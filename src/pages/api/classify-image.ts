import type { NextApiRequest, NextApiResponse } from 'next';
import { ClassificationResult } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageData } = req.body;

    const result: ClassificationResult = {
      className: '',
      probability: 0,
      category: 'other',
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error classifying image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
