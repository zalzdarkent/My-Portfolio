"use client";

import { useRef, useEffect, useState } from "react";
import { useInView, motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "./AboutSection";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { useForm, ValidationError } from "@formspree/react";
import { useTranslations, useLocale } from "next-intl";

import { toast } from "sonner";

const ICON_MAP: Record<string, any> = { FaGithub, FaLinkedin, SiGmail };

const DEFAULT_LINKS = [
  { iconName: "SiGmail", label: "arszalzdarker@email.com", href: "mailto:arszalzdarker@email.com" },
  { iconName: "FaGithub", label: "github.com/zalzdarkent", href: "https://github.com/zalzdarkent" },
  { iconName: "FaLinkedin", label: "linkedin.com/in/alif-fadillah-ummar-07001224b/", href: "https://linkedin.com/in/alif-fadillah-ummar-07001224b/" },
];

type ContactLink = { id: string; iconName: string; label: string; href: string; sortOrder: number };
type ContactContent = { id: string; locale: string; title: string; description1: string; description2: string };
type ContactData = { content: ContactContent[]; links: ContactLink[] };

export default function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  const [state, handleSubmit] = useForm("mwvjbojr");
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [links, setLinks] = useState(DEFAULT_LINKS);

  useEffect(() => {
    if (state.succeeded) {
      toast.success(t("toast"));
    }
  }, [state.succeeded, t]);

  useEffect(() => {
    fetch("/api/admin/contact")
      .then((res) => res.json())
      .then((data: ContactData) => {
        if (data.links?.length > 0) {
          setLinks(data.links.sort((a, b) => a.sortOrder - b.sortOrder));
        }
      })
      .catch(() => {});
  }, [locale]);

  const fields = [
    { label: t("form.name"),  name: "name",  type: "text",  placeholder: "John Doe" },
    { label: t("form.email"), name: "email", type: "email", placeholder: "john@email.com" },
  ];

  return (
    <>
      <section
        ref={ref}
        id="contact"
        className="bg-brutal-yellow px-6 sm:px-10 lg:px-14 py-20 border-b-4 border-brutal-black"
      >
        <SectionHeader num="06" title={t("title")} inView={inView} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <p className="font-body text-lg leading-relaxed text-black/70">{t("desc1")}</p>
            <p className="font-body text-base text-black/60">{t("desc2")}</p>

            <div className="flex flex-col gap-3">
              {links.map((link, i) => {
                const IconComponent = ICON_MAP[link.iconName];
                return (
                  <motion.a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 3, y: 3, boxShadow: "1px 1px 0px #0a0a0a" }}
                    whileTap={{ x: 4, y: 4, boxShadow: "0px 0px 0px #0a0a0a" }}
                    className="flex items-center gap-3 px-4 py-3 bg-brutal-white border-3 border-brutal-black font-body font-bold text-brutal-black text-sm no-underline"
                    style={{ boxShadow: "4px 4px 0px #0a0a0a" }}
                  >
                    <span className="w-7 text-center text-lg">{IconComponent ? <IconComponent /> : link.iconName}</span>
                    {link.label}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {fields.map((field, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <label className="font-body font-bold text-xs uppercase tracking-widest">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  name={field.name}
                  required
                  className="bg-brutal-white border-4 border-brutal-black shadow-brutal-sm px-4 py-3 font-body text-base font-medium outline-none transition-all focus:translate-x-1 focus:translate-y-1 focus:shadow-none placeholder:text-black/30"
                />
                <ValidationError
                  prefix={field.label}
                  field={field.name}
                  errors={state.errors}
                  className="text-red-600 text-sm mt-1"
                />
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="font-body font-bold text-xs uppercase tracking-widest">
                {t("form.message")}
              </label>
              <textarea
                placeholder={t("form.messagePlaceholder")}
                name="message"
                required
                rows={5}
                className="bg-brutal-white border-4 border-brutal-black shadow-brutal-sm px-4 py-3 font-body text-base font-medium outline-none resize-none transition-all focus:translate-x-1 focus:translate-y-1 focus:shadow-none placeholder:text-black/30"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ x: 3, y: 3, boxShadow: "3px 3px 0px #0a0a0a" }}
              whileTap={{ x: 6, y: 6, boxShadow: "0px 0px 0px #0a0a0a" }}
              className="mt-2 px-8 py-4 bg-brutal-black text-brutal-yellow border-4 border-brutal-black font-body font-bold text-sm uppercase tracking-widest"
              style={{ boxShadow: "6px 6px 0px #0a0a0a" }}
            >
              {state.submitting ? t("form.submitting") : t("form.submit")}
            </motion.button>
          </motion.form>
        </div>
      </section>

    </>
  );
}
