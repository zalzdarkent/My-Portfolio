"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
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

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen sticky top-0 border-r-4 border-brutal-black bg-brutal-black text-brutal-yellow flex flex-col transition-all duration-200 flex-shrink-0 ${collapsed ? "w-16" : "w-60"
        }`}
    >
      {/* Header / toggle */}
      <div className="px-3 py-3 border-b-2 border-white/10 flex items-center justify-between min-h-[52px]">
        {!collapsed && (
          <span className="font-mono text-xs uppercase tracking-widest font-bold truncate">
            Navigation
          </span>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="p-1.5 hover:bg-brutal-yellow/10 rounded transition-colors ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {/* hamburger / close icon */}
          <span className="block w-4 space-y-1">
            <span className="block h-0.5 bg-brutal-yellow" />
            <span className="block h-0.5 bg-brutal-yellow" />
            <span className="block h-0.5 bg-brutal-yellow" />
          </span>
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const href = `/admin/${item.id}`;
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={item.id}
              href={href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 border-b-2 border-white/10 font-mono text-xs uppercase tracking-widest transition-all ${collapsed ? "px-0 py-3 justify-center" : "px-5 py-3"
                } ${isActive
                  ? "bg-brutal-yellow text-brutal-black font-bold"
                  : "text-brutal-yellow/70 hover:bg-brutal-yellow/10 hover:text-brutal-yellow"
                }`}
            >
              <Icon size={16} strokeWidth={2.5} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t-2 border-white/10 flex items-center justify-center">
        {!collapsed && (
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
              Designed & Developed by
            </p>
            <p className="font-semibold text-brutal-yellow">
              Alif Fadillah Ummar
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
