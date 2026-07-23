"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { FaLaravel, FaReact, FaNodeJs } from "react-icons/fa";
import { SiNextdotjs, SiCodeigniter } from "react-icons/si";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useLocale } from "next-intl";

interface HeroData {
  id: number;
  locale: string;
  greeting: string;
  nameLabel: string;
  description: string;
  btnProject: string;
  btnContact: string;
  status: string;
  stickerExp: string;
  stickerOpen: string;
  availableText: string;
}

const techStack = [
  { name: "Laravel", Icon: FaLaravel, bg: "#FDE047", text: "#0a0a0a" },
  { name: "React", Icon: FaReact, bg: "#BFFF00", text: "#0a0a0a" },
  { name: "Next.js", Icon: SiNextdotjs, bg: "#4CAF50", text: "#0a0a0a" },
  { name: "CodeIgniter", Icon: SiCodeigniter, bg: "#FFD700", text: "#0a0a0a" },
  { name: "NodeJS", Icon: FaNodeJs, bg: "#FF6B35", text: "white" },
];
const available = [" HIRE", " FREELANCE"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } },
};

export function ScrambleText() {
  const [text, setText] = useState("");

  useEffect(() => {
    let wordIndex = 0;

    const scrambleToWord = (target: string) => {
      const chars = "!<>-_\\/[]{}—=+*^?#________";
      let frame = 0;

      const interval = setInterval(() => {
        let output = "";

        for (let i = 0; i < target.length; i++) {
          if (i < frame) {
            output += target[i];
          } else {
            output += chars[Math.floor(Math.random() * chars.length)];
          }
        }

        setText(output);

        frame += 0.5;

        if (frame >= target.length) {
          clearInterval(interval);
          setText(target);
        }
      }, 40);

      return interval;
    };

    const run = () => {
      scrambleToWord(available[wordIndex]);

      setTimeout(() => {
        wordIndex = (wordIndex + 1) % available.length;
        run();
      }, 3000);
    };

    run();
  }, []);

  return (
    <span className="text-black">
      {text}
    </span>
  );
}

export default function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const locale = useLocale();

  const rotateX = useSpring(mouseY, {
    stiffness: 120,
    damping: 15,
    mass: 0.5,
  });

  const rotateY = useSpring(mouseX, {
    stiffness: 120,
    damping: 15,
    mass: 0.5,
  });

  const translateX = useSpring(mouseX, {
    stiffness: 120,
    damping: 15,
  });

  const translateY = useSpring(mouseY, {
    stiffness: 120,
    damping: 15,
  });

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    mouseX.set((x - centerX) / 25);
    mouseY.set((y - centerY) / 25);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const sectionRef = useRef<HTMLElement>(null);

  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((res) => res.json())
      .then((data: HeroData[]) => {
        const match = data.find((h) => h.locale === locale);
        if (match) setHeroData(match);
      })
      .catch(() => {});
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="min-h-screen pt-16 grid grid-cols-1 lg:grid-cols-12 border-b-4 border-brutal-black overflow-hidden relative"
    >
      <motion.div
        className="absolute inset-0 opacity-15 pointer-events-none"
        initial={{ opacity: 0.15 }}
        animate={{ opacity: 0.15 }}
      >
        <div
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
          className="w-full h-full"
        />
      </motion.div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-16 lg:col-span-7 lg:border-r-4 border-brutal-black"
      >
        {/* Badge */}
        <motion.div variants={item} className="mb-6 self-start">
          <span className="inline-block bg-brutal-lime border-3 border-brutal-black shadow-brutal-sm px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest">
            {heroData?.availableText ?? "OPEN TO"}
            <ScrambleText />
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={item}
          className="font-display text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[0.93] tracking-tight mb-6"
        >
          <span className="block">{heroData?.greeting ?? "HALO!!"}</span>
          <span className="block">
            {heroData?.nameLabel ?? "SAYA"}{" "}
            <span className="inline-block bg-brutal-yellow px-2 border-3 border-brutal-black shadow-brutal -rotate-1">
              ALIF
            </span>
          </span>
        </motion.h1>

        {/* Desc */}
        <motion.p
          variants={item}
          className="text-lg leading-relaxed text-black/70 max-w-lg mb-8 font-body"
        >
          {heroData?.description ?? "Frontend Developer yang passionate dalam membangun antarmuka web modern, interaktif, dan responsif. Berpengalaman dalam React, Next.js, dan Tailwind CSS."}
        </motion.p>

        {/* Buttons */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
          <BrutalBtn href="#portfolio" variant="yellow">
            {heroData?.btnProject ?? "Lihat Proyek"}
          </BrutalBtn>
          <BrutalBtn href="#contact" variant="dark">
            {heroData?.btnContact ?? "Hubungi Saya"}
          </BrutalBtn>
        </motion.div>
      </motion.div>

      {/* Right — Mengambil 5 dari 12 bagian kolom (Lebih Sempit) */}
      <div className="flex lg:flex items-center justify-center bg-brutal-yellow relative overflow-hidden py-12 lg:py-0 lg:col-span-5">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              `repeating-linear-gradient(
                45deg,
                #000,
                #000 1px,
                transparent 1px,
                transparent 8px
            )`,
          }}
        />
        {/* Decorative stickers */}
        <Sticker className="top-[15%] right-[6%] rotate-[8deg] bg-brutal-orange text-white">
          {heroData?.stickerExp ?? "3+ Y.O.E"}
        </Sticker>
        <Sticker className="bottom-[12%] left-[4%] -rotate-[5deg] bg-brutal-pink text-white">
          {heroData?.stickerOpen ?? "OPEN TO WORK"}
        </Sticker>

        {/* Floating code tags */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [-2, 1, -2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] z-30 left-[5%] text-white -rotate-2 border-3 border-brutal-black bg-brutal-red px-2 py-1 font-mono text-xs font-bold shadow-brutal-sm"
        >
          {`php artisan serve ▶`}
        </motion.div>
        <motion.div
          animate={{
            y: [0, 10, 0],
            rotate: [3, 0, 3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[20%] z-20 right-[3%] rotate-3 border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-xs font-bold shadow-brutal-sm"
        >
          npm run dev ▶
        </motion.div>

        {/* Profile card */}
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            x: translateX,
            y: translateY,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 24 }}
          className="relative z-10 w-72 bg-brutal-white border-4 border-brutal-black shadow-brutal-lg"
        >
          <div className="flex flex-col items-center gap-4 p-8">
            {/* Avatar */}
            {/* Wrapper Relatif untuk Layering Shadow Bulat */}
            <div className="relative w-28 h-28 group">
              {/* Layer Bayangan Hitam di Belakang (Bulat Sempurna!) */}
              <div className="absolute inset-0 rounded-full bg-brutal-black translate-x-[6px] translate-y-[6px]" />

              {/* Layer Konten Utama di Depan (Tempat Foto) */}
              <div className="absolute inset-0 rounded-full bg-brutal-white border-4 border-brutal-black overflow-hidden flex items-center justify-center transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[2px]">

                <Image
                  src="/profile/alif.jpeg"
                  alt="Alif Fadillah Umar"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover grayscale contrast-125 transition-all duration-300 group-hover:grayscale-0"
                />

              </div>
            </div>

            {/* Name */}
            <div className="text-center">
              <p className="font-display text-xl font-extrabold">Alif Fadillah Ummar</p>
              <TypeAnimation
                sequence={[
                  "SOFTWARE ENGINEER",
                  2000,
                  "FULLSTACK WEB DEV",
                  2000,
                  "LARAVEL ENTHUSIAST",
                  2000,
                  "MERN DEVELOPER",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="font-mono text-xs text-black/60 mt-0.5"
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 border-3 border-brutal-black shadow-brutal-sm bg-brutal-lime px-3 py-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse-dot" />
              <span className="font-body font-bold text-xs">{heroData?.status ?? "Tersedia untuk kerja"}</span>
            </div>

            {/* Tech badges */}
            <div className="flex gap-2 flex-wrap justify-center">
              {techStack.map((tech, i) => {
                const IconComponent = tech.Icon;
                return (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 font-mono text-[11px] font-bold border-3 border-brutal-black px-2 py-1 transition-transform hover:-translate-y-0.5"
                    style={{
                      background: tech.bg,
                      color: tech.text,
                    }}
                  >
                    <IconComponent size={14} />
                    {tech.name}
                  </span>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function BrutalBtn({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "yellow" | "dark";
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-7 py-3.5 font-body font-bold text-sm uppercase tracking-widest border-4 border-brutal-black shadow-brutal transition-all duration-100 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-hover";
  const variants = {
    yellow: "bg-brutal-yellow text-brutal-black",
    dark: "bg-brutal-black text-brutal-yellow shadow-brutal-yellow hover:shadow-brutal-yellow-hover border-brutal-white",
  };
  return (
    <a href={href} className={`${base} ${variants[variant]}`}>
      {children}
    </a>
  );
}

function Sticker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute z-20 border-3 border-brutal-black shadow-brutal-sm px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest ${className}`}
    >
      {children}
    </motion.div>
  );
}
