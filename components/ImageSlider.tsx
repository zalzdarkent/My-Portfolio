"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ImageSliderProps {
  images: string[];
  alt?: string;
}

export default function ImageSlider({ images, alt = "Project image" }: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const prev = () => goTo(current === 0 ? images.length - 1 : current - 1);
  const next = () => goTo(current === images.length - 1 ? 0 : current + 1);

  if (!images || images.length === 0) return null;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="relative w-full aspect-video border-4 border-brutal-black bg-brutal-black overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt={`${alt} ${current + 1}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full h-full object-cover absolute inset-0"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brutal-white border-3 border-brutal-black flex items-center justify-center hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all z-10"
            style={{ boxShadow: "3px 3px 0px #0a0a0a" }}
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brutal-white border-3 border-brutal-black flex items-center justify-center hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all z-10"
            style={{ boxShadow: "3px 3px 0px #0a0a0a" }}
          >
            <FiChevronRight size={20} />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-3 h-3 border-2 border-brutal-black transition-all ${
                  i === current ? "bg-brutal-yellow scale-125" : "bg-brutal-white"
                }`}
                style={{ boxShadow: "1px 1px 0px #0a0a0a" }}
              />
            ))}
          </div>

          <span className="absolute top-3 right-3 font-mono text-xs font-bold bg-brutal-black text-brutal-yellow px-2 py-0.5 border-2 border-brutal-black z-10">
            {current + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  );
}
