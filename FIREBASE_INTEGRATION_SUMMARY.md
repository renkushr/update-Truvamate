# 🎉 Firebase Integration - สรุปการติดตั้ง

## ✅ สิ่งที่ติดตั้งเรียบร้อยแล้ว

### 1. ไฟล์ Configuration
- ✅ `config/firebase.ts` - Firebase initialization
- ✅ `.env.local` - Environment variables (ต้องกรอกค่าจริง)

### 2. Authentication Services
- ✅ `services/authService.ts`
  - สมัครสมาชิกด้วยอีเมล/รหัสผ่าน
  - เข้าสู่ระบบด้วยอีเมล/รหัสผ่าน
  - เข้าสู่ระบบด้วย Google
  - เข้าสู่ระบบด้วย Facebook
  - รีเซ็ตรหัสผ่าน

### 3. Database Services
- ✅ `services/productService.ts`
  - ดึงข้อมูลสินค้าทั้งหมด
  - ดึงข้อมูลสินค้าตาม ID
  - ดึงข้อมูลสินค้าตาม Category
  - เพิ่ม/แก้ไข/ลบสินค้า
  - ค้นหาสินค้า

- ✅ `services/orderService.ts`
  - สร้างคำสั่งซื้อ
  - ดึงคำสั่งซื้อของผู้ใช้
  - อัปเดตสถานะคำสั่งซื้อ
  - จัดการ tracking number

### 4. Storage Service
- ✅ `services/storageService.ts`
  - อัปโหลดรูปภาพ
  - ลบรูปภาพ
  - รองรับไฟล์หลายรูป

### 5. UI Components
- ✅ `pages/Login.tsx` - อัปเดตให้ใช้ Firebase
  - ฟอร์ม Login/Register
  - Social Login (Google & Facebook)
  - Modal ยอมรับเงื่อนไข
  - Modal รีเซ็ตรหัสผ่าน

### 6. Sample Data
- ✅ `data/sample-products.json` - ข้อมูลสินค้าตัวอย่าง 10 ชิ้น
- ✅ `scripts/importProducts.js` - สคริปต์สำหรับ import ข้อมูล

### 7. Documentation
- ✅ `FIREBASE_SETUP.md` - คู่มือติดตั้ง Firebase แบบละเอียด

---

## 🚀 ขั้นตอนถัดไป

### 1. ติดตั้ง Firebase Project
```bash
# อ่านคู่มือใน FIREBASE_SETUP.md
```

### 2. กรอก Firebase Config
แก้ไขไฟล์ `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxx
```

### 3. เปิดใช้งาน Firebase Services

#### 3.1 Authentication
1. ไปที่ Firebase Console > Authentication
2. เปิดใช้งาน:
   - Email/Password ✅
   - Google ✅
   - Facebook ✅ (ต้องมี App ID)

#### 3.2 Firestore Database
1. ไปที่ Firestore Database > Create database
2. เลือก "Start in test mode"
3. เลือก Location: `asia-southeast1`

#### 3.3 Storage
1. ไปที่ Storage > Get started
2. เลือก "Start in test mode"
3. เลือก Location เดียวกับ Firestore

### 4. Import ข้อมูลตัวอย่าง

#### วิธีที่ 1: ใช้ Firebase Console (แนะนำ)
1. เปิด Firebase Console > Firestore Database
2. สร้าง Collection ชื่อ `products`
3. คัดลอกข้อมูลจาก `data/sample-products.json`
4. เพิ่ม Document ทีละรายการ

#### วิธีที่ 2: ใช้ Script (Advanced)
```bash
# ต้องแก้ไขไฟล์ให้รองรับ ES modules ก่อน
node scripts/importProducts.js
```

### 5. ทดสอบระบบ
```bash
npm run dev
```

#### ทดสอบ:
- [ ] สมัครสมาชิกด้วยอีเมล/รหัสผ่าน
- [ ] เข้าสู่ระบบ
- [ ] เข้าสู่ระบบด้วย Google
- [ ] รีเซ็ตรหัสผ่าน
- [ ] ดูสินค้า (ถ้า import ข้อมูลแล้ว)

---

## 📊 โครงสร้าง Firestore Collections

### users
```javascript
{
  id: "user_uid",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://...",
  createdAt: Timestamp,
  role: "customer" | "seller" | "admin"
}
```

### products
```javascript
{
  id: "prod-001",
  title: "Product Name",
  priceUSD: 100,
  priceTHB: 3500,
  image: "https://...",
  rating: 4.5,
  sold: 100,
  category: "electronics",
  stock: 50,
  brand: "Apple",
  isFlashSale: false,
  isUSImport: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### orders
```javascript
{
  id: "order_id",
  userId: "user_uid",
  items: [...],
  total: 5000,
  status: "pending" | "processing" | "shipped" | "delivered",
  type: "marketplace" | "lotto",
  paymentMethod: "credit_card",
  trackingNumber: "TH123456789",
  carrier: "Kerry Express",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🔐 Security Rules (Production)

หลังจากทดสอบเสร็จ อย่าลืมตั้งค่า Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Orders
    match /orders/{orderId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

---

## 🛠️ วิธีใช้งาน Services

### Authentication
```typescript
import { registerWithEmail, loginWithGoogle } from './services/authService';

// สมัครสมาชิก
const result = await registerWithEmail(email, password, displayName);

// Login with Google
const result = await loginWithGoogle();
```

### Products
```typescript
import { getAllProducts, getProductById } from './services/productService';

// ดึงสินค้าทั้งหมด
const products = await getAllProducts();

// ดึงสินค้าตาม ID
const product = await getProductById('prod-001');
```

### Orders
```typescript
import { createOrder, getUserOrders } from './services/orderService';

// สร้างคำสั่งซื้อ
const result = await createOrder(userId, orderData);

// ดึงคำสั่งซื้อของผู้ใช้
const orders = await getUserOrders(userId);
```

---

## 💡 Tips

1. **Test Mode จะหมดอายุใน 30 วัน** - ตั้ง Security Rules ก่อน production
2. **Facebook Login ต้องใช้ HTTPS** - ยกเว้น localhost
3. **API Key จำกัดสิทธิ์** - ตั้งค่าใน Firebase Console
4. **Backup Firestore** - ตั้งค่า auto backup
5. **Monitor Usage** - ดู Quota ใน Firebase Console

---

## 🆘 การแก้ไขปัญหา

### Login ไม่ได้
- ตรวจสอบว่าเปิดใช้งาน Auth method แล้ว
- ตรวจสอบ Firebase config ในไฟล์ `.env.local`

### อ่านข้อมูล Firestore ไม่ได้
- ตรวจสอบ Security Rules
- ตรวจสอบว่าสร้าง Collection แล้ว

### Upload รูปไม่ได้
- ตรวจสอบว่าเปิดใช้งาน Storage แล้ว
- ตรวจสอบ Storage Rules

---

## 📞 ต้องการความช่วยเหลือ?

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/
- StackOverflow: https://stackoverflow.com/questions/tagged/firebase

---

**สร้างโดย GitHub Copilot** 🤖
