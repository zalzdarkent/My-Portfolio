"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

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
}

const EMPTY_FORM: Omit<Experience, "id"> = {
  locale: "id",
  role: "",
  place: "",
  period: "",
  logoPath: "",
  sortOrder: 0,
  items: [],
};

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLocale, setActiveLocale] = useState<"id" | "en">("id");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [form, setForm] = useState<Omit<Experience, "id">>(EMPTY_FORM);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = () => {
    fetch("/api/admin/experiences")
      .then((r) => r.json())
      .then((data) => {
        setExperiences(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gagal memuat Experience");
        setLoading(false);
      });
  };

  // --- Modal helpers ---
  const openCreateModal = () => {
    setEditingExp(null);
    setForm({ ...EMPTY_FORM, locale: activeLocale, sortOrder: experiences.length });
    setModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExp(exp);
    setForm({
      locale: exp.locale,
      role: exp.role,
      place: exp.place,
      period: exp.period,
      logoPath: exp.logoPath,
      sortOrder: exp.sortOrder,
      items: exp.items.map((it) => ({ ...it })),
    });
    setModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingExp(null);
    setForm(EMPTY_FORM);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeModal]);

  // --- Form field update ---
  const updateField = (field: keyof Omit<Experience, "id">, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { text: "", sortOrder: prev.items.length }],
    }));
  };

  const updateItem = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((it, i) => (i === index ? { ...it, text: value } : it)),
    }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // --- Save ---
  const handleSave = async () => {
    if (!form.role.trim()) {
      toast.error("Role / Posisi tidak boleh kosong!");
      return;
    }
    setSaving(true);
    const isNew = !editingExp;
    const payload = {
      ...form,
      items: form.items.map((it, i) => ({ text: it.text, sortOrder: i })),
    };

    try {
      const url = isNew ? "/api/admin/experiences" : `/api/admin/experiences/${editingExp!.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const saved: Experience = await res.json();

      setExperiences((prev) =>
        isNew ? [...prev, saved] : prev.map((e) => (e.id === saved.id ? saved : e))
      );
      toast.success(isNew ? "Experience berhasil dibuat!" : "Experience berhasil diperbarui!");
      closeModal();
    } catch {
      toast.error("Gagal menyimpan Experience!");
    } finally {
      setSaving(false);
    }
  };

  // --- Delete ---
  const handleDelete = async (exp: Experience) => {
    if (!exp.id) return;
    if (!confirm(`Hapus "${exp.role}"?`)) return;
    setDeletingId(exp.id);
    try {
      const res = await fetch(`/api/admin/experiences/${exp.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setExperiences((prev) => prev.filter((e) => e.id !== exp.id));
      toast.success("Experience berhasil dihapus!");
    } catch {
      toast.error("Gagal menghapus Experience!");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="border-4 border-brutal-black bg-brutal-white p-8 shadow-brutal font-mono text-lg text-center">
        Loading experiences...
      </div>
    );
  }

  const idList = experiences.filter((e) => e.locale === "id");
  const enList = experiences.filter((e) => e.locale === "en");
  const currentList = activeLocale === "id" ? idList : enList;

  return (
    <>
      {/* ─── Main Card ─────────────────────────────────────────────────────── */}
      <div className="border-4 border-brutal-black bg-brutal-white shadow-brutal">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-4 border-brutal-black p-4 bg-brutal-yellow gap-3">
          <div>
            <h2 className="font-display text-2xl uppercase tracking-wide">Experiences</h2>
            <p className="font-mono text-xs text-black/70">
              Kelola pengalaman karir terpisah untuk versi ID & EN.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 border-3 border-brutal-black bg-brutal-lime px-4 py-2 font-mono text-sm font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all shrink-0"
          >
            <Plus size={16} strokeWidth={3} /> Add Experience ({activeLocale.toUpperCase()})
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b-4 border-brutal-black font-mono text-xs sm:text-sm font-bold uppercase">
          {(["id", "en"] as const).map((loc) => {
            const count = loc === "id" ? idList.length : enList.length;
            const isActive = activeLocale === loc;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => setActiveLocale(loc)}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all ${
                  loc === "id" ? "border-r-3 border-brutal-black" : ""
                } ${isActive ? "bg-brutal-black text-brutal-yellow" : "bg-brutal-white hover:bg-brutal-yellow/20 text-black"}`}
              >
                <span>{loc === "id" ? "🇮🇩 Indonesian (ID)" : "🇬🇧 English (EN)"}</span>
                <span
                  className={`px-2 py-0.5 text-xs font-mono font-bold border-2 border-brutal-black ${
                    isActive ? "bg-brutal-yellow text-black" : "bg-brutal-black text-brutal-white"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="divide-y-3 divide-brutal-black">
          {currentList.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center justify-between gap-3 p-4 hover:bg-brutal-yellow/10 transition-colors"
            >
              {/* Logo thumbnail */}
              {exp.logoPath ? (
                <img
                  src={exp.logoPath}
                  alt={exp.place}
                  className="w-10 h-10 object-contain border-2 border-brutal-black bg-white shrink-0"
                />
              ) : (
                <div className="w-10 h-10 border-2 border-brutal-black bg-brutal-yellow/20 flex items-center justify-center shrink-0">
                  <ImageIcon size={16} className="text-black/40" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-body font-bold text-base truncate">
                  {exp.role || "(Untitled Role)"}
                </p>
                <p className="font-mono text-xs text-black/60 truncate">
                  {exp.place && `@ ${exp.place}`}
                  {exp.place && exp.period && " · "}
                  {exp.period}
                </p>
                {exp.items.length > 0 && (
                  <p className="font-mono text-xs text-black/40 mt-0.5">
                    {exp.items.length} deskripsi poin
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(exp)}
                  className="inline-flex items-center gap-1 border-2 border-brutal-black bg-brutal-yellow px-3 py-1.5 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(exp)}
                  disabled={deletingId === exp.id}
                  className="inline-flex items-center gap-1 border-2 border-brutal-black bg-brutal-red text-white px-3 py-1.5 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  {deletingId === exp.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {currentList.length === 0 && (
          <div className="p-8 text-center font-mono text-sm text-brutal-black/60">
            Belum ada Experience untuk versi{" "}
            <strong>{activeLocale === "id" ? "Bahasa Indonesia (ID)" : "English (EN)"}</strong>.
            <br />
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-3 inline-flex items-center gap-1 border-2 border-brutal-black bg-brutal-lime px-4 py-1.5 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover transition-all"
            >
              <Plus size={14} /> Tambah Sekarang
            </button>
          </div>
        )}
      </div>

      {/* ─── Modal ─────────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Panel */}
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col border-4 border-brutal-black bg-brutal-white shadow-[8px_8px_0px_0px_#000] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-4 border-brutal-black px-5 py-4 bg-brutal-yellow shrink-0">
              <div>
                <h3 className="font-display text-xl uppercase tracking-wide">
                  {editingExp ? "✏️ Edit Experience" : "➕ Tambah Experience"}
                </h3>
                <p className="font-mono text-xs text-black/70 mt-0.5">
                  {editingExp
                    ? `Mengedit: ${editingExp.role || "(Untitled)"}`
                    : `Membuat entri baru untuk versi ${activeLocale.toUpperCase()}`}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="border-2 border-brutal-black bg-brutal-white p-1.5 hover:bg-brutal-red hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (scrollable) */}
            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              {/* Locale & Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase font-bold mb-1">
                    Locale / Bahasa <span className="text-brutal-red">*</span>
                  </label>
                  <select
                    value={form.locale}
                    onChange={(e) => updateField("locale", e.target.value)}
                    className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                  >
                    <option value="id">🇮🇩 Indonesia (ID)</option>
                    <option value="en">🇬🇧 English (EN)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase font-bold mb-1">
                    Sort Order (Urutan)
                  </label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => updateField("sortOrder", Number(e.target.value))}
                    className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Role / Posisi <span className="text-brutal-red">*</span>
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                  placeholder="Contoh: Junior Software Engineer"
                  autoFocus
                />
              </div>

              {/* Place */}
              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Place / Perusahaan / Organisasi
                </label>
                <input
                  type="text"
                  value={form.place}
                  onChange={(e) => updateField("place", e.target.value)}
                  className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                  placeholder="Contoh: Google Developer Student Club"
                />
              </div>

              {/* Period */}
              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Period / Periode
                </label>
                <input
                  type="text"
                  value={form.period}
                  onChange={(e) => updateField("period", e.target.value)}
                  className="w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                  placeholder="Contoh: Sep 2023 - Present"
                />
              </div>

              {/* Logo */}
              <ImageUploader
                label="Company Logo / Logo Perusahaan"
                currentImage={form.logoPath}
                onUpload={(url: string) => updateField("logoPath", url)}
              />

              {/* Description Points */}
              <div className="border-2 border-brutal-black p-4 bg-brutal-yellow/10 space-y-3">
                <div className="flex items-center justify-between border-b-2 border-brutal-black pb-2">
                  <label className="font-mono text-xs uppercase font-bold">
                    📌 Deskripsi Poin ({form.items.length})
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1 border-2 border-brutal-black bg-brutal-lime px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover transition-all"
                  >
                    <Plus size={13} strokeWidth={3} /> Add Point
                  </button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, j) => (
                    <div key={j} className="flex gap-2">
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => updateItem(j, e.target.value)}
                        className="flex-1 border-2 border-brutal-black bg-brutal-white px-3 py-1.5 font-mono text-xs focus:outline-none focus:shadow-brutal-sm"
                        placeholder="Contoh: Membangun REST API dengan Next.js & Prisma..."
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(j)}
                        className="border-2 border-brutal-black bg-brutal-red text-white px-2.5 font-mono text-xs font-bold hover:bg-black transition-all shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {form.items.length === 0 && (
                    <p className="font-mono text-xs text-black/50 italic py-1">
                      Belum ada poin. Klik + Add Point untuk menambahkan deskripsi pekerjaan.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t-4 border-brutal-black px-5 py-4 bg-brutal-white flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center gap-2 border-2 border-brutal-black bg-brutal-white px-5 py-2.5 font-mono text-sm font-bold uppercase hover:bg-brutal-red hover:text-white transition-colors"
              >
                <X size={15} /> Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 border-3 border-brutal-black bg-brutal-yellow px-6 py-2.5 font-mono text-sm font-bold uppercase shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {saving ? "Menyimpan..." : editingExp ? "Simpan Perubahan" : "Buat Experience"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
