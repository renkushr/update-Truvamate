# 🚀 Google Photos Integration - Quick Setup Guide

## ขั้นตอนการตั้งค่าระบบรูปตั๋ว Lotto (5 นาที)

### Step 1: สร้าง Google Photos Album

1. เข้า **Google Photos**: https://photos.google.com
2. คลิก **Albums** (ด้านซ้าย)
3. คลิก **Create album**
4. ตั้งชื่อ: `Truvamate Lotto Tickets`
5. คลิก **Share** (แชร์อัลบั้ม)
6. คลิก **Create link** → คัดลอก URL
   
   URL จะมีลักษณะแบบนี้:
   ```
   https://photos.google.com/share/AF1QipN...xyz123
                                   ^^^^^^^^^^^^^^^^
                                   ส่วนนี้คือ Album ID
   ```

7. **คัดลอก Album ID** (ส่วนที่อยู่หลัง `/share/`)

---

### Step 2: สร้าง Access Token (OAuth 2.0)

1. เข้า **OAuth 2.0 Playground**: https://developers.google.com/oauthplayground/

2. ค้นหา **Google Photos Library API v1** (ในรายการซ้าย)

3. เลือก scope นี้:
   ```
   ✅ https://www.googleapis.com/auth/photoslibrary.readonly
   ```

4. คลิก **Authorize APIs**

5. เลือก Google Account ของคุณ → **Allow**

6. คลิก **Exchange authorization code for tokens**

7. **คัดลอก Access token** (ข้อความยาวๆ ที่ขึ้นต้นด้วย `ya29.`)

   ตัวอย่าง:
   ```
   ya29.a0AfB_byC...xyz123
   ```

⚠️ **หมายเหตุ**: Token นี้หมดอายุใน 1 ชั่วโมง จะต้องสร้างใหม่ทุกครั้ง

---

### Step 3: เชื่อมต่อกับระบบ

1. เข้าหน้า **Admin Panel**: http://localhost:5173/admin

2. คลิกปุ่ม **"📸 จัดการรูปตั๋ว"**

3. วาง **Album ID** และ **Access Token** ในช่อง:

   ```
   Album ID:     AF1QipN...xyz123
   Access Token: ya29.a0AfB_byC...xyz123
   ```

4. คลิก **"เชื่อมต่อ Google Photos"**

5. ระบบจะโหลดรูปจาก Album ✅

---

### Step 4: อัพโหลดรูปตั๋ว

#### วิธีตั้งชื่อไฟล์:
```
LTO-YYYY-XXXXXX-T#.jpg

ตัวอย่าง:
✅ LTO-2025-123456-T1.jpg  (Order 123456, ตั๋วที่ 1)
✅ LTO-2025-123456-T2.jpg  (Order 123456, ตั๋วที่ 2)
✅ LTO-2025-789012-T1.jpg  (Order 789012, ตั๋วที่ 1)
```

#### วิธีอัพโหลด:
1. **ถ่ายรูปตั๋ว** จาก iPhone/Android
2. **Rename ไฟล์** ให้ตรง pattern
3. **อัพโหลดไปยัง Google Photos Album** (ใช้ Google Photos App)
4. รอ **1-2 นาที** (ให้ Google sync)
5. กลับมาที่ระบบ → คลิก **"รีเฟรช"**

---

### Step 5: ทดสอบระบบ

#### ทดสอบจากหน้า Admin:
1. ใส่เลขคำสั่งซื้อ เช่น `LTO-2025-123456`
2. คลิก **"ค้นหา"**
3. จะแสดงรูปตั๋วทั้งหมดของคำสั่งซื้อนั้น ✅

#### ทดสอบจากหน้าลูกค้า:
1. ไปที่ **Profile** → **Special Products** tab
2. เลือกคำสั่งซื้อ Lotto
3. คลิกปุ่ม **"📸 ดูรูปตั๋วจริง"**
4. จะแสดงรูปตั๋วทั้งหมด ✅

---

## 📝 Filename Pattern Reference

### ✅ ถูกต้อง
```
LTO-2025-123456-T1.jpg
LTO-2025-123456-T2.jpg
LTO-2025-999999-T1.jpg
```

### ❌ ผิด
```
ticket1.jpg              → ไม่มีเลขคำสั่งซื้อ
lotto-ticket.jpg         → format ผิด
20251210_123456.jpg      → ไม่มี LTO prefix
LTO-2025-123456.jpg      → ไม่มีหมายเลขตั๋ว (T1)
```

### Pattern อธิบาย:
```
LTO - 2025 - 123456 - T1 . jpg
│     │      │        │    └─ File extension
│     │      │        └────── Ticket number (T1, T2, T3...)
│     │      └─────────────── Order ID (6 digits)
│     └────────────────────── Year
└──────────────────────────── Prefix (Lotto Order)
```

---

## 🔧 API Configuration

### Google Photos API Details:
```yaml
Endpoint: https://photoslibrary.googleapis.com/v1/mediaItems:search
Method: POST
Auth: Bearer Token (OAuth 2.0)
Scope: photoslibrary.readonly
```

### Request Body:
```json
{
  "albumId": "your_album_id",
  "pageSize": 100
}
```

### Response Example:
```json
{
  "mediaItems": [
    {
      "id": "AF1Qip...",
      "filename": "LTO-2025-123456-T1.jpg",
      "baseUrl": "https://lh3.googleusercontent.com/...",
      "mimeType": "image/jpeg",
      "mediaMetadata": {
        "width": "2048",
        "height": "1536",
        "creationTime": "2025-12-10T10:30:00Z"
      }
    }
  ]
}
```

---

## 🚨 Troubleshooting

### 1. "Failed to connect to Google Photos"
- ✅ ตรวจสอบว่า **Access Token ยังไม่หมดอายุ** (1 ชม.)
- ✅ ตรวจสอบว่า **Album ID ถูกต้อง**
- ✅ ลอง **Generate Token ใหม่** จาก OAuth Playground

### 2. "No photos found"
- ✅ ตรวจสอบว่า **มีรูปในอัลบั้ม**
- ✅ ตรวจสอบว่า **ชื่อไฟล์ตรง pattern**
- ✅ รอ **1-2 นาที** หลังอัพโหลด (ให้ Google sync)
- ✅ คลิก **"รีเฟรช"**

### 3. "Cannot find order photos"
- ✅ ตรวจสอบว่า **เลขคำสั่งซื้อถูกต้อง** (LTO-2025-XXXXXX)
- ✅ ตรวจสอบว่า **ชื่อไฟล์ตรง format**
- ✅ ตัวอย่าง: `LTO-2025-123456-T1.jpg` (ต้องมี `-T1` ด้วย)

### 4. Token หมดอายุตลอด
**Solution (Future Enhancement):**
- ใช้ **Refresh Token** แทน Access Token
- หรือสร้าง **Service Account** (ไม่หมดอายุ)

---

## 🔐 Security Best Practices

### ✅ ควรทำ:
- ใช้ **Private Album** (ไม่ใช่ Public)
- เก็บ Token ใน **localStorage** เท่านั้น (ไม่ commit ลง Git)
- แชร์อัลบั้มเฉพาะ **คนที่จำเป็น**
- อัพโหลดเฉพาะ **รูปตั๋ว** (ไม่มีข้อมูลส่วนตัว)

### ❌ ห้ามทำ:
- ห้าม **Public Album** (ใครก็ดูได้)
- ห้าม **แชร์ Access Token** กับคนอื่น
- ห้าม **เก็บ Token ใน Database** (ถ้าไม่ encrypt)
- ห้าม **อัพโหลดรูปที่มีข้อมูลส่วนตัว**

---

## 📊 System Routes

### Frontend Routes:
```typescript
/admin/photo-upload          → Admin photo management
/ticket-photos/:orderNumber  → Customer photo gallery
```

### Profile Integration:
```typescript
Profile → Special Products → [Order] → "📸 ดูรูปตั๋วจริง" button
```

### Admin Integration:
```typescript
Admin Panel → "📸 จัดการรูปตั๋ว" → Photo management page
```

---

## 🎯 Features Implemented

✅ Google Photos API integration  
✅ Album photo listing  
✅ Search by order number  
✅ Fullscreen photo modal  
✅ Download photo  
✅ Recent photos dashboard  
✅ Copy photo URL  
✅ Connection setup UI  
✅ Customer photo gallery  
✅ Admin photo management  
✅ Route integration  
✅ Profile page integration  
✅ Admin panel integration  

---

## 🚀 Next Steps (Optional Enhancements)

### Phase 2:
- [ ] Auto-refresh Access Token
- [ ] Batch upload (multiple files)
- [ ] OCR to verify ticket numbers
- [ ] Watermark on images
- [ ] Image compression

### Phase 3:
- [ ] Email notification when photos uploaded
- [ ] QR code generation
- [ ] Backup to Firebase Storage
- [ ] Blockchain verification

---

**ระบบพร้อมใช้งานแล้ว! 🎉**

Need help? Check `GOOGLE_PHOTOS_SYSTEM.md` for detailed documentation.
