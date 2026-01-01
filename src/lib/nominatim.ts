import axios from 'axios';
import { ReverseGeocodeResult } from '@/types';

const NOMINATIM_API = process.env.NEXT_PUBLIC_NOMINATIM_API || 'https://nominatim.openstreetmap.org';

export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<ReverseGeocodeResult> => {
  try {
    const response = await axios.get(
      `${NOMINATIM_API}/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'CivicPulse/1.0',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
};

export const searchAddress = async (query: string): Promise<ReverseGeocodeResult[]> => {
  try {
    const response = await axios.get(
      `${NOMINATIM_API}/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      {
        headers: {
          'User-Agent': 'CivicPulse/1.0',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error searching address:', error);
    throw error;
  }
};
