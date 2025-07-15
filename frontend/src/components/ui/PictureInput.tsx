import { useRef, useState, useCallback } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { cn } from "@/lib/utils";

interface PictureInputProps {
  onFileSelect?: (file: File) => void;
  className?: string;
}

const PictureInput = ({ onFileSelect, className }: PictureInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        if (onFileSelect) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={cn("w-full max-w-md mx-auto", className)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <div className="relative w-full aspect-square">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white transition-colors"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400",
            "flex flex-col items-center justify-center space-y-3",
            "h-full"
          )}
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute w-full h-1 bg-gray-400 rounded-full transform rotate-45"></div>
            <div className="absolute w-full h-1 bg-gray-400 rounded-full transform -rotate-45"></div>
          </div>
          <div className="space-y-1">
            <p className="text-gray-700 font-medium">Select Files to Upload</p>
            <p className="text-sm text-gray-500">
              or drag and drop, copy and paste files
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PictureInput;
