"use client";

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
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Section = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const sections: Section[] = [
  { id: "hero", label: "Hero", icon: LayoutDashboard },
  { id: "about", label: "About", icon: User },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "tech", label: "Tech Skills", icon: Wrench },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "sidebar", label: "Sidebar Data", icon: PanelLeft },
  { id: "marquee", label: "Marquee", icon: Megaphone },
];

interface AdminSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function AdminSidebar({
  activeSection,
  onNavigate,
  collapsed = false,
  onToggle,
}: AdminSidebarProps) {
  return (
    <aside className={`h-screen sticky top-0 border-4 border-brutal-black shadow-brutal bg-brutal-black text-brutal-yellow flex flex-col transition-all duration-200 ${collapsed ? "w-16" : "w-64"}`}>
      {/* Toggle button */}
      <div className="px-3 py-3 border-b-2 border-white/10 flex items-center justify-between">
        {!collapsed && (
          <h2 className="font-mono text-xs uppercase tracking-widest font-bold">
            Navigation
          </h2>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-brutal-yellow/10 rounded transition-colors"
        >
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              title={collapsed ? section.label : undefined}
              className={`w-full flex items-center gap-3 border-b-2 border-white/10 font-mono text-xs uppercase tracking-widest transition-all ${
                collapsed ? "px-0 py-3 justify-center" : "px-5 py-3"
              } ${
                isActive
                  ? "bg-brutal-yellow text-brutal-black font-bold"
                  : "text-brutal-yellow/70 hover:bg-brutal-yellow/10 hover:text-brutal-yellow"
              }`}
            >
              <Icon size={16} strokeWidth={2.5} />
              {!collapsed && <span>{section.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-3 border-t-2 border-white/10">
        {!collapsed && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-brutal-yellow/40">
            CMS v1.0
          </span>
        )}
      </div>
    </aside>
  );
}
