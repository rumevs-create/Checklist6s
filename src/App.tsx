import { useRef, useState } from 'react';
import { useAudit } from '@/hooks/useAudit';
import { IdentityForm } from '@/sections/IdentityForm';
import { AuditChecklist } from '@/sections/AuditChecklist';
import { AuditResults } from '@/sections/AuditResults';
import { ActionButtons } from '@/sections/ActionButtons';
import { ScoreLegend } from '@/sections/ScoreLegend';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ClipboardCheck, 
  BarChart3, 
  FileText, 
  Info,
  ChevronUp,
  RotateCcw,
  Camera,
  Wifi,
  WifiOff,
  Database
} from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { isFirebaseConfigured } from '@/config/firebase';
import { uploadPhoto } from '@/services/photoService';
import { saveAudit, uploadPhotosAsync } from '@/services/auditService';
import { sendToGoogleSheets, downloadCSV } from '@/services/googleSheetsService';

function App() {
  const {
    auditState,
    summary,
    radarData,
    isComplete,
    hasScores,
    photoCount,
    setArea,
    setLokasi,
    toggleAuditor,
    setTanggal,
    updateScore,
    updateComment,
    updatePhoto,
    updatePhotoUrl,
    getPendingPhotos,
    resetAudit
  } = useAudit();

  const printRef = useRef<HTMLDivElement>(null!);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Listen for online/offline status
  window.addEventListener('online', () => setIsOnline(true));
  window.addEventListener('offline', () => setIsOnline(false));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

const handleSubmitAudit = async () => {
  if (!isComplete) {
    toast.error("Data audit belum lengkap!");
    return;
  }

  if (!hasScores) {
    toast.error("Belum ada penilaian yang diisi!");
    return;
  }

  setIsSubmitting(true);
  const toastId = toast.loading("Menyimpan audit...");

  try {
    // ambil foto tapi jangan upload dulu
    const pendingPhotos = getPendingPhotos();

    // 1. save audit dulu
    let auditId = "";
    if (isFirebaseConfigured()) {
      toast.loading("Menyimpan ke database...", { id: toastId });
      auditId = await saveAudit(auditState, summary, []);
    }

    // 2. upload foto di background
    if (pendingPhotos.length > 0) {
      uploadPhotosAsync(auditId, pendingPhotos);
    }

    // 3. kirim ke Google Sheets (tanpa foto dulu)
    toast.loading("Mengirim ke Google Sheets...", { id: toastId });
    await sendToGoogleSheets(auditId, auditState, summary, []);

    toast.success("Audit berhasil disimpan!", { id: toastId });

    setTimeout(() => {
      resetAudit();
      scrollToTop();
    }, 2000);

  } catch (error) {
    console.error("Error submitting audit:", error);
    toast.error("Gagal menyimpan audit", { id: toastId });
  } finally {
    setIsSubmitting(false);
  }
};
  // Export to CSV fallback
  const handleExportCSV = () => {
    const auditId = `audit_${Date.now()}`;
    downloadCSV(auditId, auditState, summary, []);
  };

  const firebaseConfigured = isFirebaseConfigured();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <ClipboardCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  CHECKLIST AUDIT 6S
                </h1>
                <p className="text-blue-200 text-sm">
                  Sistem Penilaian Kebersihan & Kerapian
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <Camera className="w-3 h-3 mr-1" />
                Camera
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <BarChart3 className="w-3 h-3 mr-1" />
                Interactive
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <FileText className="w-3 h-3 mr-1" />
                Export PDF
              </Badge>
              {isOnline ? (
                <Badge className="bg-green-500 text-white border-0">
                  <Wifi className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="destructive" className="border-0">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Firebase Config Alert */}
          {!firebaseConfigured && (
            <Alert className="bg-amber-50 border-amber-200">
              <Database className="w-4 h-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Mode Demo:</strong> Firebase belum dikonfigurasi. 
                Data akan tetap bisa di-export ke CSV. 
                Tambahkan environment variables untuk mengaktifkan fitur cloud.
              </AlertDescription>
            </Alert>
          )}

          {/* Info Banner */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Selamat datang di Aplikasi Audit 6S!</p>
                  <p>
                    Aplikasi ini membantu Anda melakukan penilaian 6S dengan mudah melalui HP. 
                    Ambil foto temuan langsung, lihat hasil real-time, dan export ke PDF atau Google Sheets.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identity Form */}
          <section id="identity">
            <IdentityForm
              area={auditState.area}
              lokasi={auditState.lokasi}
              auditors={auditState.auditors}
              tanggal={auditState.tanggal}
              onAreaChange={setArea}
              onLokasiChange={setLokasi}
              onAuditorToggle={toggleAuditor}
              onTanggalChange={setTanggal}
            />
          </section>

          {/* Score Legend */}
          <section id="legend">
            <ScoreLegend />
          </section>

          {/* Audit Checklist */}
          <section id="checklist">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
                Form Penilaian
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={isComplete ? "default" : "secondary"} className={isComplete ? "bg-green-600" : ""}>
                  {isComplete ? "Data Lengkap" : "Data Belum Lengkap"}
                </Badge>
                {photoCount > 0 && (
                  <Badge className="bg-purple-600">
                    <Camera className="w-3 h-3 mr-1" />
                    {photoCount} Foto
                  </Badge>
                )}
              </div>
            </div>
            <AuditChecklist
              sections={auditState.sections}
              onScoreChange={updateScore}
              onCommentChange={updateComment}
              onPhotoChange={updatePhoto}
            />
          </section>

          {/* Results Section - For PDF Export */}
          <section id="results" ref={printRef}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                Hasil Audit
              </h2>
              {hasScores && (
                <Badge variant="default" className="bg-indigo-600">
                  {summary.avgOverall.toFixed(2)} / 5.00
                </Badge>
              )}
            </div>
            <AuditResults
              summary={summary}
              radarData={radarData}
            />
          </section>

          {/* Submit Button */}
          <section id="submit">
            <Card className="shadow-lg border-t-4 border-t-green-600">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Simpan Audit</h3>
                    <p className="text-sm text-slate-500">
                      Data akan disimpan ke database dan Google Sheets
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleExportCSV}
                      disabled={!hasScores}
                      className="border-slate-300"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button
                      onClick={handleSubmitAudit}
                      disabled={!isComplete || !hasScores || isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Database className="w-4 h-4 mr-2" />
                          Simpan Audit
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Action Buttons */}
          <section id="actions">
            <ActionButtons
              auditState={auditState}
              summary={summary}
              hasScores={hasScores}
              onReset={resetAudit}
              printRef={printRef}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm">
                © 2024 Aplikasi Audit 6S. Sistem Penilaian Kebersihan & Kerapian.
              </p>
              {firebaseConfigured && (
                <p className="text-xs text-slate-500 mt-1">
                  <Database className="w-3 h-3 inline mr-1" />
                  Connected to Firebase
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="text-slate-400 hover:text-white"
              >
                <ChevronUp className="w-4 h-4 mr-1" />
                Ke Atas
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAudit}
                className="text-slate-400 hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
const handleSubmitAudit = async () => {
  if (!isComplete) {
    toast.error("Data audit belum lengkap!");
    return;
  }

  if (!hasScores) {
    toast.error("Belum ada penilaian yang diisi!");
    return;
  }

  setIsSubmitting(true);
  const toastId = toast.loading("Menyimpan audit...");

  try {
    // 🔥 1. Generate auditId SEKALI (penting!)
    const auditId = `audit_${Date.now()}`;

    // 🔥 2. Upload semua foto dulu
    const pendingPhotos = getPendingPhotos();
    const uploadedPhotos: PhotoData[] = [];

    if (pendingPhotos.length > 0) {
      toast.loading(`Upload ${pendingPhotos.length} foto...`, { id: toastId });

      for (let i = 0; i < pendingPhotos.length; i++) {
        const photo = pendingPhotos[i];

        try {
          const photoData = await uploadPhoto(
            auditId,
            photo.sectionKey,
            photo.questionId,
            photo.imageBase64
          );

          uploadedPhotos.push(photoData);

          // update URL di state (biar langsung ke-link)
          updatePhotoUrl(photo.sectionKey, photo.questionId, photoData.url);

        } catch (error) {
          console.error("Upload foto gagal:", error);
          throw new Error("Gagal upload foto"); // ❗ langsung stop
        }
      }
    }

    // 🔥 3. Simpan ke Firestore
    if (isFirebaseConfigured()) {
      toast.loading("Menyimpan ke database...", { id: toastId });

      await saveAudit(
        {
          ...auditState,
          id: auditId, // optional kalau mau disimpan juga di state
        },
        summary,
        uploadedPhotos
      );
    }

    // 🔥 4. Kirim ke Google Sheets
    toast.loading("Mengirim ke Google Sheets...", { id: toastId });

    const sheetsSuccess = await sendToGoogleSheets(
      auditId,
      auditState,
      summary,
      uploadedPhotos
    );

    // 🔥 5. Success
    toast.success(
      `Audit berhasil disimpan!${
        sheetsSuccess ? " (Sheets ✔)" : " (Sheets ❌)"
      }`,
      { id: toastId }
    );

    // 🔥 6. Reset form
    setTimeout(() => {
      resetAudit();
      scrollToTop();
    }, 1500);

  } catch (error) {
    console.error("Error submit audit:", error);
    toast.error("Gagal menyimpan audit!", { id: toastId });

  } finally {
    setIsSubmitting(false);
  }
};
