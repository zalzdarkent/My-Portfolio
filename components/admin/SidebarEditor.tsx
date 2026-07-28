"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface WorkHabit {
  locale: string;
  k: string;
  v: string;
  sortOrder: number;
}

interface SnapshotItem {
  locale: string;
  num: string;
  label: string;
  sortOrder: number;
}

interface Competency {
  locale: string;
  k: string;
  v: string;
  sortOrder: number;
}

interface Achievement {
  locale: string;
  text: string;
  sortOrder: number;
}

interface SidebarData {
  workHabits: WorkHabit[];
  snapshotItems: SnapshotItem[];
  competencies: Competency[];
  achievements: Achievement[];
}

const emptyData: SidebarData = {
  workHabits: [],
  snapshotItems: [],
  competencies: [],
  achievements: [],
};

export default function SidebarEditor() {
  const [data, setData] = useState<SidebarData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    workHabits: true,
    snapshotItems: false,
    competencies: false,
    achievements: false,
  });

  useEffect(() => {
    fetch("/api/admin/sidebar")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gagal memuat data Sidebar");
        setLoading(false);
      });
  }, []);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateWorkHabit = (index: number, field: keyof WorkHabit, value: string | number) => {
    setData((prev) => ({
      ...prev,
      workHabits: prev.workHabits.map((w, i) => (i === index ? { ...w, [field]: value } : w)),
    }));
  };

  const addWorkHabit = () => {
    setData((prev) => ({
      ...prev,
      workHabits: [...prev.workHabits, { locale: "en", k: "", v: "", sortOrder: prev.workHabits.length }],
    }));
  };

  const removeWorkHabit = (index: number) => {
    setData((prev) => ({
      ...prev,
      workHabits: prev.workHabits.filter((_, i) => i !== index),
    }));
  };

  const updateSnapshotItem = (index: number, field: keyof SnapshotItem, value: string | number) => {
    setData((prev) => ({
      ...prev,
      snapshotItems: prev.snapshotItems.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  };

  const addSnapshotItem = () => {
    setData((prev) => ({
      ...prev,
      snapshotItems: [...prev.snapshotItems, { locale: "en", num: "", label: "", sortOrder: prev.snapshotItems.length }],
    }));
  };

  const removeSnapshotItem = (index: number) => {
    setData((prev) => ({
      ...prev,
      snapshotItems: prev.snapshotItems.filter((_, i) => i !== index),
    }));
  };

  const updateCompetency = (index: number, field: keyof Competency, value: string | number) => {
    setData((prev) => ({
      ...prev,
      competencies: prev.competencies.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    }));
  };

  const addCompetency = () => {
    setData((prev) => ({
      ...prev,
      competencies: [...prev.competencies, { locale: "en", k: "", v: "", sortOrder: prev.competencies.length }],
    }));
  };

  const removeCompetency = (index: number) => {
    setData((prev) => ({
      ...prev,
      competencies: prev.competencies.filter((_, i) => i !== index),
    }));
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: string | number) => {
    setData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    }));
  };

  const addAchievement = () => {
    setData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, { locale: "en", text: "", sortOrder: prev.achievements.length }],
    }));
  };

  const removeAchievement = (index: number) => {
    setData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sidebar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      setData(saved);
      toast.success("Data Sidebar berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan data Sidebar!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="border-4 border-brutal-black bg-brutal-white p-8 shadow-brutal font-mono text-lg text-center">
        Loading sidebar data...
      </div>
    );
  }

  const renderWorkHabits = () => (
    <div className="space-y-2">
      {data.workHabits.map((w, i) => (
        <div key={i} className="flex gap-2 items-center">
          <select
            value={w.locale}
            onChange={(e) => updateWorkHabit(i, "locale", e.target.value)}
            className="border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-xs focus:outline-none focus:shadow-brutal-sm w-20"
          >
            <option value="en">EN</option>
            <option value="id">ID</option>
          </select>
          <input
            type="text"
            value={w.k}
            onChange={(e) => updateWorkHabit(i, "k", e.target.value)}
            className="flex-1 border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
            placeholder="Key"
          />
          <input
            type="text"
            value={w.v}
            onChange={(e) => updateWorkHabit(i, "v", e.target.value)}
            className="flex-1 border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
            placeholder="Value"
          />
          <input
            type="number"
            value={w.sortOrder}
            onChange={(e) => updateWorkHabit(i, "sortOrder", Number(e.target.value))}
            className="w-16 border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
          />
          <button
            onClick={() => removeWorkHabit(i)}
            className="border-3 border-brutal-black bg-brutal-red text-brutal-white px-2 py-1 font-mono text-xs font-bold shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            X
          </button>
        </div>
      ))}
      <button
        onClick={addWorkHabit}
        className="border-3 border-brutal-black bg-brutal-lime px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
      >
        + Add Row
      </button>
    </div>
  );

  const renderSnapshotItems = () => (
    <div className="space-y-2">
      {data.snapshotItems.map((s, i) => (
        <div key={i} className="flex gap-2 items-center">
          <select
            value={s.locale}
            onChange={(e) => updateSnapshotItem(i, "locale", e.target.value)}
            className="border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-xs focus:outline-none focus:shadow-brutal-sm w-20"
          >
            <option value="en">EN</option>
            <option value="id">ID</option>
          </select>
          <input
            type="text"
            value={s.num}
            onChange={(e) => updateSnapshotItem(i, "num", e.target.value)}
            className="w-20 border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
            placeholder="Num"
          />
          <input
            type="text"
            value={s.label}
            onChange={(e) => updateSnapshotItem(i, "label", e.target.value)}
            className="flex-1 border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
            placeholder="Label"
          />
          <input
            type="number"
            value={s.sortOrder}
            onChange={(e) => updateSnapshotItem(i, "sortOrder", Number(e.target.value))}
            className="w-16 border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
          />
          <button
            onClick={() => removeSnapshotItem(i)}
            className="border-3 border-brutal-black bg-brutal-red text-brutal-white px-2 py-1 font-mono text-xs font-bold shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            X
          </button>
        </div>
      ))}
      <button
        onClick={addSnapshotItem}
        className="border-3 border-brutal-black bg-brutal-lime px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
      >
        + Add Row
      </button>
    </div>
  );

  const renderCompetencies = () => (
    <div className="space-y-2">
      {data.competencies.map((c, i) => (
        <div key={i} className="flex gap-2 items-center">
          <select
            value={c.locale}
            onChange={(e) => updateCompetency(i, "locale", e.target.value)}
            className="border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-xs focus:outline-none focus:shadow-brutal-sm w-20"
          >
            <option value="en">EN</option>
            <option value="id">ID</option>
          </select>
          <input
            type="text"
            value={c.k}
            onChange={(e) => updateCompetency(i, "k", e.target.value)}
            className="flex-1 border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
            placeholder="Key"
          />
          <input
            type="text"
            value={c.v}
            onChange={(e) => updateCompetency(i, "v", e.target.value)}
            className="flex-1 border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
            placeholder="Value"
          />
          <input
            type="number"
            value={c.sortOrder}
            onChange={(e) => updateCompetency(i, "sortOrder", Number(e.target.value))}
            className="w-16 border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
          />
          <button
            onClick={() => removeCompetency(i)}
            className="border-3 border-brutal-black bg-brutal-red text-brutal-white px-2 py-1 font-mono text-xs font-bold shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            X
          </button>
        </div>
      ))}
      <button
        onClick={addCompetency}
        className="border-3 border-brutal-black bg-brutal-lime px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
      >
        + Add Row
      </button>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-2">
      {data.achievements.map((a, i) => (
        <div key={i} className="flex gap-2 items-center">
          <select
            value={a.locale}
            onChange={(e) => updateAchievement(i, "locale", e.target.value)}
            className="border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-xs focus:outline-none focus:shadow-brutal-sm w-20"
          >
            <option value="en">EN</option>
            <option value="id">ID</option>
          </select>
          <input
            type="text"
            value={a.text}
            onChange={(e) => updateAchievement(i, "text", e.target.value)}
            className="flex-1 border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
            placeholder="Achievement text"
          />
          <input
            type="number"
            value={a.sortOrder}
            onChange={(e) => updateAchievement(i, "sortOrder", Number(e.target.value))}
            className="w-16 border-3 border-brutal-black bg-brutal-white px-2 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
          />
          <button
            onClick={() => removeAchievement(i)}
            className="border-3 border-brutal-black bg-brutal-red text-brutal-white px-2 py-1 font-mono text-xs font-bold shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            X
          </button>
        </div>
      ))}
      <button
        onClick={addAchievement}
        className="border-3 border-brutal-black bg-brutal-lime px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
      >
        + Add Row
      </button>
    </div>
  );

  const sections = [
    { key: "workHabits", label: "Work Habits", count: data.workHabits.length, render: renderWorkHabits },
    { key: "snapshotItems", label: "Snapshot Items", count: data.snapshotItems.length, render: renderSnapshotItems },
    { key: "competencies", label: "Competencies", count: data.competencies.length, render: renderCompetencies },
    { key: "achievements", label: "Achievements", count: data.achievements.length, render: renderAchievements },
  ];

  return (
    <div className="border-4 border-brutal-black bg-brutal-white shadow-brutal">
      <div className="flex items-center justify-between border-b-4 border-brutal-black p-4 bg-brutal-yellow">
        <h2 className="font-display text-2xl uppercase tracking-wide">Sidebar Editor</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="border-3 border-brutal-black bg-brutal-yellow px-6 py-2 font-mono text-sm font-bold uppercase shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      <div className="divide-y-3 divide-brutal-black">
        {sections.map((section) => (
          <div key={section.key}>
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-brutal-yellow/20 transition-colors"
              onClick={() => toggleSection(section.key)}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold">
                  {expandedSections[section.key] ? "▼" : "▶"}
                </span>
                <span className="font-display text-lg uppercase">{section.label}</span>
                <span className="font-mono text-xs border-3 border-brutal-black px-2 py-0.5 bg-brutal-white">
                  {section.count}
                </span>
              </div>
            </div>
            {expandedSections[section.key] && (
              <div className="border-t-3 border-brutal-black bg-brutal-white p-4">
                {section.render()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
