// Google Sheets Integration Service
import type { AuditState, AuditSummary } from '@/hooks/useAudit';
import type { PhotoData } from './photoService';

const GOOGLE_SHEETS_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || '';

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

// Prepare data for Google Sheets
export const prepareSheetsData = (
  auditId: string,
  auditState: AuditState,
  summary: AuditSummary,
  photos: PhotoData[]
): GoogleSheetsData => {
  // Format detail scores
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

// Send data to Google Sheets via webhook
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

    const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error sending to Google Sheets:', error);
    return false;
  }
};

// Export to CSV (fallback method)
export const exportToCSV = (
  auditId: string,
  auditState: AuditState,
  summary: AuditSummary,
  photos: PhotoData[]
): string => {
  const headers = [
    'Timestamp',
    'Audit ID',
    'Area',
    'Lokasi',
    'Auditors',
    'Tanggal',
    'AVG_SORT',
    'AVG_SET_IN_ORDER',
    'AVG_SAFETY',
    'AVG_SHINE',
    'AVG_STANDARDIZE',
    'AVG_SUSTAIN',
    'Total Score',
    'Rata-rata Overall',
    'Kategori',
    'Photo URLs',
    'Detail Scores'
  ];

  const data = prepareSheetsData(auditId, auditState, summary, photos);

  const rowData = [
    data.timestamp,
    data.auditId,
    data.area,
    data.lokasi,
    data.auditors,
    data.tanggal,
    data.avgSort.toFixed(2),
    data.avgSetInOrder.toFixed(2),
    data.avgSafety.toFixed(2),
    data.avgShine.toFixed(2),
    data.avgStandardize.toFixed(2),
    data.avgSustain.toFixed(2),
    data.totalScore.toString(),
    data.avgOverall.toFixed(2),
    data.kategori,
    data.photoUrls,
    data.detailScores
  ];

  // Add detail questions
  let csvContent = 'DATA RINGKASAN AUDIT 6S\n';
  csvContent += headers.join(',') + '\n';
  csvContent += rowData.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',') + '\n\n';

  // Add detail questions
  csvContent += 'DATA DETAIL AUDIT 6S\n';
  csvContent += ['Aspek', 'No', 'Pertanyaan', 'Score', 'Komentar', 'Photo URL'].join(',') + '\n';

  interface Question {
    id: number;
    question: string;
    score: number | null;
    comment: string;
  }

  interface Section {
    name: string;
    key: string;
    questions: Question[];
  }

  auditState.sections.forEach((section: Section) => {
    section.questions.forEach((q: Question) => {
      const photo = photos.find(p => p.sectionKey === section.key && p.questionId === q.id);
      const detailRow = [
        section.name,
        q.id.toString(),
        q.question,
        q.score?.toString() || '',
        q.comment || '',
        photo?.url || ''
      ];
      csvContent += detailRow.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',') + '\n';
    });
  });

  return csvContent;
};

// Download CSV file
export const downloadCSV = (
  auditId: string,
  auditState: AuditState,
  summary: AuditSummary,
  photos: PhotoData[]
): void => {
  const csvContent = exportToCSV(auditId, auditState, summary, photos);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `Audit_6S_${auditState.lokasi}_${auditState.tanggal}_${auditId}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
