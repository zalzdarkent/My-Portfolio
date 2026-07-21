"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  fileName: string;
  title?: string;
  downloadText?: string;
}

export default function CvModal({ isOpen, onClose, pdfUrl, fileName, title = "CURRICULUM VITAE", downloadText = "⬇ Download" }: CvModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 20, x: 8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-brutal-white border-4 border-brutal-black shadow-brutal-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-4 border-brutal-black bg-brutal-yellow">
              <p className="font-display text-lg font-extrabold uppercase tracking-tight text-brutal-black">
                ✦ {title}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-brutal-black text-brutal-yellow border-3 border-brutal-black shadow-brutal-sm font-body font-bold text-xs uppercase tracking-widest transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-1 active:translate-y-1 cursor-pointer"
                >
                  {downloadText}
                </button>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-brutal-black text-brutal-yellow border-3 border-brutal-black shadow-brutal-sm font-bold text-lg flex items-center justify-center transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-1 active:translate-y-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 min-h-0">
              <iframe
                src={`${pdfUrl}#toolbar=0`}
                className="w-full h-full border-0"
                style={{ minHeight: "70vh" }}
                title="CV Viewer"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}