import { useState, useCallback, useMemo } from 'react';
import type { AuditSection } from '@/types/audit';
import type { AuditSummary } from '@/types/audit';
import { INITIAL_AUDIT_DATA, getKategoriPenilaian } from '@/types/audit';

// Re-export AuditSummary for use in other modules
export type { AuditSummary };

export interface AuditState {
  area: string;
  lokasi: string;
  auditors: string[];
  tanggal: string;
  sections: AuditSection[];
}

export const useAudit = () => {
  const [auditState, setAuditState] = useState<AuditState>({
    area: '',
    lokasi: '',
    auditors: [],
    tanggal: new Date().toISOString().split('T')[0],
    sections: JSON.parse(JSON.stringify(INITIAL_AUDIT_DATA))
  });

  const setArea = useCallback((area: string) => {
    setAuditState(prev => ({ ...prev, area, lokasi: '' }));
  }, []);

  const setLokasi = useCallback((lokasi: string) => {
    setAuditState(prev => ({ ...prev, lokasi }));
  }, []);

  const toggleAuditor = useCallback((auditor: string) => {
    setAuditState(prev => ({
      ...prev,
      auditors: prev.auditors.includes(auditor)
        ? prev.auditors.filter(a => a !== auditor)
        : [...prev.auditors, auditor]
    }));
  }, []);

  const setTanggal = useCallback((tanggal: string) => {
    setAuditState(prev => ({ ...prev, tanggal }));
  }, []);

  const updateScore = useCallback((sectionKey: string, questionId: number, score: number | null) => {
    setAuditState(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.key === sectionKey
          ? {
              ...section,
              questions: section.questions.map(q =>
                q.id === questionId ? { ...q, score } : q
              )
            }
          : section
      )
    }));
  }, []);

  const updateComment = useCallback((sectionKey: string, questionId: number, comment: string) => {
    setAuditState(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.key === sectionKey
          ? {
              ...section,
              questions: section.questions.map(q =>
                q.id === questionId ? { ...q, comment } : q
              )
            }
          : section
      )
    }));
  }, []);

  // Update photo for a question
  const updatePhoto = useCallback((sectionKey: string, questionId: number, photoLocal: string | null) => {
    setAuditState(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.key === sectionKey
          ? {
              ...section,
              questions: section.questions.map(q =>
                q.id === questionId ? { ...q, photoLocal } : q
              )
            }
          : section
      )
    }));
  }, []);

  // Update photo URL (after Firebase upload)
  const updatePhotoUrl = useCallback((sectionKey: string, questionId: number, photoUrl: string | null) => {
    setAuditState(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.key === sectionKey
          ? {
              ...section,
              questions: section.questions.map(q =>
                q.id === questionId ? { ...q, photoUrl } : q
              )
            }
          : section
      )
    }));
  }, []);

  // Get all photos that need to be uploaded
  const getPendingPhotos = useCallback((): Array<{
    sectionKey: string;
    questionId: number;
    imageBase64: string;
  }> => {
    const photos: Array<{ sectionKey: string; questionId: number; imageBase64: string }> = [];
    
    auditState.sections.forEach(section => {
      section.questions.forEach(q => {
        if (q.photoLocal && !q.photoUrl) {
          photos.push({
            sectionKey: section.key,
            questionId: q.id,
            imageBase64: q.photoLocal
          });
        }
      });
    });
    
    return photos;
  }, [auditState.sections]);

  // Get total photo count
  const photoCount = useMemo(() => {
    return auditState.sections.reduce((total, section) => {
      return total + section.questions.filter(q => q.photoLocal || q.photoUrl).length;
    }, 0);
  }, [auditState.sections]);

  const resetAudit = useCallback(() => {
    setAuditState({
      area: '',
      lokasi: '',
      auditors: [],
      tanggal: new Date().toISOString().split('T')[0],
      sections: JSON.parse(JSON.stringify(INITIAL_AUDIT_DATA))
    });
  }, []);

  const summary: AuditSummary = useMemo(() => {
    const avgValues = {
      avgSort: 0,
      avgSetInOrder: 0,
      avgSafety: 0,
      avgShine: 0,
      avgStandardize: 0,
      avgSustain: 0
    };

    let grandTotal = 0;
    let grandCount = 0;

    auditState.sections.forEach(section => {
      let sum = 0;
      let count = 0;
      section.questions.forEach(q => {
        if (q.score !== null && q.score > 0) {
          sum += q.score;
          count++;
        }
      });
      
      const avg = count > 0 ? sum / count : 0;
      grandTotal += sum;
      grandCount += count;

      switch (section.key) {
        case 'SORT':
          avgValues.avgSort = avg;
          break;
        case 'SETINORDER':
          avgValues.avgSetInOrder = avg;
          break;
        case 'SAFETY':
          avgValues.avgSafety = avg;
          break;
        case 'SHINE':
          avgValues.avgShine = avg;
          break;
        case 'STANDARDIZE':
          avgValues.avgStandardize = avg;
          break;
        case 'SUSTAIN':
          avgValues.avgSustain = avg;
          break;
      }
    });

    const avgOverall = grandCount > 0 ? grandTotal / grandCount : 0;
    const { kategori, penjelasan } = getKategoriPenilaian(avgOverall);

    return {
      ...avgValues,
      totalScore: grandTotal,
      avgOverall,
      kategori,
      penjelasan
    };
  }, [auditState.sections]);

  const radarData = useMemo(() => [
    { subject: 'SORT', A: summary.avgSort, fullMark: 5 },
    { subject: 'SET IN ORDER', A: summary.avgSetInOrder, fullMark: 5 },
    { subject: 'SAFETY', A: summary.avgSafety, fullMark: 5 },
    { subject: 'SHINE', A: summary.avgShine, fullMark: 5 },
    { subject: 'STANDARDIZE', A: summary.avgStandardize, fullMark: 5 },
    { subject: 'SUSTAIN', A: summary.avgSustain, fullMark: 5 },
  ], [summary]);

  const isComplete = useMemo(() => {
    return (
      auditState.area !== '' &&
      auditState.lokasi !== '' &&
      auditState.auditors.length > 0 &&
      auditState.tanggal !== ''
    );
  }, [auditState]);

  const hasScores = useMemo(() => {
    return auditState.sections.some(section =>
      section.questions.some(q => q.score !== null && q.score > 0)
    );
  }, [auditState.sections]);

  return {
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
  };
};
