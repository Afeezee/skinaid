import React, { useCallback, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ImageUploader({ selectedImages = [], onImagesSelect, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleFiles = useCallback(async (files) => {
    setError(null);
    const processedFiles = [];
    
    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      
      // Convert WebP to JPG
      if (file.type === 'image/webp') {
        try {
          const convertedFile = await convertWebPToJPG(file);
          processedFiles.push(convertedFile);
        } catch (err) {
          setError('Failed to convert WebP image. Please try a different format.');
          return;
        }
      } else {
        processedFiles.push(file);
      }
    }
    
    onImagesSelect([...selectedImages, ...processedFiles]);
  }, [onImagesSelect, selectedImages]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    onImagesSelect(newImages);
  };

  return (
    <div className="space-y-3">
      {selectedImages.length === 0 ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer",
            isDragging
              ? "border-[#1E5EFF] bg-[#1E5EFF]/5"
              : "border-slate-300 dark:border-slate-600 hover:border-[#1CB5A3]"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center text-center">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors",
              isDragging ? "bg-[#1E5EFF]/10" : "bg-slate-100 dark:bg-slate-800"
            )}>
              <Upload className={cn(
                "w-8 h-8 transition-colors",
                isDragging ? "text-[#1E5EFF]" : "text-slate-400"
              )} />
            </div>
            
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              PNG, JPG, or WebP (max 10MB) • Multiple images allowed
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              ⚠️ Upload images of the same subject only
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {selectedImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Selected ${index + 1}`}
                  className="w-full h-32 object-cover rounded-xl border-2 border-slate-200 dark:border-slate-700"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 rounded-full shadow-lg h-7 w-7"
                >
                  <X className="w-3 h-3" />
                </Button>
              </motion.div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Add More Images
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
          <p className="text-xs text-center text-amber-600 dark:text-amber-400">
            ⚠️ Ensure all images are of the same subject
          </p>
        </div>
      )}

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