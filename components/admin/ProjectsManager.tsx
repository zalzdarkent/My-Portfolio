"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import ImageUploader from "@/components/admin/ImageUploader";
import TechIcon from "@/components/TechIcon";
import { matchTechSkill, getAllIconNames } from "@/lib/techHelper";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ImageIcon,
  FolderKanban,
  Globe,
  Code2,
  Tag as TagIcon,
  Wrench,
  Languages,
  Save,
  Loader2,
  ExternalLink,
  Zap,
  Search,
} from "lucide-react";

const POPULAR_TECHS = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Laravel",
  "Node.js",
  "PostgreSQL",
  "Docker",
  "Python",
  "MySQL",
  "Vite",
  "PHP",
  "Figma",
  "Prisma",
  "Redis",
];

interface Translation {
  id: number;
  locale: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  features: string;
}

interface Tag {
  id: number;
  tag: string;
}

interface TechItem {
  id: number;
  techName: string;
}

interface ProjectData {
  id: number;
  image: string;
  images: string;
  githubUrl: string;
  liveUrl: string;
  sortOrder: number;
  translations: Translation[];
  tags: Tag[];
  techStack: TechItem[];
}

interface ProjectForm {
  id: number;
  image: string;
  images: string; // JSON string array of URLs
  githubUrl: string;
  liveUrl: string;
  sortOrder: number;
  translations: Translation[];
  tags: Tag[];
  techStack: TechItem[];
  _isNew: boolean;
}

const AVAILABLE_TAGS = ["web", "fullstack", "ai", "ml", "iot", "mobile", "design"];

const DEFAULT_TRANSLATION: Translation = {
  id: 0,
  locale: "en",
  name: "",
  shortDesc: "",
  longDesc: "",
  features: "[]",
};

function createEmptyProject(sortOrder: number): ProjectForm {
  return {
    id: 0,
    image: "",
    images: "[]",
    githubUrl: "",
    liveUrl: "",
    sortOrder,
    translations: [
      { ...DEFAULT_TRANSLATION, locale: "id" },
      { ...DEFAULT_TRANSLATION, locale: "en" },
    ],
    tags: [],
    techStack: [],
    _isNew: true,
  };
}

function parseFeatures(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((f) => typeof f === "string");
  } catch {}
  return [];
}

function serializeFeatures(features: string[]): string {
  return JSON.stringify(features);
}

function parseGalleryImages(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((img) => typeof img === "string");
  } catch {}
  return [];
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formProject, setFormProject] = useState<ProjectForm | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "gallery" | "lang" | "tech">("general");
  const [activeLang, setActiveLang] = useState<"id" | "en">("id");

  // Icon Picker State for Tech Stack
  const pickerRef = useRef<HTMLDivElement>(null);
  const [activePickerIndex, setActivePickerIndex] = useState<number | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");

  // Click outside to close icon picker
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setActivePickerIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerAutoMatchTech = (index: number) => {
    if (!formProject) return;
    const tech = formProject.techStack[index];
    if (!tech.techName.trim()) {
      toast.error("Ketik nama tech terlebih dahulu!");
      return;
    }
    const matched = matchTechSkill(tech.techName);
    if (matched.iconName) {
      toast.success(`Ditemukan icon "${matched.iconName}" untuk "${tech.techName}"`);
    } else {
      toast.error(`Tidak menemukan icon otomatis untuk "${tech.techName}". Gunakan tombol Picker.`);
    }
  };

  const allIcons = getAllIconNames();
  const filteredIcons = pickerSearch.trim()
    ? allIcons.filter((icon) => icon.toLowerCase().includes(pickerSearch.toLowerCase())).slice(0, 36)
    : allIcons.slice(0, 36);

  useEffect(() => {
    fetchProjects();
  }, []);

  // ESC key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      const data: ProjectData[] = await res.json();
      setProjects(data);
    } catch {
      toast.error("Gagal memuat daftar Project");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormProject(createEmptyProject(projects.length + 1));
    setActiveTab("general");
    setActiveLang("id");
    setIsModalOpen(true);
  };

  const openEditModal = (project: ProjectData) => {
    setFormProject({
      id: project.id,
      image: project.image || "",
      images: project.images || "[]",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      sortOrder: project.sortOrder ?? 0,
      translations: [
        project.translations.find((t) => t.locale === "id") || { ...DEFAULT_TRANSLATION, locale: "id" },
        project.translations.find((t) => t.locale === "en") || { ...DEFAULT_TRANSLATION, locale: "en" },
      ],
      tags: [...project.tags],
      techStack: [...project.techStack],
      _isNew: false,
    });
    setActiveTab("general");
    setActiveLang("id");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormProject(null);
  };

  // Form Handlers
  const updateFormField = (field: keyof ProjectForm, value: unknown) => {
    if (!formProject) return;
    setFormProject((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const updateTranslation = (locale: "id" | "en", field: keyof Translation, value: string) => {
    if (!formProject) return;
    setFormProject((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        translations: prev.translations.map((t) =>
          t.locale === locale ? { ...t, [field]: value } : t
        ),
      };
    });
  };

  // Gallery / Slider Images Handlers
  const addGalleryImage = () => {
    if (!formProject) return;
    const current = parseGalleryImages(formProject.images);
    current.push("");
    updateFormField("images", JSON.stringify(current));
  };

  const updateGalleryImage = (index: number, url: string) => {
    if (!formProject) return;
    const current = parseGalleryImages(formProject.images);
    current[index] = url;
    updateFormField("images", JSON.stringify(current));
  };

  const removeGalleryImage = (index: number) => {
    if (!formProject) return;
    const current = parseGalleryImages(formProject.images);
    current.splice(index, 1);
    updateFormField("images", JSON.stringify(current));
  };

  // Tags Handlers
  const toggleTag = (tagValue: string) => {
    if (!formProject) return;
    const exists = formProject.tags.some((t) => t.tag === tagValue);
    if (exists) {
      updateFormField(
        "tags",
        formProject.tags.filter((t) => t.tag !== tagValue)
      );
    } else {
      updateFormField("tags", [...formProject.tags, { id: 0, tag: tagValue }]);
    }
  };

  // Tech Stack Handlers
  const addTechItem = () => {
    if (!formProject) return;
    updateFormField("techStack", [...formProject.techStack, { id: 0, techName: "" }]);
  };

  const updateTechItem = (index: number, value: string) => {
    if (!formProject) return;
    const updated = formProject.techStack.map((t, i) => (i === index ? { ...t, techName: value } : t));
    updateFormField("techStack", updated);
  };

  const removeTechItem = (index: number) => {
    if (!formProject) return;
    updateFormField(
      "techStack",
      formProject.techStack.filter((_, i) => i !== index)
    );
  };

  // Features Handlers
  const addFeature = (locale: "id" | "en") => {
    if (!formProject) return;
    const trans = formProject.translations.find((t) => t.locale === locale);
    const features = parseFeatures(trans?.features || "[]");
    features.push("");
    updateTranslation(locale, "features", serializeFeatures(features));
  };

  const updateFeature = (locale: "id" | "en", index: number, value: string) => {
    if (!formProject) return;
    const trans = formProject.translations.find((t) => t.locale === locale);
    const features = parseFeatures(trans?.features || "[]");
    features[index] = value;
    updateTranslation(locale, "features", serializeFeatures(features));
  };

  const removeFeature = (locale: "id" | "en", index: number) => {
    if (!formProject) return;
    const trans = formProject.translations.find((t) => t.locale === locale);
    const features = parseFeatures(trans?.features || "[]");
    features.splice(index, 1);
    updateTranslation(locale, "features", serializeFeatures(features));
  };

  // Save Handler
  const handleSave = async () => {
    if (!formProject) return;

    const idTrans = formProject.translations.find((t) => t.locale === "id");
    const enTrans = formProject.translations.find((t) => t.locale === "en");

    if (!idTrans?.name.trim() && !enTrans?.name.trim()) {
      toast.error("Nama project tidak boleh kosong!");
      return;
    }

    setSaving(true);
    const isNew = formProject._isNew;

    const payload = {
      image: formProject.image,
      images: formProject.images,
      githubUrl: formProject.githubUrl,
      liveUrl: formProject.liveUrl,
      sortOrder: formProject.sortOrder,
      translations: formProject.translations.map((t) => ({
        locale: t.locale,
        name: t.name,
        shortDesc: t.shortDesc,
        longDesc: t.longDesc,
        features: t.features,
      })),
      tags: formProject.tags.map((t) => ({ tag: t.tag })),
      techStack: formProject.techStack
        .filter((t) => t.techName.trim() !== "")
        .map((t) => ({ techName: t.techName })),
    };

    try {
      const url = isNew
        ? "/api/admin/projects"
        : `/api/admin/projects/${formProject.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success(
        isNew ? "Project baru berhasil dibuat!" : "Project berhasil diperbarui!"
      );
      closeModal();
      await fetchProjects();
    } catch {
      toast.error("Gagal menyimpan project!");
    } finally {
      setSaving(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus project "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Project berhasil dihapus!");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error("Gagal menghapus project!");
    } finally {
      setDeletingId(null);
    }
  };

  const getProjectTitle = (project: ProjectData): string => {
    const idTrans = project.translations.find((t) => t.locale === "id");
    const enTrans = project.translations.find((t) => t.locale === "en");
    return idTrans?.name || enTrans?.name || "(Untitled Project)";
  };

  const getFormTranslation = (locale: "id" | "en"): Translation => {
    if (!formProject) return { ...DEFAULT_TRANSLATION, locale };
    return (
      formProject.translations.find((t) => t.locale === locale) || {
        ...DEFAULT_TRANSLATION,
        locale,
      }
    );
  };

  const getInputClasses =
    "w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm";

  if (loading) {
    return (
      <div className="border-4 border-brutal-black bg-brutal-white p-8 shadow-brutal font-mono text-lg text-center flex items-center justify-center gap-3">
        <Loader2 className="animate-spin text-brutal-yellow" size={24} />
        Loading projects...
      </div>
    );
  }

  return (
    <div className="border-4 border-brutal-black bg-brutal-white shadow-brutal relative">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b-4 border-brutal-black p-4 bg-brutal-yellow">
        <div className="flex items-center gap-3">
          <FolderKanban size={24} className="text-brutal-black" />
          <div>
            <h2 className="font-display text-2xl uppercase tracking-wide">
              Project Manager
            </h2>
            <p className="font-mono text-xs text-black/60">
              Total {projects.length} project tersimpan di portfolio
            </p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 border-3 border-brutal-black bg-brutal-lime px-4 py-2 font-mono text-sm font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <Plus size={18} strokeWidth={3} />
          Add Project
        </button>
      </div>

      {/* Projects Table View */}
      <div className="overflow-x-auto">
        <table className="w-full font-body text-sm border-collapse">
          <thead>
            <tr className="border-b-3 border-brutal-black bg-brutal-yellow/20 font-mono uppercase text-xs">
              <th className="border-r-3 border-brutal-black p-3 text-center w-16">
                Sort
              </th>
              <th className="border-r-3 border-brutal-black p-3 text-left w-24">
                Image
              </th>
              <th className="border-r-3 border-brutal-black p-3 text-left">
                Project Name & Description
              </th>
              <th className="border-r-3 border-brutal-black p-3 text-left hidden md:table-cell">
                Tags & Tech Stack
              </th>
              <th className="p-3 text-center w-36">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-3 divide-brutal-black">
            {projects.map((project) => {
              const title = getProjectTitle(project);
              const idTrans = project.translations.find((t) => t.locale === "id");
              const galleryCount = parseGalleryImages(project.images).length;

              return (
                <tr
                  key={project.id}
                  className="hover:bg-brutal-yellow/10 transition-colors"
                >
                  {/* Sort Order */}
                  <td className="border-r-3 border-brutal-black p-3 text-center font-mono font-bold">
                    #{project.sortOrder}
                  </td>

                  {/* Image Thumbnail */}
                  <td className="border-r-3 border-brutal-black p-2">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={title}
                        className="w-16 h-16 object-cover border-2 border-brutal-black shadow-brutal-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 border-2 border-dashed border-brutal-black bg-brutal-yellow/10 flex flex-col items-center justify-center p-1">
                        <ImageIcon size={16} className="text-black/30" />
                        <span className="font-mono text-[9px] uppercase text-black/40">
                          No img
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Title & Info */}
                  <td className="border-r-3 border-brutal-black p-3">
                    <div className="font-body text-base font-extrabold text-black">
                      {title}
                    </div>
                    {idTrans?.shortDesc && (
                      <p className="font-mono text-xs text-black/60 line-clamp-2 mt-1">
                        {idTrans.shortDesc}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 font-mono text-xs">
                      {galleryCount > 0 && (
                        <span className="bg-brutal-cyan/20 border border-brutal-black px-1.5 py-0.5 text-[10px] uppercase font-bold">
                          📸 {galleryCount} Slider Images
                        </span>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-black/70 hover:text-black underline text-[11px]"
                        >
                          <Code2 size={12} /> GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-black/70 hover:text-black underline text-[11px]"
                        >
                          <Globe size={12} /> Live
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Tags & Tech */}
                  <td className="border-r-3 border-brutal-black p-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.tags.map((t) => (
                        <span
                          key={t.id || t.tag}
                          className="font-mono text-[10px] uppercase border border-brutal-black bg-brutal-lime/40 px-2 py-0.5 font-bold"
                        >
                          {t.tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.map((ts) => {
                        const matched = matchTechSkill(ts.techName);
                        const iconName = matched.iconName || ts.techName;
                        return (
                          <span
                            key={ts.id || ts.techName}
                            className="font-mono text-[10px] border border-brutal-black bg-brutal-white px-1.5 py-0.5 text-black font-bold inline-flex items-center gap-1 shadow-brutal-sm"
                          >
                            <TechIcon name={iconName} className="w-3 h-3" />
                            {ts.techName}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(project)}
                        className="inline-flex items-center gap-1 border-2 border-brutal-black bg-brutal-yellow px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        title="Edit Project"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, title)}
                        disabled={deletingId === project.id}
                        className="inline-flex items-center gap-1 border-2 border-brutal-black bg-brutal-red text-brutal-white px-2.5 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
                        title="Delete Project"
                      >
                        {deletingId === project.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="p-12 text-center font-mono text-brutal-black/50">
            Belum ada project. Klik{" "}
            <span className="font-bold text-black">+ Add Project</span> untuk
            membuat project baru.
          </div>
        )}
      </div>

      {/* ==================== CREATE / EDIT MODAL POPUP ==================== */}
      {isModalOpen && formProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brutal-black/70 backdrop-blur-xs overflow-y-auto">
          <div
            className="w-full max-w-4xl max-h-[90vh] bg-brutal-white border-4 border-brutal-black shadow-brutal flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-4 border-brutal-black p-4 bg-brutal-yellow shrink-0">
              <div className="flex items-center gap-3">
                {formProject._isNew ? (
                  <Plus size={22} strokeWidth={3} className="text-black" />
                ) : (
                  <Pencil size={22} strokeWidth={3} className="text-black" />
                )}
                <div>
                  <h3 className="font-display text-xl uppercase tracking-wide font-extrabold">
                    {formProject._isNew
                      ? "Create New Project"
                      : `Edit Project: ${
                          getFormTranslation("id").name ||
                          getFormTranslation("en").name ||
                          "#" + formProject.id
                        }`}
                  </h3>
                  <p className="font-mono text-xs text-black/60">
                    Isi detail data project di bawah dan klik simpan
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="w-9 h-9 border-3 border-brutal-black bg-brutal-red text-brutal-white flex items-center justify-center font-bold shadow-brutal-sm hover:bg-black transition-colors shrink-0"
                title="Close (ESC)"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b-3 border-brutal-black bg-brutal-yellow/20 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-r-3 border-brutal-black flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === "general"
                    ? "bg-brutal-white text-black border-b-3 border-b-transparent"
                    : "hover:bg-brutal-yellow/30 text-black/70"
                }`}
              >
                <ImageIcon size={14} /> 1. Thumbnail & Links
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("gallery")}
                className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-r-3 border-brutal-black flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === "gallery"
                    ? "bg-brutal-white text-black border-b-3 border-b-transparent"
                    : "hover:bg-brutal-yellow/30 text-black/70"
                }`}
              >
                📸 2. Slider Images ({parseGalleryImages(formProject.images).length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("lang")}
                className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-r-3 border-brutal-black flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === "lang"
                    ? "bg-brutal-white text-black border-b-3 border-b-transparent"
                    : "hover:bg-brutal-yellow/30 text-black/70"
                }`}
              >
                <Languages size={14} /> 3. Text (ID & EN)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tech")}
                className={`px-4 py-2.5 font-mono text-xs font-bold uppercase flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === "tech"
                    ? "bg-brutal-white text-black border-b-3 border-b-transparent"
                    : "hover:bg-brutal-yellow/30 text-black/70"
                }`}
              >
                <Wrench size={14} /> 4. Tags & Tech Stack
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* ================= TAB 1: GENERAL & THUMBNAIL ================= */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  {/* Thumbnail Image Uploader */}
                  <div className="border-3 border-brutal-black p-4 bg-brutal-white">
                    <label className="font-mono text-xs uppercase font-bold block mb-2">
                      🖼️ Main Project Thumbnail Image
                    </label>
                    <ImageUploader
                      currentImage={formProject.image}
                      onUpload={(url) => updateFormField("image", url)}
                      label="Upload gambar thumbnail project dari komputer Anda"
                    />
                  </div>

                  {/* Links & Order Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-mono text-xs uppercase font-bold mb-1 flex items-center gap-1">
                        <Code2 size={14} /> GitHub Repository URL
                      </label>
                      <input
                        type="text"
                        value={formProject.githubUrl}
                        onChange={(e) => updateFormField("githubUrl", e.target.value)}
                        className={getInputClasses}
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs uppercase font-bold mb-1 flex items-center gap-1">
                        <Globe size={14} /> Live Demo URL
                      </label>
                      <input
                        type="text"
                        value={formProject.liveUrl}
                        onChange={(e) => updateFormField("liveUrl", e.target.value)}
                        className={getInputClasses}
                        placeholder="https://my-app.com"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs uppercase font-bold mb-1">
                        Sort Order (Urutan)
                      </label>
                      <input
                        type="number"
                        value={formProject.sortOrder}
                        onChange={(e) => updateFormField("sortOrder", Number(e.target.value))}
                        className={getInputClasses}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: SLIDER IMAGES GALLERY ================= */}
              {activeTab === "gallery" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-brutal-black pb-2">
                    <div>
                      <h4 className="font-mono text-sm uppercase font-bold">
                        Slider / Gallery Images Upload
                      </h4>
                      <p className="font-mono text-xs text-black/60">
                        Upload foto-foto tambahan untuk slider detail project.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addGalleryImage}
                      className="inline-flex items-center gap-1 border-3 border-brutal-black bg-brutal-lime px-3 py-1.5 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      <Plus size={14} strokeWidth={3} />
                      Add Slider Image
                    </button>
                  </div>

                  <div className="space-y-4">
                    {parseGalleryImages(formProject.images).map((imgUrl, gi) => (
                      <div
                        key={gi}
                        className="border-3 border-brutal-black p-4 bg-brutal-white shadow-brutal-sm relative flex flex-col md:flex-row items-start gap-4"
                      >
                        <div className="w-full md:w-48 shrink-0">
                          <ImageUploader
                            compact
                            currentImage={imgUrl}
                            onUpload={(url) => updateGalleryImage(gi, url)}
                            label={`Slider Image #${gi + 1}`}
                          />
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <label className="font-mono text-[11px] uppercase font-bold block text-black/60">
                            Image URL / Direct Link
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={imgUrl}
                              onChange={(e) => updateGalleryImage(gi, e.target.value)}
                              className="flex-1 border-3 border-brutal-black bg-brutal-white px-3 py-1.5 font-mono text-xs focus:outline-none focus:shadow-brutal-sm"
                              placeholder="Atau paste URL image langsung..."
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(gi)}
                              className="border-3 border-brutal-black bg-brutal-red text-brutal-white px-3 py-1.5 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:bg-black transition-all shrink-0 flex items-center gap-1"
                              title="Hapus Image Slider"
                            >
                              <X size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {parseGalleryImages(formProject.images).length === 0 && (
                      <div className="p-8 border-3 border-dashed border-brutal-black text-center font-mono text-xs text-black/50">
                        Belum ada image slider. Klik <strong>+ Add Slider Image</strong> di atas untuk menambah foto ke slider.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ================= TAB 3: TEXT TRANSLATIONS (ID & EN) ================= */}
              {activeTab === "lang" && (
                <div className="space-y-4">
                  {/* Language Tab Switcher */}
                  <div className="flex border-3 border-brutal-black w-fit">
                    <button
                      type="button"
                      onClick={() => setActiveLang("id")}
                      className={`px-4 py-1.5 font-mono text-xs font-bold uppercase transition-colors ${
                        activeLang === "id"
                          ? "bg-brutal-yellow border-r-3 border-brutal-black"
                          : "bg-brutal-white hover:bg-brutal-yellow/20 border-r-3 border-brutal-black"
                      }`}
                    >
                      🇮🇩 Bahasa Indonesia (ID)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLang("en")}
                      className={`px-4 py-1.5 font-mono text-xs font-bold uppercase transition-colors ${
                        activeLang === "en"
                          ? "bg-brutal-yellow"
                          : "bg-brutal-white hover:bg-brutal-yellow/20"
                      }`}
                    >
                      🇬🇧 English (EN)
                    </button>
                  </div>

                  {/* Input Fields for Selected Language */}
                  <div className="border-3 border-brutal-black p-4 space-y-4 bg-brutal-white">
                    <div>
                      <label className="block font-mono text-xs uppercase font-bold mb-1">
                        Project Name ({activeLang.toUpperCase()}) *
                      </label>
                      <input
                        type="text"
                        value={getFormTranslation(activeLang).name}
                        onChange={(e) =>
                          updateTranslation(activeLang, "name", e.target.value)
                        }
                        className={getInputClasses}
                        placeholder={`Nama project dalam ${activeLang === "id" ? "Bahasa Indonesia" : "Bahasa Inggris"}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-xs uppercase font-bold mb-1">
                          Short Description ({activeLang.toUpperCase()})
                        </label>
                        <textarea
                          value={getFormTranslation(activeLang).shortDesc}
                          onChange={(e) =>
                            updateTranslation(activeLang, "shortDesc", e.target.value)
                          }
                          className={`${getInputClasses} resize-y min-h-[90px]`}
                          rows={3}
                          placeholder="Ringkasan singkat tentang project..."
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs uppercase font-bold mb-1">
                          Long Description ({activeLang.toUpperCase()})
                        </label>
                        <textarea
                          value={getFormTranslation(activeLang).longDesc}
                          onChange={(e) =>
                            updateTranslation(activeLang, "longDesc", e.target.value)
                          }
                          className={`${getInputClasses} resize-y min-h-[90px]`}
                          rows={3}
                          placeholder="Penjelasan detail fitur & latar belakang project..."
                        />
                      </div>
                    </div>

                    {/* Features List Section */}
                    <div className="border-2 border-brutal-black p-3 bg-brutal-yellow/10">
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-mono text-xs uppercase font-bold">
                          ✨ Features List ({activeLang.toUpperCase()})
                        </label>
                        <button
                          type="button"
                          onClick={() => addFeature(activeLang)}
                          className="border-2 border-brutal-black bg-brutal-lime px-2.5 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-none transition-all"
                        >
                          + Add Feature
                        </button>
                      </div>
                      <div className="space-y-2">
                        {parseFeatures(getFormTranslation(activeLang).features).map((feat, fi) => (
                          <div key={fi} className="flex gap-2">
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) =>
                                updateFeature(activeLang, fi, e.target.value)
                              }
                              className="flex-1 border-2 border-brutal-black bg-brutal-white px-3 py-1 font-mono text-xs focus:outline-none focus:shadow-brutal-sm"
                              placeholder={`Fitur #${fi + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeFeature(activeLang, fi)}
                              className="border-2 border-brutal-black bg-brutal-red text-brutal-white px-2 font-mono text-xs font-bold shadow-brutal-sm hover:bg-black transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {parseFeatures(getFormTranslation(activeLang).features).length === 0 && (
                          <p className="font-mono text-xs text-black/40">
                            Belum ada fitur ditambahkan.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 4: TAGS & TECH STACK ================= */}
              {activeTab === "tech" && (
                <div className="space-y-6">
                  {/* Category Tags Selector */}
                  <div className="border-3 border-brutal-black p-4 bg-brutal-white">
                    <label className="block font-mono text-xs uppercase font-bold mb-2 flex items-center gap-1">
                      <TagIcon size={14} /> Category Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_TAGS.map((tagValue) => {
                        const isSelected = formProject.tags.some((t) => t.tag === tagValue);
                        return (
                          <button
                            key={tagValue}
                            type="button"
                            onClick={() => toggleTag(tagValue)}
                            className={`border-3 border-brutal-black px-3 py-1.5 font-mono text-xs font-bold uppercase shadow-brutal-sm transition-all ${
                              isSelected
                                ? "bg-brutal-yellow text-black"
                                : "bg-brutal-white hover:bg-brutal-yellow/30 text-black/70"
                            }`}
                          >
                            {isSelected ? "✓ " : "+ "}
                            {tagValue}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tech Stack Manager with Auto Icon Matching & Picker */}
                  <div className="border-3 border-brutal-black p-4 bg-brutal-white space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-brutal-black pb-2">
                      <div>
                        <label className="font-mono text-xs uppercase font-bold flex items-center gap-1">
                          <Wrench size={14} /> Tech Stack Items
                        </label>
                        <p className="font-mono text-[11px] text-black/60 mt-0.5">
                          ⚡ Ketik nama tech (misal: React, Next.js, Tailwind, Laravel) maka Icon terdeteksi otomatis!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addTechItem}
                        className="inline-flex items-center gap-1 border-3 border-brutal-black bg-brutal-lime px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover transition-all self-start sm:self-auto"
                      >
                        <Plus size={14} strokeWidth={3} /> Add Tech
                      </button>
                    </div>

                    {/* Quick Add Popular Tech Chips */}
                    <div className="border-2 border-dashed border-brutal-black p-2.5 bg-brutal-yellow/10">
                      <span className="font-mono text-[10px] uppercase font-bold text-black/70 block mb-1.5">
                        💡 Click to Quick-Add Popular Tech:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_TECHS.map((techName) => {
                          const matched = matchTechSkill(techName);
                          const isAdded = formProject.techStack.some(
                            (t) => t.techName.toLowerCase() === techName.toLowerCase()
                          );
                          return (
                            <button
                              key={techName}
                              type="button"
                              onClick={() => {
                                if (!isAdded) {
                                  updateFormField("techStack", [
                                    ...formProject.techStack,
                                    { id: 0, techName },
                                  ]);
                                }
                              }}
                              className={`inline-flex items-center gap-1 border border-brutal-black px-2 py-0.5 font-mono text-[10px] font-bold transition-all ${
                                isAdded
                                  ? "bg-brutal-black text-brutal-yellow opacity-60 cursor-default"
                                  : "bg-brutal-white hover:bg-brutal-yellow hover:shadow-brutal-sm cursor-pointer"
                              }`}
                            >
                              <TechIcon name={matched.iconName || techName} className="w-3 h-3" />
                              {techName}
                              {!isAdded && "+"}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tech List */}
                    <div className="space-y-2.5">
                      {formProject.techStack.map((tech, ti) => {
                        const matched = matchTechSkill(tech.techName);
                        const iconName = matched.iconName || tech.techName;
                        const color = matched.color || "#FDE047";

                        return (
                          <div key={ti} className="relative">
                            <div className="flex items-center gap-2">
                              {/* Dynamic Icon Badge Preview */}
                              <div
                                className="w-9 h-9 border-2 border-brutal-black flex items-center justify-center shrink-0 shadow-brutal-sm font-bold"
                                style={{
                                  backgroundColor: color,
                                  color: color === "#000000" || color === "#181717" ? "#FFFFFF" : "#000000",
                                }}
                                title={matched.iconName ? `Icon Matched: ${matched.iconName}` : "Icon Preview"}
                              >
                                {iconName ? (
                                  <TechIcon name={iconName} className="w-5 h-5" />
                                ) : (
                                  <span className="font-mono text-xs text-black/40">?</span>
                                )}
                              </div>

                              {/* Input Name */}
                              <input
                                type="text"
                                value={tech.techName}
                                onChange={(e) => updateTechItem(ti, e.target.value)}
                                className="flex-1 border-3 border-brutal-black bg-brutal-white px-3 py-1.5 font-mono text-xs focus:outline-none focus:shadow-brutal-sm"
                                placeholder="Contoh: React, Next.js, Tailwind, Docker..."
                              />

                              {/* Auto Match Button */}
                              <button
                                type="button"
                                onClick={() => triggerAutoMatchTech(ti)}
                                className="border-2 border-brutal-black bg-brutal-yellow px-2.5 py-1.5 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-none transition-all flex items-center gap-1 shrink-0"
                                title="Cocokkan Icon Otomatis"
                              >
                                <Zap size={13} fill="currentColor" />
                                Auto
                              </button>

                              {/* Icon Picker Toggle */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (activePickerIndex === ti) {
                                    setActivePickerIndex(null);
                                  } else {
                                    setActivePickerIndex(ti);
                                    setPickerSearch(tech.techName);
                                  }
                                }}
                                className={`border-2 border-brutal-black px-2.5 py-1.5 font-mono text-xs font-bold uppercase shadow-brutal-sm transition-all shrink-0 flex items-center gap-1 ${
                                  activePickerIndex === ti
                                    ? "bg-brutal-black text-brutal-yellow"
                                    : "bg-brutal-white hover:bg-brutal-yellow/30 text-black"
                                }`}
                                title="Pilih Icon Manual"
                              >
                                <Search size={13} />
                                Picker
                              </button>

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => removeTechItem(ti)}
                                className="border-2 border-brutal-black bg-brutal-red text-brutal-white px-2.5 py-1.5 font-mono text-xs font-bold shadow-brutal-sm hover:bg-black transition-all shrink-0"
                                title="Hapus Item"
                              >
                                <X size={14} />
                              </button>
                            </div>

                            {/* Icon Picker Popover */}
                            {activePickerIndex === ti && (
                              <div
                                ref={pickerRef}
                                className="absolute left-0 top-11 z-50 w-80 border-4 border-brutal-black bg-brutal-white p-3 shadow-brutal space-y-2"
                              >
                                <div className="flex items-center justify-between border-b-2 border-brutal-black pb-2">
                                  <span className="font-mono text-xs font-bold uppercase">
                                    🔍 Select Icon for "{tech.techName || "Tech"}"
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setActivePickerIndex(null)}
                                    className="text-black hover:text-brutal-red"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>

                                <input
                                  type="text"
                                  value={pickerSearch}
                                  onChange={(e) => setPickerSearch(e.target.value)}
                                  placeholder="Search icon (e.g. React, Si, Fa)..."
                                  className="w-full border-2 border-brutal-black px-2 py-1 font-mono text-xs focus:outline-none"
                                  autoFocus
                                />

                                <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto p-1 border border-brutal-black/20 bg-brutal-white">
                                  {filteredIcons.map((icName) => (
                                    <button
                                      key={icName}
                                      type="button"
                                      onClick={() => {
                                        updateTechItem(ti, icName);
                                        setActivePickerIndex(null);
                                      }}
                                      className="border border-brutal-black p-1.5 flex flex-col items-center justify-center hover:bg-brutal-yellow hover:scale-105 transition-all text-black"
                                      title={icName}
                                    >
                                      <TechIcon name={icName} className="w-5 h-5" />
                                    </button>
                                  ))}
                                  {filteredIcons.length === 0 && (
                                    <div className="col-span-6 text-center font-mono text-[10px] text-black/50 py-4">
                                      Icon tidak ditemukan.
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {formProject.techStack.length === 0 && (
                      <p className="font-mono text-xs text-black/40">
                        Belum ada tech stack ditambahkan. Klik <strong>+ Add Tech</strong> atau pilih dari rekomendasi populer di atas.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="flex items-center justify-between border-t-4 border-brutal-black p-4 bg-brutal-yellow/20 shrink-0">
              <button
                type="button"
                onClick={closeModal}
                className="border-3 border-brutal-black bg-brutal-white px-5 py-2 font-mono text-sm font-bold uppercase shadow-brutal-sm hover:bg-brutal-yellow/30 transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 border-3 border-brutal-black bg-brutal-yellow px-6 py-2.5 font-mono text-sm font-bold uppercase shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} strokeWidth={2.5} />
                    {formProject._isNew ? "Create Project" : "Save Changes"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
