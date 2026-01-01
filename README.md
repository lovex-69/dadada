# CivicPulse - Hyper-Local Civic Accountability Platform

CivicPulse is a community-driven platform for reporting and tracking infrastructure issues in local neighborhoods. Users can report problems like road damage, garbage accumulation, water leaks, and broken infrastructure, with AI-powered image classification and real-time location tracking.

## Vision

Empower citizens to improve their communities by providing a simple, accessible platform for reporting civic issues. CivicPulse leverages modern web technologies, AI image classification, and geospatial data to create transparency and accountability in local governance.

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3 with institutional color palette
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Map**: Leaflet + React Leaflet
- **AI/ML**: TensorFlow.js + MobileNet for image classification
- **Geocoding**: Nominatim (OpenStreetMap)
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase project created with Authentication, Firestore, and Storage enabled

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd civicpulse
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Note**: The `--legacy-peer-deps` flag may be needed due to some dependency version conflicts. If the installation fails without it, try using this flag.

### 3. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable the following services:
   - **Authentication**: Enable Email/Password and Google providers
   - **Firestore Database**: Create a database in production or test mode
   - **Storage**: Enable storage for file uploads

4. Get your Firebase configuration:
   - Go to Project Settings → General → Your apps
   - Register a web app and copy the configuration values

5. Create environment variables:
   ```bash
   cp .env.example .env.local
   ```

6. Edit `.env.local` and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
civicpulse/
├── .env.example              # Environment variables template
├── .env.local                # Your local environment variables (not in git)
├── .gitignore               # Git ignore rules
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── vercel.json              # Vercel deployment configuration
├── public/                  # Static assets
│   ├── favicon.ico
│   └── logo.svg
├── src/
│   ├── lib/                 # Utility libraries and integrations
│   │   ├── firebase.ts      # Firebase initialization
│   │   ├── firestore.ts     # Firestore operations
│   │   ├── tensorflow.ts    # TensorFlow.js model loading and classification
│   │   ├── nominatim.ts     # Geocoding functions
│   │   └── utils.ts         # General utility functions
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # All interfaces and types
│   ├── components/          # React components
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── ReportForm.tsx   # Issue reporting form
│   │   ├── IssueCard.tsx    # Issue display card
│   │   ├── IssueDetailPanel.tsx  # Issue detail view
│   │   ├── MapView.tsx      # Interactive map component
│   │   ├── CategorySelect.tsx    # Category dropdown
│   │   ├── ImageUploader.tsx     # Image upload component
│   │   └── LoadingSpinner.tsx   # Loading indicator
│   ├── pages/               # Next.js pages (Pages Router)
│   │   ├── _app.tsx         # App component with providers
│   │   ├── _document.tsx    # HTML document structure
│   │   ├── index.tsx        # Homepage
│   │   ├── report.tsx       # Report issue page
│   │   ├── issue/           # Issue detail pages
│   │   │   └── [id].tsx     # Dynamic issue detail page
│   │   └── api/             # API routes
│   │       ├── submit-issue.ts      # Submit new issue
│   │       ├── fetch-issues.ts      # Fetch issues by location
│   │       ├── classify-image.ts    # AI image classification
│   │       ├── reverse-geocode.ts   # Address lookup from coordinates
│   │       └── stats.ts             # App statistics
│   ├── styles/
│   │   └── globals.css      # Global styles with Tailwind directives
│   └── hooks/               # Custom React hooks
│       ├── useGeolocation.ts        # Browser geolocation hook
│       └── useFetchIssues.ts       # Fetch issues hook
└── README.md                # This file
```

## Key Features

### Phase 1 (Current)
- ✅ Project initialization with Next.js 14 + TypeScript
- ✅ Tailwind CSS configuration with institutional colors
- ✅ Complete directory structure and template files
- ✅ Firebase configuration template
- ✅ TypeScript interfaces for all data models
- ✅ API route templates
- ✅ Custom React hooks (geolocation, data fetching)
- ✅ Component templates (empty, ready for implementation)

### Future Phases
- 🔲 User authentication and profile management
- 🔲 Issue submission with image upload
- 🔲 AI-powered image classification
- 🔲 Interactive map with issue markers
- 🔲 Issue filtering and search
- 🔲 User profiles and issue history
- 🔲 Notifications and status updates
- 🔲 Admin dashboard
- 🔲 Analytics and reporting

## Color Palette

The application uses an institutional color scheme:

- **Primary**: `#2c3e50` (Dark blue-gray)
- **Critical**: `#dc2626` (Red)
- **Medium**: `#f59e0b` (Amber)
- **Low**: `#10b981` (Green)
- **Background**: `#f8f9fa` (Light gray)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Application Settings
NEXT_PUBLIC_NOMINATIM_API=https://nominatim.openstreetmap.org
NEXT_PUBLIC_APP_NAME=CivicPulse
NEXT_PUBLIC_APP_URL=https://civicpulse.vercel.app

# Default Location (Vadodara, Gujarat, India)
NEXT_PUBLIC_DEFAULT_LAT=23.1815
NEXT_PUBLIC_DEFAULT_LON=72.6313
NEXT_PUBLIC_DEFAULT_CITY=Vadodara
```

## Deployment to Vercel

### Automatic Deployment

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
npm run build
vercel --prod
```

**Note**: Make sure to add all environment variables in Vercel's project settings before deploying.

## Firebase Security Rules

Before deploying, configure appropriate Firebase security rules:

**Firestore Rules** (example):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /issues/{issueId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

**Storage Rules** (example):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /issues/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow existing component patterns
- Write descriptive variable and function names
- Add comments for complex logic only

### Component Structure
- Keep components focused on single responsibility
- Use TypeScript interfaces for props
- Leverage Tailwind CSS for styling
- Avoid inline styles when possible

### API Routes
- Validate all incoming data
- Use proper HTTP status codes
- Return consistent error messages
- Handle edge cases gracefully

## Troubleshooting

### Build Errors
If you encounter build errors:
```bash
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
```

### TypeScript Errors
- Ensure all type imports are from `@/types`
- Check that `tsconfig.json` has correct paths configured
- Run `npx tsc --noEmit` to check for type errors

### Firebase Connection Issues
- Verify environment variables are set correctly
- Check Firebase console for API key restrictions
- Ensure Firebase services are enabled in console

## Contributing

This is a civic tech project aimed at improving local communities. Contributions are welcome in the form of:
- Bug reports
- Feature suggestions
- Code improvements
- Documentation updates

## License

This project is open source and available for community use.

## Contact

For questions or support, please open an issue in the repository.

---

**CivicPulse Phase 1**: Project Setup & Firebase Configuration ✅
