# 🔥 Firebase Setup Guide

## ขั้นตอนการติดตั้ง Firebase

### 1. สร้าง Firebase Project

1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. คลิก "Add project" หรือ "Create a project"
3. ตั้งชื่อโปรเจค เช่น `truvamate-marketplace`
4. เปิด/ปิด Google Analytics (แนะนำให้เปิด)
5. คลิก "Create project"

### 2. เพิ่ม Web App

1. ในหน้า Project Overview คลิกไอคอน `</>`  (Web)
2. ตั้งชื่อแอป เช่น `Truvamate Web`
3. คลิก "Register app"
4. คัดลอก Firebase Configuration

### 3. ตั้งค่า Authentication

1. ไปที่ **Authentication** > **Get started**
2. เปิดใช้งาน Sign-in methods:
   - ✅ **Email/Password** - เปิดใช้งาน
   - ✅ **Google** - เปิดใช้งาน (ต้องกรอก Support email)
   - ✅ **Facebook** - เปิดใช้งาน (ต้องมี App ID และ App Secret จาก Facebook Developers)

#### สำหรับ Facebook Login:
1. ไปที่ [Facebook Developers](https://developers.facebook.com/)
2. สร้าง App ใหม่ > เลือก "Consumer"
3. คัดลอก **App ID** และ **App Secret**
4. ใน Facebook App Settings > Basic > เพิ่ม App Domains: `localhost` และ domain จริง
5. ใน Firebase > Facebook Settings > คัดลอก **OAuth redirect URI** ไปใส่ใน Facebook App > Products > Facebook Login > Settings > Valid OAuth Redirect URIs

### 4. ตั้งค่า Firestore Database

1. ไปที่ **Firestore Database** > **Create database**
2. เลือก **Start in test mode** (สำหรับ development)
3. เลือก Location ที่ใกล้เคียง (แนะนำ: `asia-southeast1` สำหรับไทย)
4. คลิก "Enable"

### 5. ตั้งค่า Storage

1. ไปที่ **Storage** > **Get started**
2. เลือก **Start in test mode**
3. เลือก Location เดียวกับ Firestore
4. คลิก "Done"

### 6. คัดลอก Configuration

หลังจาก Register app แล้ว คุณจะได้ code แบบนี้:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
\`\`\`

### 7. อัปเดตไฟล์ .env.local

เปิดไฟล์ `.env.local` และแทนที่ค่าต่อไปนี้:

\`\`\`env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
\`\`\`

### 8. ตั้งค่า Firestore Security Rules (สำหรับ Production)

ไปที่ **Firestore Database** > **Rules** และแก้ไขเป็น:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
                   (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'SELLER' ||
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN');
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                   (resource.data.userId == request.auth.uid ||
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN');
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }
  }
}
\`\`\`

### 9. รันโปรเจค

\`\`\`bash
npm run dev
\`\`\`

---

## ✅ ฟีเจอร์ที่พร้อมใช้งาน

- ✅ สมัครสมาชิกด้วยอีเมล/รหัสผ่าน
- ✅ เข้าสู่ระบบด้วยอีเมล/รหัสผ่าน
- ✅ เข้าสู่ระบบด้วย Google
- ✅ เข้าสู่ระบบด้วย Facebook
- ✅ รีเซ็ตรหัสผ่าน
- ✅ บันทึกข้อมูลผู้ใช้ใน Firestore
- ✅ Modal ยอมรับเงื่อนไข

---

## 🔧 การใช้งานต่อไป

### เพิ่มข้อมูลสินค้าลง Firestore

สร้าง Collection ชื่อ `products` และเพิ่ม Document ด้วยโครงสร้าง:

\`\`\`json
{
  "id": "prod-001",
  "title": "iPhone 15 Pro",
  "priceUSD": 999,
  "priceTHB": 35000,
  "image": "https://example.com/image.jpg",
  "rating": 4.8,
  "sold": 150,
  "category": "electronics",
  "isFlashSale": false,
  "isUSImport": true,
  "description": "สินค้านำเข้าจาก USA"
}
\`\`\`

### เชื่อมต่อกับ Firestore

สร้างไฟล์ `services/productService.ts`:

\`\`\`typescript
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const getAllProducts = async () => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const getProductById = async (id: string) => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};
\`\`\`

---

## 📝 หมายเหตุ

1. **Test Mode** จะหมดอายุใน 30 วัน - อย่าลืมตั้งค่า Security Rules ก่อน deploy จริง
2. สำหรับ **Facebook Login** ต้องมี HTTPS (ไม่รองรับ http:// ยกเว้น localhost)
3. อย่าลืม **จำกัดสิทธิ์ API Key** ใน Firebase Console > Project Settings > API Restrictions

---

## 🚀 Production Checklist

- [ ] ตั้งค่า Firestore Security Rules
- [ ] ตั้งค่า Storage Rules
- [ ] จำกัดสิทธิ์ API Key
- [ ] เปิด Email Verification (optional)
- [ ] ตั้งค่า Custom Domain สำหรับ Auth
- [ ] Backup Firestore Database
- [ ] Monitor Usage & Quota

---

**ต้องการความช่วยเหลือเพิ่มเติม?**
ดูเอกสารได้ที่: https://firebase.google.com/docs
