import type { AuditState, AuditSummary } from '@/hooks/useAudit';
import type { PhotoData } from './photoService';

// ✅ FIXED WEBHOOK URL (PASTIKAN /exec)
const GOOGLE_SHEETS_WEBHOOK_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbwstSSGqDC2KFhUdnHiYgL5eGmngzNYuUmvnkUJzd5SuMep_MgeutwiP77uzZGV-OuC/exec";

// Check config
export const isGoogleSheetsConfigured = (): boolean => {
  return !!GOOGLE_SHEETS_WEBHOOK_URL;
};

// Prepare data
export const prepareSheetsData = (
  auditId: string,
  auditState: AuditState,
  summary: AuditSummary,
  photos: PhotoData[]
) => {
  return {
    auditId,
    area: auditState.area,
    lokasi: auditState.lokasi,
    tanggal: auditState.tanggal,
    auditors: auditState.auditors,
    summary,
    photoUrls: photos.map(p => p.url)
  };
};

// 🚀 FINAL FUNCTION (FIXED)
export const sendToGoogleSheets = async (
  auditId: string,
  auditState: AuditState,
  summary: AuditSummary,
  photos: PhotoData[]
): Promise<boolean> => {
  if (!isGoogleSheetsConfigured()) {
    console.warn("Google Sheets webhook not configured");
    return false;
  }

  try {
    const payload = prepareSheetsData(auditId, auditState, summary, photos);

    console.log("📤 SEND TO SHEETS:", payload);

    const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST", // 🔥 WAJIB
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    console.log("📥 SHEETS RESPONSE:", text);

    return true;

  } catch (error) {
    console.error("❌ SHEETS ERROR:", error);
    return false;
  }
};

// Export CSV
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
