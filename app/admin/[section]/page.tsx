"use client";

import { notFound } from "next/navigation";
import HeroEditor from "@/components/admin/HeroEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import ProjectsManager from "@/components/admin/ProjectsManager";
import TechSkillsManager from "@/components/admin/TechSkillsManager";
import ExperienceManager from "@/components/admin/ExperienceManager";
import EducationManager from "@/components/admin/EducationManager";
import ContactEditor from "@/components/admin/ContactEditor";
import SidebarEditor from "@/components/admin/SidebarEditor";
import MarqueeEditor from "@/components/admin/MarqueeEditor";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Wrench,
  Briefcase,
  GraduationCap,
  Mail,
  PanelLeft,
  Megaphone,
} from "lucide-react";

type Section = "hero" | "about" | "projects" | "tech" | "experience" | "education" | "contact" | "sidebar" | "marquee";

const SECTION_CONFIG: Record<Section, { title: string; icon: React.ElementType; editor: React.ReactNode }> = {
  hero:       { title: "Hero Section",      icon: LayoutDashboard, editor: <HeroEditor /> },
  about:      { title: "About Section",     icon: User,            editor: <AboutEditor /> },
  projects:   { title: "Projects Manager",  icon: FolderKanban,    editor: <ProjectsManager /> },
  tech:       { title: "Technical Skills",  icon: Wrench,          editor: <TechSkillsManager /> },
  experience: { title: "Experience Section",icon: Briefcase,       editor: <ExperienceManager /> },
  education:  { title: "Education Section", icon: GraduationCap,   editor: <EducationManager /> },
  contact:    { title: "Contact Section",   icon: Mail,            editor: <ContactEditor /> },
  sidebar:    { title: "Sidebar Data",      icon: PanelLeft,       editor: <SidebarEditor /> },
  marquee:    { title: "Marquee Items",     icon: Megaphone,       editor: <MarqueeEditor /> },
};

const VALID_SECTIONS = Object.keys(SECTION_CONFIG) as Section[];

export default function AdminSectionPage({ params }: { params: { section: string } }) {
  const { section } = params;

  if (!VALID_SECTIONS.includes(section as Section)) {
    notFound();
  }

  const config = SECTION_CONFIG[section as Section];
  const Icon = config.icon;

  return (
    <div>
      {/* Section title bar */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center bg-brutal-black border-3 border-brutal-black shadow-brutal-sm">
          <Icon size={16} strokeWidth={2.5} className="text-brutal-yellow" />
        </div>
        <div>
          <h2 className="font-display text-xl font-extrabold tracking-tight">
            {config.title}
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-widest text-black/40">
            Edit content &amp; save to update portfolio
          </p>
        </div>
      </div>

      {/* Editor */}
      {config.editor}
    </div>
  );
}
