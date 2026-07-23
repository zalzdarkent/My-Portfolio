"use client";

import { useEffect, useState } from "react";

type ContactLocale = {
  locale: string;
  title: string;
  description1: string;
  description2: string;
  formName: string;
  formEmail: string;
  formMessage: string;
  formPlaceholder: string;
  formSubmit: string;
  formSubmitting: string;
  toast: string;
};

type ContactLink = {
  iconName: string;
  label: string;
  href: string;
  sortOrder: number;
};

const emptyLocale = (locale: string): ContactLocale => ({
  locale,
  title: "",
  description1: "",
  description2: "",
  formName: "",
  formEmail: "",
  formMessage: "",
  formPlaceholder: "",
  formSubmit: "",
  formSubmitting: "",
  toast: "",
});

const contentFields: {
  key: keyof Omit<ContactLocale, "locale">;
  label: string;
  textarea?: boolean;
}[] = [
  { key: "title", label: "Title" },
  { key: "description1", label: "Description 1", textarea: true },
  { key: "description2", label: "Description 2", textarea: true },
  { key: "formName", label: "Form Name" },
  { key: "formEmail", label: "Form Email" },
  { key: "formMessage", label: "Form Message" },
  { key: "formPlaceholder", label: "Form Placeholder" },
  { key: "formSubmit", label: "Form Submit" },
  { key: "formSubmitting", label: "Form Submitting" },
  { key: "toast", label: "Toast" },
];

export default function ContactEditor() {
  const [locales, setLocales] = useState<Record<string, ContactLocale>>({
    id: emptyLocale("id"),
    en: emptyLocale("en"),
  });
  const [links, setLinks] = useState<ContactLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/contact")
      .then((r) => r.json())
      .then((data: { content: ContactLocale[]; links: ContactLink[] }) => {
        const map: Record<string, ContactLocale> = {
          id: emptyLocale("id"),
          en: emptyLocale("en"),
        };
        data.content.forEach((item) => {
          map[item.locale] = item;
        });
        setLocales(map);
        setLinks(data.links || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateContent = (
    locale: string,
    key: keyof Omit<ContactLocale, "locale">,
    value: string
  ) => {
    setLocales((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [key]: value },
    }));
  };

  const updateLink = (index: number, key: keyof ContactLink, value: string | number) => {
    setLinks((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [key]: value } : l))
    );
  };

  const addLink = () => {
    setLinks((prev) => [
      ...prev,
      { iconName: "", label: "", href: "", sortOrder: prev.length },
    ]);
  };

  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const moveLink = (index: number, direction: -1 | 1) => {
    setLinks((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((l, i) => ({ ...l, sortOrder: i }));
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: [locales.id, locales.en],
          links: links.map((l, i) => ({ ...l, sortOrder: i })),
        }),
      });
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
          Loading contact content...
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
      {contentFields.map(({ key, label, textarea }) => (
        <div key={key} className="space-y-1">
          <label className="font-body font-bold text-xs uppercase tracking-widest text-black/60 block">
            {label}
          </label>
          {textarea ? (
            <textarea
              value={locales[locale][key]}
              onChange={(e) => updateContent(locale, key, e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-3 border-brutal-black bg-brutal-white font-body text-sm outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-brutal-hover transition-all resize-y"
            />
          ) : (
            <input
              type="text"
              value={locales[locale][key]}
              onChange={(e) => updateContent(locale, key, e.target.value)}
              className="w-full px-4 py-3 border-3 border-brutal-black bg-brutal-white font-body text-sm outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-brutal-hover transition-all"
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="border-4 border-brutal-black shadow-brutal bg-brutal-white p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-extrabold text-xl uppercase tracking-widest">
          Contact Editor
        </h2>
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2 border-brutal-black bg-brutal-yellow/30">
          /api/admin/contact
        </span>
      </div>

      {/* Content - two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderColumn("id")}
        {renderColumn("en")}
      </div>

      {/* Contact Links */}
      <div className="border-t-4 border-brutal-black pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-extrabold text-lg uppercase tracking-widest">
            Contact Links
          </h3>
          <button
            onClick={addLink}
            className="px-4 py-2 border-3 border-brutal-black shadow-brutal-sm bg-brutal-lime font-mono font-bold text-xs uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
          >
            + Add Link
          </button>
        </div>

        <div className="space-y-3">
          {links.length === 0 && (
            <div className="border-3 border-brutal-black bg-brutal-white p-4 text-center">
              <p className="font-body text-sm text-black/50">No contact links yet.</p>
            </div>
          )}
          {links.map((link, i) => (
            <div
              key={i}
              className="border-3 border-brutal-black shadow-brutal-sm p-4 bg-brutal-white"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono font-bold text-[10px] uppercase tracking-widest bg-brutal-black text-brutal-yellow px-2 py-0.5">
                  #{String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex gap-1 ml-auto">
                  <button
                    onClick={() => moveLink(i, -1)}
                    disabled={i === 0}
                    className="px-2 py-1 border-2 border-brutal-black font-mono font-bold text-xs hover:bg-brutal-yellow/30 disabled:opacity-30 transition-all"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveLink(i, 1)}
                    disabled={i === links.length - 1}
                    className="px-2 py-1 border-2 border-brutal-black font-mono font-bold text-xs hover:bg-brutal-yellow/30 disabled:opacity-30 transition-all"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeLink(i)}
                    className="px-2 py-1 border-2 border-brutal-red bg-brutal-red/10 font-mono font-bold text-xs text-brutal-red hover:bg-brutal-red hover:text-white transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(["iconName", "label", "href"] as const).map((key) => (
                  <div key={key} className="space-y-1">
                    <label className="font-body font-bold text-[10px] uppercase tracking-widest text-black/60 block">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={link[key]}
                      onChange={(e) => updateLink(i, key, e.target.value)}
                      className="w-full px-3 py-2 border-3 border-brutal-black bg-brutal-white font-mono text-sm outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-brutal-hover transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="border-t-4 border-brutal-black pt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-7 py-3.5 border-4 border-brutal-black shadow-brutal bg-brutal-yellow text-brutal-black font-body font-bold text-sm uppercase tracking-widest hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-hover active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Contact"}
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
