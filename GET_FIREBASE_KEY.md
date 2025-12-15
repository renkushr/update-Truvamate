# 🔧 Firebase Service Account Setup Guide for truvamate-e3b97

## วิธีดาวน์โหลด Service Account Key

### ขั้นตอน:

1. **เปิด Firebase Console: https://console.firebase.google.com/**

2. **เลือก Project: truvamate-e3b97**

3. **ไปที่ Project Settings:**
   - คลิกไอคอนเฟือง ⚙️ → "Project settings"
   - คลิกแท็บ "Service accounts"

4. **Generate Private Key:**
   - คลิก "Generate new private key"
   - ยืนยัน "Generate key"
   - ไฟล์ JSON ดาวน์โหลดมา

5. **วางไฟล์:**
   ```powershell
   Move-Item "~\Downloads\truvamate-e3b97-*.json" ".\backend\serviceAccountKey.json"
   ```

## สำหรับ Vercel Production

Copy ข้อมูลจากไฟล์ JSON ไปใส่ใน Vercel Environment Variables:

```
FIREBASE_PROJECT_ID=truvamate-e3b97
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@truvamate-e3b97.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=truvamate-e3b97.firebasestorage.app
```
