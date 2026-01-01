export type Severity = 'low' | 'medium' | 'critical';

export type Category =
  | 'road_damage'
  | 'garbage'
  | 'water_leak'
  | 'broken_infra'
  | 'other';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: Category;
  customCategory?: string;
  severity: Severity;
  imageUrl: string;
  latitude: number;
  longitude: number;
  address: string;
  timestamp: number;
  userId: string;
  aiConfidence?: number;
  viewCount: number;
  shareToken: string;
}

export interface ClassificationResult {
  className: string;
  probability: number;
  category: Category;
}

export interface ReverseGeocodeResult {
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
    road?: string;
    house_number?: string;
  };
  lat: string;
  lon: string;
}

export interface AppStats {
  totalIssues: number;
  criticalIssues: number;
  resolvedIssues: number;
  activeUsers: number;
  issuesByCategory: Record<Category, number>;
  issuesBySeverity: Record<Severity, number>;
}

export interface User {
  uid: string;
  email?: string;
  displayName?: string;
  isAnonymous: boolean;
  createdAt: number;
}

export interface AuthError {
  code: string;
  message: string;
}
