# 📋 Framework Summary & Deployment Guide

## 🏗️ Code Framework Architecture

### **Frontend Stack**
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6.2.0
- **Routing**: React Router v7
- **State Management**: React Context API (GlobalContext)
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **OCR**: Tesseract.js

### **Backend Stack**
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Admin SDK
- **Storage**: Firebase Storage
- **Payment**: Stripe & Omise integration
- **Email**: SendGrid
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston

### **Infrastructure**
- **Hosting**: Vercel (Frontend + Backend)
- **Database**: Firebase Firestore
- **File Storage**: Firebase Storage
- **Authentication**: Firebase Auth (Email, Google, Facebook)

---

## 📁 Project Structure

```
truvamatenewversion-master/
├── Frontend (Root)
│   ├── pages/              # React page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Lotto.tsx
│   │   ├── Profile.tsx
│   │   ├── Admin*.tsx      # Admin pages
│   │   └── Seller*.tsx     # Seller pages
│   ├── components/         # Reusable components
│   │   ├── Layout/         # Header, Footer, BottomNav
│   │   ├── Marketplace/    # ProductCard
│   │   └── ui/             # Button, Toast
│   ├── services/           # API service layers
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   ├── referralService.ts
│   │   └── googlePhotos.ts
│   ├── context/            # Global state
│   │   └── GlobalContext.tsx
│   ├── config/             # Configuration
│   │   └── firebase.ts
│   └── App.tsx             # Main app router
│
└── backend/                # Express API Server
    ├── src/
    │   ├── server.ts       # Express app entry
    │   ├── routes/         # API routes
    │   │   ├── auth.routes.ts
    │   │   ├── lotto.routes.ts
    │   │   ├── order.routes.ts
    │   │   ├── payment.routes.ts
    │   │   ├── product.routes.ts
    │   │   └── referral.routes.ts
    │   ├── controllers/   # Business logic
    │   ├── middleware/     # Auth, error handling
    │   ├── config/         # Firebase, database config
    │   └── utils/          # Logger, helpers
    └── api/
        └── index.ts        # Vercel serverless entry
```

---

## 🚀 Next Steps for Deployment

### **Phase 1: Pre-Deployment Setup** ✅

#### 1.1 Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

#### 1.2 Firebase Configuration
- [ ] Download Firebase Service Account Key
  - Go to: Firebase Console → Project Settings → Service Accounts
  - Download JSON key file
  - Save as: `backend/serviceAccountKey.json`

- [ ] Get Firebase Client Config
  - Go to: Firebase Console → Project Settings → General
  - Copy Web App config values
  - Create `.env.local` in root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### 1.3 Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

---

### **Phase 2: Backend Deployment** 🎯

#### 2.1 Deploy Backend to Vercel
```bash
cd backend
vercel --prod
```

**Follow prompts:**
- Set up and deploy? → **Yes**
- Link to existing project? → **No**
- Project name? → `truvamate-backend`
- Directory? → `./`

#### 2.2 Configure Backend Environment Variables

Go to: **Vercel Dashboard → truvamate-backend → Settings → Environment Variables**

Add these variables:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://truvamate-marketplace.vercel.app

# Firebase Admin (from serviceAccountKey.json)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Payment Keys (if applicable)
STRIPE_SECRET_KEY=sk_live_...
OMISE_SECRET_KEY=skey_live_...

# Email (if applicable)
SENDGRID_API_KEY=SG...
```

**Important**: After adding env vars, redeploy:
```bash
vercel --prod
```

#### 2.3 Test Backend
```bash
# Health check
curl https://truvamate-backend-xxxxx.vercel.app/health

# Should return:
# {"status":"ok","timestamp":"...","environment":"production","firebase":"connected"}
```

---

### **Phase 3: Frontend Deployment** 🎯

#### 3.1 Update API Configuration

Create/update `src/config/api.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://truvamate-backend-xxxxx.vercel.app/api' 
    : 'http://localhost:5000/api');
```

#### 3.2 Deploy Frontend to Vercel
```bash
cd ..  # Back to root
vercel --prod
```

**Follow prompts:**
- Project name? → `truvamate-marketplace`
- Directory? → `./`

#### 3.3 Configure Frontend Environment Variables

Go to: **Vercel Dashboard → truvamate-marketplace → Settings → Environment Variables**

Add these variables:

```env
# Backend API URL (use your backend URL from Phase 2)
VITE_API_URL=https://truvamate-backend-xxxxx.vercel.app/api

# Firebase Client Config
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Redeploy after adding env vars:**
```bash
vercel --prod
```

---

### **Phase 4: Firebase Configuration** 🔥

#### 4.1 Update Authorized Domains

1. Go to: **Firebase Console → Authentication → Settings → Authorized domains**
2. Add production domains:
   - `truvamate-marketplace.vercel.app`
   - `truvamate-backend.vercel.app`
   - Your custom domain (if any)

#### 4.2 Update Firestore Security Rules

Ensure production rules are set in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Add your production rules here
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

---

### **Phase 5: Testing & Verification** ✅

#### 5.1 Test Backend API
```bash
# Health check
curl https://truvamate-backend-xxxxx.vercel.app/health

# API info
curl https://truvamate-backend-xxxxx.vercel.app/api
```

#### 5.2 Test Frontend
1. Open: `https://truvamate-marketplace-xxxxx.vercel.app`
2. Test features:
   - [ ] User registration/login
   - [ ] Browse products
   - [ ] Add to cart
   - [ ] Checkout process
   - [ ] Lotto ticket purchase
   - [ ] Referral system
   - [ ] Admin panel access
   - [ ] Seller dashboard

#### 5.3 Check Console Logs
- Frontend: Browser DevTools → Console
- Backend: Vercel Dashboard → Deployments → View Function Logs

---

### **Phase 6: Custom Domain (Optional)** 🌐

#### 6.1 Add Domain in Vercel

**Backend:**
- Domain: `api.yourdomain.com`
- Points to: `truvamate-backend.vercel.app`

**Frontend:**
- Domain: `yourdomain.com` & `www.yourdomain.com`
- Points to: `truvamate-marketplace.vercel.app`

#### 6.2 Update DNS Records

At your domain provider:

```
Type: CNAME
Name: api
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 6.3 Update Environment Variables

Update `FRONTEND_URL` and `VITE_API_URL` with custom domains, then redeploy.

---

## 📊 Deployment Checklist

### Pre-Deployment
- [ ] All dependencies installed
- [ ] Firebase project created and configured
- [ ] Service account key downloaded
- [ ] Environment variables documented
- [ ] Vercel CLI installed and logged in

### Backend Deployment
- [ ] Backend deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] Health check endpoint working
- [ ] Firebase connection verified
- [ ] CORS configured correctly

### Frontend Deployment
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] API URL configured correctly
- [ ] Firebase client config set
- [ ] Build successful

### Post-Deployment
- [ ] Firebase authorized domains updated
- [ ] Firestore security rules deployed
- [ ] All features tested in production
- [ ] Error monitoring set up
- [ ] Custom domain configured (if applicable)

---

## 🔄 Future Updates

After initial deployment, updates are simple:

```bash
# Backend
cd backend
npm run build
vercel --prod

# Frontend
cd ..
npm run build
vercel --prod
```

---

## 🐛 Troubleshooting

### Backend Issues
- **Firebase connection failed**: Check `FIREBASE_PRIVATE_KEY` format (must include `\n` for newlines)
- **CORS errors**: Verify `FRONTEND_URL` matches your frontend domain
- **500 errors**: Check Vercel function logs

### Frontend Issues
- **API calls failing**: Verify `VITE_API_URL` is correct
- **Firebase auth not working**: Check authorized domains in Firebase Console
- **Build errors**: Check TypeScript errors and missing dependencies

### View Logs
```bash
# Backend logs
vercel logs https://truvamate-backend-xxxxx.vercel.app

# Or via Vercel Dashboard → Deployments → View Function Logs
```

---

## 📚 Key Documentation Files

- `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- `QUICK_DEPLOY.md` - Quick deployment guide
- `FIREBASE_SETUP.md` - Firebase configuration
- `README.md` - Project overview

---

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Backend health check returns `{"status":"ok"}`
- ✅ Frontend loads without errors
- ✅ Users can register/login
- ✅ Products display correctly
- ✅ Orders can be created
- ✅ Admin panel accessible
- ✅ No console errors in browser

---

**Ready to deploy? Start with Phase 1! 🚀**

