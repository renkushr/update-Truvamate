# 🚀 PRODUCTION DEPLOYMENT - Quick Start

## สิ่งที่ต้องทำก่อน Deploy (ครั้งเดียว)

### 1. ดาวน์โหลด Firebase Service Account Key

```powershell
# อ่านวิธีการได้จาก GET_FIREBASE_KEY.md
# หรือเปิดลิงก์นี้:
Start-Process "https://console.firebase.google.com/project/truvamate-e3b97/settings/serviceaccounts/adminsdk"

# หลังดาวน์โหลด ย้ายไฟล์มาที่:
Move-Item "$env:USERPROFILE\Downloads\truvamate-e3b97-*.json" ".\backend\serviceAccountKey.json"
```

### 2. Install Vercel CLI

```powershell
npm install -g vercel
```

### 3. Login Vercel

```powershell
vercel login
# จะเปิด browser ให้ login
```

---

## 🚀 Deploy ทั้งระบบ (Auto)

```powershell
# รันสคริปต์อัตโนมัติ:
.\deploy.ps1

# เลือก Option 3: Deploy ทั้งคู่
```

---

## 📋 Deploy แบบ Manual (Step by Step)

### Backend:

```powershell
cd backend

# Build
npm run build

# Deploy to Vercel (Production)
vercel --prod

# จะได้ URL ประมาณ: https://truvamate-backend-xxxxx.vercel.app
```

### ตั้งค่า Environment Variables สำหรับ Backend:

1. ไปที่ Vercel Dashboard → truvamate-backend → Settings → Environment Variables
2. เพิ่ม variables เหล่านี้:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://truvamate-marketplace.vercel.app

# Firebase (copy จาก serviceAccountKey.json)
FIREBASE_PROJECT_ID=truvamate-e3b97
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@truvamate-e3b97.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=truvamate-e3b97.firebasestorage.app
```

3. Redeploy:
```powershell
vercel --prod
```

---

### Frontend:

```powershell
cd ..  # กลับมาที่ root

# Build
npm run build

# Deploy to Vercel
vercel --prod

# จะได้ URL ประมาณ: https://truvamate-marketplace-xxxxx.vercel.app
```

### ตั้งค่า Environment Variables สำหรับ Frontend:

1. ไปที่ Vercel Dashboard → truvamate-marketplace → Settings → Environment Variables
2. เพิ่ม (ใช้ URL ของ backend จากขั้นตอนก่อนหน้า):

```env
VITE_API_URL=https://truvamate-backend-xxxxx.vercel.app/api

# Firebase Client (ใช้จาก .env.local)
VITE_FIREBASE_API_KEY=AIzaSyB_OWhpMZ9pemfqMJmZ_hv30cFksLlg6lU
VITE_FIREBASE_AUTH_DOMAIN=truvamate-e3b97.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=truvamate-e3b97
VITE_FIREBASE_STORAGE_BUCKET=truvamate-e3b97.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=693226652314
VITE_FIREBASE_APP_ID=1:693226652314:web:1d814042d754194131d523
VITE_FIREBASE_MEASUREMENT_ID=G-G3DN3Z6Y60
```

3. Redeploy:
```powershell
vercel --prod
```

---

## ✅ ทดสอบ Production

### Test Backend API:

```powershell
# เปลี่ยน URL เป็นของคุณ
$backendUrl = "https://truvamate-backend-xxxxx.vercel.app"

# Health check
Invoke-WebRequest "$backendUrl/health" | ConvertFrom-Json

# ควรได้:
# {
#   "status": "ok",
#   "firebase": "connected"
# }
```

### Test Frontend:

1. เปิด `https://truvamate-marketplace-xxxxx.vercel.app`
2. ลอง Login
3. ทดสอบสร้าง Referral Code
4. ทดสอบ Order

---

## 🔄 Update Production

หลังจาก deploy ครั้งแรกแล้ว ครั้งต่อไปก็แค่:

```powershell
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

### ถ้า Backend ไม่เชื่อม Firebase:

```powershell
# ตรวจสอบ logs
vercel logs https://truvamate-backend-xxxxx.vercel.app

# ตรวจสอบว่าตั้ง Environment Variables ครบหรือยัง
```

### ถ้า Frontend เรียก API ไม่ได้:

1. ตรวจสอบว่า `VITE_API_URL` ตั้งถูกต้องหรือไม่
2. เช็ค CORS ใน backend (ดูที่ `FRONTEND_URL`)
3. เช็ค Firebase Authorized Domains

---

## 📊 URLs หลัง Deploy:

```
Backend:  https://truvamate-backend-xxxxx.vercel.app
Frontend: https://truvamate-marketplace-xxxxx.vercel.app

API Health: https://truvamate-backend-xxxxx.vercel.app/health
API Docs:   https://truvamate-backend-xxxxx.vercel.app/api
```

---

## 🎉 เสร็จแล้ว!

ระบบพร้อมใช้งานแล้ว! 🚀

- ✅ Backend บน Vercel
- ✅ Frontend บน Vercel  
- ✅ Firebase Authentication
- ✅ Firestore Database
- ✅ Referral System
- ✅ Order Processing
- ✅ Auto Commission

**Happy Launching! 🎊**
