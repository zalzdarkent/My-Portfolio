"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/admin/ImageUploader";

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
  githubUrl: string;
  liveUrl: string;
  sortOrder: number;
  translations: Translation[];
  tags: Tag[];
  techStack: TechItem[];
  _isNew: boolean;
  _expanded: boolean;
}

const AVAILABLE_TAGS = ["web", "fullstack", "ai", "ml", "iot", "mobile"];

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
    _expanded: true,
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

export default function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [activeLangTab, setActiveLangTab] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((data: ProjectData[]) => {
        setProjects(
          data.map((p) => ({ ...p, _isNew: false, _expanded: false }))
        );
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load projects");
        setLoading(false);
      });
  }, []);

  const updateProject = (index: number, field: string, value: unknown) => {
    setProjects((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const updateTranslation = (
    projIndex: number,
    locale: string,
    field: keyof Translation,
    value: string
  ) => {
    setProjects((prev) =>
      prev.map((p, i) =>
        i === projIndex
          ? {
              ...p,
              translations: p.translations.map((t) =>
                t.locale === locale ? { ...t, [field]: value } : t
              ),
            }
          : p
      )
    );
  };

  const toggleExpanded = (index: number) => {
    setProjects((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, _expanded: !p._expanded } : p
      )
    );
  };

  const addProject = () => {
    setProjects((prev) => [createEmptyProject(prev.length), ...prev]);
  };

  const toggleTag = (projIndex: number, tagValue: string) => {
    setProjects((prev) =>
      prev.map((p, i) => {
        if (i !== projIndex) return p;
        const exists = p.tags.some((t) => t.tag === tagValue);
        if (exists) {
          return { ...p, tags: p.tags.filter((t) => t.tag !== tagValue) };
        }
        return { ...p, tags: [...p.tags, { id: 0, tag: tagValue }] };
      })
    );
  };

  const addTechItem = (projIndex: number) => {
    setProjects((prev) =>
      prev.map((p, i) =>
        i === projIndex
          ? { ...p, techStack: [...p.techStack, { id: 0, techName: "" }] }
          : p
      )
    );
  };

  const updateTechItem = (
    projIndex: number,
    techIndex: number,
    value: string
  ) => {
    setProjects((prev) =>
      prev.map((p, i) =>
        i === projIndex
          ? {
              ...p,
              techStack: p.techStack.map((t, j) =>
                j === techIndex ? { ...t, techName: value } : t
              ),
            }
          : p
      )
    );
  };

  const removeTechItem = (projIndex: number, techIndex: number) => {
    setProjects((prev) =>
      prev.map((p, i) =>
        i === projIndex
          ? { ...p, techStack: p.techStack.filter((_, j) => j !== techIndex) }
          : p
      )
    );
  };

  const addFeature = (projIndex: number, locale: string) => {
    setProjects((prev) =>
      prev.map((p, i) => {
        if (i !== projIndex) return p;
        return {
          ...p,
          translations: p.translations.map((t) => {
            if (t.locale !== locale) return t;
            const features = parseFeatures(t.features);
            features.push("");
            return { ...t, features: serializeFeatures(features) };
          }),
        };
      })
    );
  };

  const updateFeature = (
    projIndex: number,
    locale: string,
    featureIndex: number,
    value: string
  ) => {
    setProjects((prev) =>
      prev.map((p, i) => {
        if (i !== projIndex) return p;
        return {
          ...p,
          translations: p.translations.map((t) => {
            if (t.locale !== locale) return t;
            const features = parseFeatures(t.features);
            features[featureIndex] = value;
            return { ...t, features: serializeFeatures(features) };
          }),
        };
      })
    );
  };

  const removeFeature = (projIndex: number, locale: string, featureIndex: number) => {
    setProjects((prev) =>
      prev.map((p, i) => {
        if (i !== projIndex) return p;
        return {
          ...p,
          translations: p.translations.map((t) => {
            if (t.locale !== locale) return t;
            const features = parseFeatures(t.features);
            features.splice(featureIndex, 1);
            return { ...t, features: serializeFeatures(features) };
          }),
        };
      })
    );
  };

  const handleSave = async (index: number) => {
    const project = projects[index];
    const isNew = project._isNew;
    setSavingId(project.id || `new-${index}`);
    setMessage("");

    const payload = {
      image: project.image,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      sortOrder: project.sortOrder,
      translations: project.translations.map((t) => ({
        locale: t.locale,
        name: t.name,
        shortDesc: t.shortDesc,
        longDesc: t.longDesc,
        features: t.features,
      })),
      tags: project.tags.map((t) => ({ tag: t.tag })),
      techStack: project.techStack
        .filter((t) => t.techName.trim() !== "")
        .map((t) => ({ techName: t.techName })),
    };

    try {
      const url = isNew
        ? "/api/admin/projects"
        : `/api/admin/projects/${project.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved: ProjectData = await res.json();
      setProjects((prev) =>
        prev.map((p, i) =>
          i === index ? { ...saved, _isNew: false, _expanded: true } : p
        )
      );
      setMessage(isNew ? "Project created!" : "Project updated!");
    } catch {
      setMessage("Failed to save project");
    } finally {
      setSavingId(null);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleDelete = async (index: number) => {
    const project = projects[index];
    if (project._isNew) {
      setProjects((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    if (!confirm("Delete this project?")) return;

    setDeletingId(project.id);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setProjects((prev) => prev.filter((_, i) => i !== index));
      setMessage("Project deleted!");
    } catch {
      setMessage("Failed to delete project");
    } finally {
      setDeletingId(null);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const getTranslation = (project: ProjectForm, locale: string): Translation => {
    return (
      project.translations.find((t) => t.locale === locale) || {
        ...DEFAULT_TRANSLATION,
        locale,
      }
    );
  };

  const getProjectName = (project: ProjectForm): string => {
    const idTrans = getTranslation(project, "id");
    const enTrans = getTranslation(project, "en");
    return idTrans.name || enTrans.name || "(untitled)";
  };

  const getInputClasses =
    "w-full border-3 border-brutal-black bg-brutal-white px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-brutal-sm";

  if (loading) {
    return (
      <div className="border-4 border-brutal-black bg-brutal-white p-8 shadow-brutal font-mono text-lg text-center">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="border-4 border-brutal-black bg-brutal-white shadow-brutal">
      <div className="flex items-center justify-between border-b-4 border-brutal-black p-4 bg-brutal-yellow">
        <h2 className="font-display text-2xl uppercase tracking-wide">
          Projects
        </h2>
        <button
          onClick={addProject}
          className="border-3 border-brutal-black bg-brutal-lime px-4 py-2 font-mono text-sm font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          + Add Project
        </button>
      </div>

      <div className="divide-y-3 divide-brutal-black">
        {projects.map((project, i) => {
          const langTab = activeLangTab[project.id || i] || "id";
          const idTrans = getTranslation(project, "id");
          const enTrans = getTranslation(project, "en");
          const features = parseFeatures(
            getTranslation(project, langTab).features
          );

          return (
            <div key={project.id || `new-${i}`}>
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-brutal-yellow/20 transition-colors"
                onClick={() => toggleExpanded(i)}
              >
                <span className="font-mono text-lg font-bold shrink-0">
                  {project._expanded ? "▼" : "▶"}
                </span>

                {project.image ? (
                  <img
                    src={project.image}
                    alt=""
                    className="w-14 h-14 object-cover border-3 border-brutal-black shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 border-3 border-brutal-black bg-brutal-yellow/20 flex items-center justify-center shrink-0">
                    <span className="font-mono text-[10px] uppercase text-black/30">
                      No img
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-body text-lg truncate">
                      {getProjectName(project)}
                    </span>
                    {project._isNew && (
                      <span className="font-mono text-xs border-3 border-brutal-black bg-brutal-orange text-brutal-white px-2 py-0.5">
                        NEW
                      </span>
                    )}
                    <span className="font-mono text-xs border-3 border-brutal-black px-2 py-0.5 bg-brutal-white">
                      #{project.sortOrder}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {project.tags.map((tag) => (
                      <span
                        key={tag.id || tag.tag}
                        className="font-mono text-[11px] uppercase border-2 border-brutal-black px-2 py-0.5 bg-brutal-lime/30"
                      >
                        {tag.tag}
                      </span>
                    ))}
                    {project.techStack.length > 0 && (
                      <span className="font-mono text-[11px] text-black/50">
                        {project.techStack.map((t) => t.techName).join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(i);
                  }}
                  disabled={deletingId === project.id}
                  className="border-3 border-brutal-black bg-brutal-red text-brutal-white px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50 shrink-0"
                >
                  {deletingId === project.id ? "..." : "Delete"}
                </button>
              </div>

              {project._expanded && (
                <div className="border-t-3 border-brutal-black bg-brutal-white p-4">
                  <div className="mb-4">
                    <ImageUploader
                      currentImage={project.image}
                      onUpload={(url) => updateProject(i, "image", url)}
                      label="Project Image"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block font-mono text-xs uppercase font-bold mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="text"
                        value={project.githubUrl}
                        onChange={(e) =>
                          updateProject(i, "githubUrl", e.target.value)
                        }
                        className={getInputClasses}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs uppercase font-bold mb-1">
                        Live URL
                      </label>
                      <input
                        type="text"
                        value={project.liveUrl}
                        onChange={(e) =>
                          updateProject(i, "liveUrl", e.target.value)
                        }
                        className={getInputClasses}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs uppercase font-bold mb-1">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={project.sortOrder}
                        onChange={(e) =>
                          updateProject(i, "sortOrder", Number(e.target.value))
                        }
                        className={getInputClasses}
                      />
                    </div>
                  </div>

                  <div className="mb-4 border-3 border-brutal-black">
                    <div className="flex border-b-3 border-brutal-black bg-brutal-yellow/30">
                      <button
                        onClick={() =>
                          setActiveLangTab((prev) => ({
                            ...prev,
                            [project.id || i]: "id",
                          }))
                        }
                        className={`px-4 py-2 font-mono text-sm font-bold uppercase transition-colors ${
                          langTab === "id"
                            ? "bg-brutal-yellow border-r-3 border-brutal-black"
                            : "hover:bg-brutal-yellow/20"
                        }`}
                      >
                        ID
                      </button>
                      <button
                        onClick={() =>
                          setActiveLangTab((prev) => ({
                            ...prev,
                            [project.id || i]: "en",
                          }))
                        }
                        className={`px-4 py-2 font-mono text-sm font-bold uppercase transition-colors ${
                          langTab === "en"
                            ? "bg-brutal-yellow border-r-3 border-brutal-black"
                            : "hover:bg-brutal-yellow/20"
                        }`}
                      >
                        EN
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                          <label className="block font-mono text-xs uppercase font-bold mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={getTranslation(project, langTab).name}
                            onChange={(e) =>
                              updateTranslation(
                                i,
                                langTab,
                                "name",
                                e.target.value
                              )
                            }
                            className={getInputClasses}
                            placeholder="Project name"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-xs uppercase font-bold mb-1">
                            Short Description
                          </label>
                          <textarea
                            value={getTranslation(project, langTab).shortDesc}
                            onChange={(e) =>
                              updateTranslation(
                                i,
                                langTab,
                                "shortDesc",
                                e.target.value
                              )
                            }
                            className={`${getInputClasses} resize-y min-h-[80px]`}
                            rows={3}
                            placeholder="Brief project summary"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-xs uppercase font-bold mb-1">
                            Long Description
                          </label>
                          <textarea
                            value={getTranslation(project, langTab).longDesc}
                            onChange={(e) =>
                              updateTranslation(
                                i,
                                langTab,
                                "longDesc",
                                e.target.value
                              )
                            }
                            className={`${getInputClasses} resize-y min-h-[80px]`}
                            rows={3}
                            placeholder="Detailed project description"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-mono text-xs uppercase font-bold">
                            Features
                          </label>
                          <button
                            onClick={() => addFeature(i, langTab)}
                            className="border-3 border-brutal-black bg-brutal-lime px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                          >
                            + Add Feature
                          </button>
                        </div>
                        <div className="space-y-2">
                          {features.map((feat, fi) => (
                            <div key={fi} className="flex gap-2">
                              <input
                                type="text"
                                value={feat}
                                onChange={(e) =>
                                  updateFeature(i, langTab, fi, e.target.value)
                                }
                                className="flex-1 border-3 border-brutal-black bg-brutal-white px-3 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                                placeholder="Feature description"
                              />
                              <button
                                onClick={() => removeFeature(i, langTab, fi)}
                                className="border-3 border-brutal-black bg-brutal-red text-brutal-white px-2 font-mono text-xs font-bold shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                              >
                                X
                              </button>
                            </div>
                          ))}
                          {features.length === 0 && (
                            <span className="font-mono text-xs text-black/40">
                              No features added yet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 border-3 border-brutal-black p-4">
                    <label className="block font-mono text-xs uppercase font-bold mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_TAGS.map((tagValue) => {
                        const isSelected = project.tags.some(
                          (t) => t.tag === tagValue
                        );
                        return (
                          <button
                            key={tagValue}
                            onClick={() => toggleTag(i, tagValue)}
                            className={`border-3 border-brutal-black px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm transition-all ${
                              isSelected
                                ? "bg-brutal-yellow"
                                : "bg-brutal-white hover:bg-brutal-yellow/30"
                            }`}
                          >
                            {isSelected ? "✓ " : ""}
                            {tagValue}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-4 border-3 border-brutal-black p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-mono text-xs uppercase font-bold">
                        Tech Stack
                      </label>
                      <button
                        onClick={() => addTechItem(i)}
                        className="border-3 border-brutal-black bg-brutal-lime px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                      >
                        + Add Tech
                      </button>
                    </div>
                    <div className="space-y-2">
                      {project.techStack.map((tech, ti) => (
                        <div key={ti} className="flex gap-2">
                          <input
                            type="text"
                            value={tech.techName}
                            onChange={(e) => updateTechItem(i, ti, e.target.value)}
                            className="flex-1 border-3 border-brutal-black bg-brutal-white px-3 py-1 font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                            placeholder="e.g. React, Next.js, TypeScript"
                          />
                          <button
                            onClick={() => removeTechItem(i, ti)}
                            className="border-3 border-brutal-black bg-brutal-red text-brutal-white px-2 font-mono text-xs font-bold shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                          >
                            X
                          </button>
                        </div>
                      ))}
                      {project.techStack.length === 0 && (
                        <span className="font-mono text-xs text-black/40">
                          No tech stack items yet
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSave(i)}
                    disabled={savingId === (project.id || `new-${i}`)}
                    className="border-3 border-brutal-black bg-brutal-yellow px-6 py-2 font-mono text-sm font-bold uppercase shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingId === (project.id || `new-${i}`)
                      ? "Saving..."
                      : project._isNew
                        ? "Create Project"
                        : "Save Project"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="p-6 text-center font-mono text-brutal-black/50">
          No projects yet. Click + Add Project to begin.
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
