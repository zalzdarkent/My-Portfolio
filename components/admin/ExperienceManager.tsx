"use client";

import { useState, useEffect } from "react";

interface ExperienceItem {
  text: string;
  sortOrder: number;
}

interface Experience {
  id?: number;
  locale: string;
  role: string;
  place: string;
  period: string;
  logoPath: string;
  sortOrder: number;
  items: ExperienceItem[];
  _isNew?: boolean;
  _expanded?: boolean;
}

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/experiences")
      .then((r) => r.json())
      .then((data) => {
        setExperiences(data.map((e: Experience) => ({ ...e, _expanded: false })));
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load experiences");
        setLoading(false);
      });
  }, []);

  const updateExp = (index: number, field: keyof Experience, value: any) => {
    setExperiences((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  };

  const updateItem = (expIndex: number, itemIndex: number, value: string) => {
    setExperiences((prev) =>
      prev.map((e, i) =>
        i === expIndex
          ? { ...e, items: e.items.map((it, j) => (j === itemIndex ? { ...it, text: value } : it)) }
          : e
      )
    );
  };

  const addItem = (expIndex: number) => {
    setExperiences((prev) =>
      prev.map((e, i) =>
        i === expIndex
          ? { ...e, items: [...e.items, { text: "", sortOrder: e.items.length }] }
          : e
      )
    );
  };

  const removeItem = (expIndex: number, itemIndex: number) => {
    setExperiences((prev) =>
      prev.map((e, i) =>
        i === expIndex
          ? { ...e, items: e.items.filter((_, j) => j !== itemIndex) }
          : e
      )
    );
  };

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        locale: "en",
        role: "",
        place: "",
        period: "",
        logoPath: "",
        sortOrder: prev.length,
        items: [],
        _isNew: true,
        _expanded: true,
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleExpanded = (index: number) => {
    setExperiences((prev) => prev.map((e, i) => (i === index ? { ...e, _expanded: !e._expanded } : e)));
  };

  const handleSave = async (index: number) => {
    const exp = experiences[index];
    const isNew = exp._isNew;
    setSavingId(exp.id ?? "new-" + index);
    setMessage("");

    const payload = {
      locale: exp.locale,
      role: exp.role,
      place: exp.place,
      period: exp.period,
      logoPath: exp.logoPath,
      sortOrder: exp.sortOrder,
      items: exp.items.map((it, i) => ({ text: it.text, sortOrder: i })),
    };

    try {
      const url = isNew ? "/api/admin/experiences" : `/api/admin/experiences/${exp.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      setExperiences((prev) =>
        prev.map((e, i) => (i === index ? { ...saved, _isNew: false, _expanded: true } : e))
      );
      setMessage(isNew ? "Created!" : "Updated!");
    } catch {
      setMessage("Failed to save");
    } finally {
      setSavingId(null);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleDelete = async (index: number) => {
    const exp = experiences[index];
    if (!exp.id) {
      removeExperience(index);
      return;
    }
    if (!confirm("Delete this experience?")) return;

    setDeletingId(exp.id);
    try {
      const res = await fetch(`/api/admin/experiences/${exp.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setExperiences((prev) => prev.filter((_, i) => i !== index));
      setMessage("Deleted!");
    } catch {
      setMessage("Failed to delete");
    } finally {
      setDeletingId(null);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="border-4 border-brutal-black bg-brutal-white p-8 shadow-brutal font-mono text-lg text-center">
        Loading experiences...
      </div>
    );
  }

  return (
    <div className="border-4 border-brutal-black bg-brutal-white shadow-brutal">
      <div className="flex items-center justify-between border-b-4 border-brutal-black p-4 bg-brutal-yellow">
        <h2 className="font-display text-2xl uppercase tracking-wide">Experiences</h2>
        <button
          onClick={addExperience}
          className="border-3 border-brutal-black bg-brutal-lime px-4 py-2 font-mono text-sm font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          + Add Experience
        </button>
      </div>

      <div className="divide-y-3 divide-brutal-black">
        {experiences.map((exp, i) => (
          <div key={exp.id ?? `new-${i}`}>
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-brutal-yellow/20 transition-colors"
              onClick={() => toggleExpanded(i)}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold">{exp._expanded ? "▼" : "▶"}</span>
                <span className="font-mono text-sm font-bold uppercase border-3 border-brutal-black px-2 py-0.5 bg-brutal-white">
                  {exp.locale}
                </span>
                <span className="font-body text-lg">{exp.role || "(untitled)"}</span>
                {exp.place && <span className="font-mono text-sm text-brutal-black/60">@ {exp.place}</span>}
                {exp._isNew && (
                  <span className="font-mono text-xs border-3 border-brutal-black bg-brutal-orange text-brutal-white px-2 py-0.5">
                    NEW
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(i);
                }}
                disabled={deletingId === exp.id}
                className="border-3 border-brutal-black bg-brutal-red text-brutal-white px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50"
              >
                {deletingId === exp.id ? "..." : "Delete"}
              </button>
            </div>

            {exp._expanded && (
              <div className="border-t-3 border-brutal-black bg-brutal-white p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1">Locale</label>
                    <select
                      value={exp.locale}
                      onChange={(e) => updateExp(i, "locale", e.target.value)}
                      className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                    >
                      <option value="en">English</option>
                      <option value="id">Indonesia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1">Sort Order</label>
                    <input
                      type="number"
                      value={exp.sortOrder}
                      onChange={(e) => updateExp(i, "sortOrder", Number(e.target.value))}
                      className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1">Role</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExp(i, "role", e.target.value)}
                      className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                      placeholder="e.g. Frontend Developer"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1">Place</label>
                    <input
                      type="text"
                      value={exp.place}
                      onChange={(e) => updateExp(i, "place", e.target.value)}
                      className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                      placeholder="e.g. Google"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1">Period</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExp(i, "period", e.target.value)}
                      className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                      placeholder="e.g. 2022 - Present"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1">Logo Path</label>
                    <input
                      type="text"
                      value={exp.logoPath}
                      onChange={(e) => updateExp(i, "logoPath", e.target.value)}
                      className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                      placeholder="/images/logo.png"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-mono text-xs uppercase font-bold">Items</label>
                    <button
                      onClick={() => addItem(i)}
                      className="border-3 border-brutal-black bg-brutal-lime px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {exp.items.map((item, j) => (
                      <div key={j} className="flex gap-2">
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => updateItem(i, j, e.target.value)}
                          className="flex-1 border-3 border-brutal-black bg-brutal-white px-3 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                          placeholder="Description bullet point"
                        />
                        <button
                          onClick={() => removeItem(i, j)}
                          className="border-3 border-brutal-black bg-brutal-red text-brutal-white px-2 font-mono text-xs font-bold shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSave(i)}
                  disabled={savingId === (exp.id ?? "new-" + i)}
                  className="border-3 border-brutal-black bg-brutal-yellow px-6 py-2 font-mono text-sm font-bold uppercase shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingId === (exp.id ?? "new-" + i) ? "Saving..." : "Save Experience"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {experiences.length === 0 && (
        <div className="p-6 text-center font-mono text-brutal-black/50">
          No experiences yet. Click + Add Experience to begin.
        </div>
      )}

      {message && (
        <div className="border-t-4 border-brutal-black p-3 bg-brutal-yellow/30 text-center font-mono text-sm font-bold">
          {message}
        </div>
      )}
    </div>
  );
}
