# CivicPulse Phase 1 - Core TypeScript Types & Utils Implementation

## Overview
This document details the implementation of core utility functions and TypeScript helpers for the CivicPulse application.

## Implementation Summary

### 1. Firestore Query Helpers (`src/lib/firestore.ts`)
All required Firestore operations have been implemented with comprehensive error handling:

#### Functions Implemented:
- **`submitIssue(issue: Omit<Issue, 'id'>): Promise<string>`**
  - Adds new issue to Firestore
  - Automatically sets timestamp and viewCount defaults
  - Returns document ID
  - Includes FirestoreError handling

- **`fetchIssues(filters?: {...}): Promise<Issue[]>`**
  - Supports filtering by category and severity
  - Supports pagination with limit and offset
  - Orders by timestamp (descending)
  - Returns array of issues

- **`getIssueById(id: string): Promise<Issue | null>`**
  - Fetches single issue by document ID
  - Returns null if not found
  - Includes error handling

- **`incrementViewCount(issueId: string): Promise<void>`**
  - Atomically increments view count using Firestore increment()
  - Handles errors gracefully

- **`generateShareToken(): string`**
  - Generates unique share tokens for public links
  - Combines random strings with timestamp for uniqueness

- **`getIssueByShareToken(token: string): Promise<Issue | null>`**
  - Fetches issue by share token
  - Returns null if not found
  - Efficient query with limit(1)

#### Additional Features:
- Custom `FirestoreError` class for proper error handling
- Legacy function support (`createIssue`, `getAllIssues`, `updateIssue`, `deleteIssue`, `getIssuesByLocation`)
- Environment-aware logging (only logs in development)
- Full JSDoc documentation

### 2. TensorFlow.js Wrapper (`src/lib/tensorflow.ts`)
Complete image classification system with MobileNet integration:

#### Functions Implemented:
- **`loadModel(): Promise<void>`**
  - Singleton pattern ensures model loads only once
  - Handles concurrent load requests
  - Custom TensorFlowError handling

- **`classifyImage(imageElement): Promise<ClassificationResult>`**
  - Classifies images using MobileNet
  - Returns top prediction with confidence
  - Confidence threshold logic (70% cutoff)
  - Graceful fallback on errors

- **`getCategoryFromClassification(className: string): Category`**
  - Maps ImageNet labels to CivicPulse categories
  - Keyword-based matching for:
    - `road_damage`: road, pothole, crack, pavement
    - `garbage`: trash, litter, waste, bottle
    - `water_leak`: water, leak, pipe, hydrant
    - `broken_infra`: pole, sign, fence, bridge
    - `other`: default fallback

#### Additional Features:
- **`classifyImageFromBase64(base64Image: string)`** - Classify from base64 string
- **`isModelLoaded()`** - Check model status
- **`disposeModel()`** - Clean up resources
- Confidence adjustment for low-confidence predictions
- Error handling returns safe defaults

### 3. Nominatim Reverse Geocoding (`src/lib/nominatim.ts`)
OpenStreetMap Nominatim API wrapper with rate limiting and caching:

#### Functions Implemented:
- **`reverseGeocode(latitude, longitude): Promise<ReverseGeocodeResult>`**
  - Converts coordinates to addresses
  - In-memory caching to avoid duplicate requests
  - Rate limiting (1 second between requests)
  - Fallback to "Unknown Location" on errors

- **`searchAddress(query: string): Promise<ReverseGeocodeResult[]>`**
  - Forward geocoding (address to coordinates)
  - Returns up to 5 results
  - Rate limited

#### Additional Features:
- **`formatGeocodeResult(result)`** - Format addresses for display
- **`clearGeocodeCache()`** - Clear cache manually
- **`getCacheSize()`** - Get number of cached entries
- Custom `NominatimError` class
- Proper User-Agent header ("CivicPulse/1.0")
- 10-second timeout for requests

### 4. Utility Functions (`src/lib/utils.ts`)
Comprehensive collection of helper functions:

#### Core Functions:
- **`calculateDistance(lat1, lon1, lat2, lon2): number`**
  - Haversine formula implementation
  - Returns distance in miles (Earth radius: 3958.8 mi)
  - Accurate for all coordinate ranges

- **`formatTimestamp(timestamp: number): string`**
  - Human-readable relative time
  - Formats: "just now", "2 hours ago", "3 days ago", etc.
  - Handles seconds, minutes, hours, days, weeks, months, years

- **`formatAddress(address: string, maxLength?: number): string`**
  - Truncates long addresses with ellipsis
  - Default max length: 50 characters
  - Returns "Unknown Location" for empty strings

- **`generateUUID(): string`**
  - Uses uuid v4 library
  - For anonymous user identification

- **`severityColor(severity: Severity): string`**
  - Returns CSS hex colors:
    - critical: `#dc2626` (red)
    - medium: `#f59e0b` (amber)
    - low: `#10b981` (green)

- **`categoryLabel(category: Category): string`**
  - Human-readable category names:
    - `road_damage` → "Road Damage"
    - `garbage` → "Garbage"
    - `water_leak` → "Water Leak"
    - `broken_infra` → "Broken Infrastructure"
    - `other` → "Other"

- **`imageToBase64(file: File | Blob): Promise<string>`**
  - Converts File or Blob to base64 string
  - Uses FileReader API
  - Proper error handling

- **`validateCoordinates(lat: number, lon: number): boolean`**
  - Validates latitude (-90 to 90)
  - Validates longitude (-180 to 180)
  - Checks for NaN and Infinity
  - Type checking

#### Type Guards:
- **`isValidCategory(value: any): value is Category`**
  - Type guard for Category validation
  
- **`isValidSeverity(value: any): value is Severity`**
  - Type guard for Severity validation

#### Additional Utilities:
- **`formatDate(timestamp)`** - Full date formatting
- **`formatDateTime(timestamp)`** - Date and time formatting
- **`clamp(value, min, max)`** - Numeric clamping
- **`truncateText(text, maxLength)`** - General text truncation
- **`isNullOrUndefined(value)`** - Null/undefined check
- **`safeJsonParse(jsonString, fallback)`** - JSON parsing with fallback
- **`debounce(func, wait)`** - Debounce function execution
- **`throttle(func, limit)`** - Throttle function execution

### 5. Error Handling
Custom error classes for better error management:

- **`FirestoreError`** - Firestore operations
- **`TensorFlowError`** - ML model operations
- **`NominatimError`** - Geocoding operations

Features:
- Environment-aware logging (development only)
- Graceful fallbacks for all external API calls
- Original error preservation for debugging
- Safe defaults on errors

### 6. Type Safety
All functions are fully typed with TypeScript:
- Strict mode enabled
- No `any` types without guards
- Proper return type annotations
- JSDoc comments for all public functions
- Type guards for runtime validation

## Testing Results

### Build Status
✅ TypeScript compilation successful (`npx tsc --noEmit`)
✅ Next.js build successful (`npm run build`)
✅ ESLint passed with no errors (warnings only from existing components)

### Verification
- All imports resolve correctly
- No circular dependencies
- All type definitions match interfaces
- Functions handle edge cases (null, undefined, invalid values)
- Error handling tested with graceful fallbacks

## Files Modified/Created

1. **`src/lib/firestore.ts`** - Complete rewrite with all required functions
2. **`src/lib/tensorflow.ts`** - Complete rewrite with model loading and classification
3. **`src/lib/nominatim.ts`** - Complete rewrite with rate limiting and caching
4. **`src/lib/utils.ts`** - Complete rewrite with all utility functions

## Dependencies Used

All dependencies are already included in `package.json`:
- `firebase` (^10.14.1) - Firestore operations
- `@tensorflow/tfjs` (^4.20.0) - TensorFlow runtime
- `@tensorflow-models/mobilenet` (^2.1.1) - MobileNet model
- `axios` (^1.7.7) - HTTP requests for Nominatim
- `uuid` (^10.0.0) - UUID generation

## Usage Examples

### Firestore
```typescript
import { submitIssue, fetchIssues, getIssueById } from '@/lib/firestore';

// Submit new issue
const issueId = await submitIssue({
  title: "Pothole on Main Street",
  category: "road_damage",
  severity: "critical",
  // ... other fields
});

// Fetch filtered issues
const criticalIssues = await fetchIssues({
  severity: "critical",
  limit: 10
});

// Get single issue
const issue = await getIssueById("issue-id");
```

### TensorFlow
```typescript
import { loadModel, classifyImage } from '@/lib/tensorflow';

// Load model (call once on app init)
await loadModel();

// Classify image
const result = await classifyImage(imageElement);
console.log(result.category, result.probability);
```

### Nominatim
```typescript
import { reverseGeocode } from '@/lib/nominatim';

const address = await reverseGeocode(23.1815, 72.6313);
console.log(address.display_name);
```

### Utils
```typescript
import {
  calculateDistance,
  formatTimestamp,
  validateCoordinates,
  imageToBase64
} from '@/lib/utils';

// Calculate distance
const miles = calculateDistance(lat1, lon1, lat2, lon2);

// Format time
const timeAgo = formatTimestamp(Date.now() - 3600000); // "1 hour ago"

// Validate coordinates
if (validateCoordinates(lat, lon)) {
  // coordinates are valid
}

// Convert image to base64
const base64 = await imageToBase64(file);
```

## Next Steps

These utilities are now ready to be integrated into:
- API routes (`/api/*`)
- React components
- Custom hooks
- Page components

The foundation is complete for Phase 2 implementation of UI components and user flows.
