// Google Sheets Integration Service
import type { AuditState, AuditSummary } from '@/hooks/useAudit';
import type { PhotoData } from './photoService';

const GOOGLE_SHEETS_WEBHOOK_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbwstSSGqDC2KFhUdnHiYgL5eGmngzNYuUmvnkUJzd5SuMep_MgeutwiP77uzZGV-OuC/exec";

export interface GoogleSheetsData {
  timestamp: string;
  auditId: string;
  area: string;
  lokasi: string;
  auditors: string;
  tanggal: string;
  avgSort: number;
  avgSetInOrder: number;
  avgSafety: number;
  avgShine: number;
  avgStandardize: number;
  avgSustain: number;
  totalScore: number;
  avgOverall: number;
  kategori: string;
  photoUrls: string;
  detailScores: string;
}

// Check if Google Sheets is configured
export const isGoogleSheetsConfigured = (): boolean => {
  return !!GOOGLE_SHEETS_WEBHOOK_URL;
};

// Prepare data
export const prepareSheetsData = (
  auditId: string,
  auditState: AuditState,
  summary: AuditSummary,
  photos: PhotoData[]
): GoogleSheetsData => {
  const detailScores = auditState.sections.map(section => {
    const scores = section.questions.map(q => `${q.id}:${q.score || '-'}`).join(',');
    return `${section.name}=[${scores}]`;
  }).join(' | ');

  return {
    timestamp: new Date().toISOString(),
    auditId,
    area: auditState.area,
    lokasi: auditState.lokasi,
    auditors: auditState.auditors.join('; '),
    tanggal: auditState.tanggal,
    avgSort: summary.avgSort,
    avgSetInOrder: summary.avgSetInOrder,
    avgSafety: summary.avgSafety,
    avgShine: summary.avgShine,
    avgStandardize: summary.avgStandardize,
    avgSustain: summary.avgSustain,
    totalScore: summary.totalScore,
    avgOverall: summary.avgOverall,
    kategori: summary.kategori,
    photoUrls: photos.map(p => p.url).join('; '),
    detailScores
  };
};

// 🚀 FINAL NON-BLOCKING FUNCTION
export const sendToGoogleSheets = async (
  auditId: string,
  auditState: AuditState,
  summary: AuditSummary,
  photos: PhotoData[]
): Promise<boolean> => {
  if (!isGoogleSheetsConfigured()) {
    console.warn('Google Sheets webhook not configured');
    return false;
  }

  try {
    const data = prepareSheetsData(auditId, auditState, summary, photos);

    console.log("SEND TO SHEETS:", data);

    // 🔥 NON-BLOCKING FETCH
    fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => console.log("Sheets OK:", result))
    .catch(err => console.error("Sheets ERROR:", err));

    // 🔥 langsung return tanpa nunggu
    return true;

  } catch (error) {
    console.error('Error sending to Google Sheets:', error);
    return false;
  }
};
