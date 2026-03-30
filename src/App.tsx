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
import { saveAudit } from '@/services/auditService';
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

  window.addEventListener('online', () => setIsOnline(true));
  window.addEventListener('offline', () => setIsOnline(false));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ FIXED HANDLE SUBMIT
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
      const auditId = `audit_${Date.now()}`;

      // 1. Upload foto
      const pendingPhotos = getPendingPhotos();
      const uploadedPhotos: any[] = [];

      if (pendingPhotos.length > 0) {
        toast.loading(`Upload ${pendingPhotos.length} foto...`, { id: toastId });

        for (const photo of pendingPhotos) {
          const photoData = await uploadPhoto(
            auditId,
            photo.sectionKey,
            photo.questionId,
            photo.imageBase64
          );

          uploadedPhotos.push(photoData);

          updatePhotoUrl(
            photo.sectionKey,
            photo.questionId,
            photoData.url
          );
        }
      }

      // 2. Save ke Firestore
      let savedAuditId = auditId;

      if (isFirebaseConfigured()) {
        toast.loading("Menyimpan ke database...", { id: toastId });

        savedAuditId = await saveAudit(
          auditState,
          summary,
          uploadedPhotos
        );
      }

      // 3. Kirim ke Google Sheets
      toast.loading("Mengirim ke Google Sheets...", { id: toastId });

      await sendToGoogleSheets(
        savedAuditId,
        auditState,
        summary,
        uploadedPhotos
      );

      toast.success("Audit berhasil disimpan!", { id: toastId });

      setTimeout(() => {
        resetAudit();
        scrollToTop();
      }, 1500);

    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Gagal menyimpan audit", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const auditId = `audit_${Date.now()}`;
    downloadCSV(auditId, auditState, summary, []);
  };

  const firebaseConfigured = isFirebaseConfigured();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-blue-900 text-white p-4">
        <h1 className="text-xl font-bold">Checklist Audit 6S</h1>
      </header>

      <main className="p-4 space-y-6">
        {!firebaseConfigured && (
          <Alert>
            <AlertDescription>
              Mode demo aktif (Firebase belum dikonfigurasi)
            </AlertDescription>
          </Alert>
        )}

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

        <ScoreLegend />

        <AuditChecklist
          sections={auditState.sections}
          onScoreChange={updateScore}
          onCommentChange={updateComment}
          onPhotoChange={updatePhoto}
        />

        <AuditResults summary={summary} radarData={radarData} />

        <div className="flex gap-3">
          <Button onClick={handleExportCSV}>
            Export CSV
          </Button>

          <Button
            onClick={handleSubmitAudit}
            disabled={!isComplete || !hasScores || isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Audit"}
          </Button>
        </div>

        <ActionButtons
          auditState={auditState}
          summary={summary}
          hasScores={hasScores}
          onReset={resetAudit}
          printRef={printRef}
        />
      </main>

      <Toaster />
    </div>
  );
}

export default App;
