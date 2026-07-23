"use client";

import { useState, useEffect } from "react";

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
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/tech-skills")
      .then((r) => r.json())
      .then((data) => {
        setSkills(data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load skills");
        setLoading(false);
      });
  }, []);

  const updateSkill = (index: number, field: keyof TechSkill, value: string | number) => {
    setSkills((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
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
    setMessage("");
    try {
      const res = await fetch("/api/admin/tech-skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: skills }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setSkills(data);
      setMessage("Saved!");
    } catch {
      setMessage("Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 2000);
    }
  };

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
        <h2 className="font-display text-2xl uppercase tracking-wide">Tech Skills</h2>
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
              <th className="border-r-3 border-brutal-black p-3 text-left font-mono uppercase text-xs">Icon</th>
              <th className="border-r-3 border-brutal-black p-3 text-left font-mono uppercase text-xs w-24">Sort</th>
              <th className="p-3 font-mono uppercase text-xs w-20"></th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, i) => (
              <tr key={i} className="border-b-3 border-brutal-black last:border-b-0 hover:bg-brutal-yellow/20 transition-colors">
                <td className="border-r-3 border-brutal-black p-2">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(i, "name", e.target.value)}
                    className="w-full border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                    placeholder="Skill name"
                  />
                </td>
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
                <td className="border-r-3 border-brutal-black p-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={skill.color || "#FDE047"}
                      onChange={(e) => updateSkill(i, "color", e.target.value)}
                      className="w-8 h-8 border-3 border-brutal-black cursor-pointer"
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
                <td className="border-r-3 border-brutal-black p-2">
                  <input
                    type="text"
                    value={skill.iconName}
                    onChange={(e) => updateSkill(i, "iconName", e.target.value)}
                    className="w-full border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                    placeholder="e.g. SiReact"
                  />
                </td>
                <td className="border-r-3 border-brutal-black p-2">
                  <input
                    type="number"
                    value={skill.sortOrder}
                    onChange={(e) => updateSkill(i, "sortOrder", Number(e.target.value))}
                    className="w-full border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                  />
                </td>
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
          No skills yet. Click + Add Skill to begin.
        </div>
      )}

      <div className="flex items-center gap-4 border-t-4 border-brutal-black p-4 bg-brutal-yellow/30">
        <button
          onClick={handleSave}
          disabled={saving}
          className="border-3 border-brutal-black bg-brutal-yellow px-6 py-2 font-mono text-sm font-bold uppercase shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save All Skills"}
        </button>
        {message && (
          <span className="font-mono text-sm font-bold">{message}</span>
        )}
      </div>
    </div>
  );
}
