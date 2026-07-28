import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";

export interface KnownTech {
  name: string;
  iconName: string;
  color: string;
}

// Popular tech dictionary for instant auto-filling name -> icon & color
export const KNOWN_TECHS: Record<string, { iconName: string; color: string }> = {
  react: { iconName: "FaReact", color: "#4fb7fd" },
  "react.js": { iconName: "FaReact", color: "#4fb7fd" },
  reactjs: { iconName: "FaReact", color: "#4fb7fd" },
  "next.js": { iconName: "SiNextdotjs", color: "#000000" },
  nextjs: { iconName: "SiNextdotjs", color: "#000000" },
  next: { iconName: "SiNextdotjs", color: "#000000" },
  typescript: { iconName: "SiTypescript", color: "#2ea8fa" },
  ts: { iconName: "SiTypescript", color: "#2ea8fa" },
  javascript: { iconName: "SiJavascript", color: "#f7df1e" },
  js: { iconName: "SiJavascript", color: "#f7df1e" },
  "node.js": { iconName: "FaNodeJs", color: "#0fbf09" },
  nodejs: { iconName: "FaNodeJs", color: "#0fbf09" },
  node: { iconName: "FaNodeJs", color: "#0fbf09" },
  postgresql: { iconName: "SiPostgresql", color: "#06469b" },
  postgres: { iconName: "SiPostgresql", color: "#06469b" },
  mysql: { iconName: "SiMysql", color: "#00758f" },
  mongodb: { iconName: "SiMongodb", color: "#47a248" },
  mongo: { iconName: "SiMongodb", color: "#47a248" },
  redis: { iconName: "SiRedis", color: "#d50a0a" },
  docker: { iconName: "SiDocker", color: "#1b83c9" },
  "tailwind css": { iconName: "SiTailwindcss", color: "#3aa3e9" },
  tailwindcss: { iconName: "SiTailwindcss", color: "#3aa3e9" },
  tailwind: { iconName: "SiTailwindcss", color: "#3aa3e9" },
  git: { iconName: "SiGit", color: "#d51a1a" },
  github: { iconName: "FaGithub", color: "#181717" },
  laravel: { iconName: "FaLaravel", color: "#e31a1a" },
  codeigniter: { iconName: "SiCodeigniter", color: "#f12f2f" },
  python: { iconName: "FaPython", color: "#3776ab" },
  php: { iconName: "FaPhp", color: "#777bb4" },
  "vue.js": { iconName: "SiVuedotjs", color: "#4fc08d" },
  vuejs: { iconName: "SiVuedotjs", color: "#4fc08d" },
  vue: { iconName: "SiVuedotjs", color: "#4fc08d" },
  angular: { iconName: "SiAngular", color: "#dd0031" },
  svelte: { iconName: "SiSvelte", color: "#ff3e00" },
  express: { iconName: "SiExpress", color: "#000000" },
  "express.js": { iconName: "SiExpress", color: "#000000" },
  nestjs: { iconName: "SiNestjs", color: "#e0234e" },
  nest: { iconName: "SiNestjs", color: "#e0234e" },
  fastapi: { iconName: "SiFastapi", color: "#009688" },
  django: { iconName: "SiDjango", color: "#092e20" },
  springboot: { iconName: "SiSpringboot", color: "#6db33f" },
  spring: { iconName: "SiSpringboot", color: "#6db33f" },
  prisma: { iconName: "SiPrisma", color: "#2d3748" },
  figma: { iconName: "SiFigma", color: "#f24e1e" },
  java: { iconName: "FaJava", color: "#5382a1" },
  kotlin: { iconName: "SiKotlin", color: "#7f52ff" },
  swift: { iconName: "SiSwift", color: "#f05138" },
  flutter: { iconName: "SiFlutter", color: "#02569b" },
  dart: { iconName: "SiDart", color: "#0175c2" },
  go: { iconName: "SiGo", color: "#00add8" },
  golang: { iconName: "SiGo", color: "#00add8" },
  rust: { iconName: "FaRust", color: "#000000" },
  graphql: { iconName: "SiGraphql", color: "#e10098" },
  aws: { iconName: "FaAws", color: "#ff9900" },
  firebase: { iconName: "SiFirebase", color: "#ffca28" },
  supabase: { iconName: "SiSupabase", color: "#3ecf8e" },
  nginx: { iconName: "SiNginx", color: "#009639" },
  linux: { iconName: "FaLinux", color: "#fcc624" },
  sass: { iconName: "SiSass", color: "#cc6699" },
  scss: { iconName: "SiSass", color: "#cc6699" },
  bootstrap: { iconName: "SiBootstrap", color: "#7952b3" },
  wordpress: { iconName: "FaWordpress", color: "#21759b" },
  vite: { iconName: "SiVite", color: "#646cff" },
  webpack: { iconName: "SiWebpack", color: "#8dd6f9" },
  turborepo: { iconName: "SiTurborepo", color: "#ef4444" },
  bun: { iconName: "SiBun", color: "#fbf0df" },
  kubernetes: { iconName: "SiKubernetes", color: "#326ce5" },
  k8s: { iconName: "SiKubernetes", color: "#326ce5" },
  android: { iconName: "FaAndroid", color: "#34a853" },
  ios: { iconName: "FaApple", color: "#000000" },
  apple: { iconName: "FaApple", color: "#000000" },
  html: { iconName: "FaHtml5", color: "#e34f26" },
  html5: { iconName: "FaHtml5", color: "#e34f26" },
  css: { iconName: "FaCss3Alt", color: "#1572b6" },
  css3: { iconName: "FaCss3Alt", color: "#1572b6" },
};

// Auto-detect icon and color by skill name
export function matchTechSkill(name: string): { iconName?: string; color?: string } {
  if (!name) return {};
  const normalized = name.trim().toLowerCase();

  // 1. Direct dictionary match
  if (KNOWN_TECHS[normalized]) {
    return KNOWN_TECHS[normalized];
  }

  // 2. Fuzzy match in dictionary keys
  const cleanName = normalized.replace(/[^a-z0-9]/g, "");
  for (const key in KNOWN_TECHS) {
    const cleanKey = key.replace(/[^a-z0-9]/g, "");
    if (cleanKey === cleanName || cleanKey.includes(cleanName) || cleanName.includes(cleanKey)) {
      return KNOWN_TECHS[key];
    }
  }

  // 3. Fallback search in react-icons exports directly
  const faKeys = Object.keys(FaIcons);
  const siKeys = Object.keys(SiIcons);

  // Search Si icons first (Si<CleanName>)
  const siCandidate = siKeys.find((k) => k.toLowerCase() === `si${cleanName}`);
  if (siCandidate) return { iconName: siCandidate };

  // Search Fa icons (Fa<CleanName>)
  const faCandidate = faKeys.find((k) => k.toLowerCase() === `fa${cleanName}`);
  if (faCandidate) return { iconName: faCandidate };

  // Partial match in Si keys
  const siPartial = siKeys.find((k) => k.toLowerCase().includes(cleanName));
  if (siPartial) return { iconName: siPartial };

  // Partial match in Fa keys
  const faPartial = faKeys.find((k) => k.toLowerCase().includes(cleanName));
  if (faPartial) return { iconName: faPartial };

  return {};
}

// Get all icon options for searchable dropdown picker
let cachedIconList: string[] | null = null;
export function getAllIconNames(): string[] {
  if (!cachedIconList) {
    const faList = Object.keys(FaIcons).filter((k) => k.startsWith("Fa"));
    const siList = Object.keys(SiIcons).filter((k) => k.startsWith("Si"));
    cachedIconList = [...siList, ...faList];
  }
  return cachedIconList;
}
