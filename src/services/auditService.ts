// Audit Service - Firestore Operations
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  type DocumentData,
  updateDoc,
} from "firebase/firestore";

import { db, isFirebaseConfigured, COLLECTIONS } from "@/config/firebase";
import type { AuditState, AuditSummary } from "@/hooks/useAudit";
import type { PhotoData } from "./photoService";
import { uploadPhoto } from "./photoService";

export interface AuditRecord {
  id: string;
  area: string;
  lokasi: string;
  auditors: string[];
  tanggal: string;
  sections: AuditState["sections"];
  summary: AuditSummary;
  photos: PhotoData[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
  status: "draft" | "completed" | "synced";
}

// Generate unique audit ID
export const generateAuditId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `audit_${timestamp}_${random}`;
};

// Save audit
export const saveAudit = async (
  auditState: AuditState,
  summary: AuditSummary,
  photos: PhotoData[],
  userId?: string
): Promise<string> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const auditId = generateAuditId();
  const auditRef = doc(db!, COLLECTIONS.AUDITS, auditId);

  const auditData: AuditRecord = {
    id: auditId,
    area: auditState.area,
    lokasi: auditState.lokasi,
    auditors: auditState.auditors,
    tanggal: auditState.tanggal,
    sections: auditState.sections,
    summary,
    photos,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: userId || "anonymous",
    status: "completed",
  };

  await setDoc(auditRef, auditData as DocumentData);
  return auditId;
};

// Get audit by ID
export const getAudit = async (
  auditId: string
): Promise<AuditRecord | null> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const auditRef = doc(db!, COLLECTIONS.AUDITS, auditId);
  const auditSnap = await getDoc(auditRef);

  if (auditSnap.exists()) {
    return auditSnap.data() as AuditRecord;
  }

  return null;
};

// Get audits by date range
export const getAuditsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<AuditRecord[]> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const auditsRef = collection(db!, COLLECTIONS.AUDITS);

  const q = query(
    auditsRef,
    where("tanggal", ">=", startDate),
    where("tanggal", "<=", endDate),
    orderBy("tanggal", "desc")
  );

  const querySnap = await getDocs(q);
  return querySnap.docs.map((doc) => doc.data() as AuditRecord);
};

// Get audits by area
export const getAuditsByArea = async (
  area: string
): Promise<AuditRecord[]> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const auditsRef = collection(db!, COLLECTIONS.AUDITS);

  const q = query(
    auditsRef,
    where("area", "==", area),
    orderBy("createdAt", "desc")
  );

  const querySnap = await getDocs(q);
  return querySnap.docs.map((doc) => doc.data() as AuditRecord);
};

// Get all audits
export const getAllAudits = async (
  limit: number = 100
): Promise<AuditRecord[]> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const auditsRef = collection(db!, COLLECTIONS.AUDITS);
  const q = query(auditsRef, orderBy("createdAt", "desc"));

  const querySnap = await getDocs(q);
  return querySnap.docs
    .slice(0, limit)
    .map((doc) => doc.data() as AuditRecord);
};

// Update audit status
export const updateAuditStatus = async (
  auditId: string,
  status: AuditRecord["status"]
): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase not configured");
  }

  const auditRef = doc(db!, COLLECTIONS.AUDITS, auditId);

  await setDoc(
    auditRef,
    {
      status,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};

// 🚀 BACKGROUND PHOTO UPLOAD (NON-BLOCKING)
export const uploadPhotosAsync = async (
  auditId: string,
  photos: Array<{
    sectionKey: string;
    questionId: number;
    imageBase64: string;
  }>
) => {
  try {
    console.log("START BACKGROUND UPLOAD");

    const results: PhotoData[] = [];

    for (const photo of photos) {
      try {
        const uploaded = await uploadPhoto(
          auditId,
          photo.sectionKey,
          photo.questionId,
          photo.imageBase64
        );

        results.push(uploaded);
        console.log("UPLOAD OK:", uploaded.url);
      } catch (err) {
        console.error("UPLOAD ERROR:", err);
      }
    }

    // update Firestore setelah upload selesai
    const ref = doc(db!, COLLECTIONS.AUDITS, auditId);

    await updateDoc(ref, {
      photos: results,
    });

    console.log("FIRESTORE UPDATED WITH PHOTOS");
  } catch (err) {
    console.error("BACKGROUND UPLOAD ERROR:", err);
  }
};
