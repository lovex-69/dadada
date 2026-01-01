import { db } from './firebase';
import { Issue } from '@/types';

export const createIssue = async (issue: Omit<Issue, 'id'>): Promise<string> => {
  return '';
};

export const getIssueById = async (id: string): Promise<Issue | null> => {
  return null;
};

export const getAllIssues = async (): Promise<Issue[]> => {
  return [];
};

export const updateIssue = async (id: string, updates: Partial<Issue>): Promise<void> => {
  return;
};

export const deleteIssue = async (id: string): Promise<void> => {
  return;
};

export const getIssuesByLocation = async (
  lat: number,
  lon: number,
  radiusKm: number
): Promise<Issue[]> => {
  return [];
};

export const incrementViewCount = async (id: string): Promise<void> => {
  return;
};
