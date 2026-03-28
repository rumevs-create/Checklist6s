# Setup Google Sheets untuk Aplikasi Audit 6S

Panduan lengkap untuk mengintegrasikan aplikasi dengan Google Sheets agar data audit otomatis masuk ke spreadsheet.

## 📋 Prasyarat

- Akun Google
- Google Sheets
- Akses ke [Google Apps Script](https://script.google.com/)

---

## Step 1: Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **"Blank"** untuk membuat spreadsheet baru
3. Beri nama: `Data Audit 6S`
4. Buat sheet dengan nama: `Audit6S`

---

## Step 2: Buat Header Kolom

Di sheet `Audit6S`, isi baris pertama dengan header:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Audit ID | Area | Lokasi | Auditors | Tanggal | AVG_SORT | AVG_SET_IN_ORDER | AVG_SAFETY | AVG_SHINE | AVG_STANDARDIZE | AVG_SUSTAIN | Total Score | Rata-rata Overall | Kategori | Photo URLs | Detail Scores |

---

## Step 3: Buat Google Apps Script

1. Di spreadsheet, klik **"Extensions"** > **"Apps Script"**
2. Hapus kode default, ganti dengan:

```javascript
function doPost(e) {
  try {
    // Parse data dari request
    const data = JSON.parse(e.postData.contents);
    
    // Buka spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Audit6S');
    
    // Siapkan row data
    const row = [
      data.timestamp,
      data.auditId,
      data.area,
      data.lokasi,
      data.auditors,
      data.tanggal,
      data.avgSort,
      data.avgSetInOrder,
      data.avgSafety,
      data.avgShine,
      data.avgStandardize,
      data.avgSustain,
      data.totalScore,
      data.avgOverall,
      data.kategori,
      data.photoUrls,
      data.detailScores
    ];
    
    // Append ke sheet
    sheet.appendRow(row);
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function
function testDoPost() {
  const mockData = {
    timestamp: new Date().toISOString(),
    auditId: 'test_123',
    area: 'Area I',
    lokasi: 'Area I - Cutter',
    auditors: 'Auditor 1; Auditor 2',
    tanggal: '2024-01-15',
    avgSort: 4.5,
    avgSetInOrder: 4.0,
    avgSafety: 4.2,
    avgShine: 3.8,
    avgStandardize: 4.1,
    avgSustain: 3.9,
    totalScore: 180,
    avgOverall: 4.08,
    kategori: 'Baik',
    photoUrls: 'https://...',
    detailScores: 'SORT=[1:4,2:5,...]'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(mockData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
```

3. Klik **"Save"** (Ctrl+S)
4. Beri nama project: `Audit6SWebhook`

---

## Step 4: Deploy sebagai Web App

1. Klik **"Deploy"** > **"New deployment"**
2. Klik ikon gear (⚙️) di "Select type"
3. Pilih **"Web app"**
4. Isi deskripsi: `Audit 6S Webhook`
5. **Execute as:** `Me`
6. **Who has access:** `Anyone`
7. Klik **"Deploy"**
8. Klik **"Authorize access"**
9. Pilih akun Google Anda
10. Klik **"Advanced"** > **"Go to Audit6SWebhook (unsafe)"**
11. Klik **"Allow"**
12. Copy **Web App URL** yang muncul

Contoh URL:
```
https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXX/exec
```

---

## Step 5: Setup Environment Variable

1. Buka file `.env` di project
2. Tambahkan URL webhook:

```env
VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXX/exec
```

3. Restart dev server:
```bash
npm run dev
```

---

## Step 6: Test Integration

1. Buka aplikasi di browser
2. Isi form audit lengkap
3. Klik **"Simpan Audit"**
4. Check Google Sheets - data baru akan muncul di baris terakhir

---

## 🔧 Troubleshooting

### Error: "Script not found"

**Penyebab:** URL webhook salah atau deployment expired

**Solusi:**
1. Buka Apps Script
2. Klik **"Deploy"** > **"Manage deployments"**
3. Pastikan deployment masih aktif
4. Copy URL yang benar

### Error: "Authorization required"

**Penyebab:** Permission belum di-set

**Solusi:**
1. Buka Apps Script
2. Klik **"Deploy"** > **"Test deployments"**
3. Klik **"Authorize access"**
4. Pastikan "Who has access" = "Anyone"

### Data tidak masuk ke Sheets

**Penyebab:** Struktur data tidak sesuai

**Solusi:**
1. Buka Apps Script
2. Klik **"View"** > **"Executions"**
3. Check error log
4. Pastikan header kolom sesuai dengan data yang dikirim

---

## 📊 Format Data yang Dikirim

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "auditId": "audit_abc123",
  "area": "Area I",
  "lokasi": "Area I - Cutter",
  "auditors": "Auditor 1; Auditor 2",
  "tanggal": "2024-01-15",
  "avgSort": 4.5,
  "avgSetInOrder": 4.0,
  "avgSafety": 4.2,
  "avgShine": 3.8,
  "avgStandardize": 4.1,
  "avgSustain": 3.9,
  "totalScore": 180,
  "avgOverall": 4.08,
  "kategori": "Baik",
  "photoUrls": "https://...;https://...",
  "detailScores": "SORT=[1:4,2:5,...] | SETINORDER=[1:3,...]"
}
```

---

## 🚀 Deploy ke Netlify

### Step 1: Update Environment Variable

1. Buka [Netlify Dashboard](https://app.netlify.com/)
2. Pilih site Anda
3. Buka **"Site settings"** > **"Environment variables"**
4. Tambahkan:
   - Key: `VITE_GOOGLE_SHEETS_WEBHOOK_URL`
   - Value: URL webhook dari Apps Script

### Step 2: Redeploy

1. Buka **"Deploys"**
2. Klik **"Trigger deploy"** > **"Deploy site"**

---

## ✅ Checklist

- [ ] Spreadsheet dibuat
- [ ] Header kolom diisi
- [ ] Apps Script dibuat
- [ ] Web app di-deploy
- [ ] URL webhook di-copy ke `.env`
- [ ] Environment variable di-set di Netlify
- [ ] Test submit berhasil
- [ ] Data muncul di Google Sheets

---

## 📚 Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [SpreadsheetApp Reference](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app)
- [Web App Deployment](https://developers.google.com/apps-script/guides/web)

---

## 💡 Tips

1. **Backup Data:** Buat copy spreadsheet secara berkala
2. **Monitoring:** Tambahkan notifikasi email di Apps Script
3. **Validasi:** Tambahkan validasi data sebelum append ke sheet
4. **Formatting:** Gunakan conditional formatting di Sheets untuk highlight nilai
