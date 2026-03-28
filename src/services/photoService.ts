// Photo Upload Service
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, isFirebaseConfigured, STORAGE_PATHS } from '@/config/firebase';
import imageCompression from 'browser-image-compression';

export interface PhotoData {
  questionId: number;
  sectionKey: string;
  url: string;
  fileName: string;
  uploadedAt: string;
}

// Compress image before upload
export const compressImage = async (
  imageBase64: string,
  options = { maxSizeMB: 0.5, maxWidthOrHeight: 1280 }
): Promise<string> => {
  try {
    // Convert base64 to file
    const response = await fetch(imageBase64);
    const blob = await response.blob();
    
    // Create a File from Blob
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    
    // Compress
    const compressedFile = await imageCompression(file, options);
    
    // Convert back to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    return imageBase64; // Return original if compression fails
  }
};

// Generate unique filename
export const generateFileName = (
  auditId: string,
  sectionKey: string,
  questionId: number
): string => {
  const timestamp = Date.now();
  return `${STORAGE_PATHS.AUDIT_PHOTOS}/${auditId}/${sectionKey}_${questionId}_${timestamp}.jpg`;
};

// Upload photo to Firebase Storage
export const uploadPhoto = async (
  auditId: string,
  sectionKey: string,
  questionId: number,
  imageBase64: string,
  onProgress?: (progress: number) => void
): Promise<PhotoData> => {
  if (!isFirebaseConfigured() || !storage) {
    throw new Error('Firebase not configured');
  }

  try {
    // Compress image
    onProgress?.(10);
    const compressedImage = await compressImage(imageBase64);
    onProgress?.(30);

    // Generate filename
    const fileName = generateFileName(auditId, sectionKey, questionId);
    const storageRef = ref(storage, fileName);

    // Upload
    onProgress?.(50);
    await uploadString(storageRef, compressedImage, 'data_url');
    onProgress?.(80);

    // Get download URL
    const url = await getDownloadURL(storageRef);
    onProgress?.(100);

    return {
      questionId,
      sectionKey,
      url,
      fileName,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

// Delete photo from storage
export const deletePhoto = async (fileName: string): Promise<void> => {
  if (!isFirebaseConfigured() || !storage) {
    throw new Error('Firebase not configured');
  }

  try {
    const storageRef = ref(storage, fileName);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};

// Upload multiple photos
export const uploadMultiplePhotos = async (
  auditId: string,
  photos: Array<{ sectionKey: string; questionId: number; imageBase64: string }>,
  onProgress?: (current: number, total: number) => void
): Promise<PhotoData[]> => {
  const results: PhotoData[] = [];

  for (let i = 0; i < photos.length; i++) {
    const { sectionKey, questionId, imageBase64 } = photos[i];
    
    try {
      const photoData = await uploadPhoto(auditId, sectionKey, questionId, imageBase64);
      results.push(photoData);
      onProgress?.(i + 1, photos.length);
    } catch (error) {
      console.error(`Error uploading photo ${i + 1}:`, error);
      // Continue with next photo
    }
  }

  return results;
};

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
