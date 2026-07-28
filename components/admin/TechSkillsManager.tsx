"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { TechIcon } from "@/components/TechIcon";
import { matchTechSkill, getAllIconNames, KNOWN_TECHS } from "@/lib/techHelper";

interface TechSkill {
  id?: number;
  name: string;
  level: string;
  color: string;
  iconName: string;
  sortOrder: number;
}

const LEVELS = ["Expert", "Advanced", "Intermediate", "Beginner"];

export default function TechSkillsManager() {
  const [skills, setSkills] = useState<TechSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activePickerIndex, setActivePickerIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/tech-skills")
      .then((r) => r.json())
      .then((data) => {
        setSkills(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gagal memuat Tech Skills");
        setLoading(false);
      });
  }, []);

  // Close picker on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setActivePickerIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateSkill = (index: number, field: keyof TechSkill, value: string | number) => {
    setSkills((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  // Auto-detect icon and color when skill name changes
  const handleNameChange = (index: number, newName: string) => {
    setSkills((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        const matched = matchTechSkill(newName);
        return {
          ...s,
          name: newName,
          // Auto fill icon if icon is empty or matches previous auto-fill
          iconName: matched.iconName || s.iconName,
          // Auto fill color if color is empty or default
          color: matched.color || s.color,
        };
      })
    );
  };

  // Manual auto-detect trigger button
  const triggerAutoDetect = (index: number) => {
    const skill = skills[index];
    const matched = matchTechSkill(skill.name);
    if (matched.iconName || matched.color) {
      setSkills((prev) =>
        prev.map((s, i) =>
          i === index
            ? {
                ...s,
                iconName: matched.iconName || s.iconName,
                color: matched.color || s.color,
              }
            : s
        )
      );
      toast.success(`Berhasil mencocokkan icon "${matched.iconName}" untuk ${skill.name}`);
    } else {
      toast.error(`Tidak dapat menemukan icon otomatis untuk "${skill.name}". Silakan pilih dari list.`);
    }
  };

  const addSkill = () => {
    setSkills((prev) => [
      ...prev,
      { name: "", level: "Intermediate", color: "#FDE047", iconName: "", sortOrder: prev.length },
    ]);
  };

  const removeSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/tech-skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: skills }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setSkills(data);
      toast.success("Tech Skills berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan Tech Skills!");
    } finally {
      setSaving(false);
    }
  };

  // Filter icons for picker
  const allIcons = getAllIconNames();
  const filteredIcons = searchQuery.trim()
    ? allIcons.filter((icon) => icon.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 30)
    : allIcons.slice(0, 30);

  if (loading) {
    return (
      <div className="border-4 border-brutal-black bg-brutal-white p-8 shadow-brutal font-mono text-lg text-center">
        Loading skills...
      </div>
    );
  }

  return (
    <div className="border-4 border-brutal-black bg-brutal-white shadow-brutal">
      <div className="flex items-center justify-between border-b-4 border-brutal-black p-4 bg-brutal-yellow">
        <div>
          <h2 className="font-display text-2xl uppercase tracking-wide">Tech Skills</h2>
          <p className="font-mono text-xs text-brutal-black/70 mt-1">
            ⚡ Ketik nama tech (misal: Laravel, React, Docker) maka Icon & Color akan terisi otomatis!
          </p>
        </div>
        <button
          onClick={addSkill}
          className="border-3 border-brutal-black bg-brutal-lime px-4 py-2 font-mono text-sm font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          + Add Skill
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="border-b-3 border-brutal-black bg-brutal-white">
              <th className="border-r-3 border-brutal-black p-3 text-left font-mono uppercase text-xs">Name</th>
              <th className="border-r-3 border-brutal-black p-3 text-left font-mono uppercase text-xs">Level</th>
              <th className="border-r-3 border-brutal-black p-3 text-left font-mono uppercase text-xs">Color</th>
              <th className="border-r-3 border-brutal-black p-3 text-left font-mono uppercase text-xs">Icon (Auto-Match / Picker)</th>
              <th className="border-r-3 border-brutal-black p-3 text-left font-mono uppercase text-xs w-24">Sort</th>
              <th className="p-3 font-mono uppercase text-xs w-20"></th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, i) => (
              <tr key={i} className="border-b-3 border-brutal-black last:border-b-0 hover:bg-brutal-yellow/10 transition-colors">
                {/* Skill Name */}
                <td className="border-r-3 border-brutal-black p-2">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleNameChange(i, e.target.value)}
                    className="w-full border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                    placeholder="e.g. Laravel, React, Docker"
                  />
                </td>

                {/* Level */}
                <td className="border-r-3 border-brutal-black p-2">
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(i, "level", e.target.value)}
                    className="w-full border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </td>

                {/* Color */}
                <td className="border-r-3 border-brutal-black p-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={skill.color || "#FDE047"}
                      onChange={(e) => updateSkill(i, "color", e.target.value)}
                      className="w-8 h-8 border-3 border-brutal-black cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={skill.color}
                      onChange={(e) => updateSkill(i, "color", e.target.value)}
                      className="w-full border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none"
                      placeholder="#FDE047"
                    />
                  </div>
                </td>

                {/* Icon input with Live Preview & Auto Picker */}
                <td className="border-r-3 border-brutal-black p-2 relative">
                  <div className="flex items-center gap-2">
                    {/* Live Preview Box */}
                    <div
                      className="w-8 h-8 border-3 border-brutal-black bg-brutal-white flex items-center justify-center text-xl shrink-0"
                      style={{ color: skill.color || "#000000" }}
                      title={skill.iconName ? `Icon: ${skill.iconName}` : "No Icon"}
                    >
                      <TechIcon name={skill.iconName} />
                    </div>

                    {/* Icon Input Field */}
                    <input
                      type="text"
                      value={skill.iconName}
                      onFocus={() => {
                        setActivePickerIndex(i);
                        setSearchQuery(skill.iconName || skill.name);
                      }}
                      onChange={(e) => {
                        updateSkill(i, "iconName", e.target.value);
                        setSearchQuery(e.target.value);
                      }}
                      className="flex-1 border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                      placeholder="FaLaravel / SiReact"
                    />

                    {/* Magic Auto Detect Button */}
                    <button
                      type="button"
                      onClick={() => triggerAutoDetect(i)}
                      title="Auto-detect icon by skill name"
                      className="border-3 border-brutal-black bg-brutal-cyan px-2 py-1 font-mono text-xs font-bold shadow-brutal-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      ⚡ Auto
                    </button>
                  </div>

                  {/* Dropdown Icon Picker Modal/Menu */}
                  {activePickerIndex === i && (
                    <div
                      ref={pickerRef}
                      className="absolute left-2 top-full mt-1 z-50 w-72 max-h-60 overflow-y-auto border-3 border-brutal-black bg-brutal-white p-2 shadow-brutal"
                    >
                      <div className="sticky top-0 bg-brutal-white pb-2 border-b-2 border-brutal-black mb-2">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari icon (Fa... / Si...)..."
                          className="w-full border-2 border-brutal-black px-2 py-1 font-mono text-xs focus:outline-none"
                          autoFocus
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-1">
                        {filteredIcons.length > 0 ? (
                          filteredIcons.map((iconName) => (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => {
                                updateSkill(i, "iconName", iconName);
                                setActivePickerIndex(null);
                              }}
                              className="flex items-center gap-3 w-full p-1.5 text-left font-mono text-xs border border-transparent hover:border-brutal-black hover:bg-brutal-yellow/30 transition-all rounded-none"
                            >
                              <span className="text-lg w-6 flex justify-center text-brutal-black">
                                <TechIcon name={iconName} />
                              </span>
                              <span className="truncate">{iconName}</span>
                            </button>
                          ))
                        ) : (
                          <div className="p-2 font-mono text-xs text-brutal-black/50 text-center">
                            Icon tidak ditemukan
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </td>

                {/* Sort Order */}
                <td className="border-r-3 border-brutal-black p-2">
                  <input
                    type="number"
                    value={skill.sortOrder}
                    onChange={(e) => updateSkill(i, "sortOrder", Number(e.target.value))}
                    className="w-full border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                  />
                </td>

                {/* Remove button */}
                <td className="p-2 text-center">
                  <button
                    onClick={() => removeSkill(i)}
                    className="border-3 border-brutal-black bg-brutal-red text-brutal-white px-2 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {skills.length === 0 && (
        <div className="p-6 text-center font-mono text-brutal-black/50 border-t-3 border-brutal-black">
          Belum ada skill. Klik + Add Skill untuk menambahkan.
        </div>
      )}

      <div className="flex items-center justify-between border-t-4 border-brutal-black p-4 bg-brutal-yellow/30">
        <button
          onClick={handleSave}
          disabled={saving}
          className="border-3 border-brutal-black bg-brutal-yellow px-6 py-2 font-mono text-sm font-bold uppercase shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save All Skills"}
        </button>

        <span className="font-mono text-xs text-brutal-black/60">
          Total Skills: {skills.length}
        </span>
      </div>
    </div>
  );
}
