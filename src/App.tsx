import { useRef } from 'react';
import { useAudit } from '@/hooks/useAudit';
import { IdentityForm } from '@/sections/IdentityForm';
import { AuditChecklist } from '@/sections/AuditChecklist';
import { AuditResults } from '@/sections/AuditResults';
import { ActionButtons } from '@/sections/ActionButtons';
import { ScoreLegend } from '@/sections/ScoreLegend';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardCheck, 
  BarChart3, 
  FileText, 
  Info,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const {
    auditState,
    summary,
    radarData,
    isComplete,
    hasScores,
    setArea,
    setLokasi,
    toggleAuditor,
    setTanggal,
    updateScore,
    updateComment,
    resetAudit
  } = useAudit();

  const printRef = useRef<HTMLDivElement>(null!);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <BarChart3 className="w-3 h-3 mr-1" />
                Interactive
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <FileText className="w-3 h-3 mr-1" />
                Export PDF
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Info Banner */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Selamat datang di Aplikasi Audit 6S!</p>
                  <p>
                    Aplikasi ini membantu Anda melakukan penilaian 6S (Sort, Set in Order, Safety, Shine, Standardize, Sustain) 
                    dengan mudah. Hasil audit dapat dilihat secara real-time dalam bentuk diagram radar dan dapat diekspor ke PDF atau CSV.
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
                Form Penilaian
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant={isComplete ? "default" : "secondary"} className={isComplete ? "bg-green-600" : ""}>
                  {isComplete ? "Data Lengkap" : "Data Belum Lengkap"}
                </Badge>
              </div>
            </div>
            <AuditChecklist
              sections={auditState.sections}
              onScoreChange={updateScore}
              onCommentChange={updateComment}
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
