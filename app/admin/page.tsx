"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import HeroEditor from "@/components/admin/HeroEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import ProjectsManager from "@/components/admin/ProjectsManager";
import TechSkillsManager from "@/components/admin/TechSkillsManager";
import ExperienceManager from "@/components/admin/ExperienceManager";
import EducationManager from "@/components/admin/EducationManager";
import ContactEditor from "@/components/admin/ContactEditor";
import SidebarEditor from "@/components/admin/SidebarEditor";
import MarqueeEditor from "@/components/admin/MarqueeEditor";

type Section = "hero" | "about" | "projects" | "tech" | "experience" | "education" | "contact" | "sidebar" | "marquee";

const SECTION_TITLES: Record<Section, string> = {
  hero: "Hero Section",
  about: "About Section",
  projects: "Projects Manager",
  tech: "Technical Skills",
  experience: "Experience Section",
  education: "Education Section",
  contact: "Contact Section",
  sidebar: "Sidebar Data",
  marquee: "Marquee Items",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authOk, setAuthOk] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth/check");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        setAuthOk(true);
      } catch {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }, [router]);

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section as Section);
  }, []);

  if (!authOk) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brutal-white">
        <div className="font-mono text-sm animate-pulse">LOADING...</div>
      </div>
    );
  }

  const renderEditor = () => {
    switch (activeSection) {
      case "hero": return <HeroEditor />;
      case "about": return <AboutEditor />;
      case "projects": return <ProjectsManager />;
      case "tech": return <TechSkillsManager />;
      case "experience": return <ExperienceManager />;
      case "education": return <EducationManager />;
      case "contact": return <ContactEditor />;
      case "sidebar": return <SidebarEditor />;
      case "marquee": return <MarqueeEditor />;
      default: return <HeroEditor />;
    }
  };

  return (
    <div className="min-h-screen flex bg-brutal-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-200 flex-shrink-0`}>
        <AdminSidebar
          activeSection={activeSection}
          onNavigate={handleNavigate}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen overflow-y-auto">
        <AdminHeader onLogout={handleLogout} />

        <div className="p-6 lg:p-8">
          {/* Section title */}
          <div className="mb-6 flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-brutal-black border-3 border-brutal-black shadow-brutal-sm">
              <span className="font-mono font-extrabold text-brutal-yellow text-xs">
                {SECTION_TITLES[activeSection].slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold tracking-tight">
                {SECTION_TITLES[activeSection]}
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-black/40">
                Edit content & save to update portfolio
              </p>
            </div>
          </div>

          {/* Editor */}
          <div className="border-4 border-brutal-black shadow-brutal bg-brutal-white p-6">
            {renderEditor()}
          </div>
        </div>
      </div>
    </div>
  );
}
