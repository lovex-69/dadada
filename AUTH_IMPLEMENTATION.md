# CivicPulse Firebase Authentication Implementation

## Overview
This document describes the implementation of Firebase Authentication with both anonymous and email-based login flows for the CivicPulse application.

## Architecture

### Components

#### 1. Authentication Library (`src/lib/auth.ts`)
Core authentication functions that interact with Firebase Auth:

- `loginAnonymously()` - Auto-login users anonymously on first visit
- `getCurrentUser()` - Get current authenticated user
- `loginWithEmail(email, password)` - Email/password login
- `signUpWithEmail(email, password)` - Create new user account
- `logout()` - Sign out user and revert to anonymous
- `updateUserProfile(displayName)` - Update user display name
- `passwordReset(email)` - Send password reset email
- `validatePassword(password)` - Validate password strength (min 8 chars, 1 uppercase, 1 number)
- `validateEmail(email)` - Validate email format

**Fallback Mechanism**: If Firebase Auth is disabled or fails, the system falls back to localStorage-based UUID generation for anonymous users.

#### 2. Auth Context (`src/context/AuthContext.tsx`)
React Context providing authentication state and methods throughout the app:

**State**:
- `user: User | null` - Current user object
- `loading: boolean` - Loading state during auth operations
- `error: string | null` - Error messages from auth operations

**Methods**:
- `loginWithEmail(email, password)` - Login with email/password
- `signUpWithEmail(email, password)` - Sign up new user
- `logout()` - Sign out and revert to anonymous
- `updateProfile(displayName)` - Update user profile
- `resetPassword(email)` - Send password reset email
- `clearError()` - Clear error state

**Hook**: `useAuth()` - Custom hook to access auth context

#### 3. Login Modal (`src/components/LoginModal.tsx`)
Modal dialog component with login and signup tabs:

**Features**:
- Two tabs: "Login" and "Sign Up"
- Email and password inputs with validation
- Confirm password field for signup
- Terms and conditions checkbox for signup
- Inline error messages
- Loading spinner during authentication
- Close button (X) to dismiss modal

**Validation**:
- Email format validation
- Password strength validation (8+ chars, 1 uppercase, 1 number)
- Password confirmation match
- Terms acceptance for signup

#### 4. Auth Button (`src/components/AuthButton.tsx`)
Header authentication button component:

**Anonymous User**:
- Displays "Sign In" button
- Opens LoginModal on click

**Authenticated User**:
- Displays user avatar (first letter of email)
- Shows user email
- Dropdown menu with "Sign Out" option
- Click outside to close dropdown

#### 5. Updated Layout (`src/components/Layout.tsx`)
Enhanced layout component with navigation bar:
- Brand name "CivicPulse" on the left
- AuthButton on the right
- Responsive design

#### 6. Updated App Wrapper (`src/pages/_app.tsx`)
App component wrapped with AuthProvider to provide auth context throughout the application.

## Authentication Flow

### Anonymous Login
1. User visits the app for the first time
2. `AuthProvider` initializes and checks for existing session
3. If no session exists, automatically calls `loginAnonymously()`
4. Anonymous user ID stored in localStorage with key `anon-user-id`
5. User can browse and use the app without signing up

### Email Signup
1. Anonymous user clicks "Sign In" button
2. LoginModal opens with "Sign Up" tab
3. User enters email, password, and confirms password
4. User accepts terms and conditions
5. Form validates inputs locally
6. Calls `signUpWithEmail(email, password)`
7. Firebase creates new user account
8. Anonymous user ID removed from localStorage
9. User automatically logged in
10. Modal closes

### Email Login
1. User clicks "Sign In" button
2. LoginModal opens with "Login" tab
3. User enters email and password
4. Form validates inputs locally
5. Calls `loginWithEmail(email, password)`
6. Firebase authenticates user
7. Anonymous user ID removed from localStorage
8. User logged in
9. Modal closes

### Session Persistence
1. Firebase Auth automatically stores session tokens
2. On app reload, `AuthProvider` checks for existing session
3. If valid session exists, user state restored
4. If no session, falls back to anonymous login

### Logout
1. User clicks on their avatar/email in header
2. Dropdown menu appears
3. User clicks "Sign Out"
4. Calls `logout()`
5. Firebase signs out user
6. Anonymous login automatically initiated
7. User reverts to anonymous state

## Error Handling

### User-Friendly Error Messages
- `auth/invalid-email` → "Invalid email address format"
- `auth/user-not-found` → "No account found with this email"
- `auth/wrong-password` → "Incorrect password"
- `auth/email-already-in-use` → "An account already exists with this email"
- `auth/weak-password` → "Password should be at least 8 characters with 1 uppercase and 1 number"
- `auth/network-request-failed` → "Network error. Please check your connection"
- `auth/too-many-requests` → "Too many attempts. Please try again later"

### Fallback Behavior
If Firebase Auth is unavailable or disabled:
- System generates UUID for anonymous users
- Stores in localStorage
- App remains functional for anonymous operations
- Email login/signup will show appropriate error messages

## Type Definitions

### User Interface
```typescript
interface User {
  uid: string;
  email?: string;
  displayName?: string;
  isAnonymous: boolean;
  createdAt: number;
}
```

### AuthError Interface
```typescript
interface AuthError {
  code: string;
  message: string;
}
```

## Security Features

1. **Password Validation**:
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 number

2. **No Sensitive Data Storage**:
   - Passwords never stored in localStorage
   - Only anonymous user IDs stored locally
   - Firebase Auth handles secure token storage

3. **HTTPS Only**:
   - Production deployment (Vercel) enforces HTTPS
   - Secure communication with Firebase

4. **Session Management**:
   - Firebase Auth tokens automatically managed
   - Tokens expire and refresh automatically
   - Logout clears all session data

## Environment Variables

Required Firebase configuration in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Testing Checklist

- [x] Anonymous login on first visit
- [x] Email signup with validation
- [x] Email login with validation
- [x] Session persistence across page reloads
- [x] Logout functionality
- [x] Error messages display correctly
- [x] LoginModal opens/closes properly
- [x] AuthButton shows correct state
- [x] Dropdown menu works (authenticated users)
- [x] TypeScript compilation succeeds
- [x] No sensitive data in localStorage
- [x] Graceful fallback if Firebase disabled
- [x] AuthProvider wraps entire app

## Future Enhancements (Phase 2)

1. **Email Verification**:
   - Send verification email on signup
   - Verify email before allowing certain actions

2. **Password Reset**:
   - Enable "Forgot Password" functionality
   - Send password reset emails

3. **Social Login**:
   - Google Sign-In
   - GitHub Sign-In
   - Other OAuth providers

4. **User Profile Management**:
   - Edit display name
   - Upload profile picture
   - Manage account settings

5. **Link Anonymous to Email**:
   - Allow anonymous users to create account
   - Preserve their submitted issues

## Development Notes

- Development mode logs all auth operations to console
- Production mode suppresses debug logs
- ESLint warnings for dependencies are intentionally suppressed to prevent infinite loops
- Anonymous user fallback ensures app works even if Firebase is misconfigured
