# Deployment Guide for Cehpoint

## Prerequisites

Before deploying to Vercel, make sure you have:

1. A Vercel account (sign up at vercel.com)
2. MongoDB Atlas account (for database hosting)
3. Google Gemini API key
4. Firebase project set up
5. Gmail account for email notifications (with app password)

## Environment Variables

Set up the following environment variables in your Vercel project settings:

### Required Environment Variables

```bash
# Google Gemini AI API Key
API_KEY=your_google_gemini_api_key

# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# JWT Secret (use a strong random string)
JWT_SECRET=your_secure_jwt_secret_minimum_32_characters

# Node Environment
NODE_ENV=production

# Email Configuration (for certificates)
EMAIL=your_email@gmail.com
PASSWORD=your_gmail_app_password

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## Deployment Steps

### 1. Prepare Your Repository

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add all environment variables from the list above
6. Click "Deploy"

### 3. Post-Deployment Configuration

#### MongoDB Atlas Setup

1. Go to MongoDB Atlas
2. Network Access → Add your Vercel deployment IPs (or allow all: 0.0.0.0/0)
3. Database Access → Create a user with read/write permissions
4. Get your connection string and add it to MONGODB_URI

#### Firebase Configuration

1. Go to Firebase Console
2. Add your Vercel deployment domain to authorized domains
3. Update Authentication settings if needed

#### Email Configuration

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password
4. Use this App Password in the PASSWORD environment variable

### 4. Verify Deployment

After deployment, verify that:

- [ ] Homepage loads correctly
- [ ] User authentication works (Sign In/Sign Up)
- [ ] Course generation works
- [ ] Quiz feature functions properly
- [ ] Project suggestions load
- [ ] Admin panel is accessible (for admin users)
- [ ] Dark mode toggles correctly
- [ ] All API routes respond correctly

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Monitoring and Maintenance

### View Logs

```bash
# Using Vercel CLI
vercel logs <deployment-url>
```

Or view logs in the Vercel Dashboard under "Functions" tab.

### Update Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add/Edit/Remove variables
5. Redeploy for changes to take effect

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in package.json
   - Ensure environment variables are set

2. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check MongoDB Atlas network access settings
   - Ensure database user has proper permissions

3. **API Route Failures**
   - Check function logs in Vercel
   - Verify environment variables are set
   - Ensure API endpoints are not timing out

4. **Authentication Issues**
   - Verify Firebase configuration
   - Check JWT_SECRET is set
   - Ensure cookies are working properly

## Performance Optimization

- Images are optimized using Next.js Image component
- API routes use proper caching headers
- Database queries are optimized
- Static pages are pre-rendered where possible

## Security Checklist

- [ ] All environment variables are stored securely in Vercel
- [ ] MongoDB uses strong authentication
- [ ] JWT secret is strong and unique
- [ ] CORS is properly configured
- [ ] Admin routes are protected
- [ ] User inputs are validated
- [ ] SQL injection protection is in place (using Mongoose)

## Scaling

Vercel automatically scales your application based on traffic. For heavy database usage:

1. Consider upgrading MongoDB Atlas tier
2. Implement caching strategies
3. Optimize database queries
4. Use connection pooling

## Support

For issues specific to:
- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)
- **MongoDB**: Check [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

**Last Updated**: October 2025
**Version**: 1.0.0
