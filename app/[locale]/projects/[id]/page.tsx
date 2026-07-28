"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Project } from "@/lib/data";
import ImageSlider from "@/components/ImageSlider";
import { matchTechSkill } from "@/lib/techHelper";
import TechIcon from "@/components/TechIcon";
import { FiArrowLeft, FiExternalLink, FiGithub } from "react-icons/fi";
import CustomCursor from "@/components/CustomCursor";

interface ApiProjectTag {
  id: number;
  projectId: number;
  tag: string;
}

interface ApiProjectTech {
  id: number;
  projectId: number;
  techName: string;
}

interface ApiProject {
  id: number;
  image: string;
  images: string;
  githubUrl: string;
  liveUrl: string;
  sortOrder: number;
  tags: ApiProjectTag[];
  techStack: ApiProjectTech[];
  translations: {
    locale: string;
    name: string;
    shortDesc: string;
    longDesc: string;
    features: string[];
  }[];
}

function tryParseJsonArray(val: string | undefined): string[] | undefined {
  if (!val) return undefined;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function tryParseFeatures(val: string | string[] | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ProjectDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations("projects");
  const id = Number(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/admin/projects/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data: ApiProject = await res.json();
        const tr = data.translations?.find((t) => t.locale === locale);
        setProject({
          id: data.id,
          tags: data.tags.map((tag) => tag.tag) as Project["tags"],
          image: data.image,
          images: tryParseJsonArray(data.images),
          tech: data.techStack.map((tech) => tech.techName),
          github: data.githubUrl,
          live: data.liveUrl,
          name: tr?.name ?? "",
          shortDesc: tr?.shortDesc ?? "",
          longDesc: tr?.longDesc ?? "",
          features: tryParseFeatures(tr?.features as any),
        });
      } catch {
        setProject(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id, locale]);

  if (loading) {
    return (
      <>
        <CustomCursor />
        <div className="min-h-screen bg-brutal-white flex items-center justify-center">
        <div className="border-4 border-brutal-black bg-brutal-yellow px-8 py-4 font-mono text-lg font-bold shadow-brutal animate-pulse">
          Loading...
        </div>
      </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <CustomCursor />
        <div className="min-h-screen bg-brutal-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display text-6xl font-extrabold mb-4">404</h1>
          <p className="font-body text-lg mb-6">Project not found</p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brutal-black text-brutal-yellow border-3 border-brutal-black shadow-brutal-sm font-body font-bold text-sm uppercase tracking-widest transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <FiArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
      </>
    );
  }

  const allImages = project.images && project.images.length > 0
    ? project.images
    : project.image
      ? [project.image]
      : [];

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen bg-brutal-white">
      {/* Top bar */}
      <div className="border-b-4 border-brutal-black bg-brutal-yellow">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-14 py-4 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider transition-all hover:translate-x-[2px]"
          >
            <FiArrowLeft size={18} />
            Back
          </Link>
          <span className="font-mono text-xs font-bold bg-brutal-black text-brutal-yellow px-3 py-1 border-3 border-brutal-black">
            #{String(project.id).padStart(3, "0")}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-14 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs font-bold uppercase tracking-widest border-3 border-brutal-black px-3 py-1 bg-brutal-yellow"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight">
              {project.name || `Project ${project.id}`}
            </h1>
          </div>

          {/* Image Slider */}
          {allImages.length > 0 && (
            <div className="mb-8">
              <ImageSlider images={allImages} alt={project.name} />
            </div>
          )}

          {/* Description */}
          <div className="mb-8 p-6 border-4 border-brutal-black shadow-brutal">
            <p className="font-body text-base sm:text-lg leading-relaxed">
              {project.longDesc || project.shortDesc || ""}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <h2 className="font-mono text-sm font-bold uppercase tracking-widest mb-4 border-b-3 border-brutal-black pb-2 inline-block">
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.tech.map((techName) => {
                const matched = matchTechSkill(techName);
                const iconName = matched.iconName || techName;
                const bg = matched.color || "#FDE047";
                const isLightBg =
                  bg === "#FFFFFF" ||
                  bg === "#F7DF1E" ||
                  bg.toLowerCase() === "#ffffff" ||
                  bg === "#fde047";
                const textColor = isLightBg ? "#000000" : "#FFFFFF";

                return (
                  <span
                    key={techName}
                    className="inline-flex items-center gap-2 px-3.5 py-2 border-3 border-brutal-black shadow-brutal-sm font-mono text-xs font-bold transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: bg, color: textColor }}
                  >
                    <TechIcon name={iconName} className="w-4 h-4 shrink-0" />
                    <span>{techName}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="mb-8">
              <h2 className="font-mono text-sm font-bold uppercase tracking-widest mb-4 border-b-3 border-brutal-black pb-2 inline-block">
                Feature Highlights
              </h2>
              <ul className="space-y-3">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm sm:text-base">
                    <span className="text-brutal-orange font-bold mt-1 shrink-0">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4 pt-4 border-t-4 border-brutal-black">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brutal-white border-3 border-brutal-black shadow-brutal-sm font-body font-bold text-sm uppercase tracking-wide transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <FiGithub size={18} />
                GitHub
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brutal-black text-brutal-yellow border-3 border-brutal-black shadow-brutal-sm font-body font-bold text-sm uppercase tracking-wide transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <FiExternalLink size={18} />
                Live Demo
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
