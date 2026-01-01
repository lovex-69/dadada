import { v4 as uuidv4 } from 'uuid';
import { Category, Severity } from '@/types';

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
 * Generate a unique UUID for anonymous users
 * @returns UUID string
 */
export const generateUUID = (): string => {
  return uuidv4();
};

/**
 * Convert degrees to radians
 * @param value - Value in degrees
 * @returns Value in radians
 */
const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - First latitude
 * @param lon1 - First longitude
 * @param lat2 - Second latitude
 * @param lon2 - Second longitude
 * @returns Distance in miles
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Format timestamp to human-readable relative time
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string (e.g., "2 hours ago")
 */
export const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return 'just now';
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days < 7) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (weeks < 4) {
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
};

/**
 * Format address for display (truncate if too long)
 * @param address - Full address string
 * @param maxLength - Maximum length before truncation (default: 50)
 * @returns Formatted address string
 */
export const formatAddress = (address: string, maxLength: number = 50): string => {
  if (!address || address.trim() === '') {
    return 'Unknown Location';
  }

  const trimmedAddress = address.trim();

  if (trimmedAddress.length <= maxLength) {
    return trimmedAddress;
  }

  return trimmedAddress.substring(0, maxLength - 3) + '...';
};

/**
 * Get CSS color for severity level
 * @param severity - Severity level
 * @returns CSS color string
 */
export const severityColor = (severity: Severity): string => {
  switch (severity) {
    case 'critical':
      return '#dc2626';
    case 'medium':
      return '#f59e0b';
    case 'low':
      return '#10b981';
    default:
      return '#6b7280';
  }
};

/**
 * Get human-readable category label
 * @param category - Category identifier
 * @returns Human-readable category name
 */
export const categoryLabel = (category: Category): string => {
  const labels: Record<Category, string> = {
    road_damage: 'Road Damage',
    garbage: 'Garbage',
    water_leak: 'Water Leak',
    broken_infra: 'Broken Infrastructure',
    other: 'Other',
  };
  return labels[category] || category;
};

/**
 * Convert image file to base64 string
 * @param file - Image file or blob
 * @returns Promise resolving to base64 string
 */
export const imageToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Validate latitude and longitude coordinates
 * @param lat - Latitude value
 * @param lon - Longitude value
 * @returns Boolean indicating if coordinates are valid
 */
export const validateCoordinates = (lat: number, lon: number): boolean => {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return false;
  }

  if (isNaN(lat) || isNaN(lon)) {
    return false;
  }

  if (!isFinite(lat) || !isFinite(lon)) {
    return false;
  }

  if (lat < -90 || lat > 90) {
    return false;
  }

  if (lon < -180 || lon > 180) {
    return false;
  }

  return true;
};

/**
 * Type guard for validating category
 * @param value - Value to check
 * @returns Boolean indicating if value is a valid Category
 */
export const isValidCategory = (value: any): value is Category => {
  const validCategories: Category[] = [
    'road_damage',
    'garbage',
    'water_leak',
    'broken_infra',
    'other',
  ];
  return validCategories.includes(value);
};

/**
 * Type guard for validating severity
 * @param value - Value to check
 * @returns Boolean indicating if value is a valid Severity
 */
export const isValidSeverity = (value: any): value is Severity => {
  const validSeverities: Severity[] = ['low', 'medium', 'critical'];
  return validSeverities.includes(value);
};

/**
 * Format date to human-readable string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date and time to human-readable string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date and time string
 */
export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get severity color (legacy function - alias for severityColor)
 * @param severity - Severity level
 * @returns CSS color string
 */
export const getSeverityColor = severityColor;

/**
 * Get category label (legacy function - alias for categoryLabel)
 * @param category - Category identifier
 * @returns Human-readable category name
 */
export const getCategoryLabel = categoryLabel;

/**
 * Clamp a number between min and max values
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Check if value is null or undefined
 * @param value - Value to check
 * @returns Boolean indicating if value is null or undefined
 */
export const isNullOrUndefined = (value: any): value is null | undefined => {
  return value === null || value === undefined;
};

/**
 * Safely parse JSON with fallback
 * @param jsonString - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};

/**
 * Debounce function to limit execution rate
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Throttle function to limit execution rate
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};
