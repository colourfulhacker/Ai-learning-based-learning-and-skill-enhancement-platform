# Cehpoint - E-Learning AI Solutions

## Project Overview
Cehpoint is a Next.js-based e-learning platform that uses AI to generate personalized courses, provide interactive learning experiences, and manage user authentication through Firebase and Google OAuth.

## Recent Changes

### October 18, 2025 - Vercel to Replit Migration
- **Port Configuration**: Updated development and production scripts to bind to `0.0.0.0:5000` for Replit compatibility
- **Next.js Image Configuration**: Migrated from deprecated `images.domains` to `images.remotePatterns` for improved security
- **Environment Variables**: All required secrets configured in Replit (MongoDB, API keys, Firebase config, JWT, email credentials)
- **Deployment Setup**: Configured autoscale deployment with proper build and start commands
- **Workflow**: Development server running on port 5000 with Turbopack enabled

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15.5.4 with Turbopack
- **Runtime**: Node.js with npm package manager
- **UI**: React 19.1.0 with Tailwind CSS 4
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Firebase Auth + Google OAuth + JWT
- **AI Integration**: Google Gemini AI
- **Image Services**: Unsplash API
- **Email**: Nodemailer

### Key Features
- AI-powered course generation
- User authentication (Email/Password + Google OAuth)
- Course management and tracking
- Interactive learning with YouTube integration
- Markdown content rendering
- Calendar heatmap for progress tracking

## Environment Variables
All sensitive configuration is stored in Replit Secrets:
- `MONGODB_URI` - Database connection
- `API_KEY` - Google Gemini AI
- `UNSPLASH_ACCESS_KEY` - Image service
- `JWT_SECRET` - Authentication tokens
- `EMAIL` / `PASSWORD` - Email service
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration (7 variables)
- `GOOGLE_CLIENT_ID` - OAuth

## Known Issues & Security Notes

### Security Vulnerabilities (Non-blocking)
**Package**: `g-i-s` (Google Image Search)
- **Status**: Package is defined in dependencies and has type definitions, but NOT currently used in the codebase
- **Vulnerabilities**: 
  - 2 critical: form-data unsafe random function, request deprecated
  - 2 moderate: tough-cookie prototype pollution
- **Impact**: No immediate security risk since package is unused
- **Recommendation**: Remove from package.json if not needed in future features. If Google Image Search functionality is required, use a maintained alternative like the Unsplash API (already integrated) or Google Custom Search API

## Deployment

### Development
```bash
npm run dev
```
Runs on http://0.0.0.0:5000

### Production
```bash
npm run build
npm run start
```
Configured for Replit autoscale deployment

## User Preferences
- No specific preferences documented yet
