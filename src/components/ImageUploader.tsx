import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { translations } from '../utils/translations';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  language: 'en' | 'hi';
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  selectedImage,
  language,
  disabled = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const t = translations[language];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  }, [disabled]);

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    onImageSelect(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    onImageSelect(null as any);
  };

  return (
    <div className="w-full">
      {!imagePreview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragOver && !disabled
              ? 'border-purple-500 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 shadow-lg'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50/30 hover:to-pink-50/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={disabled}
          />
          <label htmlFor="file-upload" className={`cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 rounded-full mb-6 shadow-md">
              <Upload className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-3">
              {t.dragAndDrop}
            </p>
            <p className="text-base text-gray-600">
              {t.supportedFormats}
            </p>
          </label>
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 rounded-xl border border-purple-200/50 p-6 shadow-md">
          <button
            onClick={removeImage}
            className="absolute -top-3 -right-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full p-2 hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl z-10 transform hover:scale-110"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <ImageIcon className="w-5 h-5 text-purple-500" />
                <p className="font-semibold text-gray-900 truncate text-lg">
                  {selectedImage?.name}
                </p>
              </div>
              <p className="text-base text-gray-600">
                {selectedImage ? `${(selectedImage.size / (1024 * 1024)).toFixed(2)} MB` : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};