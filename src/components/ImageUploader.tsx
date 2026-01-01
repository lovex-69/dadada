import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onUpload(base64); // In a real app, this would upload to Firebase Storage and return a URL
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-all group"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {preview ? (
        <div className="relative group">
          <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
             <span className="text-white font-bold text-xs uppercase tracking-widest">Change Photo</span>
          </div>
        </div>
      ) : (
        <div className="py-8">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
            <svg
              className="h-8 w-8 text-gray-400 group-hover:text-primary transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Click to Capture Evidence
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG or WEBP (Max. 10MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
