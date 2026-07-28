"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      gap={12}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "w-full flex items-center gap-3 px-5 py-4 border-4 border-brutal-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200",
          title: "font-mono font-extrabold text-xs uppercase tracking-wider",
          description: "font-body text-xs font-semibold normal-case opacity-90 mt-1",
          actionButton:
            "px-3 py-1 bg-brutal-black text-brutal-yellow font-mono text-xs font-bold uppercase border-2 border-brutal-black shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]",
          cancelButton:
            "px-3 py-1 bg-brutal-white text-brutal-black font-mono text-xs font-bold uppercase border-2 border-brutal-black shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]",
          closeButton:
            "bg-brutal-black text-brutal-yellow border-2 border-brutal-black font-bold text-xs flex items-center justify-center w-6 h-6 hover:bg-brutal-yellow hover:text-brutal-black transition-colors",
          default:
            "bg-brutal-white text-brutal-black shadow-brutal",
          success:
            "bg-brutal-yellow text-brutal-black shadow-brutal",
          error:
            "bg-brutal-pink text-white shadow-brutal",
          info:
            "bg-brutal-blue text-white shadow-brutal",
          warning:
            "bg-brutal-orange text-white shadow-brutal",
        },
      }}
      icons={{
        success: (
          <span className="inline-flex shrink-0 items-center justify-center w-7 h-7 bg-brutal-black text-brutal-lime border-2 border-brutal-black font-mono font-extrabold text-sm shadow-brutal-sm">
            ✓
          </span>
        ),
        error: (
          <span className="inline-flex shrink-0 items-center justify-center w-7 h-7 bg-brutal-black text-brutal-pink border-2 border-brutal-black font-mono font-extrabold text-sm shadow-brutal-sm">
            ✕
          </span>
        ),
        info: (
          <span className="inline-flex shrink-0 items-center justify-center w-7 h-7 bg-brutal-black text-brutal-yellow border-2 border-brutal-black font-mono font-extrabold text-sm shadow-brutal-sm">
            ✦
          </span>
        ),
        warning: (
          <span className="inline-flex shrink-0 items-center justify-center w-7 h-7 bg-brutal-black text-brutal-orange border-2 border-brutal-black font-mono font-extrabold text-sm shadow-brutal-sm">
            !
          </span>
        ),
        loading: (
          <span className="inline-flex shrink-0 items-center justify-center w-7 h-7 bg-brutal-black text-brutal-yellow border-2 border-brutal-black font-mono font-extrabold text-sm shadow-brutal-sm animate-spin">
            ⚡
          </span>
        ),
      }}
    />
  );
}
