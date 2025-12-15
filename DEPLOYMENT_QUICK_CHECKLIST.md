# ⚡ Quick Deployment Checklist

## 🚀 Fast Track (30 minutes)

### Prerequisites
- [ ] Firebase project ready
- [ ] Vercel account created
- [ ] Code tested locally

---

## Step-by-Step Commands

### 1. Install & Login (2 min)
```bash
npm install -g vercel
vercel login
```

### 2. Deploy Backend (5 min)
```bash
cd backend
vercel                    # First deployment
# Save the URL you get

# Set env vars in Vercel Dashboard:
# - NODE_ENV=production
# - FIREBASE_PROJECT_ID=...
# - FIREBASE_CLIENT_EMAIL=...
# - FIREBASE_PRIVATE_KEY="..."
# - FIREBASE_STORAGE_BUCKET=...
# - FRONTEND_URL=(update after frontend deploy)

vercel --prod            # Production deployment
```

### 3. Deploy Frontend (5 min)
```bash
cd ..
vercel                    # First deployment
# Save the URL you get

# Set env vars in Vercel Dashboard:
# - VITE_API_URL=https://your-backend-url.vercel.app/api
# - VITE_FIREBASE_API_KEY=...
# - VITE_FIREBASE_AUTH_DOMAIN=...
# - VITE_FIREBASE_PROJECT_ID=...
# - VITE_FIREBASE_STORAGE_BUCKET=...
# - VITE_FIREBASE_MESSAGING_SENDER_ID=...
# - VITE_FIREBASE_APP_ID=...

vercel --prod            # Production deployment
```

### 4. Update Backend CORS (2 min)
```bash
# Update FRONTEND_URL in backend env vars
# Then redeploy:
cd backend
vercel --prod
```

### 5. Configure Firebase (5 min)
- [ ] Add authorized domains in Firebase Console
- [ ] Deploy Firestore security rules

### 6. Test (5 min)
- [ ] Backend health check: `curl https://your-backend.vercel.app/health`
- [ ] Frontend loads: Open URL in browser
- [ ] Test login/register
- [ ] Test product features

---

## 🔑 Key Environment Variables

### Backend
```
NODE_ENV=production
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx
FIREBASE_PRIVATE_KEY="xxx"
FIREBASE_STORAGE_BUCKET=xxx
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend
```
VITE_API_URL=https://your-backend.vercel.app/api
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

---

## ✅ Verification

- [ ] Backend: `curl https://your-backend.vercel.app/health` → `{"status":"ok"}`
- [ ] Frontend: Opens without errors
- [ ] Login works
- [ ] No console errors

---

## 🆘 Quick Fixes

**Backend not working?**
- Check Vercel logs
- Verify Firebase env vars
- Check FIREBASE_PRIVATE_KEY format

**Frontend not working?**
- Check VITE_API_URL is correct
- Verify all Firebase env vars
- Check browser console

**CORS errors?**
- Update FRONTEND_URL in backend
- Add domain to Firebase authorized domains

---

**Full guide:** See `DEPLOYMENT_NEXT_STEPS.md`


