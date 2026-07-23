"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import { SectionHeader } from "./AboutSection";
import { FaLaravel, FaReact, FaNodeJs } from "react-icons/fa";
import { SiNextdotjs, SiCodeigniter, SiGit, SiTailwindcss, SiTypescript, SiRedis, SiDocker, SiPostgresql, SiMysql } from "react-icons/si";
import { useTranslations } from "next-intl";

const ICON_MAP: Record<string, any> = {
  FaReact, FaLaravel, FaNodeJs, SiNextdotjs, SiCodeigniter, SiGit,
  SiTailwindcss, SiTypescript, SiRedis, SiDocker, SiPostgresql, SiMysql,
};

const DEFAULT_TECHS = [
  { name: "React", level: "Intermediate", color: "#4fb7fd", iconName: "FaReact" },
  { name: "Next.js", level: "Intermediate", color: "#000000", iconName: "SiNextdotjs" },
  { name: "TypeScript", level: "Intermediate", color: "#2ea8fa", iconName: "SiTypescript" },
  { name: "Node.js", level: "Intermediate", color: "#0fbf09", iconName: "FaNodeJs" },
  { name: "PostgreSQL", level: "Beginner", color: "#06469b", iconName: "SiPostgresql" },
  { name: "Redis", level: "Beginner", color: "#d50a0a", iconName: "SiRedis" },
  { name: "Docker", level: "Beginner", color: "#1b83c9", iconName: "SiDocker" },
  { name: "Tailwind CSS", level: "Intermediate", color: "#3aa3e9", iconName: "SiTailwindcss" },
  { name: "Git", level: "Intermediate", color: "#d51a1a", iconName: "SiGit" },
  { name: "Laravel", level: "Advanced", color: "#e31a1a", iconName: "FaLaravel" },
  { name: "CodeIgniter", level: "Intermediate", color: "#f12f2f", iconName: "SiCodeigniter" },
  { name: "MySQL", level: "Advanced", color: "#00758f", iconName: "SiMysql" },
];

const LEVEL_COLORS: Record<string, string> = {
  Expert: "#FDE047",
  Advanced: "#BFFF00",
  Intermediate: "#FF6B35",
};

export default function TechSection() {
  const t = useTranslations("tech");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [techs, setTechs] = useState(DEFAULT_TECHS);

  useEffect(() => {
    fetch("/api/admin/tech-skills")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTechs(data.sort((a: any, b: any) => a.sortOrder - b.sortOrder));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      ref={ref}
      id="tech"
      className="bg-brutal-black px-6 sm:px-10 lg:px-14 py-20 border-b-4 border-brutal-black"
    >
      <SectionHeader num="02" title={t("title")} inView={inView} light />

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10"
      >
        {techs.map((tech, i) => {
          const IconComponent = tech.icon ? tech.icon : ICON_MAP[tech.iconName];
          return (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover="hover"
              whileTap={{ x: 6, y: 6, boxShadow: "0px 0px 0px #FDE047" }}
              className="group bg-brutal-white border-3 border-brutal-black cursor-default text-center p-4 transition-colors"
              style={{ boxShadow: "6px 6px 0px #FDE047" }}
              variants={{
                hover: { x: 4, y: 4, boxShadow: "2px 2px 0px #FDE047" }
              }}
            >
              <motion.span
                className="text-3xl flex mb-2 items-center justify-center text-brutal-black"
                variants={{
                  initial: { color: "#000000" },
                  hover: {
                    color: tech.color || "#000000",
                    transition: { duration: 0.3, ease: "easeInOut" }
                  }
                }}
              >
                {IconComponent ? <IconComponent /> : null}
              </motion.span>

              <span className="font-body font-bold text-sm block">{tech.name}</span>
              <span
                className="inline-block mt-2 font-mono text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 border-2 border-brutal-black"
                style={{ background: LEVEL_COLORS[tech.level] }}
              >
                {t(`levels.${tech.level}`)}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
