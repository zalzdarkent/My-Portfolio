"use client";

import { useEffect, useState } from "react";

type MarqueeItem = {
  text: string;
  sortOrder: number;
};

export default function MarqueeEditor() {
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/marquee")
      .then((r) => r.json())
      .then((data: MarqueeItem[]) => {
        setItems(
          data.map((d, i) => ({ text: d.text, sortOrder: d.sortOrder ?? i }))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateText = (index: number, text: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, text } : item)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { text: "", sortOrder: prev.length }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, sortOrder: i }))
    );
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((item, i) => ({ ...item, sortOrder: i }));
    });
  };

  const updateSortOrder = (index: number, order: number) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], sortOrder: order };
      return [...next].sort((a, b) => a.sortOrder - b.sortOrder);
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const sorted = [...items]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((item, i) => ({ ...item, sortOrder: i }));
      await fetch("/api/admin/marquee", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: sorted }),
      });
      setItems(sorted);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="border-4 border-brutal-black shadow-brutal bg-brutal-white p-8 text-center">
        <p className="font-mono font-bold text-sm uppercase tracking-widest animate-pulse">
          Loading marquee content...
        </p>
      </div>
    );
  }

  return (
    <div className="border-4 border-brutal-black shadow-brutal bg-brutal-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-extrabold text-xl uppercase tracking-widest">
          Marquee Editor
        </h2>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2 border-brutal-black bg-brutal-yellow/30">
            /api/admin/marquee
          </span>
          <span className="font-mono font-bold text-[10px] uppercase tracking-widest bg-brutal-black text-brutal-yellow px-2 py-0.5">
            {items.length} items
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <div className="border-3 border-dashed border-brutal-black p-6 text-center">
            <p className="font-body text-sm text-black/50">No marquee items yet. Add one below.</p>
          </div>
        )}
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border-3 border-brutal-black shadow-brutal-sm p-3 bg-brutal-white hover:bg-brutal-yellow/10 transition-all group"
          >
            <span className="font-mono font-bold text-[10px] uppercase tracking-widest bg-brutal-black text-brutal-yellow px-2 py-0.5 shrink-0">
              #{String(i + 1).padStart(2, "0")}
            </span>

            <input
              type="number"
              value={item.sortOrder}
              onChange={(e) => updateSortOrder(i, parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-2 border-3 border-brutal-black bg-brutal-white font-mono text-xs text-center outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-brutal-hover transition-all shrink-0"
              title="Sort order"
            />

            <input
              type="text"
              value={item.text}
              onChange={(e) => updateText(i, e.target.value)}
              placeholder="Marquee text..."
              className="flex-1 px-4 py-2 border-3 border-brutal-black bg-brutal-white font-body text-sm outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-brutal-hover transition-all"
            />

            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => moveItem(i, -1)}
                disabled={i === 0}
                className="px-2 py-2 border-2 border-brutal-black font-mono font-bold text-xs hover:bg-brutal-yellow/30 disabled:opacity-30 transition-all"
              >
                ↑
              </button>
              <button
                onClick={() => moveItem(i, 1)}
                disabled={i === items.length - 1}
                className="px-2 py-2 border-2 border-brutal-black font-mono font-bold text-xs hover:bg-brutal-yellow/30 disabled:opacity-30 transition-all"
              >
                ↓
              </button>
              <button
                onClick={() => removeItem(i)}
                className="px-2 py-2 border-2 border-brutal-red bg-brutal-red/10 font-mono font-bold text-xs text-brutal-red hover:bg-brutal-red hover:text-white transition-all"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={addItem}
          className="px-5 py-2.5 border-3 border-brutal-black shadow-brutal-sm bg-brutal-lime font-mono font-bold text-xs uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
        >
          + Add Item
        </button>

        <div className="flex-1" />

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-7 py-3.5 border-4 border-brutal-black shadow-brutal bg-brutal-yellow text-brutal-black font-body font-bold text-sm uppercase tracking-widest hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-hover active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Marquee"}
        </button>
        {saved && (
          <span className="font-mono font-bold text-xs uppercase tracking-widest bg-brutal-lime border-3 border-brutal-black px-3 py-1 animate-pulse">
            Saved!
          </span>
        )}
      </div>
    </div>
  );
}
