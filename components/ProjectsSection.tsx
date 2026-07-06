"use client";

import { useRef, useState } from "react";
import { useInView, motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "./AboutSection";
import ProjectModal from "./ProjectModal";
import { PROJECTS, FILTER_OPTIONS, Project } from "@/lib/data";
import { useTranslations } from "next-intl";

export default function ProjectsSection() {
  const t = useTranslations("projects");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = PROJECTS.filter((p) =>
    activeFilter === "all" ? true : p.tags.includes(activeFilter as any)
  );

  return (
    <>
      <section ref={ref} id="projects" className="px-6 sm:px-10 lg:px-14 py-20 border-b-4 border-brutal-black">
        <SectionHeader num="03" title={t("title")} inView={inView} />

        {/* Filter bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="flex flex-wrap gap-3 mt-8 mb-10">
          {FILTER_OPTIONS.map((opt) => (
            <motion.button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              whileHover={{ x: 2, y: 2, boxShadow: "2px 2px 0px #0a0a0a" }}
              whileTap={{ x: 4, y: 4, boxShadow: "0px 0px 0px #0a0a0a" }}
              className={`px-5 py-2 font-body font-bold text-sm uppercase tracking-widest border-3 border-brutal-black transition-colors ${
                activeFilter === opt.value
                  ? "bg-brutal-black text-brutal-yellow translate-x-1 translate-y-1"
                  : "bg-brutal-white text-brutal-black"
              }`}
              style={{ boxShadow: activeFilter === opt.value ? "none" : "4px 4px 0px #0a0a0a" }}
            >
              {t(`filter.${opt.key}`)} {/* ← */}
            </motion.button>
          ))}
        </motion.div>

        {/* Project grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onOpen={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const t = useTranslations("projects");
  const id = String(project.id);

  const TAG_STYLES: Record<string, string> = {
    web: "bg-brutal-yellow",
    fullstack: "bg-brutal-yellow",
    mobile: "bg-brutal-orange text-white",
    ai: "bg-brutal-pink text-white",
    ml: "bg-brutal-blue text-white",
    iot: "bg-brutal-lime text-black",
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileHover={{ x: 5, y: 5, boxShadow: "3px 3px 0px #0a0a0a" }}
      whileTap={{ x: 8, y: 8, boxShadow: "0px 0px 0px #0a0a0a" }}
      onClick={onOpen}
      className="bg-brutal-white border-4 border-brutal-black cursor-pointer flex flex-col"
      style={{ boxShadow: "8px 8px 0px #0a0a0a" }}
    >
      <div className="h-44 flex items-center justify-center border-b-4 border-brutal-black relative text-5xl font-bold">
        <img src={project.image} alt={t(`projects.${id}.name`)} className="w-full h-full object-cover" />
        <span className="absolute top-2 right-2 font-mono text-xs font-bold bg-brutal-black text-brutal-yellow px-2 py-0.5">
          #{String(project.id).padStart(3, "0")}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag) => (
            <span key={tag} className={`font-mono text-[10px] font-bold uppercase tracking-widest border-2 border-brutal-black px-2 py-0.5 ${TAG_STYLES[tag] ?? "bg-brutal-yellow"}`}>
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-display text-lg font-extrabold mb-2">
          {t(`projects.${id}.name`)} {/* ← */}
        </h3>
        <p className="font-body text-sm leading-relaxed text-black/60 flex-1 line-clamp-2">
          {t(`projects.${id}.shortDesc`)} {/* ← */}
        </p>

        <button
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className="mt-4 self-start px-4 py-2 bg-brutal-black text-brutal-yellow border-3 border-brutal-black shadow-brutal-sm font-body font-bold text-xs uppercase tracking-widest transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          {t("detailBtn")} {/* ← */}
        </button>
      </div>
    </motion.article>
  );
}