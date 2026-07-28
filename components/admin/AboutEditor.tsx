"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type AboutLocale = {
  locale: string;
  title: string;
  description: string;
  btnLabel: string;
  cvModalTitle: string;
  cvModalDownload: string;
};

const emptyLocale = (locale: string): AboutLocale => ({
  locale,
  title: "",
  description: "",
  btnLabel: "",
  cvModalTitle: "",
  cvModalDownload: "",
});

const fields: { key: keyof Omit<AboutLocale, "locale">; label: string; textarea?: boolean }[] = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description", textarea: true },
  { key: "btnLabel", label: "Button Label" },
  { key: "cvModalTitle", label: "CV Modal Title" },
  { key: "cvModalDownload", label: "CV Modal Download" },
];

export default function AboutEditor() {
  const [locales, setLocales] = useState<Record<string, AboutLocale>>({
    id: emptyLocale("id"),
    en: emptyLocale("en"),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/about")
      .then((r) => r.json())
      .then((data: AboutLocale[]) => {
        const map: Record<string, AboutLocale> = {
          id: emptyLocale("id"),
          en: emptyLocale("en"),
        };
        data.forEach((item) => {
          map[item.locale] = item;
        });
        setLocales(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const update = (locale: string, key: keyof Omit<AboutLocale, "locale">, value: string) => {
    setLocales((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [key]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [locales.id, locales.en] }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("About Section berhasil disimpan!");
    } catch (e) {
      console.error(e);
      toast.error("Gagal menyimpan About Section!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="border-4 border-brutal-black shadow-brutal bg-brutal-white p-8 text-center">
        <p className="font-mono font-bold text-sm uppercase tracking-widest animate-pulse">
          Loading about content...
        </p>
      </div>
    );
  }

  const renderColumn = (locale: string) => (
    <div className="space-y-4">
      <div className="border-b-4 border-brutal-black pb-2 mb-4">
        <span className="font-display font-extrabold text-lg uppercase tracking-widest bg-brutal-yellow px-3 py-1 border-3 border-brutal-black inline-block">
          {locale.toUpperCase()}
        </span>
      </div>
      {fields.map(({ key, label, textarea }) => (
        <div key={key} className="space-y-1">
          <label className="font-body font-bold text-xs uppercase tracking-widest text-black/60 block">
            {label}
          </label>
          {textarea ? (
            <textarea
              value={locales[locale][key]}
              onChange={(e) => update(locale, key, e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-3 border-brutal-black bg-brutal-white font-body text-sm outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-brutal-hover transition-all resize-y"
            />
          ) : (
            <input
              type="text"
              value={locales[locale][key]}
              onChange={(e) => update(locale, key, e.target.value)}
              className="w-full px-4 py-3 border-3 border-brutal-black bg-brutal-white font-body text-sm outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-brutal-hover transition-all"
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="border-4 border-brutal-black shadow-brutal bg-brutal-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-extrabold text-xl uppercase tracking-widest">
          About Editor
        </h2>
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2 border-brutal-black bg-brutal-yellow/30">
          /api/admin/about
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderColumn("id")}
        {renderColumn("en")}
      </div>

      <div className="mt-8 border-t-4 border-brutal-black pt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-7 py-3.5 border-4 border-brutal-black shadow-brutal bg-brutal-yellow text-brutal-black font-body font-bold text-sm uppercase tracking-widest hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-hover active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save About"}
        </button>
      </div>
    </div>
  );
}
