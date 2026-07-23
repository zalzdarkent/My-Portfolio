"use client";

import { useState, useEffect } from "react";

interface EducationHighlight {
  text: string;
  sortOrder: number;
}

interface EducationEntry {
  id?: number;
  locale: string;
  title: string;
  place: string;
  period: string;
  sortOrder: number;
  highlights: EducationHighlight[];
  _isNew?: boolean;
  _expanded?: boolean;
}

export default function EducationManager() {
  const [entries, setEntries] = useState<EducationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/education")
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.map((e: EducationEntry) => ({ ...e, _expanded: false })));
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load education");
        setLoading(false);
      });
  }, []);

  const updateEntry = (index: number, field: keyof EducationEntry, value: any) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  };

  const updateHighlight = (entryIndex: number, highlightIndex: number, value: string) => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === entryIndex
          ? { ...e, highlights: e.highlights.map((h, j) => (j === highlightIndex ? { ...h, text: value } : h)) }
          : e
      )
    );
  };

  const addHighlight = (entryIndex: number) => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === entryIndex
          ? { ...e, highlights: [...e.highlights, { text: "", sortOrder: e.highlights.length }] }
          : e
      )
    );
  };

  const removeHighlight = (entryIndex: number, highlightIndex: number) => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === entryIndex
          ? { ...e, highlights: e.highlights.filter((_, j) => j !== highlightIndex) }
          : e
      )
    );
  };

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        locale: "en",
        title: "",
        place: "",
        period: "",
        sortOrder: prev.length,
        highlights: [],
        _isNew: true,
        _expanded: true,
      },
    ]);
  };

  const toggleExpanded = (index: number) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, _expanded: !e._expanded } : e)));
  };

  const handleSave = async (index: number) => {
    const entry = entries[index];
    const isNew = entry._isNew;
    setSavingId(entry.id ?? "new-" + index);
    setMessage("");

    const payload = {
      locale: entry.locale,
      title: entry.title,
      place: entry.place,
      period: entry.period,
      sortOrder: entry.sortOrder,
      highlights: entry.highlights.map((h, i) => ({ text: h.text, sortOrder: i })),
    };

    try {
      const url = isNew ? "/api/admin/education" : `/api/admin/education/${entry.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      setEntries((prev) =>
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
    const entry = entries[index];
    if (!entry.id) {
      setEntries((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    if (!confirm("Delete this education entry?")) return;

    setDeletingId(entry.id);
    try {
      const res = await fetch(`/api/admin/education/${entry.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setEntries((prev) => prev.filter((_, i) => i !== index));
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
        Loading education...
      </div>
    );
  }

  return (
    <div className="border-4 border-brutal-black bg-brutal-white shadow-brutal">
      <div className="flex items-center justify-between border-b-4 border-brutal-black p-4 bg-brutal-yellow">
        <h2 className="font-display text-2xl uppercase tracking-wide">Education</h2>
        <button
          onClick={addEntry}
          className="border-3 border-brutal-black bg-brutal-lime px-4 py-2 font-mono text-sm font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          + Add Education
        </button>
      </div>

      <div className="divide-y-3 divide-brutal-black">
        {entries.map((entry, i) => (
          <div key={entry.id ?? `new-${i}`}>
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-brutal-yellow/20 transition-colors"
              onClick={() => toggleExpanded(i)}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold">{entry._expanded ? "▼" : "▶"}</span>
                <span className="font-mono text-sm font-bold uppercase border-3 border-brutal-black px-2 py-0.5 bg-brutal-white">
                  {entry.locale}
                </span>
                <span className="font-body text-lg">{entry.title || "(untitled)"}</span>
                {entry.place && <span className="font-mono text-sm text-brutal-black/60">@ {entry.place}</span>}
                {entry._isNew && (
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
                disabled={deletingId === entry.id}
                className="border-3 border-brutal-black bg-brutal-red text-brutal-white px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50"
              >
                {deletingId === entry.id ? "..." : "Delete"}
              </button>
            </div>

            {entry._expanded && (
              <div className="border-t-3 border-brutal-black bg-brutal-white p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1">Locale</label>
                    <select
                      value={entry.locale}
                      onChange={(e) => updateEntry(i, "locale", e.target.value)}
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
                      value={entry.sortOrder}
                      onChange={(e) => updateEntry(i, "sortOrder", Number(e.target.value))}
                      className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1">Title</label>
                    <input
                      type="text"
                      value={entry.title}
                      onChange={(e) => updateEntry(i, "title", e.target.value)}
                      className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                      placeholder="e.g. Bachelor of Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-1">Place</label>
                    <input
                      type="text"
                      value={entry.place}
                      onChange={(e) => updateEntry(i, "place", e.target.value)}
                      className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                      placeholder="e.g. MIT"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-mono text-xs uppercase font-bold mb-1">Period</label>
                    <input
                      type="text"
                      value={entry.period}
                      onChange={(e) => updateEntry(i, "period", e.target.value)}
                      className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                      placeholder="e.g. 2018 - 2022"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-mono text-xs uppercase font-bold">Highlights</label>
                    <button
                      onClick={() => addHighlight(i)}
                      className="border-3 border-brutal-black bg-brutal-lime px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      + Add Highlight
                    </button>
                  </div>
                  <div className="space-y-2">
                    {entry.highlights.map((h, j) => (
                      <div key={j} className="flex gap-2">
                        <input
                          type="text"
                          value={h.text}
                          onChange={(e) => updateHighlight(i, j, e.target.value)}
                          className="flex-1 border-3 border-brutal-black bg-brutal-white px-3 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                          placeholder="Highlight or achievement"
                        />
                        <button
                          onClick={() => removeHighlight(i, j)}
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
                  disabled={savingId === (entry.id ?? "new-" + i)}
                  className="border-3 border-brutal-black bg-brutal-yellow px-6 py-2 font-mono text-sm font-bold uppercase shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingId === (entry.id ?? "new-" + i) ? "Saving..." : "Save Education"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="p-6 text-center font-mono text-brutal-black/50">
          No education entries yet. Click + Add Education to begin.
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
