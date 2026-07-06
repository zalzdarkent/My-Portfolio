// ─── Types ────────────────────────────────────────────────────────────────────

export type Tag = "web" | "iot" | "ai" | "ml" | "fullstack";

export interface Project {
  id: number;
  tags: Tag[];
  image: string;
  tech: string[];
  github: string;
  live: string;
}

export interface Tech {
  icon: string;
  name: string;
  level: "Expert" | "Advanced" | "Intermediate";
}

export interface Testimonial {
  id: number;
  avatar?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
]; 

// ─── Data ─────────────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: 1,
    tags: ["web", "fullstack"],
    image: "/projects/onlinetest.png",
    tech: ["Laravel", "React", "Inertia.js", "Tailwind CSS", "Shadcn", "MySQL", "Docker"],
    github: "https://github.com/zalzdarkent/tes_online_unsika",
    live: "https://onlinetest.unsika.ac.id",
  },
  {
    id: 2,
    tags: ["web", "fullstack"],
    image: "/projects/absen_aslab.png",         
    tech: ["Laravel", "React", "Inertia.js", "Tailwind CSS", "Shadcn", "MySQL", "Docker"],
    github: "https://github.com/zalzdarkent/absensi_aslab_react",
    live: "http://aslab.my.id",
  },
  {
    id: 3,
    tags: ["ai", "ml"],
    image: "/projects/deteksi-apd.png",
    tech: ["Python", "OpenCV", "Yolo", "Flask", "ONNX"],
    github: "https://github.com/zalzdarkent/deteksi_apd_next",
    live: "",
  },
  {
    id: 4,
    tags: ["web", "fullstack"],
    image: "/projects/spicyplay.png",
    tech: ["React", "Vite", "Tailwind CSS"],
    github: "https://github.com/zalzdarkent/synth-groovebox", 
    live: "",
  },
  {
    id: 5,
    tags: ["web", "fullstack"],
    image: "/projects/monitoring_cctv.png",
    tech: ["PHP", "SQLSRV", "Bootstrap", "Jquery", "Javascript"],
    github: "", 
    live: "",
  },
  {
    id: 6,
    tags: ["web", "iot"],
    image: "/projects/grinding-monitoring.png",
    tech: ["PHP", "postgreSQL", "SQLSRV", "Bootstrap", "Jquery", "Javascript"],
    github: "", 
    live: "",
  },
];

export const NAV_LINKS = [
  { href: "#home",       key: "home" },
  { href: "#about",      key: "about" },
  { href: "#tech",       key: "tech" },
  { href: "#projects",  key: "projects" },
  { href: "#pengalaman", key: "experience" },
  { href: "#education",  key: "education" },
  { href: "#contact",    key: "contact" },
];

export const FILTER_OPTIONS: { key: string; value: string }[] = [
  { key: "all",       value: "all" },
  { key: "web",       value: "web" },
  { key: "iot",    value: "iot" },
  { key: "ai",        value: "ai" },
  { key: "fullstack", value: "fullstack" },
];
