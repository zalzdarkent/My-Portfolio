"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/lib/data";
import { FaDocker, FaLaravel, FaPython, FaReact, FaPhp } from "react-icons/fa6";
import { SiInertia, SiMysql, SiOpencv, SiShadcnui, SiTailwindcss, SiYolo, SiFlask, SiOnnx, SiVite, SiBootstrap, SiJquery, SiJavascript, SiPostgresql } from "react-icons/si";
import { useTranslations } from "next-intl";
import { DiMsqlServer } from "react-icons/di";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const techIconMap: Record<string, { icon: any; bg: string; text: string }> = {
  // web
  "Laravel": { icon: FaLaravel, bg: "#FF2D20", text: "#FFFFFF" },
  "React": { icon: FaReact, bg: "#20232A", text: "#61DAFB" },
  "Inertia.js": { icon: SiInertia, bg: "#9553E9", text: "#FFFFFF" },
  "Tailwind CSS": { icon: SiTailwindcss, bg: "#06B6D4", text: "#FFFFFF" },
  "Shadcn": { icon: SiShadcnui, bg: "#000000", text: "#FFFFFF" },
  "MySQL": { icon: SiMysql, bg: "#00758F", text: "#F29111" },
  "Docker": { icon: FaDocker, bg: "#2496ED", text: "#FFFFFF" },
  "Vite": { icon: SiVite, bg: "#FFFFFF", text: "#db12ee" },
  "PHP": { icon: FaPhp, bg: "#777BB4", text: "#FFFFFF" },
  "SQLSRV": { icon: DiMsqlServer, bg: "#CC2927", text: "#FFFFFF" },
  "Bootstrap": { icon: SiBootstrap, bg: "#7952B3", text: "#FFFFFF" },
  "Jquery": { icon: SiJquery, bg: "#0769AD", text: "#FFFFFF" },
  "Javascript": { icon: SiJavascript, bg: "#F7DF1E", text: "#000000" },

  // ai/ml
  "Python": { icon: FaPython, bg: "#FFFFF", text: "#3776AB" },
  "OpenCV": { icon: SiOpencv, bg: "#FFFFFF", text: "#5C3EE8" },
  "Yolo": { icon: SiYolo, bg: "#FFFFF", text: "#005CED" },
  "Flask": { icon: SiFlask, bg: "#000000", text: "#FFFFFF" },
  "ONNX": { icon: SiOnnx, bg: "#005CED", text: "#FFFFFF" },

  // iot
  "postgreSQL": { icon: SiPostgresql, bg: "#336791", text: "#FFFFFF" },
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const t = useTranslations("projects");
  // Lock scroll
  useEffect(() => {
    if (project) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [project]);

  // Esc to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
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
            className="bg-brutal-white border-4 border-brutal-black shadow-brutal-lg w-full max-w-xl max-h-[88vh] overflow-y-auto"
          >
            {/* Header */}
            <div
              className="flex items-start justify-between gap-4 p-6 border-b-4 border-brutal-black"
            >
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest mb-1 opacity-60">
                  {project.tags.join(" · ")}
                </p>
                <h3 className="font-display text-2xl font-extrabold">{project.name || `Project ${project.id}`}</h3>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-10 h-10 bg-brutal-black text-brutal-yellow border-3 border-brutal-black shadow-brutal-sm font-bold text-lg flex items-center justify-center transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-1 active:translate-y-1"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Project Image */}
              {project.image && (
                <div className="relative w-full aspect-video border-3 border-brutal-black shadow-brutal-sm overflow-hidden">
                  <img src={project.image} alt={project.name || `Project ${project.id}`} className="w-full h-full object-cover" />
                </div>
              )}

              <p className="font-body text-base leading-relaxed text-black/70">{project.longDesc || ""}</p>

              {/* Tech */}
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-black/40 mb-3">
                  {t("modal.techLabel")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((techName: string, index: number) => {
                    const techConfig = techIconMap[techName];
                    if (!techConfig) return null;

                    const IconComponent = techConfig.icon;

                    return (
                      <div
                        key={index}
                        className="relative group"
                      >
                        <span
                          className="flex items-center justify-center p-2 border-3 border-black shadow-brutal-sm transition-transform hover:-translate-y-0.5"
                          style={{
                            background: techConfig.bg,
                            color: techConfig.text,
                          }}
                        >
                          <IconComponent size={18} />
                        </span>

                        {/* Neo Brutalist Tooltip */}
                        <div
                          className="
            absolute
            left-1/2
            -translate-x-1/2
            bottom-full
            mb-3
            opacity-0
            invisible
            group-hover:opacity-100
            group-hover:visible
            transition-all
            duration-200
            z-50
            whitespace-nowrap
          "
                        >
                          <div
                            className="
              bg-brutal-white
              border-3
              border-brutal-black
              shadow-brutal-sm
              px-3
              py-1
              font-mono
              text-xs
              font-bold
            "
                          >
                            {techName}
                          </div>

                          {/* Arrow */}
                          <div
                            className="
              absolute
              left-1/2
              -translate-x-1/2
              w-3
              h-3
              bg-brutal-white
              border-r-3
              border-b-3
              border-brutal-black
              rotate-45
              -bottom-1
            "
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>  
              </div>

              {/* Features */}
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-black/40 mb-3">
                  {t("modal.featuresLabel")}
                </p>
                <ul className="space-y-2">
                  {(project.features ?? []).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 font-body text-sm">
                      <span className="text-brutal-orange font-bold mt-0.5">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Links */}
              <div className="flex gap-3 pt-2">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-2.5 bg-brutal-white border-3 border-brutal-black shadow-brutal-sm font-body font-bold text-sm uppercase tracking-wide transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-1 active:translate-y-1"
                >
                  GitHub →
                </a>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-2.5 bg-brutal-black text-brutal-yellow border-3 border-brutal-black shadow-brutal-sm font-body font-bold text-sm uppercase tracking-wide transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-1 active:translate-y-1"
                >
                  Live Demo →
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
