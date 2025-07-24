import { useRef, useState, useCallback, useEffect } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface PictureInputProps {
  onFileSelect?: (file: File) => void;
  className?: string;
}

const PictureInput = ({ onFileSelect, className }: PictureInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect?.(file);
    }
  };

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onFileSelect?.(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => fileInputRef.current?.click();

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn("w-full max-w-md mx-auto", className)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label="Upload an image"
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-300">
          <img
            src={previewUrl}
            alt="Selected preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full shadow-md transition"
            aria-label="Remove selected image"
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
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400",
            "flex flex-col items-center justify-center space-y-3 h-full"
          )}
        >
          <div className="w-12 h-12 flex items-center justify-center relative">
            <div className="absolute w-full h-1 bg-gray-400 rotate-45 rounded-full" />
            <div className="absolute w-full h-1 bg-gray-400 -rotate-45 rounded-full" />
          </div>
          <div>
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
