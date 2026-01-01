import axios from 'axios';
import { ReverseGeocodeResult } from '@/types';

const NOMINATIM_API = process.env.NEXT_PUBLIC_NOMINATIM_API || 'https://nominatim.openstreetmap.org';

/**
 * Custom error type for Nominatim operations
 */
export class NominatimError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'NominatimError';
  }
}

let lastRequestTime = 0;
const RATE_LIMIT_DELAY = 1000;

const geocodeCache = new Map<string, ReverseGeocodeResult>();

/**
 * Delay execution to comply with rate limiting
 * @param ms - Milliseconds to delay
 */
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Enforce rate limiting for Nominatim API (1 second between requests)
 */
const enforceRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await delay(RATE_LIMIT_DELAY - timeSinceLastRequest);
  }

  lastRequestTime = Date.now();
};

/**
 * Generate cache key for coordinate pair
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Cache key string
 */
const getCacheKey = (lat: number, lon: number): string => {
  return `${lat.toFixed(6)},${lon.toFixed(6)}`;
};

/**
 * Reverse geocode coordinates to address
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Promise resolving to reverse geocode result
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> => {
  const cacheKey = getCacheKey(latitude, longitude);

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  try {
    await enforceRateLimit();

    const response = await axios.get(
      `${NOMINATIM_API}/reverse`,
      {
        params: {
          format: 'json',
          lat: latitude,
          lon: longitude,
          zoom: 18,
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'CivicPulse/1.0',
        },
        timeout: 10000,
      }
    );

    const result: ReverseGeocodeResult = {
      display_name: response.data.display_name || 'Unknown Location',
      address: response.data.address || {},
      lat: response.data.lat || String(latitude),
      lon: response.data.lon || String(longitude),
    };

    geocodeCache.set(cacheKey, result);

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reverse geocoding:', error);
    }

    const fallbackResult: ReverseGeocodeResult = {
      display_name: 'Unknown Location',
      address: {},
      lat: String(latitude),
      lon: String(longitude),
    };

    return fallbackResult;
  }
};

/**
 * Search for addresses by query string
 * @param query - Address search query
 * @returns Promise resolving to array of geocode results
 */
export const searchAddress = async (query: string): Promise<ReverseGeocodeResult[]> => {
  try {
    await enforceRateLimit();

    const response = await axios.get(
      `${NOMINATIM_API}/search`,
      {
        params: {
          format: 'json',
          q: query,
          limit: 5,
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'CivicPulse/1.0',
        },
        timeout: 10000,
      }
    );

    return response.data.map((item: any) => ({
      display_name: item.display_name || 'Unknown Location',
      address: item.address || {},
      lat: item.lat || '0',
      lon: item.lon || '0',
    }));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error searching address:', error);
    }
    throw new NominatimError('Failed to search address', error);
  }
};

/**
 * Get formatted address string from reverse geocode result
 * @param result - Reverse geocode result
 * @returns Formatted address string
 */
export const formatGeocodeResult = (result: ReverseGeocodeResult): string => {
  const parts: string[] = [];

  if (result.address.house_number) {
    parts.push(result.address.house_number);
  }

  if (result.address.road) {
    parts.push(result.address.road);
  }

  if (result.address.city || result.address.town || result.address.village) {
    parts.push(result.address.city || result.address.town || result.address.village || '');
  }

  if (result.address.state) {
    parts.push(result.address.state);
  }

  if (parts.length === 0) {
    return result.display_name;
  }

  return parts.filter(Boolean).join(', ');
};

/**
 * Clear the geocode cache
 */
export const clearGeocodeCache = (): void => {
  geocodeCache.clear();
};

/**
 * Get cache size
 * @returns Number of cached entries
 */
export const getCacheSize = (): number => {
  return geocodeCache.size;
};
