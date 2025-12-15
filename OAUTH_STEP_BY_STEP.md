# 🔐 OAuth 2.0 Playground - Step by Step Guide

## ขั้นตอนสร้าง Access Token สำหรับ Google Photos API

---

### **STEP 1: เปิด OAuth 2.0 Playground**
URL: https://developers.google.com/oauthplayground/

---

### **STEP 2: เลือก Google Photos Library API v1**

1. ในด้านซ้าย **"Step 1: Select & authorize APIs"**
2. เลื่อนหาหรือค้นหา: **"Google Photos Library API v1"**
3. คลิกเพื่อขยายเมนู
4. **เลือก Scope นี้** (คลิกติ๊กถูก):
   ```
   ✅ https://www.googleapis.com/auth/photoslibrary.readonly
   ```

   **หมายเหตุ**: ใช้ `.readonly` เท่านั้น (อ่านได้อย่างเดียว, ปลอดภัยกว่า)

---

### **STEP 3: Authorize APIs**

1. **คลิกปุ่ม "Authorize APIs"** (สีน้ำเงิน, ด้านล่าง)

2. **เลือก Google Account** ที่จะใช้ (บัญชีที่สร้าง Album)

3. **หน้า Consent Screen** จะปรากฏ:
   ```
   OAuth 2.0 Playground wants to access your Google Account
   
   ✅ See your Google Photos library
   ```

4. **คลิก "Allow"** (อนุญาต)

5. **คลิก "Continue"** ถ้ามี warning "This app isn't verified"

---

### **STEP 4: Exchange Authorization Code for Tokens**

1. หลังจาก Authorize สำเร็จ → จะกลับมาที่ Playground
2. ด้านซ้าย จะเห็น **"Step 2: Exchange authorization code for tokens"**
3. จะมี **Authorization code** แสดงอยู่แล้ว (ยาวๆ)
4. **คลิกปุ่ม "Exchange authorization code for tokens"** (สีน้ำเงิน)

---

### **STEP 5: Copy Access Token**

1. หลังจากคลิกแล้ว → จะเห็น **Response** ด้านขวา:
   ```json
   {
     "access_token": "ya29.a0AfB_byC...",
     "token_type": "Bearer",
     "expires_in": 3599,
     "refresh_token": "1//0g...",
     "scope": "https://www.googleapis.com/auth/photoslibrary.readonly"
   }
   ```

2. **คัดลอก `access_token`** (ข้อความยาวๆ ที่ขึ้นต้นด้วย `ya29.`)

   **ตัวอย่าง**:
   ```
   ya29.a0AfB_byC1234567890abcdefghijklmnopqrstuvwxyz...
   ```

3. 📋 **คัดลอกเก็บไว้** (จะใช้ในระบบ)

---

### **⚠️ สิ่งสำคัญที่ต้องรู้**:

#### 🕐 **Token Expiration (หมดอายุ)**
- **Access Token** หมดอายุใน **1 ชั่วโมง** (3600 seconds)
- หลังจากนั้นต้อง **Generate ใหม่**

#### 🔄 **Refresh Token (สำหรับอนาคต)**
- สามารถเก็บ **Refresh Token** ไว้
- ใช้ Refresh Token เพื่อขอ Access Token ใหม่ (ไม่ต้อง authorize ซ้ำ)
- Refresh Token **ไม่หมดอายุ** (ใช้ได้นาน)

---

### **STEP 6: ทดสอบ API (Optional)**

1. ในด้านซ้าย **"Step 3: Configure request to API"**
2. ใส่:
   ```
   HTTP Method: POST
   Request URI: https://photoslibrary.googleapis.com/v1/mediaItems:search
   ```

3. **Enter request body**:
   ```json
   {
     "albumId": "YOUR_ALBUM_ID_HERE",
     "pageSize": 10
   }
   ```

4. **คลิก "Send the request"**

5. ถ้าสำเร็จ → จะเห็น Response ด้านขวา:
   ```json
   {
     "mediaItems": [
       {
         "id": "...",
         "filename": "photo.jpg",
         "baseUrl": "https://lh3.googleusercontent.com/...",
         "mimeType": "image/jpeg"
       }
     ]
   }
   ```

---

## 🎯 **สรุป: สิ่งที่คุณต้องมี**

### ✅ **1. Album ID**
```
AF1QipNabcXYZ123...
```
(จากขั้นตอนที่ 2 - Create Album)

### ✅ **2. Access Token**
```
ya29.a0AfB_byC1234567890abcdefghijklmnopqrstuvwxyz...
```
(จากขั้นตอนนี้ - OAuth Playground)

---

## 🔧 **Next Step: เชื่อมต่อกับระบบ**

1. เปิดระบบ Truvamate: http://localhost:5173/admin/photo-upload
2. วาง **Album ID** และ **Access Token**
3. คลิก **"เชื่อมต่อ Google Photos"**
4. ระบบจะโหลดรูปจาก Album ✅

---

## 🚨 **Troubleshooting**

### ❌ **"Invalid OAuth scope"**
- ✅ ตรวจสอบว่าเลือก scope: `photoslibrary.readonly`
- ✅ ไม่ใช่ scope อื่น (เช่น `photoslibrary` เฉยๆ)

### ❌ **"Token expired"**
- ✅ Token หมดอายุแล้ว (1 ชั่วโมง)
- ✅ Generate Token ใหม่จาก OAuth Playground

### ❌ **"Access denied"**
- ✅ ตรวจสอบว่ากด **"Allow"** ในหน้า Consent Screen
- ✅ ใช้ Google Account ที่ถูกต้อง (บัญชีที่สร้าง Album)

---

## 🔐 **Security Tips**

### ✅ **ควรทำ**:
- เก็บ Token ไว้ที่ **localStorage** เท่านั้น
- ใช้ **readonly scope** (ไม่ให้สิทธิ์แก้ไข)
- ห้าม commit Token ลง Git
- ใช้ Private Album

### ❌ **ห้ามทำ**:
- ห้ามแชร์ Token กับคนอื่น
- ห้าม Public Album
- ห้ามเก็บ Token ใน code

---

**ขั้นตอนถัดไป**: ไปที่ระบบ → เชื่อมต่อ Google Photos! 🚀
