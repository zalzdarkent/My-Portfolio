"use client";

import { useRef, useState, useEffect } from "react";
import { useInView, motion, animate, useMotionValue, useTransform } from "framer-motion";
import { FolderKanban, Handshake, GitBranch } from "lucide-react";
import { BiBriefcaseAlt } from "react-icons/bi";
import { useTranslations, useLocale } from "next-intl";
import CvModal from "@/components/CvModal";

function Counter({
  value,
  inView,
}: {
  value: number;
  inView: boolean;
}) {
  const count = useMotionValue(0);

  const rounded = useTransform(count, (latest) =>
    Math.round(latest)
  );

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, {
        duration: 1.5,
        ease: "easeOut",
      });

      return controls.stop;
    }
  }, [inView, value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function AboutSection() {
  const t = useTranslations("about");
  const locale = useLocale();
  const STATS = [
    {
      num: 3,
      suffix: "+",
      label: t("stats.experiences"),
      icon: <BiBriefcaseAlt size={32} />,
      bgColor: "bg-brutal-lime",
      textColor: "text-brutal-black",
    },
    {
      num: 5,
      suffix: "+",
      label: t("stats.projects"),
      icon: <FolderKanban size={32} />,
      bgColor: "bg-brutal-orange",
      textColor: "text-brutal-black",
    },
    {
      num: 5,
      suffix: "+",
      label: t("stats.clients"),
      icon: <Handshake size={32} />,
      bgColor: "bg-brutal-blue",
      textColor: "text-brutal-black",
    },
    {
      num: 8,
      suffix: "+",
      label: t("stats.open_source"),
      icon: <GitBranch size={32} />,
      bgColor: "bg-brutal-purple",
      textColor: "text-brutal-black",
    },
  ];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [cvModalOpen, setCvModalOpen] = useState(false);

  const fileMap: Record<string, string> = {
    id: "/resume/CV_ID_Alif_Fadillah_Ummar.pdf",
    en: "/resume/CV_ENG_Alif_Fadillah_Ummar.pdf",
  };

  const cvUrl = fileMap[locale] ?? fileMap.en;
  const cvFileName = cvUrl.split("/").pop() ?? "CV.pdf";

  return (
    <section
      ref={ref}
      id="about"
      className="relative overflow-hidden px-6 sm:px-10 lg:px-14 py-20 border-b-4 border-brutal-black"
    >
      {/* Section header */}
      <SectionHeader num="01" title={t("title")} inView={inView} />

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="space-y-5"
        >
          {[
            t("desc")
          ].map((p, i) => (
            <p key={i} className="font-body text-lg leading-relaxed text-black/70">
              {p}
            </p>
          ))}

          <button
            onClick={() => setCvModalOpen(true)}
            className="inline-flex items-center gap-2 mt-4 px-7 py-3.5 border-4 border-brutal-black shadow-brutal font-body font-bold text-sm uppercase tracking-widest bg-brutal-yellow text-brutal-black hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-hover active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-100 cursor-pointer"
          >
            {t("btn")}
          </button>

          <CvModal
            isOpen={cvModalOpen}
            onClose={() => setCvModalOpen(false)}
            pdfUrl={cvUrl}
            fileName={cvFileName}
            title={t("cvModal.title")}
            downloadText={t("cvModal.download")}
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 4, y: 4, boxShadow: "2px 2px 0px #0a0a0a" }}
              className={
                `${s.bgColor} border-4 border-brutal-black shadow-brutal p-6 text-center cursor-default `
              }
              style={{ boxShadow: "6px 6px 0px #0a0a0a" }}
            >
              <span className="text-3xl block">{s.icon}</span>
              <span
                className={`font-display text-4xl font-extrabold block mt-1 ${s.textColor}`}
              >
                <Counter value={s.num} inView={inView} />
                {s.suffix}
              </span>
              <span className="font-body font-bold text-xs uppercase tracking-widest text-black/60 mt-1 block">
                {s.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function SectionHeader({
  num,
  title,
  inView,
  light = false,
}: {
  num: string;
  title: string;
  inView: boolean;
  light?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45 }}
      className="flex items-center gap-4"
    >
      <span className={`font-mono text-sm font-bold ${light ? "text-white/40" : "text-black/40"}`}>
        {num} //
      </span>
      <h2
        className={`font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight ${light ? "text-brutal-white" : "text-brutal-black"
          }`}
      >
        {title}
      </h2>
      <div className={`flex-1 h-[3px] ${light ? "bg-white/20" : "bg-brutal-black"}`} />
    </motion.div>
  );
}
