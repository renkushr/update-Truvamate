# Firebase Configuration Update Summary

## ✅ Updated Configuration

### Frontend Firebase Config (`config/firebase.ts`)
- **Project ID**: Updated to `truvamate-9e0fa`
- **Project Number**: Updated to `896181893176`
- **App ID**: Updated to `1:896181893176:web:cb4a98e430ef1921fa8ecd`
- **Auth Domain**: Updated to `truvamate-9e0fa.firebaseapp.com`
- **Storage Bucket**: Updated to `truvamate-9e0fa.firebasestorage.app`

## ⚠️ Still Need to Update

### 1. API Key (Required)
You need to get the **Web API Key** from Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `truvamate-9e0fa`
3. Click ⚙️ **Project Settings** > **General** tab
4. Scroll to **Your apps** section
5. Find your web app or click **Add app** > **Web** (</> icon)
6. Copy the **API Key** (starts with `AIza...`)
7. Update `config/firebase.ts` line 7 with the new API key

### 2. Measurement ID (Optional - for Analytics)
If you're using Firebase Analytics:
1. Go to Firebase Console > Project Settings > General
2. Scroll to **Your apps** section
3. Find the **Measurement ID** (starts with `G-...`)
4. Update `config/firebase.ts` line 13

## 🔧 Backend Configuration

The backend uses environment variables, so you need to set these in Vercel:

### Required Environment Variables for Backend:
```
FIREBASE_PROJECT_ID=truvamate-9e0fa
FIREBASE_STORAGE_BUCKET=truvamate-9e0fa.firebasestorage.app
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@truvamate-9e0fa.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

### How to Get Service Account Credentials:
1. Go to Firebase Console > Project Settings > **Service Accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Extract:
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)
   - `project_id` → `FIREBASE_PROJECT_ID`

## 📋 Next Steps for Vercel Deployment

### 1. Update Frontend Environment Variables (if using env vars):
```
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=truvamate-9e0fa.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=truvamate-9e0fa
VITE_FIREBASE_STORAGE_BUCKET=truvamate-9e0fa.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=896181893176
VITE_FIREBASE_APP_ID=1:896181893176:web:cb4a98e430ef1921fa8ecd
```

### 2. Update Backend Environment Variables:
```
FIREBASE_PROJECT_ID=truvamate-9e0fa
FIREBASE_STORAGE_BUCKET=truvamate-9e0fa.firebasestorage.app
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@truvamate-9e0fa.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 3. Deploy Firestore Rules:
1. Go to Firebase Console > Firestore Database > **Rules**
2. Copy the content from `firestore.rules` file
3. Paste and click **Publish**

### 4. Add Authorized Domains:
1. Go to Firebase Console > Authentication > **Settings** > **Authorized domains**
2. Add your Vercel domain (e.g., `your-app.vercel.app`)

## ✅ Current Status

- ✅ Project ID updated
- ✅ Project number updated  
- ✅ App ID updated
- ✅ Auth domain updated
- ✅ Storage bucket updated
- ⚠️ API Key needs to be updated (get from Firebase Console)
- ⚠️ Measurement ID needs to be updated (if using Analytics)

