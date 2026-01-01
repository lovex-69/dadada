import type { NextApiRequest, NextApiResponse } from 'next';
import { Issue } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const issueData: Omit<Issue, 'id'> = req.body;

    res.status(201).json({ message: 'Issue submitted successfully', id: 'sample-id' });
  } catch (error) {
    console.error('Error submitting issue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
