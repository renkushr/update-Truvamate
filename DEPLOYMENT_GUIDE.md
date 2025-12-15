# 🚀 Production Deployment Guide

## ขั้นตอนการ Deploy ทั้งระบบ

### 1️⃣ Deploy Backend ไปที่ Vercel

#### A. Install Vercel CLI
```powershell
npm install -g vercel
```

#### B. Login Vercel
```powershell
cd backend
vercel login
```

#### C. Deploy Backend
```powershell
# First deployment
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? truvamate-backend
# - Directory? ./
# - Override settings? No

# Production deployment
vercel --prod
```

#### D. Set Environment Variables on Vercel
```powershell
# ไปที่ Vercel Dashboard → Project → Settings → Environment Variables

# เพิ่ม variables เหล่านี้:
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://truvamate-marketplace.vercel.app

# Firebase (ใช้ข้อมูลจริงจาก Firebase Console)
FIREBASE_PROJECT_ID=your-real-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Payment Keys (ถ้ามี)
STRIPE_SECRET_KEY=sk_live_...
OMISE_SECRET_KEY=skey_live_...
```

**หมายเหตุ:** หลังจากเพิ่ม env vars แล้ว ต้อง redeploy:
```powershell
vercel --prod
```

---

### 2️⃣ Deploy Frontend ไปที่ Vercel

#### A. อัพเดท Frontend API URL

สร้างไฟล์ `src/config/api.ts`:

```typescript
// src/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://truvamate-backend.vercel.app/api' 
    : 'http://localhost:5000/api');

export const getAuthHeaders = async () => {
  const { auth } = await import('../config/firebase');
  const token = await auth.currentUser?.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};
```

อัพเดท services ให้ใช้ API_BASE_URL:

```typescript
// ตัวอย่างใน src/services/referralService.ts
import { API_BASE_URL, getAuthHeaders } from '../config/api';

export const createReferralCode = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/referrals/create`, {
    method: 'POST',
    headers,
  });
  return response.json();
};
```

#### B. Deploy Frontend
```powershell
cd ..  # กลับไปที่ root folder

# Deploy
vercel

# Production deployment
vercel --prod
```

#### C. Set Environment Variables (Frontend)
```powershell
# ที่ Vercel Dashboard → Frontend Project → Settings → Environment Variables

VITE_API_URL=https://truvamate-backend.vercel.app/api

# Firebase Client Config (ใช้ข้อมูลจาก Firebase Console → Project Settings → Web App)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

### 3️⃣ อัพเดท Firebase CORS Settings

เพิ่ม production domains ใน Firebase Console:

1. ไปที่ **Authentication → Settings → Authorized domains**
2. เพิ่ม: `truvamate-marketplace.vercel.app`
3. เพิ่ม: `truvamate-backend.vercel.app`

---

### 4️⃣ ทดสอบ Production

#### Test Backend API:
```powershell
# Health check
Invoke-WebRequest -Uri "https://truvamate-backend.vercel.app/health"

# API info
Invoke-WebRequest -Uri "https://truvamate-backend.vercel.app/api"
```

#### Test Frontend:
1. เปิด `https://truvamate-marketplace.vercel.app`
2. Login ด้วย Firebase
3. ทดสอบสร้าง referral code
4. ทดสอบสร้าง order

---

### 5️⃣ Custom Domain (Optional)

#### A. เพิ่ม Custom Domain ใน Vercel

**Backend:**
```
api.truvamate.com → truvamate-backend.vercel.app
```

**Frontend:**
```
truvamate.com → truvamate-marketplace.vercel.app
www.truvamate.com → truvamate-marketplace.vercel.app
```

#### B. อัพเดท DNS Records

ที่ Domain Provider (GoDaddy, Namecheap, etc.):

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

#### C. อัพเดท Environment Variables

```
FRONTEND_URL=https://truvamate.com
VITE_API_URL=https://api.truvamate.com/api
```

---

## 🔧 Alternative: Deploy ด้วย Railway (ถ้า Vercel ไม่ได้)

### Backend on Railway:

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up

# Set environment variables
railway variables set NODE_ENV=production
railway variables set FIREBASE_PROJECT_ID=...
# (เพิ่ม env vars ทั้งหมด)

# Open dashboard
railway open
```

---

## 📊 Monitoring & Logs

### Vercel Logs:
```powershell
vercel logs [deployment-url]
```

### Check Errors:
1. ไปที่ Vercel Dashboard
2. เลือก Project → Deployments
3. คลิก deployment → View Function Logs

---

## 🔒 Security Checklist

- [x] Firebase Security Rules ตั้งค่าแล้ว
- [x] Environment Variables อยู่บน Vercel (ไม่ commit ใน code)
- [x] CORS อนุญาตเฉพาะ production domain
- [x] HTTPS enabled (Vercel ให้ฟรี)
- [x] Rate limiting enabled (express-rate-limit)
- [ ] Add monitoring (Sentry, LogRocket)
- [ ] Set up backup (Firestore auto-backup)

---

## 🚨 Rollback Plan

ถ้ามีปัญหา rollback ได้ทันที:

```powershell
# List deployments
vercel list

# Rollback to previous
vercel rollback [deployment-url]
```

---

## 📞 Support Checklist

- Backend URL: `https://truvamate-backend.vercel.app`
- Frontend URL: `https://truvamate-marketplace.vercel.app`
- Firebase Project: [ใส่ชื่อ project]
- Vercel Account: [ใส่ email]

**Happy Deploying! 🎉**
