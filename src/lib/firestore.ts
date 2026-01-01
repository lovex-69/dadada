import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit, 
  startAfter,
  updateDoc,
  increment,
  QueryConstraint,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Issue, Category, Severity, IssueStatus, TimelineEvent } from '@/types';
import { enrichIssue } from './responsibility';

const ISSUES_COLLECTION = 'issues';

/**
 * Custom error type for Firestore operations
 */
export class FirestoreError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'FirestoreError';
  }
}

/**
 * Submit a new issue to Firestore
 * @param issue - Issue data without ID and generated fields
 * @returns Promise resolving to the document ID
 */
export const submitIssue = async (issue: Omit<Issue, 'id' | 'status' | 'timeline' | 'viewCount' | 'shareToken' | 'timestamp'> & { timestamp?: number }): Promise<string> => {
  try {
    const enriched = enrichIssue({
      ...issue,
      timestamp: issue.timestamp || Date.now(),
      viewCount: 0,
      shareToken: generateShareToken(),
    });

    const docRef = await addDoc(collection(db, ISSUES_COLLECTION), enriched);
    return docRef.id;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error submitting issue:', error);
    }
    throw new FirestoreError('Failed to submit issue', error);
  }
};

/**
 * Update the status of an issue and add a timeline event
 * @param issueId - Issue document ID
 * @param status - New status
 * @param description - Description for the timeline event
 * @param updatedBy - Name/ID of the person/system who updated it
 */
export const updateIssueStatus = async (
  issueId: string,
  status: IssueStatus,
  description: string,
  updatedBy: string
): Promise<void> => {
  try {
    const issue = await getIssueById(issueId);
    if (!issue) throw new Error('Issue not found');

    const newEvent: TimelineEvent = {
      id: `evt_${Date.now()}`,
      status,
      timestamp: Date.now(),
      description,
      updatedBy,
    };

    const docRef = doc(db, ISSUES_COLLECTION, issueId);
    await updateDoc(docRef, {
      status,
      timeline: [...(issue.timeline || []), newEvent],
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating issue status:', error);
    }
    throw new FirestoreError('Failed to update issue status', error);
  }
};

/**
 * Fetch issues with optional filtering and pagination
 * @param filters - Optional filters for category, severity, status, ward, limit, and offset
 * @returns Promise resolving to array of issues
 */
export const fetchIssues = async (filters?: {
  category?: Category;
  severity?: Severity;
  status?: IssueStatus;
  ward?: string;
  limit?: number;
  offset?: number;
}): Promise<Issue[]> => {
  try {
    const constraints: QueryConstraint[] = [
      orderBy('timestamp', 'desc')
    ];

    if (filters?.category) {
      constraints.unshift(where('category', '==', filters.category));
    }

    if (filters?.severity) {
      constraints.unshift(where('severity', '==', filters.severity));
    }

    if (filters?.status) {
      constraints.unshift(where('status', '==', filters.status));
    }

    if (filters?.ward) {
      constraints.unshift(where('ward', '==', filters.ward));
    }

    if (filters?.limit) {
      constraints.push(firestoreLimit(filters.limit));
    }

    const q = query(collection(db, ISSUES_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);

    const issues: Issue[] = [];
    querySnapshot.forEach((doc) => {
      issues.push({
        id: doc.id,
        ...doc.data(),
      } as Issue);
    });

    if (filters?.offset && filters.offset > 0) {
      return issues.slice(filters.offset);
    }

    return issues;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching issues:', error);
    }
    throw new FirestoreError('Failed to fetch issues', error);
  }
};

/**
 * Fetch a single issue by ID
 * @param id - Issue document ID
 * @returns Promise resolving to Issue or null if not found
 */
export const getIssueById = async (id: string): Promise<Issue | null> => {
  try {
    const docRef = doc(db, ISSUES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Issue;
    }

    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting issue by ID:', error);
    }
    throw new FirestoreError('Failed to get issue by ID', error);
  }
};

/**
 * Increment view count for an issue atomically
 * @param issueId - Issue document ID
 * @returns Promise resolving when increment is complete
 */
export const incrementViewCount = async (issueId: string): Promise<void> => {
  try {
    const docRef = doc(db, ISSUES_COLLECTION, issueId);
    await updateDoc(docRef, {
      viewCount: increment(1),
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error incrementing view count:', error);
    }
    throw new FirestoreError('Failed to increment view count', error);
  }
};

/**
 * Generate a unique share token for public links
 * @returns Unique share token string
 */
export const generateShareToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

/**
 * Fetch an issue by its share token
 * @param token - Share token string
 * @returns Promise resolving to Issue or null if not found
 */
export const getIssueByShareToken = async (token: string): Promise<Issue | null> => {
  try {
    const q = query(
      collection(db, ISSUES_COLLECTION),
      where('shareToken', '==', token),
      firestoreLimit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as Issue;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting issue by share token:', error);
    }
    throw new FirestoreError('Failed to get issue by share token', error);
  }
};

/**
 * Get all issues (legacy function - kept for backward compatibility)
 * @returns Promise resolving to array of all issues
 */
export const getAllIssues = async (): Promise<Issue[]> => {
  return fetchIssues();
};

/**
 * Update an issue
 * @param id - Issue document ID
 * @param updates - Partial issue data to update
 * @returns Promise resolving when update is complete
 */
export const updateIssue = async (id: string, updates: Partial<Issue>): Promise<void> => {
  try {
    const docRef = doc(db, ISSUES_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating issue:', error);
    }
    throw new FirestoreError('Failed to update issue', error);
  }
};

/**
 * Delete an issue
 * @param id - Issue document ID
 * @returns Promise resolving when deletion is complete
 */
export const deleteIssue = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, ISSUES_COLLECTION, id);
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(docRef);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error deleting issue:', error);
    }
    throw new FirestoreError('Failed to delete issue', error);
  }
};

/**
 * Get issues by location within a radius
 * @param lat - Latitude
 * @param lon - Longitude
 * @param radiusKm - Radius in kilometers
 * @returns Promise resolving to array of issues within radius
 */
export const getIssuesByLocation = async (
  lat: number,
  lon: number,
  radiusKm: number
): Promise<Issue[]> => {
  try {
    const allIssues = await getAllIssues();
    
    const { calculateDistance } = await import('./utils');
    
    return allIssues.filter((issue) => {
      const distance = calculateDistance(lat, lon, issue.latitude, issue.longitude);
      return distance <= radiusKm;
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting issues by location:', error);
    }
    throw new FirestoreError('Failed to get issues by location', error);
  }
};

/**
 * Legacy function - alias for submitIssue
 * @deprecated Use submitIssue instead
 */
export const createIssue = submitIssue;
