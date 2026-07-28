"use client";

import { useRef, useState, useEffect, useId } from "react";
import { Upload, X, Check, Loader2, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  currentImage: string;
  onUpload: (url: string) => void;
  label?: string;
  compact?: boolean;
}

export default function ImageUploader({
  currentImage,
  onUpload,
  label,
  compact = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const uniqueId = `image-upload-${generatedId.replace(/:/g, "")}`;

  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [error, setError] = useState("");

  // Keep preview in sync when currentImage changes externally (e.g. edit modal opens)
  useEffect(() => {
    setPreview(currentImage);
    setUploadedUrl("");
    setError("");
  }, [currentImage]);

  const uploadFile = async (file: File) => {
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
        throw new Error(data?.error || data?.message || "Upload gagal.");
      }

      const data = await res.json();
      const url: string = data.url || data.secure_url || data.path || "";

      if (!url) throw new Error("URL tidak ditemukan di response.");

      setUploadedUrl(url);
      setPreview(url);
      onUpload(url);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan saat upload.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    await uploadFile(file);
  };

  const handleManualUploadClick = () => {
    const file = inputRef.current?.files?.[0];
    if (file) {
      uploadFile(file);
    } else {
      inputRef.current?.click();
    }
  };

  const handleClear = () => {
    setPreview("");
    setUploadedUrl("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onUpload("");
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="font-body font-bold text-xs uppercase tracking-widest text-black/60 block">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          {preview ? (
            <div className="relative shrink-0">
              <img
                src={preview}
                alt="Preview"
                className="w-12 h-12 object-cover border-2 border-brutal-black"
              />
              <button
                onClick={handleClear}
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-brutal-red text-brutal-white border border-brutal-black hover:bg-black transition-colors"
                type="button"
                title="Hapus gambar"
              >
                <X size={10} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-brutal-black/30 bg-brutal-yellow/5 shrink-0">
              <ImageIcon size={18} className="text-black/30" />
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={uniqueId}
          />

          <label
            htmlFor={uniqueId}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-brutal-black font-body font-bold text-xs uppercase cursor-pointer transition-all select-none ${
              uploading
                ? "bg-brutal-yellow/50 opacity-70 cursor-wait"
                : "bg-brutal-white hover:bg-brutal-yellow/30 shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px]"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={12} strokeWidth={2.5} />
                {preview ? "Ganti File" : "Upload Image"}
              </>
            )}
          </label>
        </div>

        {error && (
          <p className="font-mono text-[11px] text-brutal-red mt-1">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="font-body font-bold text-xs uppercase tracking-widest text-black/60 block">
          {label}
        </label>
      )}

      <div className="border-4 border-brutal-black shadow-brutal-sm bg-brutal-white p-3">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-44 object-cover border-3 border-brutal-black"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-brutal-black text-brutal-yellow border-2 border-brutal-black hover:bg-brutal-orange transition-colors"
              type="button"
              title="Remove Image"
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <div className="w-full h-44 flex flex-col items-center justify-center gap-2 border-3 border-dashed border-brutal-black/30 bg-brutal-yellow/5">
            <ImageIcon size={32} className="text-black/30" />
            <span className="font-mono text-xs uppercase tracking-widest text-black/40">
              No Image Selected
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
        id={uniqueId}
      />

      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor={uniqueId}
          className="inline-flex items-center gap-2 px-4 py-2 border-3 border-brutal-black bg-brutal-white font-body font-bold text-xs uppercase tracking-widest cursor-pointer hover:bg-brutal-yellow/20 shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all select-none"
        >
          <ImageIcon size={14} strokeWidth={2.5} />
          {preview ? "Pilih File Lain" : "Select File"}
        </label>

        {uploading && (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 border-3 border-brutal-black bg-brutal-yellow font-mono text-xs uppercase font-bold animate-pulse">
            <Loader2 size={14} className="animate-spin" />
            Uploading image...
          </span>
        )}
      </div>

      {uploadedUrl && (
        <div className="flex items-start gap-2 border-3 border-brutal-black bg-brutal-lime/20 p-2">
          <Check size={14} className="shrink-0 mt-0.5 text-green-700" />
          <span className="font-mono text-[11px] break-all text-black/80 font-bold">
            Uploaded: {uploadedUrl}
          </span>
        </div>
      )}

      {error && (
        <div className="border-3 border-brutal-black bg-brutal-red/10 p-3">
          <span className="font-mono text-[11px] text-brutal-red font-bold">{error}</span>
        </div>
      )}
    </div>
  );
}

