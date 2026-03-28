# 📱 Aplikasi Audit 6S - Mobile First

Aplikasi web progressive (PWA) untuk melakukan penilaian audit 6S (Sort, Set in Order, Safety, Shine, Standardize, Sustain) dengan fitur lengkap melalui handphone.

![Aplikasi Audit 6S](https://img.shields.io/badge/6S-Audit%20Application-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Cloud-FFCA28?logo=firebase)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)

## ✨ Fitur Unggulan

### 📷 Camera Integration
- Ambil foto temuan langsung dari kamera HP
- Compress gambar otomatis (max 500KB)
- Preview sebelum upload
- Support galeri foto

### ☁️ Cloud Sync
- **Firebase Firestore** - Database real-time
- **Firebase Storage** - Penyimpanan foto
- Auto-sync saat online
- Data tersimpan offline (IndexedDB)

### 📊 Google Sheets Integration
- Data audit otomatis masuk ke spreadsheet
- URL foto tersimpan di sheet
- Export CSV sebagai fallback

### 📱 Mobile First
- Responsive design untuk HP
- PWA - bisa install seperti aplikasi native
- Touch-friendly interface
- Optimized untuk audit di lapangan

### 📈 Real-time Analytics
- Diagram radar interaktif
- Ringkasan skor per aspek
- Kategori hasil audit otomatis
- Export PDF laporan

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/audit-6s-app.git
cd audit-6s-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi Anda (lihat [SETUP_FIREBASE.md](docs/SETUP_FIREBASE.md) dan [SETUP_GOOGLE_SHEETS.md](docs/SETUP_GOOGLE_SHEETS.md)).

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

### 5. Build untuk Production

```bash
npm run build
```

---

## 📁 Struktur Project

```
audit-6s-app/
├── docs/                       # Dokumentasi
│   ├── SETUP_FIREBASE.md      # Setup Firebase
│   └── SETUP_GOOGLE_SHEETS.md # Setup Google Sheets
├── public/                     # Static assets
├── src/
│   ├── components/            # UI Components
│   │   ├── ui/               # shadcn/ui components
│   │   └── CameraCapture.tsx # Camera component
│   ├── config/               # Configuration
│   │   └── firebase.ts       # Firebase config
│   ├── hooks/                # Custom React hooks
│   │   └── useAudit.ts       # Audit state management
│   ├── sections/             # Page sections
│   │   ├── IdentityForm.tsx  # Form identitas
│   │   ├── AuditChecklist.tsx# Checklist 6S
│   │   ├── AuditResults.tsx  # Hasil & diagram
│   │   ├── ActionButtons.tsx # Export buttons
│   │   └── ScoreLegend.tsx   # Legenda skor
│   ├── services/             # Business logic
│   │   ├── photoService.ts   # Photo upload
│   │   ├── auditService.ts   # Firestore operations
│   │   └── googleSheetsService.ts # Sheets integration
│   ├── types/                # TypeScript types
│   │   └── audit.ts
│   ├── App.tsx               # Main App
│   └── main.tsx              # Entry point
├── .env.example              # Environment template
├── netlify.toml              # Netlify config
└── package.json
```

---

## 🔧 Konfigurasi

### Firebase (Wajib untuk Cloud Sync)

Lihat [SETUP_FIREBASE.md](docs/SETUP_FIREBASE.md) untuk panduan lengkap.

Ringkasan:
1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Aktifkan Firestore Database dan Storage
3. Copy config ke `.env`
4. Deploy rules

### Google Sheets (Opsional)

Lihat [SETUP_GOOGLE_SHEETS.md](docs/SETUP_GOOGLE_SHEETS.md) untuk panduan lengkap.

Ringkasan:
1. Buat spreadsheet baru
2. Buat Apps Script webhook
3. Deploy sebagai web app
4. Copy URL ke `.env`

---

## 📱 Cara Install di HP (PWA)

### Android (Chrome)

1. Buka aplikasi di Chrome
2. Klik menu **"⋮"** > **"Add to Home screen"**
3. Klik **"Add"**
4. Aplikasi muncul di home screen

### iOS (Safari)

1. Buka aplikasi di Safari
2. Klik tombol **"Share"** (kotak dengan panah)
3. Pilih **"Add to Home Screen"**
4. Klik **"Add"**

### Desktop (Chrome/Edge)

1. Buka aplikasi
2. Klik icon **"⊕"** di address bar
3. Klik **"Install"**

---

## 🎯 Alur Kerja Aplikasi

```
┌─────────────────────────────────────────────────────────────┐
│  1. BUKA APLIKASI (HP/Desktop)                              │
│     ↓ Install PWA (opsional)                               │
├─────────────────────────────────────────────────────────────┤
│  2. ISI FORM IDENTITAS                                      │
│     ↓ Area, Lokasi, Auditor, Tanggal                       │
├─────────────────────────────────────────────────────────────┤
│  3. AUDIT 6S                                                │
│     ↓ Baca pertanyaan                                       │
│     ↓ Beri score (1-5)                                      │
│     ↓ [📷] Ambil foto temuan (opsional)                    │
│     ↓ Tulis komentar                                        │
├─────────────────────────────────────────────────────────────┤
│  4. SUBMIT                                                  │
│     ↓ Upload foto ke Firebase Storage                      │
│     ↓ Simpan audit ke Firestore                            │
│     ↓ Kirim ke Google Sheets                               │
├─────────────────────────────────────────────────────────────┤
│  5. HASIL                                                   │
│     ↓ Lihat diagram radar                                   │
│     ↓ Export PDF / CSV                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Frontend** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Charts** | Recharts |
| **Camera** | MediaDevices API |
| **Backend** | Firebase (Firestore + Storage) |
| **Spreadsheet** | Google Sheets + Apps Script |
| **PDF Export** | jsPDF + html2canvas |
| **Image Compression** | browser-image-compression |
| **Deploy** | Netlify |

---

## 📸 Screenshot

### Form Identitas
![Identity Form](https://via.placeholder.com/400x300?text=Identity+Form)

### Checklist dengan Camera
![Checklist](https://via.placeholder.com/400x300?text=Checklist+with+Camera)

### Hasil Audit
![Results](https://via.placeholder.com/400x300?text=Results+Dashboard)

---

## 🚀 Deploy ke Netlify

### Via GitHub (Recommended)

1. Push ke GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Buka [Netlify](https://www.netlify.com/)
3. Klik **"Add new site"** > **"Import an existing project"**
4. Pilih repository GitHub Anda
5. Konfigurasi:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Klik **"Deploy site"**
7. Tambahkan Environment Variables di Site Settings

### Manual (Drag & Drop)

1. Build:
```bash
npm run build
```

2. Buka [Netlify Drop](https://app.netlify.com/drop)
3. Drag folder `dist`

---

## 🔐 Environment Variables

| Variable | Keterangan | Wajib |
|----------|------------|-------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | Ya |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Ya |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | Ya |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Ya |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging ID | Ya |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | Ya |
| `VITE_GOOGLE_SHEETS_WEBHOOK_URL` | Google Sheets Webhook URL | Tidak |

---

## 🐛 Troubleshooting

### Aplikasi tidak bisa akses kamera

**Solusi:**
1. Pastikan izin kamera sudah diberikan
2. Gunakan HTTPS (localhost atau deployed)
3. Di iOS: Settings > Safari > Camera > Allow

### Foto tidak terupload

**Solusi:**
1. Check Firebase Storage rules
2. Pastikan file < 5MB
3. Check console untuk error detail

### Data tidak masuk ke Google Sheets

**Solusi:**
1. Check URL webhook
2. Pastikan Apps Script deployment aktif
3. Check execution log di Apps Script

---

## 🤝 Contributing

1. Fork repository
2. Buat branch baru: `git checkout -b feature/nama-fitur`
3. Commit perubahan: `git commit -am 'Add new feature'`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat Pull Request

---

## 📄 License

MIT License - Bebas digunakan untuk personal dan komersial.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Firebase](https://firebase.google.com/) - Backend
- [Google Apps Script](https://developers.google.com/apps-script) - Sheets Integration

---

## 📞 Support

Jika ada pertanyaan atau masalah:

1. Baca dokumentasi di folder `docs/`
2. Check [Issues](https://github.com/YOUR_USERNAME/audit-6s-app/issues)
3. Buat issue baru dengan template yang sesuai

---

**Dibuat dengan ❤️ untuk memudahkan audit 6S di lapangan** 🚀
