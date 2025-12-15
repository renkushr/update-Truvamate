# 🚀 Deployment Next Steps - Step-by-Step Guide

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Firebase project created and configured
- [ ] Firebase Service Account Key downloaded
- [ ] Vercel account created (free tier is fine)
- [ ] All environment variables documented
- [ ] Code tested locally
- [ ] Git repository ready (optional but recommended)

---

## 🎯 Step 1: Prepare Firebase Configuration

### 1.1 Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate new private key**
5. Download the JSON file
6. **Save the file securely** (you'll need it for backend env vars)

### 1.2 Get Firebase Client Config

1. In Firebase Console → **Project Settings** → **General**
2. Scroll to **Your apps** section
3. Click on your web app (or create one)
4. Copy the config values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

**Save these values** - you'll need them for frontend env vars.

---

## 🎯 Step 2: Install Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Verify installation
vercel --version
```

---

## 🎯 Step 3: Deploy Backend

### 3.1 Login to Vercel

```bash
cd backend
vercel login
```

This will open your browser to authenticate.

### 3.2 Initial Deployment

```bash
# Make sure you're in the backend directory
cd backend

# Deploy (this creates a preview deployment)
vercel
```

**Follow the prompts:**
- Set up and deploy? → **Yes**
- Which scope? → Select your account/team
- Link to existing project? → **No**
- What's your project's name? → `truvamate-backend`
- In which directory is your code located? → `./`
- Want to override the settings? → **No**

### 3.3 Set Backend Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `truvamate-backend` project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```env
# Environment
NODE_ENV=production
PORT=5000

# Frontend URL (update after frontend is deployed)
FRONTEND_URL=https://truvamate-marketplace.vercel.app

# Firebase Admin (from serviceAccountKey.json)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Optional: Payment Keys (if you have them)
STRIPE_SECRET_KEY=sk_live_...
OMISE_SECRET_KEY=skey_live_...
```

**Important Notes:**
- For `FIREBASE_PRIVATE_KEY`: Copy the entire private key from the JSON file, including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Replace `\n` with actual newlines in Vercel (or use the format shown above)
- The `FRONTEND_URL` will be updated after frontend deployment

### 3.4 Deploy to Production

```bash
# Deploy to production
vercel --prod
```

**Save the URL** - you'll get something like: `https://truvamate-backend-xxxxx.vercel.app`

### 3.5 Test Backend

```bash
# Test health endpoint
curl https://truvamate-backend-xxxxx.vercel.app/health

# Should return:
# {"status":"ok","timestamp":"...","environment":"production","firebase":"connected"}
```

If you see errors, check:
- Vercel Dashboard → Deployments → View Function Logs
- Verify all environment variables are set correctly

---

## 🎯 Step 4: Deploy Frontend

### 4.1 Update API Configuration

First, let's ensure the frontend uses the backend API. Check if `src/config/api.ts` exists:

```bash
# Check if file exists
ls src/config/api.ts
```

If it doesn't exist, create it:

```typescript
// src/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://truvamate-backend-xxxxx.vercel.app/api'  // Replace with your backend URL
    : 'http://localhost:5001/api');

export const getAuthHeaders = async () => {
  const { auth } = await import('../config/firebase');
  const token = await auth.currentUser?.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};
```

### 4.2 Initial Frontend Deployment

```bash
# Go back to root directory
cd ..

# Deploy frontend
vercel
```

**Follow the prompts:**
- Set up and deploy? → **Yes**
- Which scope? → Select your account/team
- Link to existing project? → **No**
- What's your project's name? → `truvamate-marketplace`
- In which directory is your code located? → `./`
- Want to override the settings? → **No**

### 4.3 Set Frontend Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `truvamate-marketplace` project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```env
# Backend API URL (use your actual backend URL from Step 3.4)
VITE_API_URL=https://truvamate-backend-xxxxx.vercel.app/api

# Firebase Client Config (from Step 1.2)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX  # Optional
```

### 4.4 Deploy to Production

```bash
# Deploy to production
vercel --prod
```

**Save the URL** - you'll get something like: `https://truvamate-marketplace-xxxxx.vercel.app`

### 4.5 Update Backend CORS

Now update the backend `FRONTEND_URL` environment variable:

1. Go to Vercel Dashboard → `truvamate-backend` → Settings → Environment Variables
2. Update `FRONTEND_URL` to your frontend URL:
   ```
   FRONTEND_URL=https://truvamate-marketplace-xxxxx.vercel.app
   ```
3. Redeploy backend:
   ```bash
   cd backend
   vercel --prod
   ```

---

## 🎯 Step 5: Configure Firebase

### 5.1 Add Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain** and add:
   - `truvamate-marketplace-xxxxx.vercel.app` (your frontend URL)
   - `truvamate-backend-xxxxx.vercel.app` (your backend URL)
   - Your custom domain (if you have one)

### 5.2 Deploy Firestore Security Rules

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

Make sure your `firestore.rules` file has proper security rules for production.

---

## 🎯 Step 6: Test Production Deployment

### 6.1 Test Backend

```bash
# Health check
curl https://truvamate-backend-xxxxx.vercel.app/health

# API endpoint
curl https://truvamate-backend-xxxxx.vercel.app/api
```

### 6.2 Test Frontend

1. Open your frontend URL: `https://truvamate-marketplace-xxxxx.vercel.app`
2. Test the following:
   - [ ] Page loads without errors
   - [ ] User can register/login
   - [ ] Products display correctly
   - [ ] Can add items to cart
   - [ ] Can create orders
   - [ ] Seller dashboard works
   - [ ] Admin panel works (if applicable)

### 6.3 Check Browser Console

1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed API calls

### 6.4 Check Vercel Logs

- **Backend logs**: Vercel Dashboard → `truvamate-backend` → Deployments → View Function Logs
- **Frontend logs**: Vercel Dashboard → `truvamate-marketplace` → Deployments → View Build Logs

---

## 🎯 Step 7: Set Up Custom Domain (Optional)

### 7.1 Add Domain in Vercel

**For Frontend:**
1. Vercel Dashboard → `truvamate-marketplace` → Settings → Domains
2. Add your domain: `yourdomain.com`
3. Follow DNS configuration instructions

**For Backend:**
1. Vercel Dashboard → `truvamate-backend` → Settings → Domains
2. Add subdomain: `api.yourdomain.com`
3. Follow DNS configuration instructions

### 7.2 Update Environment Variables

After custom domain is set up:

**Frontend:**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

**Backend:**
```env
FRONTEND_URL=https://yourdomain.com
```

Then redeploy both.

---

## 🔄 Step 8: Future Updates

After initial deployment, updates are simple:

```bash
# Update Backend
cd backend
npm run build  # Optional: test build locally
vercel --prod

# Update Frontend
cd ..
npm run build  # Optional: test build locally
vercel --prod
```

Vercel will automatically:
- Build your code
- Run tests (if configured)
- Deploy to production
- Update your live site

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Firebase connection failed**
```bash
# Check logs
vercel logs https://truvamate-backend-xxxxx.vercel.app

# Verify:
# 1. FIREBASE_PRIVATE_KEY format is correct (with \n)
# 2. All Firebase env vars are set
# 3. Service account has proper permissions
```

**Problem: CORS errors**
- Verify `FRONTEND_URL` in backend env vars matches your frontend URL
- Check that frontend URL is in Firebase authorized domains

### Frontend Issues

**Problem: API calls failing**
- Check `VITE_API_URL` is correct
- Verify backend is running (check `/health` endpoint)
- Check browser console for CORS errors

**Problem: Firebase auth not working**
- Verify all Firebase env vars are set
- Check authorized domains in Firebase Console
- Verify Firebase project is active

**Problem: Build fails**
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run type-check  # if available
```

---

## 📊 Post-Deployment Checklist

- [ ] Backend health check returns `{"status":"ok"}`
- [ ] Frontend loads without errors
- [ ] User registration/login works
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Seller dashboard accessible
- [ ] Admin panel accessible (if applicable)
- [ ] No console errors in browser
- [ ] No errors in Vercel logs
- [ ] Firebase authorized domains configured
- [ ] Firestore security rules deployed
- [ ] Environment variables all set
- [ ] Custom domain configured (if applicable)

---

## 🎉 Success!

Your application is now live! 

**Your URLs:**
- Frontend: `https://truvamate-marketplace-xxxxx.vercel.app`
- Backend: `https://truvamate-backend-xxxxx.vercel.app`
- API: `https://truvamate-backend-xxxxx.vercel.app/api`

**Next Steps:**
1. Monitor Vercel logs for any errors
2. Set up monitoring (Sentry, LogRocket, etc.)
3. Set up analytics (Google Analytics, etc.)
4. Configure backups for Firestore
5. Set up CI/CD for automatic deployments

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**Need Help?**
- Check Vercel Dashboard → Deployments → View Logs
- Check Firebase Console → Project Settings → Usage
- Review error messages in browser console

**Happy Deploying! 🚀**


