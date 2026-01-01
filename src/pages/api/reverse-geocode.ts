import type { NextApiRequest, NextApiResponse } from 'next';
import { ReverseGeocodeResult } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const result: ReverseGeocodeResult = {
      display_name: '',
      address: {},
      lat: lat as string,
      lon: lon as string,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
