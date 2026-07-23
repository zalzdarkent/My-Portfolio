"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "./AboutSection";
import { useTranslations, useLocale } from "next-intl";

const LOGOS = [
  "/brands/gdsc.png",
  "/brands/logo_aslab.png",
  "/brands/cbi.png",
  "/brands/ati.png",
];
const ACCENTS = ["#BFFF00", "#FDE047", "#35ffff", "#FF6B35"];

type ExperienceItem = {
  id: string;
  locale: string;
  role: string;
  place: string;
  period: string;
  sortOrder: number;
  logoPath: string;
  items: { id: string; text: string; sortOrder: number }[];
};

type SidebarData = {
  workHabits: { id: string; k: string; v: string }[];
  snapshotItems: { id: string; num: string; label: string }[];
};

export default function ExperienceSection() {
  const t = useTranslations("experience");
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const defaultExpList = t.raw("list") as {
    role: string;
    place: string;
    period: string;
    items: string[];
  }[];

  const defaultWorkHabits = t.raw("workHabits.items") as { k: string; v: string }[];
  const defaultSnapshotItems = t.raw("snapshot.items") as { num: string; label: string }[];

  const [expList, setExpList] = useState(defaultExpList);
  const [workHabits, setWorkHabits] = useState(defaultWorkHabits);
  const [snapshotItems, setSnapshotItems] = useState(defaultSnapshotItems);

  useEffect(() => {
    fetch("/api/admin/experiences")
      .then((res) => res.json())
      .then((data: ExperienceItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const filtered = data
            .filter((e) => e.locale === locale)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((e) => ({
              role: e.role,
              place: e.place,
              period: e.period,
              items: e.items.sort((a, b) => a.sortOrder - b.sortOrder).map((it) => it.text),
            }));
          if (filtered.length > 0) setExpList(filtered);
        }
      })
      .catch(() => {});

    fetch("/api/admin/sidebar")
      .then((res) => res.json())
      .then((data: SidebarData) => {
        if (data.workHabits?.length > 0) setWorkHabits(data.workHabits.map((w) => ({ k: w.k, v: w.v })));
        if (data.snapshotItems?.length > 0) setSnapshotItems(data.snapshotItems.map((s) => ({ num: s.num, label: s.label })));
      })
      .catch(() => {});
  }, [locale]);

  return (
    <section
      ref={ref}
      id="pengalaman"
      className="bg-brutal-black px-6 sm:px-10 lg:px-14 py-20 border-b-4 border-brutal-black"
    >
      <SectionHeader num="04" title={t("title")} inView={inView} light />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mt-10">
        {/* Left: timeline */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="lg:col-span-3"
        >
          <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal-yellow">
            <div className="p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-brutal-black border-4 border-brutal-black shadow-brutal-sm">
                  <span className="font-mono font-extrabold text-brutal-yellow">EXP</span>
                </div>
                <div className="space-y-2">
                  <p className="font-body font-bold text-sm uppercase tracking-widest text-black/60">
                    {t("subtitle")}
                  </p>
                  <p className="font-display font-extrabold text-[clamp(1.25rem,3vw,1.65rem)] leading-tight">
                    {t("headline")}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {expList.map((exp, idx) => (
                  <motion.div
                    key={exp.role}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                    className="border-3 border-brutal-black bg-brutal-white p-4"
                    whileHover={{ x: 4, y: 4, boxShadow: "3px 3px 0px #0a0a0a" }}
                    style={{ boxShadow: "6px 6px 0px #0a0a0a" }}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-10 h-10 flex items-center justify-center border-4 border-brutal-black shadow-brutal-sm">
                          <Image
                            src={LOGOS[idx % LOGOS.length]}
                            alt={`${exp.role} logo`}
                            width={40}
                            height={40}
                            className="w-8 h-8 object-contain"
                          />
                        </span>
                        <div>
                          <p className="font-display font-extrabold text-lg">{exp.role}</p>
                          <p className="font-body text-sm text-black/60">{exp.place}</p>
                        </div>
                      </div>
                      <span
                        className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-1 border-2 border-brutal-black"
                        style={{ background: ACCENTS[idx % ACCENTS.length], color: "#0a0a0a" }}
                      >
                        {exp.period}
                      </span>
                    </div>

                    <ul className="mt-3 space-y-2">
                      {exp.items.map((it, i) => (
                        <li key={i} className="font-body text-sm text-black/70 flex gap-2">
                          <span className="mt-2 inline-block w-2 h-2 bg-brutal-black border border-brutal-black" />
                          <span className="leading-relaxed">{it}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: stats */}
        <motion.aside
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            <div className="bg-brutal-yellow border-4 border-brutal-black shadow-brutal p-5">
              <p className="font-mono font-bold text-sm uppercase tracking-widest text-black">
                {t("workHabits.label")}
              </p>
              <div className="mt-4 space-y-3">
                {workHabits.map((r) => (
                  <div key={r.k} className="border-3 border-brutal-black bg-brutal-white/0 p-3">
                    <p className="font-body font-bold text-black">{r.k}</p>
                    <p className="font-body text-xs text-brutal-black mt-1">{r.v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal-yellow p-5">
              <p className="font-mono font-bold text-sm uppercase tracking-widest text-black/60">
                {t("snapshot.label")}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {snapshotItems.map((s) => (
                  <div
                    key={s.label}
                    className="bg-brutal-white border-3 border-brutal-black shadow-brutal-sm p-4 text-center"
                    style={{ boxShadow: "6px 6px 0px #0a0a0a" }}
                  >
                    <p className="font-display font-extrabold text-3xl">{s.num}</p>
                    <p className="font-body font-bold text-[11px] uppercase tracking-widest text-black/60 mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
