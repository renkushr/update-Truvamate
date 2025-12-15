# 📋 ขั้นตอนต่อไปที่ต้องทำ (Next Steps)

**สถานะปัจจุบัน:** ✅ Backend และ Frontend ได้ถูก Deploy แล้ว แต่ยังไม่ได้เชื่อมต่อกัน

---

## 🎯 ขั้นตอนที่ต้องทำต่อ (เรียงตามลำดับ)

### 1️⃣ อัพเดท Environment Variables ใน Vercel

#### Backend Environment Variables
เข้าไปที่: https://vercel.com/weenahee04-8034s-projects/truvamate-marketplace/settings/environment-variables

**อัพเดทค่านี้:**
```
FRONTEND_URL = https://truvamate-marketplace-oygxyhymu-weenahee04-8034s-projects.vercel.app
```

**ค่าที่มีอยู่แล้ว (ไม่ต้องแก้):**
- ✅ FIREBASE_PROJECT_ID = `truvamate-e3b97`
- ✅ FIREBASE_CLIENT_EMAIL = `firebase-adminsdk-fbsvc@truvamate-e3b97.iam.gserviceaccount.com`
- ✅ FIREBASE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvQI...` (ดูในไฟล์ serviceAccountKey.json)
- ✅ FIREBASE_STORAGE_BUCKET = `truvamate-e3b97.firebasestorage.app`
- ✅ NODE_ENV = `production`

#### Frontend Environment Variables
เข้าไปที่: https://vercel.com/weenahee04-8034s-projects/truvamate-marketplace/settings/environment-variables

**เพิ่มค่าใหม่:**
```
Name:  VITE_API_URL
Value: https://truvamate-marketplace-9n7c53jdr-weenahee04-8034s-projects.vercel.app/api
Environment: Production ✓
```

---

### 2️⃣ Redeploy Backend

```powershell
cd backend
vercel --prod
cd ..
```

**ทำไมต้อง Redeploy:**
- เพื่อให้ Backend โหลดค่า `FRONTEND_URL` ใหม่
- เพื่อให้ CORS อนุญาตให้ Frontend ใหม่เรียก API ได้

**ระยะเวลา:** ~25-30 วินาที

---

### 3️⃣ Redeploy Frontend

```powershell
npm run build
vercel --prod
```

**ทำไมต้อง Redeploy:**
- เพื่อให้ Frontend โหลดค่า `VITE_API_URL` ใหม่
- เพื่อให้ Frontend รู้ว่าต้องเรียก Backend API ที่ไหน

**ระยะเวลา:** ~30 วินาที

---

### 4️⃣ ทดสอบระบบ End-to-End

#### ทดสอบ Backend Health Check
```powershell
Invoke-RestMethod -Uri "https://truvamate-marketplace-9n7c53jdr-weenahee04-8034s-projects.vercel.app/health"
```

**ผลที่ควรได้:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-14T...",
  "environment": "production",
  "firebase": "connected"
}
```

#### ทดสอบ Frontend
1. เปิด: https://truvamate-marketplace-oygxyhymu-weenahee04-8034s-projects.vercel.app
2. เปิด Browser Console (F12)
3. ตรวจสอบว่า API calls ไปที่ URL ถูกต้องหรือไม่

#### ทดสอบ Features หลัก

**1. ระบบ Authentication:**
- [ ] ลงทะเบียนผู้ใช้ใหม่
- [ ] Login
- [ ] Logout
- [ ] ตรวจสอบใน Firebase Console ว่ามีผู้ใช้ถูกสร้าง

**2. ระบบ Referral:**
- [ ] สร้าง Referral Code
- [ ] แชร์ Link ให้คนอื่น
- [ ] ตรวจสอบว่าระบบบันทึก Referrer ถูกต้อง
- [ ] ดูใน Firestore ว่ามีข้อมูล referrals

**3. ระบบ Marketplace:**
- [ ] เข้าดูสินค้า
- [ ] เพิ่มสินค้าในตะกร้า
- [ ] Checkout
- [ ] ตรวจสอบ Order ใน Firestore

**4. ระบบ Commission:**
- [ ] ดูว่ามี Commission คำนวณหลังจากมี Order
- [ ] ตรวจสอบ Commission ใน Admin Panel
- [ ] ตรวจสอบใน Firestore collection `commissions`

**5. ระบบ Seller:**
- [ ] เพิ่มสินค้าใหม่
- [ ] จัดการ Orders
- [ ] ดู Dashboard

---

## 🔗 URLs สำคัญ

### Production URLs
```
Frontend (เว็บหลัก):
https://truvamate-marketplace-oygxyhymu-weenahee04-8034s-projects.vercel.app

Backend API:
https://truvamate-marketplace-9n7c53jdr-weenahee04-8034s-projects.vercel.app

Backend Health Check:
https://truvamate-marketplace-9n7c53jdr-weenahee04-8034s-projects.vercel.app/health
```

### Vercel Dashboard
```
Settings:
https://vercel.com/weenahee04-8034s-projects/truvamate-marketplace/settings

Environment Variables:
https://vercel.com/weenahee04-8034s-projects/truvamate-marketplace/settings/environment-variables

Deployments:
https://vercel.com/weenahee04-8034s-projects/truvamate-marketplace
```

### Firebase Console
```
Project: truvamate-e3b97
Console: https://console.firebase.google.com/project/truvamate-e3b97

Authentication:
https://console.firebase.google.com/project/truvamate-e3b97/authentication/users

Firestore:
https://console.firebase.google.com/project/truvamate-e3b97/firestore

Storage:
https://console.firebase.google.com/project/truvamate-e3b97/storage
```

### GitHub Repository
```
Repository: https://github.com/weenahee04/truvamatenewversion
```

---

## 📦 ติดตั้งที่เครื่องใหม่

```powershell
# 1. Clone repository
git clone https://github.com/weenahee04/truvamatenewversion.git
cd truvamatenewversion

# 2. ติดตั้ง dependencies
npm install

# 3. ติดตั้ง backend dependencies
cd backend
npm install
cd ..

# 4. สร้าง .env สำหรับ development (local)
# ดูค่าใน serviceAccountKey.json และ Firebase Console
```

---

## 🔐 Firebase Credentials ที่ต้องใช้

**ไฟล์สำคัญ:**
- `backend/serviceAccountKey.json` - **ห้าม push ขึ้น Git!**

**ค่าที่ต้องใช้ (ดูจาก serviceAccountKey.json):**
```json
{
  "type": "service_account",
  "project_id": "truvamate-e3b97",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@truvamate-e3b97.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "...",
  "universe_domain": "googleapis.com"
}
```

**สำหรับ Environment Variables:**
- `FIREBASE_PROJECT_ID` = `truvamate-e3b97`
- `FIREBASE_CLIENT_EMAIL` = `firebase-adminsdk-fbsvc@truvamate-e3b97.iam.gserviceaccount.com`
- `FIREBASE_PRIVATE_KEY` = เอาค่า `private_key` มาใส่ (ต้องเป็น single line ที่มี `\n`)
- `FIREBASE_STORAGE_BUCKET` = `truvamate-e3b97.firebasestorage.app`

---

## ⚙️ Optional: Custom Domain (ทำหลังจากระบบทำงานแล้ว)

### 1. ซื้อ Domain
- แนะนำ: Namecheap, GoDaddy, หรือ Google Domains
- ตัวอย่าง: `truvamate.com`

### 2. เพิ่ม Domain ใน Vercel

#### Frontend Domain
```
truvamate.com
app.truvamate.com
```

#### Backend Domain
```
api.truvamate.com
```

### 3. ตั้งค่า DNS
ทำตาม Vercel Instructions หลังจากเพิ่ม Domain

### 4. อัพเดท Environment Variables
```
Backend:
FRONTEND_URL = https://truvamate.com

Frontend:
VITE_API_URL = https://api.truvamate.com/api
```

### 5. Redeploy ทั้งสองอีกครั้ง

---

## 🐛 Troubleshooting

### ปัญหาที่อาจเจอ

#### 1. CORS Error
**อาการ:** Frontend ไม่สามารถเรียก Backend API ได้
**วิธีแก้:**
- ตรวจสอบว่า `FRONTEND_URL` ใน Backend ถูกต้อง
- Redeploy Backend
- เช็ค Network tab ใน Browser Console

#### 2. Firebase Error
**อาการ:** "Firebase not connected" หรือ Auth ไม่ทำงาน
**วิธีแก้:**
- ตรวจสอบ Environment Variables ทั้ง 6 ตัว
- ตรวจสอบว่า `FIREBASE_PRIVATE_KEY` มี `\n` อยู่
- ตรวจสอบ Firebase Console ว่า Services เปิดอยู่

#### 3. 404 Not Found
**อาการ:** เรียก API แล้วได้ 404
**วิธีแก้:**
- เช็ค `VITE_API_URL` ใน Frontend
- ตรวจสอบว่า URL ลงท้ายด้วย `/api` หรือไม่
- เช็ค Network tab ดู URL ที่เรียกจริง

#### 4. Environment Variables ไม่โหลด
**อาการ:** แก้ไข Env Vars แล้ว ไม่มีผล
**วิธีแก้:**
- **ต้อง Redeploy เสมอ** หลังจากแก้ Environment Variables
- Environment ต้องเลือก Production ✓
- รอ ~30 วินาทีหลัง Deploy แล้วลองใหม่

---

## 📊 Performance Optimization (ทำทีหลัง)

### Frontend Bundle Size
**ปัญหา:** Bundle ใหญ่เกิน 500 KB

**วิธีแก้:**
1. Code Splitting ด้วย React.lazy()
```typescript
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
```

2. Dynamic Imports
```typescript
import type { ComponentType } from 'react';
const loadComponent = (name: string) => lazy(() => import(`./pages/${name}`));
```

3. แยก Vendor Chunks ใน `vite.config.ts`:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
      }
    }
  }
}
```

---

## ✅ Checklist ก่อนไปทำต่อที่เครื่องอื่น

- [ ] Clone repository แล้ว
- [ ] `npm install` เสร็จแล้ว
- [ ] มีไฟล์ `serviceAccountKey.json` (ต้อง download จาก Firebase Console หรือ copy จากเครื่องเดิม)
- [ ] อัพเดท Environment Variables ใน Vercel แล้ว
- [ ] Redeploy Backend แล้ว
- [ ] Redeploy Frontend แล้ว
- [ ] ทดสอบ Health Check ผ่าน
- [ ] ทดสอบ Frontend เปิดได้
- [ ] ทดสอบ API calls ทำงาน (ดู Console)

---

## 📞 การติดต่อ & Support

**Repository:** https://github.com/weenahee04/truvamatenewversion

**หากมีปัญหา:**
1. เช็ค Runtime Logs ใน Vercel
2. เช็ค Browser Console (F12)
3. เช็ค Network Tab
4. ตรวจสอบ Environment Variables
5. ลอง Redeploy ใหม่

---

**สร้างเมื่อ:** 14 ธันวาคม 2025  
**สถานะ:** ✅ Backend & Frontend Deployed, ⏳ Pending Final Configuration
