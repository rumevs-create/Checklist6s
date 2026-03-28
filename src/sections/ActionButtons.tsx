import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AuditSummary } from '@/types/audit';
import type { AuditState } from '@/hooks/useAudit';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { 
  FileDown, 
  FileSpreadsheet, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Info
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ActionButtonsProps {
  auditState: AuditState;
  summary: AuditSummary;
  hasScores: boolean;
  onReset: () => void;
  printRef: React.RefObject<HTMLDivElement>;
}

export const ActionButtons = ({
  auditState,
  summary,
  hasScores,
  onReset,
  printRef
}: ActionButtonsProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const {
    error,
    successMessage,
    spreadsheetId,
    setSpreadsheetId,
    downloadCSV
  } = useGoogleSheets();

  const exportToPDF = async () => {
    if (!printRef.current) return;
    
    setIsExporting(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      let imgY = 10;
      
      // Add header
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 128);
      pdf.text('LAPORAN AUDIT 6S', pdfWidth / 2, 10, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Area: ${auditState.area} | Lokasi: ${auditState.lokasi}`, pdfWidth / 2, 18, { align: 'center' });
      pdf.text(`Tanggal: ${auditState.tanggal} | Auditor: ${auditState.auditors.join(', ')}`, pdfWidth / 2, 24, { align: 'center' });
      
      imgY = 30;
      
      // Calculate scaled dimensions
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      // Add image
      pdf.addImage(imgData, 'PNG', imgX, imgY, scaledWidth, scaledHeight);
      
      // Save PDF
      pdf.save(`Audit_6S_${auditState.lokasi}_${auditState.tanggal}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Gagal mengekspor PDF. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="shadow-lg border-t-4 border-t-emerald-600">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileDown className="w-5 h-5 text-emerald-600" />
          Aksi & Export
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Export PDF */}
              <Button
                onClick={exportToPDF}
                disabled={!hasScores || isExporting}
                className="h-auto py-4 flex flex-col items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <FileDown className="w-6 h-6" />
                )}
                <div className="text-center">
                  <div className="font-semibold">Export PDF</div>
                  <div className="text-xs opacity-80">Simpan sebagai file PDF</div>
                </div>
              </Button>

              {/* Export CSV */}
              <Button
                onClick={() => downloadCSV(auditState, summary)}
                disabled={!hasScores}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50"
              >
                <FileSpreadsheet className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">Export CSV</div>
                  <div className="text-xs opacity-80">Untuk import Google Sheets</div>
                </div>
              </Button>
            </div>

            {/* Google Sheets Info */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Tips Export ke Google Sheets:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Export data dalam format CSV</li>
                    <li>Buka Google Sheets dan buat spreadsheet baru</li>
                    <li>Pilih File → Import → Upload → Pilih file CSV</li>
                    <li>Pilih "Replace spreadsheet" dan klik Import</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full h-auto py-3 flex items-center gap-2 border-slate-300 text-slate-600 hover:bg-slate-100"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Form Audit
            </Button>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="spreadsheet-id" className="text-sm font-medium">
                  Google Sheets Spreadsheet ID (Opsional)
                </Label>
                <Input
                  id="spreadsheet-id"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  placeholder="Masukkan Spreadsheet ID"
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  ID spreadsheet dari URL Google Sheets Anda
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Catatan Penting:</p>
                    <p className="text-xs">
                      Integrasi langsung dengan Google Sheets API memerlukan setup OAuth dan konfigurasi yang kompleks. 
                      Sebagai alternatif yang lebih mudah, gunakan fitur Export CSV dan import manual ke Google Sheets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
