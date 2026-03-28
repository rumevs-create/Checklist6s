import { useState, useCallback } from 'react';
import type { AuditSummary } from '@/types/audit';
import type { AuditState } from '@/hooks/useAudit';

interface GoogleSheetsState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const useGoogleSheets = () => {
  const [state, setState] = useState<GoogleSheetsState>({
    isAuthenticated: false,
    isLoading: false,
    error: null,
    successMessage: null
  });

  const [spreadsheetId, setSpreadsheetId] = useState<string>('');
  const [, setApiKey] = useState<string>('');

  const showError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, successMessage: null }));
    setTimeout(() => setState(prev => ({ ...prev, error: null })), 5000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    setState(prev => ({ ...prev, successMessage: message, error: null }));
    setTimeout(() => setState(prev => ({ ...prev, successMessage: null })), 5000);
  }, []);

  const configureSheet = useCallback((id: string, key: string) => {
    setSpreadsheetId(id);
    setApiKey(key);
    setState(prev => ({ ...prev, isAuthenticated: true }));
  }, []);

  const saveToGoogleSheets = useCallback(async (
    auditState: AuditState, 
    summary: AuditSummary
  ): Promise<boolean> => {
    if (!spreadsheetId) {
      showError('Spreadsheet ID belum dikonfigurasi. Silakan atur di pengaturan.');
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Prepare data row
      const rowData = [
        auditState.area,
        auditState.lokasi,
        auditState.auditors.join(', '),
        auditState.tanggal,
        summary.avgSort.toFixed(2),
        summary.avgSetInOrder.toFixed(2),
        summary.avgSafety.toFixed(2),
        summary.avgShine.toFixed(2),
        summary.avgStandardize.toFixed(2),
        summary.avgSustain.toFixed(2),
        summary.totalScore.toString(),
        summary.avgOverall.toFixed(2),
        summary.kategori,
        new Date().toISOString()
      ];

      // Try to use Google Apps Script Web App approach (CORS-friendly)
      // This is a placeholder - user needs to deploy their own Apps Script
      const response = await fetch(
        `https://script.google.com/macros/s/${spreadsheetId}/exec`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'append',
            data: rowData
          })
        }
      );

      if (!response.ok) {
        throw new Error('Gagal menyimpan ke Google Sheets');
      }

      showSuccess('Data berhasil disimpan ke Google Sheets!');
      setState(prev => ({ ...prev, isLoading: false }));
      return true;
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
      showError('Gagal menyimpan ke Google Sheets. Pastikan konfigurasi sudah benar.');
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, [spreadsheetId, showError, showSuccess]);

  // Alternative: Export to CSV that can be imported to Google Sheets
  const exportToCSV = useCallback((
    auditState: AuditState, 
    summary: AuditSummary
  ): string => {
    const headers = [
      'Area Utama',
      'Lokasi Detail',
      'Auditor',
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
      'Timestamp'
    ];

    const rowData = [
      auditState.area,
      auditState.lokasi,
      auditState.auditors.join('; '),
      auditState.tanggal,
      summary.avgSort.toFixed(2),
      summary.avgSetInOrder.toFixed(2),
      summary.avgSafety.toFixed(2),
      summary.avgShine.toFixed(2),
      summary.avgStandardize.toFixed(2),
      summary.avgSustain.toFixed(2),
      summary.totalScore.toString(),
      summary.avgOverall.toFixed(2),
      summary.kategori,
      new Date().toISOString()
    ];

    // Add detailed questions data
    const detailHeaders = [
      'Aspek',
      'No',
      'Pertanyaan',
      'Score',
      'Komentar'
    ];

    let csvContent = 'DATA RINGKASAN AUDIT 6S\n';
    csvContent += headers.join(',') + '\n';
    csvContent += rowData.map(field => `"${field}"`).join(',') + '\n\n';

    csvContent += 'DATA DETAIL AUDIT 6S\n';
    csvContent += detailHeaders.join(',') + '\n';

    interface Question {
      id: number;
      question: string;
      score: number | null;
      comment: string;
    }

    interface Section {
      name: string;
      questions: Question[];
    }

    auditState.sections.forEach((section: Section) => {
      section.questions.forEach((q: Question) => {
        const detailRow = [
          section.name,
          q.id.toString(),
          q.question,
          q.score?.toString() || '',
          q.comment || ''
        ];
        csvContent += detailRow.map(field => `"${field.replace(/"/g, '""')}"`).join(',') + '\n';
      });
    });

    return csvContent;
  }, []);

  const downloadCSV = useCallback((
    auditState: AuditState, 
    summary: AuditSummary
  ) => {
    const csvContent = exportToCSV(auditState, summary);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Audit_6S_${auditState.lokasi}_${auditState.tanggal}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccess('File CSV berhasil diunduh!');
  }, [exportToCSV, showSuccess]);

  return {
    ...state,
    spreadsheetId,
    setSpreadsheetId,
    configureSheet,
    saveToGoogleSheets,
    exportToCSV,
    downloadCSV
  };
};
