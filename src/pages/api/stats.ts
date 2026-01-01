import type { NextApiRequest, NextApiResponse } from 'next';
import { AppStats } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const stats: AppStats = {
      totalIssues: 0,
      criticalIssues: 0,
      resolvedIssues: 0,
      activeUsers: 0,
      issuesByCategory: {
        road_damage: 0,
        garbage: 0,
        water_leak: 0,
        broken_infra: 0,
        other: 0,
      },
      issuesBySeverity: {
        low: 0,
        medium: 0,
        critical: 0,
      },
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
