import type { AuditState, AuditSummary } from '@/hooks/useAudit';
import type { PhotoData } from './photoService';

// 🔥 HARDCODE URL (PASTIKAN INI YANG TADI SUDAH "Webhook OK")
const GOOGLE_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbz5HYeH_JPOyuc3GpxDSUs30DY2j8NzXRT9muhBCKO3xYBPLqHgoBNA_Kk2Uot4nGRc/exec";

// 🚀 FUNCTION FINAL (PASTI JALAN)
export const sendToGoogleSheets = async (
  auditId: string,
  auditState: AuditState,
  summary: AuditSummary,
  photos: PhotoData[]
): Promise<boolean> => {
  try {
    console.log("🔥 KIRIM KE GOOGLE SHEETS");

    const payload = {
      timestamp: new Date().toISOString(),
      auditId,
      area: auditState.area,
      lokasi: auditState.lokasi,
      tanggal: auditState.tanggal,
      auditors: auditState.auditors.join("; "),
      avgSort: summary.avgSort,
      avgSetInOrder: summary.avgSetInOrder,
      avgSafety: summary.avgSafety,
      avgShine: summary.avgShine,
      avgStandardize: summary.avgStandardize,
      avgSustain: summary.avgSustain,
      totalScore: summary.totalScore,
      avgOverall: summary.avgOverall,
      kategori: summary.kategori,
      photoUrls: photos.map(p => p.url).join("; "),
      detailScores: "detail"
    };

    console.log("📤 DATA DIKIRIM:", payload);

    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors", // 🔥 WAJIB BIAR TIDAK KE-BLOCK
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("✅ REQUEST TERKIRIM KE SHEETS");

    return true;

  } catch (error) {
    console.error("❌ ERROR GOOGLE SHEETS:", error);
    return false;
  }
};

// Export CSV (backup)
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
