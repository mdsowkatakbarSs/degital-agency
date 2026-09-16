"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  /** Current image URL (for editing) */
  value?: string;
  /** Called when a new image is uploaded or removed */
  onChange: (url: string) => void;
  /** Upload subfolder (e.g. "packages", "qrcodes", "covers") */
  folder?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Hide the URL text input (upload only) */
  uploadOnly?: boolean;
  /** Small variant for inline use */
  small?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  placeholder = "Paste image URL or upload a file",
  uploadOnly = false,
  small = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        onChange(data.url);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setError(msg);
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleUpload(file);
      } else {
        setError("Please drop an image file");
      }
    },
    [handleUpload],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [handleUpload],
  );

  const clearImage = useCallback(() => {
    onChange("");
    setError(null);
  }, [onChange]);

  const previewSize = small ? "h-20" : "h-32";

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className={`relative ${previewSize} rounded-lg overflow-hidden border`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => setError("Image failed to load")}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          cursor-pointer border-2 border-dashed rounded-lg transition-colors
          ${small ? "p-2" : "p-4"}
          ${dragOver ? "border-blue-500 bg-blue-500/10" : "border-gray-300 hover:border-gray-400"}
          ${!value ? "flex flex-col items-center justify-center gap-2" : "flex items-center gap-2"}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            {!small && (
              <span className="text-sm text-muted-foreground">Uploading...</span>
            )}
          </>
        ) : (
          <>
            {value ? (
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Upload className="w-5 h-5 text-muted-foreground" />
            )}
            {!small && (
              <span className="text-sm text-muted-foreground text-center">
                {value ? "Replace image" : "Click or drag to upload"}
              </span>
            )}
          </>
        )}
      </div>

      {/* URL input (optional, unless uploadOnly) */}
      {!uploadOnly && (
        <input
          ref={inputRef}
          type="text"
          value={value || ""}
          onChange={(e) => {
            onChange(e.target.value);
            setError(null);
          }}
          placeholder={placeholder}
          className="w-full text-sm px-3 py-2 border rounded-md bg-background"
        />
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* File size hint */}
      {!small && (
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, GIF or WebP. Max 5MB.
        </p>
      )}
    </div>
  );
}
