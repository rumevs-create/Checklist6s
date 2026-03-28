// Camera Capture Component
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  X, 
  RotateCcw, 
  Check, 
  ImagePlus,
  Loader2,
  Smartphone
} from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void;
  onCancel?: () => void;
  existingPhoto?: string | null;
  onDelete?: () => void;
  disabled?: boolean;
}

export const CameraCapture = ({
  onCapture,
  onCancel,
  existingPhoto,
  onDelete,
  disabled = false
}: CameraCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(existingPhoto || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.');
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);
      setPreviewImage(imageBase64);
      stopCamera();
    }
  }, [stopCamera]);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Gagal membaca file.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  // Confirm capture
  const confirmCapture = useCallback(() => {
    if (previewImage) {
      onCapture(previewImage);
    }
  }, [previewImage, onCapture]);

  // Retake photo
  const retakePhoto = useCallback(() => {
    setPreviewImage(null);
    startCamera();
  }, [startCamera]);

  // Cancel capture
  const handleCancel = useCallback(() => {
    stopCamera();
    setPreviewImage(null);
    onCancel?.();
  }, [stopCamera, onCancel]);

  // Delete photo
  const handleDelete = useCallback(() => {
    setPreviewImage(null);
    onDelete?.();
  }, [onDelete]);

  // Open file picker
  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // If there's an existing photo, show it
  if (existingPhoto && !previewImage) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={existingPhoto} 
              alt="Captured" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Badge className="bg-green-500 text-white">
                <Check className="w-3 h-3 mr-1" />
                Tersimpan
              </Badge>
            </div>
            {onDelete && (
              <div className="absolute bottom-2 right-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={disabled}
                >
                  <X className="w-4 h-4 mr-1" />
                  Hapus
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // If previewing captured image
  if (previewImage) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={retakePhoto}
                className="flex-1"
                disabled={disabled}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Ulangi
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={confirmCapture}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={disabled}
              >
                <Check className="w-4 h-4 mr-1" />
                Konfirmasi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If capturing from camera
  if (isCapturing) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 object-cover bg-black"
            />
            <div className="absolute bottom-2 left-2 right-2 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancel}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-1" />
                Batal
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={capturePhoto}
                className="flex-1"
              >
                <Camera className="w-4 h-4 mr-1" />
                Ambil Foto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default state - options to capture or upload
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {/* Camera button */}
          <Button
            variant="outline"
            onClick={startCamera}
            disabled={disabled || isUploading}
            className="w-full h-auto py-4 flex flex-col items-center gap-2 border-blue-300 hover:bg-blue-50"
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-blue-600" />
            )}
            <div className="text-center">
              <div className="font-semibold text-blue-700">
                {isUploading ? 'Memuat...' : 'Ambil Foto'}
              </div>
              <div className="text-xs text-blue-500">
                Gunakan kamera HP
              </div>
            </div>
          </Button>

          {/* Or divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">atau</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Upload button */}
          <Button
            variant="outline"
            onClick={openFilePicker}
            disabled={disabled || isUploading}
            className="w-full h-auto py-4 flex flex-col items-center gap-2 border-slate-300 hover:bg-slate-50"
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <ImagePlus className="w-6 h-6 text-slate-600" />
            )}
            <div className="text-center">
              <div className="font-semibold text-slate-700">
                {isUploading ? 'Memuat...' : 'Pilih dari Galeri'}
              </div>
              <div className="text-xs text-slate-500">
                Upload foto yang sudah ada
              </div>
            </div>
          </Button>

          {/* Mobile hint */}
          <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
            <Smartphone className="w-3 h-3" />
            <span>Optimalkan untuk penggunaan di HP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
