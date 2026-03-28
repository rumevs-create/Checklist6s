# Setup Firebase untuk Aplikasi Audit 6S

Panduan lengkap untuk mengkonfigurasi Firebase agar aplikasi bisa menyimpan data audit dan foto ke cloud.

## 📋 Prasyarat

- Akun Google
- Akses ke [Firebase Console](https://console.firebase.google.com/)

---

## Step 1: Buat Project Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"**
3. Masukkan nama project: `audit-6s-app`
4. Pilih lokasi: `asia-southeast2` (Singapore - terdekat dengan Indonesia)
5. Klik **"Create project"**

---

## Step 2: Aktifkan Services

### 2.1 Firestore Database

1. Di sidebar, klik **"Firestore Database"**
2. Klik **"Create database"**
3. Pilih **"Start in production mode"**
4. Pilih lokasi: `asia-southeast2`
5. Klik **"Enable"**

### 2.2 Firebase Storage

1. Di sidebar, klik **"Storage"**
2. Klik **"Get started"**
3. Pilih **"Start in production mode"**
4. Pilih lokasi: `asia-southeast2`
5. Klik **"Done"**

### 2.3 Authentication (Opsional)

1. Di sidebar, klik **"Authentication"**
2. Klik **"Get started"**
3. Pilih provider **"Email/Password"**
4. Enable **"Email/Password"**
5. Klik **"Save"**

---

## Step 3: Dapatkan Config

1. Klik ikon **"</>"** (Add app) di halaman utama project
2. Pilih **"Web"**
3. Masukkan nama app: `audit-6s-web`
4. Klik **"Register app"**
5. Copy config yang muncul:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "audit-6s-app.firebaseapp.com",
  projectId: "audit-6s-app",
  storageBucket: "audit-6s-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

## Step 4: Setup Environment Variables

Buat file `.env` di root project:

```bash
# Copy dari template
cp .env.example .env
```

Edit file `.env` dengan config dari Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=audit-6s-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=audit-6s-app
VITE_FIREBASE_STORAGE_BUCKET=audit-6s-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

---

## Step 5: Setup Firestore Rules

1. Buka Firestore Database > Rules
2. Ganti rules dengan:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write if user is authenticated
    match /audits/{auditId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow public read for demo (remove in production)
    match /audits/{auditId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Klik **"Publish"**

---

## Step 6: Setup Storage Rules

1. Buka Storage > Rules
2. Ganti rules dengan:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /audit-photos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

3. Klik **"Publish"**

---

## Step 7: Test Koneksi

1. Jalankan aplikasi:
```bash
npm run dev
```

2. Buka browser di `http://localhost:5173`

3. Jika Firebase terkonfigurasi dengan benar, alert "Mode Demo" tidak akan muncul.

4. Coba lakukan audit dan simpan - data akan masuk ke Firestore.

---

## 🔧 Troubleshooting

### Error: "Firebase not configured"

**Penyebab:** Environment variables belum di-set

**Solusi:**
1. Pastikan file `.env` ada di root project
2. Restart dev server: `Ctrl+C` lalu `npm run dev`
3. Check console browser untuk error detail

### Error: "Permission denied"

**Penyebab:** Firestore rules terlalu ketat

**Solusi:**
1. Update rules seperti di Step 5
2. Klik "Publish"
3. Tunggu 1-2 menit untuk propagasi

### Error: "CORS policy"

**Penyebab:** Domain belum di-whitelist

**Solusi:**
1. Buka Firebase Console > Authentication > Settings
2. Di "Authorized domains", tambahkan:
   - `localhost`
   - `your-netlify-app.netlify.app`
   - Domain custom Anda

---

## 📊 Struktur Database

### Collection: `audits`

```json
{
  "id": "audit_abc123",
  "area": "Area I",
  "lokasi": "Area I - Cutter",
  "auditors": ["Nama Auditor"],
  "tanggal": "2024-01-15",
  "sections": [...],
  "summary": {
    "avgSort": 4.2,
    "avgSetInOrder": 3.8,
    ...
  },
  "photos": [
    {
      "questionId": 1,
      "sectionKey": "SORT",
      "url": "https://storage...",
      "fileName": "audit-photos/audit_abc123/SORT_1_123456.jpg",
      "uploadedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "status": "completed"
}
```

---

## 🚀 Deploy ke Netlify dengan Environment Variables

### Step 1: Push ke GitHub

```bash
git add .
git commit -m "Add Firebase integration"
git push origin main
```

### Step 2: Setup Netlify

1. Buka [Netlify Dashboard](https://app.netlify.com/)
2. Pilih site Anda
3. Buka **"Site settings"** > **"Environment variables"**
4. Klik **"Add a variable"**
5. Tambahkan semua variable dari `.env`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### Step 3: Redeploy

1. Buka **"Deploys"**
2. Klik **"Trigger deploy"** > **"Deploy site"**

---

## ✅ Checklist

- [ ] Project Firebase dibuat
- [ ] Firestore Database diaktifkan
- [ ] Firebase Storage diaktifkan
- [ ] Config disalin ke `.env`
- [ ] Firestore rules di-publish
- [ ] Storage rules di-publish
- [ ] Environment variables di-set di Netlify
- [ ] Aplikasi berhasil connect ke Firebase

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage Rules](https://firebase.google.com/docs/storage/security)
