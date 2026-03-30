import type { AuditState, AuditSummary } from '@/hooks/useAudit';
import type { PhotoData } from './photoService';

// 🔥 URL WEBHOOK (SUDAH BENAR)
const GOOGLE_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbz5HYeH_JPOyuc3GpxDSUs30DY2j8NzXRT9muhBCKO3xYBPLqHgoBNA_Kk2Uot4nGRc/exec";
// 🚀 FUNCTION KIRIM KE GOOGLE SHEETS
export const sendToGoogleSheets = async (
  auditId: string,
  auditState: AuditState,
  summary: AuditSummary,
  photos: PhotoData[]
): Promise<boolean> => {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      auditId,
      area: auditState.area,
      lokasi: auditState.lokasi,
      tanggal: auditState.tanggal,
      auditors: auditState.auditors.join("; "),
      avgOverall: summary.avgOverall
    };

    const url =
      "https://script.google.com/macros/s/AKfycbz5HYeH_JPOyuc3GpxDSUs30DY2j8NzXRT9muhBCKO3xYBPLqHgoBNA_Kk2Uot4nGRc/exec" +
      "?data=" +
      encodeURIComponent(JSON.stringify(payload));

    // 🔥 ANTI CORS (PASTI TEMBUS)
    new Image().src = url;

    console.log("✅ DIKIRIM KE GOOGLE SHEETS");

    return true;

  } catch (error) {
    console.error("❌ ERROR GOOGLE SHEETS:", error);
    return false;
  }
};

// ✅ FIX: TAMBAHKAN INI (BIAR APP.TSX TIDAK ERROR)
export const downloadCSV = (
  auditId: string,
  auditState: any,
  summary: any,
  photos: any[]
) => {
  const headers = [
    "Audit ID",
    "Area",
    "Lokasi",
    "Tanggal",
    "Auditors",
    "Avg Overall",
  ];

  const row = [
    auditId,
    auditState.area,
    auditState.lokasi,
    auditState.tanggal,
    auditState.auditors.join("; "),
    summary.avgOverall,
  ];

  let csv = headers.join(",") + "\n";
  csv += row.map((x) => `"${x}"`).join(",");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `Audit_${auditId}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
