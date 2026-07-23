"use client";

import { useRef, useState } from "react";
import { Upload, X, Check, Loader2, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  currentImage: string;
  onUpload: (url: string) => void;
  label?: string;
}

export default function ImageUploader({
  currentImage,
  onUpload,
  label,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleUpload = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Pilih file dulu bosque.");
      return;
    }

    setUploading(true);
    setError("");
    setUploadedUrl("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Upload gagal.");
      }

      const data = await res.json();
      const url: string = data.url || data.secure_url || data.path || "";

      if (!url) throw new Error("URL tidak ditemukan di response.");

      setUploadedUrl(url);
      onUpload(url);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan saat upload.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview("");
    setUploadedUrl("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onUpload("");
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="font-body font-bold text-xs uppercase tracking-widest text-black/60">
          {label}
        </label>
      )}

      <div className="border-4 border-brutal-black shadow-brutal-sm bg-brutal-white p-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover border-3 border-brutal-black"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-brutal-black text-brutal-yellow border-2 border-brutal-black hover:bg-brutal-orange transition-colors"
              type="button"
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <div className="w-full h-48 flex flex-col items-center justify-center gap-3 border-3 border-dashed border-brutal-black/30 bg-brutal-yellow/5">
            <ImageIcon size={32} className="text-black/30" />
            <span className="font-mono text-xs uppercase tracking-widest text-black/30">
              No image
            </span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id={`image-upload-${label?.replace(/\s/g, "-") || "default"}`}
      />

      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor={`image-upload-${label?.replace(/\s/g, "-") || "default"}`}
          className="inline-flex items-center gap-2 px-4 py-2 border-3 border-brutal-black bg-brutal-white font-body font-bold text-xs uppercase tracking-widest cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] transition-all select-none"
        >
          <ImageIcon size={14} strokeWidth={2.5} />
          Select File
        </label>

        <button
          onClick={handleUpload}
          disabled={uploading || !inputRef.current?.files?.[0]}
          className="inline-flex items-center gap-2 px-4 py-2 border-4 border-brutal-black shadow-brutal-sm bg-brutal-yellow text-brutal-black font-body font-bold text-xs uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {uploading ? (
            <>
              <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={14} strokeWidth={2.5} />
              Upload
            </>
          )}
        </button>
      </div>

      {uploadedUrl && (
        <div className="flex items-start gap-2 border-3 border-brutal-black bg-brutal-lime/20 p-3">
          <Check size={14} className="shrink-0 mt-0.5 text-green-700" />
          <span className="font-mono text-[11px] break-all text-black/70">
            {uploadedUrl}
          </span>
        </div>
      )}

      {error && (
        <div className="border-3 border-brutal-black bg-brutal-red/10 p-3">
          <span className="font-mono text-[11px] text-brutal-red">{error}</span>
        </div>
      )}
    </div>
  );
}
