import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image, X, Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ImageUploader({ onImageSelect, selectedImage, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return "Please upload a JPG, PNG, or WebP image";
    }
    if (file.size > maxSize) {
      return "Image must be less than 10MB";
    }
    return null;
  };

  const convertWebPToJPG = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const convertedFile = new File([blob], file.name.replace(/\.webp$/i, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(convertedFile);
            } else {
              reject(new Error('Failed to convert image'));
            }
          }, 'image/jpeg', 0.92);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFile = useCallback(async (file) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // Convert WebP to JPG
    if (file.type === 'image/webp') {
      try {
        const convertedFile = await convertWebPToJPG(file);
        onImageSelect(convertedFile);
      } catch (err) {
        setError('Failed to convert WebP image. Please try a different format.');
      }
    } else {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedImage ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer",
                isDragging
                  ? "border-[#1E5EFF] bg-[#1E5EFF]/5"
                  : "border-slate-300 dark:border-slate-600 hover:border-[#1CB5A3] hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="flex flex-col items-center text-center">
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                  isDragging 
                    ? "bg-[#1E5EFF]/10" 
                    : "bg-slate-100 dark:bg-slate-800"
                )}>
                  <Upload className={cn(
                    "w-10 h-10 transition-colors",
                    isDragging ? "text-[#1E5EFF]" : "text-slate-400"
                  )} />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Upload your image
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  Drag and drop or click to browse
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">JPG</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">PNG</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">WebP</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">Max 10MB</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-[#1CB5A3] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm mb-1">
                    Tips for best results
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <li>• Use good lighting (natural light works best)</li>
                    <li>• Keep the camera steady and focused</li>
                    <li>• Capture the affected area clearly</li>
                    <li>• Include some surrounding skin for context</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected skin image"
                className="w-full h-auto max-h-[400px] object-contain"
              />
              <Button
                size="icon"
                variant="secondary"
                onClick={onClear}
                className="absolute top-4 right-4 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 shadow-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="mt-4 flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                    {selectedImage.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                Ready
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-700 dark:text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </motion.div>
      )}
    </div>
  );
}