import type { NextApiRequest, NextApiResponse } from 'next';
import { Issue } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { lat, lon, radius } = req.query;

    const issues: Issue[] = [];

    res.status(200).json({ issues });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
