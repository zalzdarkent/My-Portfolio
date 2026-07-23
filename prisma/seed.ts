import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── Clean all tables ────────────────────────────────────────────────────
  console.log("🧹 Cleaning existing data...");

  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE "education_highlights" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "education_entries" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "experience_items" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "experiences" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "project_tech" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "project_tags" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "project_translations" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "projects" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "hero_content" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "about_content" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "tech_skills" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "work_habits" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "snapshot_items" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "competencies" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "achievements" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "contact_content" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "contact_links" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "marquee_items" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "footer_content" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "site_settings" CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE`,
  ]);

  console.log("✅ All tables truncated.\n");

  // ─── Admin User ──────────────────────────────────────────────────────────
  console.log("👤 Creating admin user...");
  const passwordHash = await bcrypt.hash("admin123", 10);
  const user = await prisma.user.create({
    data: {
      username: "admin",
      passwordHash,
      displayName: "Alif Fadillah Ummar",
    },
  });
  console.log(`   ✔ User created: ${user.username}\n`);

  // ─── Hero Content ────────────────────────────────────────────────────────
  console.log("🦸 Seeding hero content...");
  await prisma.heroContent.createMany({
    data: [
      {
        locale: "id",
        greeting: "HALO!!",
        nameLabel: "SAYA",
        description:
          "Full Stack Developer dengan semangat membangun produk digital yang berdampak. Spesialis Laravel, React, Next.js, CodeIgniter, dan Node.js dengan 3+ tahun pengalaman nyata.",
        btnProject: "Lihat Proyek →",
        btnContact: "Hubungi Saya",
        status: "Tersedia untuk Proyek",
        stickerExp: "3+ YRS EXP",
        stickerOpen: "OPEN TO WORK!",
        availableText: "✦ Available for",
      },
      {
        locale: "en",
        greeting: "HELLO!!",
        nameLabel: "I'M",
        description:
          "Full Stack Developer passionate about building impactful digital products. Specialist in Laravel, React, Next.js, CodeIgniter, and Node.js with 3+ years of real experience.",
        btnProject: "View Projects →",
        btnContact: "Contact Me",
        status: "Available for Projects",
        stickerExp: "3+ YRS EXP",
        stickerOpen: "OPEN TO WORK!",
        availableText: "✦ Available for",
      },
    ],
  });
  console.log("   ✔ 2 hero locales created\n");

  // ─── About Content ───────────────────────────────────────────────────────
  console.log("📖 Seeding about content...");
  await prisma.aboutContent.createMany({
    data: [
      {
        locale: "id",
        title: "TENTANG SAYA",
        description:
          "Saya adalah seorang Full Stack Developer dengan pengalaman lebih dari 3 tahun dalam membangun aplikasi web yang inovatif dan efisien. Keahlian saya meliputi Laravel, React, Next.js, CodeIgniter, dan Node.js. Saya memiliki rekam jejak yang terbukti dalam mengembangkan solusi digital yang berdampak, bekerja sama dengan tim lintas fungsi untuk mencapai hasil yang luar biasa.",
        btnLabel: "Lihat CV",
        cvModalTitle: "CURRICULUM VITAE",
        cvModalDownload: "⬇ Unduh",
      },
      {
        locale: "en",
        title: "ABOUT ME",
        description:
          "I am a Full Stack Developer with over 3 years of experience in building innovative and efficient web applications. My expertise includes Laravel, React, Next.js, CodeIgniter, and Node.js. I have a proven track record of developing impactful digital solutions, collaborating with cross-functional teams to achieve outstanding results.",
        btnLabel: "View CV",
        cvModalTitle: "CURRICULUM VITAE",
        cvModalDownload: "⬇ Download",
      },
    ],
  });
  console.log("   ✔ 2 about locales created\n");

  // ─── Projects ────────────────────────────────────────────────────────────
  console.log("🚀 Seeding projects...");

  const projectsData = [
    {
      image: "/projects/onlinetest.png",
      githubUrl: "https://github.com/zalzdarkent/tes_online_unsika",
      liveUrl: "https://onlinetest.unsika.ac.id",
      sortOrder: 1,
      tags: ["web", "fullstack"],
      tech: ["Laravel", "React", "Inertia.js", "Tailwind CSS", "Shadcn", "MySQL", "Docker"],
      id: {
        name: "Tes SEP-T UNSIKA",
        shortDesc: "Platform tes SEP-T (Singaperbangsa English Proficiency Test) berbasis web untuk mahasiswa UNSIKA.",
        longDesc: "Sistem Tes Online UNSIKA adalah platform komprehensif yang dirancang khusus untuk mendukung proses evaluasi dan ujian di lingkungan Universitas Singaperbangsa Karawang. Dibangun dengan teknologi terdepan, sistem ini menawarkan pengalaman tes online yang aman, efisien, dan user-friendly.",
        features: JSON.stringify([
          "Manajemen Kategori Tes & Penjadwalan Fleksibel",
          "Sistem Soal Canggih (Pilihan Ganda, Esai, Skala Likert, & Rumus LaTeX)",
          "Media Pendukung (Upload Audio & Gambar untuk Soal)",
          "Keamanan Ujian (Anti-Cheating Deteksi Tab & Sesi Terkunci)",
          "Sistem Auto-Save Jawaban & Timer Real-time",
          "Dashboard Analytics & Scoring Otomatis untuk Soal Objektif",
          "Panel Koreksi Manual Khusus Soal Esai",
        ]),
      },
      en: {
        name: "UNSIKA SEP-T Test",
        shortDesc: "Web-based SEP-T (Singaperbangsa English Proficiency Test) platform for UNSIKA students.",
        longDesc: "UNSIKA Online Test System is a comprehensive platform designed to support evaluation and examination processes at Universitas Singaperbangsa Karawang. Built with modern technology, offering a secure, efficient, and user-friendly online testing experience.",
        features: JSON.stringify([
          "Test Category Management & Flexible Scheduling",
          "Advanced Question System (Multiple Choice, Essay, Likert Scale, & LaTeX Formula)",
          "Supporting Media (Audio & Image Upload for Questions)",
          "Exam Security (Anti-Cheating Tab Detection & Locked Session)",
          "Auto-Save Answer System & Real-time Timer",
          "Analytics Dashboard & Auto-Scoring for Objective Questions",
          "Manual Correction Panel for Essay Questions",
        ]),
      },
    },
    {
      image: "/projects/absen_aslab.png",
      githubUrl: "https://github.com/zalzdarkent/tes_online_unsika",
      liveUrl: "https://onlinetest.unsika.ac.id",
      sortOrder: 2,
      tags: ["web", "fullstack"],
      tech: ["Laravel", "React", "Inertia.js", "Tailwind CSS", "Shadcn", "MySQL", "Docker"],
      id: {
        name: "Absen Asisten Lab",
        shortDesc: "Platform asisten laboratorium berbasis web untuk asisten laboratorium Fakultas Ilmu Komputer Universitas Singaperbangsa Karawang.",
        longDesc: "Sistem manajemen asisten lab yang di dalamnya terdapat beberapa fitur seperti manajemen data asisten lab, manajemen inventaris lab, manajemen jadwal piket asisten lab, serta fitur absensi piket asisten lab yang sudah terintegrasi dengan RFID untuk memudahkan proses absensi.",
        features: JSON.stringify([
          "Manajemen Data Asisten Lab",
          "Manajemen Inventaris Lab",
          "Manajemen Jadwal Piket",
          "Absensi Terintegrasi RFID",
          "Notifikasi Pengingat Piket",
          "Laporan Kehadiran Asisten Lab",
        ]),
      },
      en: {
        name: "Lab Assistant Attendance",
        shortDesc: "Web-based laboratory assistant platform for the Faculty of Computer Science at Universitas Singaperbangsa Karawang.",
        longDesc: "Lab assistant management system featuring assistant data management, lab inventory management, duty schedule management, and RFID-integrated attendance system to simplify the attendance process.",
        features: JSON.stringify([
          "Lab Assistant Data Management",
          "Lab Inventory Management",
          "Duty Schedule Management",
          "RFID-Integrated Attendance",
          "Duty Reminder Notifications",
          "Lab Assistant Attendance Reports",
        ]),
      },
    },
    {
      image: "/projects/deteksi-apd.png",
      githubUrl: "https://github.com/zalzdarkent/tes_online_unsika",
      liveUrl: "https://onlinetest.unsika.ac.id",
      sortOrder: 3,
      tags: ["ai", "ml"],
      tech: ["Python", "OpenCV", "Yolo", "Flask", "ONNX"],
      id: {
        name: "Deteksi APD Karyawan",
        shortDesc: "Sistem deteksi APD karyawan berbasis AI untuk memastikan kepatuhan terhadap protokol keselamatan di tempat kerja.",
        longDesc: "Sistem deteksi APD karyawan berbasis AI yang dapat mengenali apakah karyawan memakai peralatan pelindung diri (APD) yang sesuai saat berada di area kerja. Sistem ini menggunakan teknologi computer vision untuk menganalisis gambar atau video secara real-time.",
        features: JSON.stringify([
          "Deteksi APD Real-time via Computer Vision",
          "Notifikasi Pelanggaran Keselamatan",
          "Analisis Video & Gambar Otomatis",
          "Integrasi dengan Sistem Keamanan",
          "Laporan Kepatuhan APD",
        ]),
      },
      en: {
        name: "Employee PPE Detection",
        shortDesc: "AI-based employee PPE detection system to ensure compliance with workplace safety protocols.",
        longDesc: "AI-based PPE detection system that recognizes whether employees are wearing appropriate personal protective equipment (PPE) in work areas. Uses computer vision technology to analyze images or video in real-time.",
        features: JSON.stringify([
          "Real-time PPE Detection via Computer Vision",
          "Safety Violation Notifications",
          "Automated Video & Image Analysis",
          "Security System Integration",
          "PPE Compliance Reports",
        ]),
      },
    },
    {
      image: "",
      githubUrl: "",
      liveUrl: "",
      sortOrder: 4,
      tags: ["web", "fullstack"],
      tech: ["React", "Vite", "Tailwind CSS"],
      id: {
        name: "SpicyPlay Music Player",
        shortDesc: "Aplikasi pemutar musik berbasis web dengan tampilan modern dan fitur sintesis suara interaktif.",
        longDesc: "SpicyPlay Music Player adalah aplikasi web pemutar musik interaktif yang dibangun dengan React dan Vite. Aplikasi ini menyediakan antarmuka modern untuk memutar musik serta dilengkapi dengan synth grovebox untuk eksplorasi suara kreatif. Dibangun dengan performa tinggi dan pengalaman pengguna yang responsif.",
        features: JSON.stringify([
          "Pemutar Musik dengan Kontrol Putar, Jeda, & Volume",
          "Synth Groovebox untuk Eksplorasi Suara Kreatif",
          "Daftar Putar & Manajemen Antrean Musik",
          "Tampilan Modern & Responsif dengan Tailwind CSS",
          "Performa Cepat dengan Vite",
        ]),
      },
      en: {
        name: "SpicyPlay Music Player",
        shortDesc: "Web-based music player with a modern interface and interactive sound synthesis features.",
        longDesc: "SpicyPlay Music Player is an interactive web music player built with React and Vite. It features a modern interface for playing music along with a synth groovebox for creative sound exploration. Built for high performance and responsive user experience.",
        features: JSON.stringify([
          "Music Player with Play, Pause & Volume Controls",
          "Synth Groovebox for Creative Sound Exploration",
          "Playlist & Music Queue Management",
          "Modern & Responsive UI with Tailwind CSS",
          "Fast Performance with Vite",
        ]),
      },
    },
    {
      image: "",
      githubUrl: "",
      liveUrl: "",
      sortOrder: 5,
      tags: ["web"],
      tech: ["PHP", "SQLSRV"],
      id: {
        name: "Monitoring IP Address CCTV",
        shortDesc: "Sistem monitoring IP Address CCTV berbasis web untuk mencegah duplikasi IP Address dan kesalahan data CCTV.",
        longDesc: "Sistem Monitoring IP Address CCTV adalah aplikasi berbasis web yang dibangun untuk mengelola dan memonitor IP Address CCTV di seluruh organisasi. Sistem ini membantu mencegah duplikasi IP, melacak status CCTV, dan memastikan manajemen data yang akurat. Dibangun dengan PHP dan SQLSRV untuk integrasi database yang handal.",
        features: JSON.stringify([
          "Manajemen & Monitoring IP Address CCTV",
          "Deteksi & Pencegahan Duplikasi IP Address",
          "Pelacakan Status CCTV (Aktif/Tidak Aktif)",
          "Pencarian & Filter berdasarkan Lokasi atau IP",
          "Pelaporan Excel/PDF untuk Audit",
        ]),
      },
      en: {
        name: "Monitoring IP Address CCTV",
        shortDesc: "Web-based CCTV IP Address monitoring system to prevent IP duplication and data errors.",
        longDesc: "CCTV IP Address Monitoring System is a web-based application built to manage and monitor CCTV IP addresses across an organization. The system helps prevent IP duplication, tracks CCTV status, and ensures accurate data management. Built with PHP and SQLSRV for reliable database integration.",
        features: JSON.stringify([
          "CCTV IP Address Management & Monitoring",
          "Duplicate IP Address Detection & Prevention",
          "CCTV Status Tracking (Active/Inactive)",
          "Search & Filter by Location or IP",
          "Excel/PDF Reporting for Audit",
        ]),
      },
    },
    {
      image: "",
      githubUrl: "",
      liveUrl: "",
      sortOrder: 6,
      tags: ["web"],
      tech: ["PHP", "SQLSRV"],
      id: {
        name: "Monitoring Mesin Grinding",
        shortDesc: "Sistem monitoring mesin grinding berbasis Web-IoT.",
        longDesc: "Sistem Monitoring Mesin Grinding adalah aplikasi berbasis web yang dibangun untuk mengelola dan memonitor status mesin grinding di seluruh organisasi. Sistem ini membantu mencegah downtime peralatan, melacak kinerja mesin, dan memastikan manajemen data yang akurat. Dibangun dengan PHP dan SQLSRV untuk integrasi database yang handal.",
        features: JSON.stringify([
          "Manajemen & Monitoring Status Mesin",
          "Pelacakan & Analisis Kinerja",
          "Peringatan & Notifikasi untuk Pemeliharaan",
          "Pencarian & Filter berdasarkan Line dan rentang waktu",
        ]),
      },
      en: {
        name: "Grinding Machine Monitoring",
        shortDesc: "Web-IoT-based monitoring system for grinding machines.",
        longDesc: "The Grinding Machine Monitoring System is a web-based application built to manage and monitor the status of grinding machines across an organization. The system helps prevent equipment downtime, tracks machine performance, and ensures accurate data management. Built with PHP and SQLSRV for reliable database integration.",
        features: JSON.stringify([
          "Machine Status Management & Monitoring",
          "Performance Tracking & Analysis",
          "Alerts & Notifications for Maintenance",
          "Search & Filter by line or Location and range date",
        ]),
      },
    },
  ];

  let projectCount = 0;
  for (const p of projectsData) {
    const project = await prisma.project.create({
      data: {
        image: p.image,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        sortOrder: p.sortOrder,
        translations: {
          create: [
            { locale: "id", name: p.id.name, shortDesc: p.id.shortDesc, longDesc: p.id.longDesc, features: p.id.features },
            { locale: "en", name: p.en.name, shortDesc: p.en.shortDesc, longDesc: p.en.longDesc, features: p.en.features },
          ],
        },
        tags: { create: p.tags.map((tag) => ({ tag })) },
        techStack: { create: p.tech.map((techName) => ({ techName })) },
      },
    });
    projectCount++;
    console.log(`   ✔ Project ${project.sortOrder}: ${project.id} created`);
  }
  console.log(`   ✔ ${projectCount} projects created\n`);

  // ─── Tech Skills ─────────────────────────────────────────────────────────
  console.log("🛠️  Seeding tech skills...");
  await prisma.techSkill.createMany({
    data: [
      { name: "React", level: "Intermediate", color: "#4fb7fd", iconName: "FaReact", sortOrder: 1 },
      { name: "Next.js", level: "Intermediate", color: "", iconName: "SiNextdotjs", sortOrder: 2 },
      { name: "TypeScript", level: "Intermediate", color: "#2ea8fa", iconName: "SiTypescript", sortOrder: 3 },
      { name: "Node.js", level: "Intermediate", color: "#0fbf09", iconName: "FaNodeJs", sortOrder: 4 },
      { name: "PostgreSQL", level: "Beginner", color: "#06469b", iconName: "SiPostgresql", sortOrder: 5 },
      { name: "Redis", level: "Beginner", color: "#d50a0a", iconName: "SiRedis", sortOrder: 6 },
      { name: "Docker", level: "Beginner", color: "#1b83c9", iconName: "SiDocker", sortOrder: 7 },
      { name: "Tailwind CSS", level: "Intermediate", color: "#3aa3e9", iconName: "SiTailwindcss", sortOrder: 8 },
      { name: "Git", level: "Intermediate", color: "#d51a1a", iconName: "SiGit", sortOrder: 9 },
      { name: "Laravel", level: "Advanced", color: "#e31a1a", iconName: "FaLaravel", sortOrder: 10 },
      { name: "CodeIgniter", level: "Intermediate", color: "#f12f2f", iconName: "SiCodeigniter", sortOrder: 11 },
      { name: "MySQL", level: "Advanced", color: "#00758f", iconName: "SiMysql", sortOrder: 12 },
    ],
  });
  console.log("   ✔ 12 tech skills created\n");

  // ─── Experiences ─────────────────────────────────────────────────────────
  console.log("💼 Seeding experiences...");

  const experiencesData = [
    {
      sortOrder: 1,
      logoPath: "/brands/gdsc.png",
      id: {
        role: "Google Developer Student Club (GDSC)",
        place: "Chapter Kampus",
        period: "Agustus 2023 - September 2024",
        items: [
          "Berpartisipasi dalam program mentoring dan pengembangan komunitas.",
          "Membangun project dan mengikuti kegiatan berbasis teknologi.",
          "Melatih kemampuan kolaborasi dan komunikasi teknis.",
        ],
      },
      en: {
        role: "Google Developer Student Club (GDSC)",
        place: "Campus Chapter",
        period: "August 2023 - September 2024",
        items: [
          "Participated in mentoring programs and community development.",
          "Built projects and joined technology-based activities.",
          "Trained collaboration and technical communication skills.",
        ],
      },
    },
    {
      sortOrder: 2,
      logoPath: "/brands/logo_aslab.png",
      id: {
        role: "Laboratorium Komputer",
        place: "Universitas / Organisasi Kampus",
        period: "Januari 2024 - Januari 2026",
        items: [
          "Membimbing praktikum dan membantu operasional kegiatan lab.",
          "Menyusun materi dan alur pembelajaran yang terstruktur.",
          "Berkoordinasi dengan tim untuk memastikan kelancaran event.",
        ],
      },
      en: {
        role: "Computer Laboratory",
        place: "University / Campus Organization",
        period: "January 2024 - January 2026",
        items: [
          "Guided lab practicum sessions and assisted lab operations.",
          "Prepared structured learning materials and workflows.",
          "Coordinated with the team to ensure smooth event execution.",
        ],
      },
    },
    {
      sortOrder: 3,
      logoPath: "/brands/cbi.png",
      id: {
        role: "PT Century Batteries Indonesia",
        place: "Magang",
        period: "Maret 2025 - Juni 2025",
        items: [
          "Membangun sistem E-Checksheet Pre-Use untuk pemantauan terhadap mesin-mesin yang ada oleh departemen maintenance.",
          "Mengembangkan sistem dashboard Preventive Maintenance untuk departemen maintenance.",
        ],
      },
      en: {
        role: "PT Century Batteries Indonesia",
        place: "Internship",
        period: "March 2025 - June 2025",
        items: [
          "Built an E-Checksheet Pre-Use system for machine monitoring by the maintenance department.",
          "Developed a Preventive Maintenance dashboard system for the maintenance department.",
        ],
      },
    },
    {
      sortOrder: 4,
      logoPath: "/brands/ati.png",
      id: {
        role: "PT AT Indonesia",
        place: "Magang",
        period: "Januari 2026 - Sekarang",
        items: [
          "Membangun sistem deteksi APD berbasis Camera Vision menggunakan Yolo.",
          "Mengoptimalkan proses data input dan pengolahan hasil deteksi.",
          "Menerapkan evaluasi sederhana untuk memastikan performa.",
        ],
      },
      en: {
        role: "PT AT Indonesia",
        place: "Internship",
        period: "January 2026 - Present",
        items: [
          "Built a Camera Vision-based PPE detection system using Yolo.",
          "Optimized data input processes and detection result handling.",
          "Applied simple evaluations to ensure performance.",
        ],
      },
    },
  ];

  let experienceCount = 0;
  for (const e of experiencesData) {
    for (const locale of ["id", "en"] as const) {
      const data = e[locale];
      const exp = await prisma.experience.create({
        data: {
          locale,
          role: data.role,
          place: data.place,
          period: data.period,
          sortOrder: e.sortOrder,
          logoPath: e.logoPath,
          items: {
            create: data.items.map((text, i) => ({ text, sortOrder: i + 1 })),
          },
        },
      });
      experienceCount++;
      console.log(`   ✔ Experience [${locale}] #${e.sortOrder}: ${exp.id}`);
    }
  }
  console.log(`   ✔ ${experienceCount} experience records created\n`);

  // ─── Education ───────────────────────────────────────────────────────────
  console.log("🎓 Seeding education...");

  const educationData = [
    {
      sortOrder: 1,
      id: {
        title: "S1 Informatika",
        place: "Universitas Singaperbangsa Karawang (UNSIKA)",
        period: "2022 - 2026",
        highlights: [
          "Fresh Graduate with cumlaude honor.",
          "Fokus pada pengembangan aplikasi web end-to-end dan struktur data.",
          "Membangun project berbasis teknologi modern dan mengutamakan kualitas kode.",
          "Aktif dalam kegiatan kampus dan organisasi untuk memperluas pengalaman kolaborasi.",
        ],
      },
      en: {
        title: "Bachelor of Informatics",
        place: "Universitas Singaperbangsa Karawang (UNSIKA)",
        period: "2022 - 2026",
        highlights: [
          "Fresh Graduate with cumlaude honor.",
          "Focused on end-to-end web application development and data structures.",
          "Built projects using modern technology with emphasis on code quality.",
          "Active in campus activities and organizations to broaden collaboration experience.",
        ],
      },
    },
    {
      sortOrder: 2,
      id: {
        title: "MSIB Studi Independen @ Vocasia",
        place: "Fullstack Web MERN Development",
        period: "2024 - 2024",
        highlights: [
          "Mengembangkan soft skill public speaking dan time management.",
          "Memahami struktur ExpressJS untuk pengembangan backend.",
          "Belajar menangani race condition pada aplikasi concurrent.",
          "Membangun project fullstack menggunakan stack MERN.",
        ],
      },
      en: {
        title: "MSIB Independent Study @ Vocasia",
        place: "Fullstack Web MERN Development",
        period: "2024 - 2024",
        highlights: [
          "Developed soft skills: public speaking and time management.",
          "Understood ExpressJS structure for backend development.",
          "Learned to handle race conditions in concurrent applications.",
          "Built fullstack projects using MERN stack.",
        ],
      },
    },
    {
      sortOrder: 3,
      id: {
        title: "Praktik Industri / Magang",
        place: "PT Century Batteries Indonesia & PT AT Indonesia",
        period: "2025 - Sekarang",
        highlights: [
          "Membangun sistem E-Checksheet Pre-Use dan dashboard Preventive Maintenance.",
          "Mengembangkan sistem deteksi APD berbasis Camera Vision menggunakan YOLO.",
          "Menerapkan evaluasi dan optimasi pipeline data agar hasil lebih stabil.",
        ],
      },
      en: {
        title: "Industry Internship",
        place: "PT Century Batteries Indonesia & PT AT Indonesia",
        period: "2025 - Present",
        highlights: [
          "Built E-Checksheet Pre-Use system and Preventive Maintenance dashboard.",
          "Developed Camera Vision-based PPE detection system using YOLO.",
          "Applied evaluation and data pipeline optimization for more stable results.",
        ],
      },
    },
  ];

  let educationCount = 0;
  for (const e of educationData) {
    for (const locale of ["id", "en"] as const) {
      const data = e[locale];
      const edu = await prisma.educationEntry.create({
        data: {
          locale,
          title: data.title,
          place: data.place,
          period: data.period,
          sortOrder: e.sortOrder,
          highlights: {
            create: data.highlights.map((text, i) => ({ text, sortOrder: i + 1 })),
          },
        },
      });
      educationCount++;
      console.log(`   ✔ Education [${locale}] #${e.sortOrder}: ${edu.id}`);
    }
  }
  console.log(`   ✔ ${educationCount} education records created\n`);

  // ─── Work Habits ─────────────────────────────────────────────────────────
  console.log("⚡ Seeding work habits...");
  const workHabitsData = {
    id: [
      { k: "Cepat adaptasi", v: "Belajar teknologi baru + penerapan langsung" },
      { k: "Rapi & scalable", v: "Struktur kode & alur pengerjaan yang jelas" },
      { k: "Kolaboratif", v: "Komunikasi tim untuk mencapai target" },
    ],
    en: [
      { k: "Fast adapter", v: "Learn new technologies + direct implementation" },
      { k: "Clean & scalable", v: "Clear code structure & workflow" },
      { k: "Collaborative", v: "Team communication to achieve targets" },
    ],
  };

  let workHabitCount = 0;
  for (const locale of ["id", "en"] as const) {
    await prisma.workHabit.createMany({
      data: workHabitsData[locale].map((item, i) => ({
        locale,
        k: item.k,
        v: item.v,
        sortOrder: i + 1,
      })),
    });
    workHabitCount += workHabitsData[locale].length;
  }
  console.log(`   ✔ ${workHabitCount} work habits created\n`);

  // ─── Snapshot Items ──────────────────────────────────────────────────────
  console.log("📸 Seeding snapshot items...");
  const snapshotData = {
    id: [
      { num: "3+", label: "Rangkaian peran" },
      { num: "1+", label: "Proyek industri" },
      { num: "Yolo", label: "Deteksi APD" },
      { num: "Tim", label: "Kolaborasi aktif" },
    ],
    en: [
      { num: "3+", label: "Roles held" },
      { num: "1+", label: "Industry projects" },
      { num: "Yolo", label: "PPE Detection" },
      { num: "Team", label: "Active collaboration" },
    ],
  };

  let snapshotCount = 0;
  for (const locale of ["id", "en"] as const) {
    await prisma.snapshotItem.createMany({
      data: snapshotData[locale].map((item, i) => ({
        locale,
        num: item.num,
        label: item.label,
        sortOrder: i + 1,
      })),
    });
    snapshotCount += snapshotData[locale].length;
  }
  console.log(`   ✔ ${snapshotCount} snapshot items created\n`);

  // ─── Competencies ────────────────────────────────────────────────────────
  console.log("🧠 Seeding competencies...");
  const competenciesData = {
    id: [
      { k: "Teknis", v: "Web development, integrasi sistem, dan struktur kode" },
      { k: "Analitik", v: "Proses data yang rapi untuk hasil yang bisa diukur" },
      { k: "Eksekusi", v: "Membangun fitur end-to-end dengan target & timeline" },
    ],
    en: [
      { k: "Technical", v: "Web development, system integration, and code structure" },
      { k: "Analytical", v: "Clean data processing for measurable results" },
      { k: "Execution", v: "Building end-to-end features with targets & timelines" },
    ],
  };

  let competencyCount = 0;
  for (const locale of ["id", "en"] as const) {
    await prisma.competency.createMany({
      data: competenciesData[locale].map((item, i) => ({
        locale,
        k: item.k,
        v: item.v,
        sortOrder: i + 1,
      })),
    });
    competencyCount += competenciesData[locale].length;
  }
  console.log(`   ✔ ${competencyCount} competencies created\n`);

  // ─── Achievements ────────────────────────────────────────────────────────
  console.log("🏆 Seeding achievements...");
  const achievementsData = {
    id: [
      "Head of Technical Core Team @ GDSC",
      "Built E-Checksheet System",
      "Preventive Maintenance Dashboard",
      "PPE Detection using YOLO",
    ],
    en: [
      "Head of Technical Core Team @ GDSC",
      "Built E-Checksheet System",
      "Preventive Maintenance Dashboard",
      "PPE Detection using YOLO",
    ],
  };

  let achievementCount = 0;
  for (const locale of ["id", "en"] as const) {
    await prisma.achievement.createMany({
      data: achievementsData[locale].map((text, i) => ({
        locale,
        text,
        sortOrder: i + 1,
      })),
    });
    achievementCount += achievementsData[locale].length;
  }
  console.log(`   ✔ ${achievementCount} achievements created\n`);

  // ─── Contact Content ─────────────────────────────────────────────────────
  console.log("📬 Seeding contact content...");
  await prisma.contactContent.createMany({
    data: [
      {
        locale: "id",
        title: "HUBUNGI SAYA",
        description1: "Punya ide proyek yang keren? Atau sekadar ingin ngobrol soal teknologi? Saya selalu terbuka untuk kolaborasi baru dan kesempatan menarik.",
        description2: "Biasanya saya membalas dalam 24 jam kerja.",
        formName: "Nama Lengkap",
        formEmail: "Email",
        formMessage: "Pesan",
        formPlaceholder: "Ceritakan proyek impian kamu...",
        formSubmit: "Kirim Pesan ✦",
        formSubmitting: "Mengirim...",
        toast: "✦ Pesan berhasil dikirim!",
      },
      {
        locale: "en",
        title: "CONTACT ME",
        description1: "Got a cool project idea? Or just want to chat about tech? I'm always open to new collaborations and exciting opportunities.",
        description2: "I usually reply within 24 business hours.",
        formName: "Full Name",
        formEmail: "Email",
        formMessage: "Message",
        formPlaceholder: "Tell me about your dream project...",
        formSubmit: "Send Message ✦",
        formSubmitting: "Sending...",
        toast: "✦ Message sent successfully!",
      },
    ],
  });
  console.log("   ✔ 2 contact locales created\n");

  // ─── Contact Links ───────────────────────────────────────────────────────
  console.log("🔗 Seeding contact links...");
  await prisma.contactLink.createMany({
    data: [
      { iconName: "SiGmail", label: "arszalzdarker@email.com", href: "mailto:arszalzdarker@email.com", sortOrder: 1 },
      { iconName: "FaGithub", label: "github.com/zalzdarkent", href: "https://github.com/zalzdarkent", sortOrder: 2 },
      { iconName: "FaLinkedin", label: "linkedin.com/in/alif-fadillah-ummar-07001224b/", href: "https://linkedin.com/in/alif-fadillah-ummar-07001224b/", sortOrder: 3 },
    ],
  });
  console.log("   ✔ 3 contact links created\n");

  // ─── Marquee Items ───────────────────────────────────────────────────────
  console.log("🎡 Seeding marquee items...");
  await prisma.marqueeItem.createMany({
    data: [
      { text: "Full Stack Development", sortOrder: 1 },
      { text: "UI/UX Design", sortOrder: 2 },
      { text: "API Integration", sortOrder: 3 },
      { text: "Database Design", sortOrder: 4 },
      { text: "Performance Optimization", sortOrder: 5 },
      { text: "Mobile Responsive", sortOrder: 6 },
    ],
  });
  console.log("   ✔ 6 marquee items created\n");

  // ─── Footer Content ──────────────────────────────────────────────────────
  console.log("📎 Seeding footer content...");
  await prisma.footerContent.createMany({
    data: [
      { locale: "id", copyText: "© 2026 Alif Fadillah Ummar. Dibangun dengan banyak ☕" },
      { locale: "en", copyText: "© 2026 Alif Fadillah Ummar. Built with lots of ☕" },
    ],
  });
  console.log("   ✔ 2 footer locales created\n");

  // ─── Summary ─────────────────────────────────────────────────────────────
  console.log("═══════════════════════════════════════════════════════════");
  console.log("📊 SEED SUMMARY");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`   Users:                   1`);
  console.log(`   Hero Content:            2 locales`);
  console.log(`   About Content:           2 locales`);
  console.log(`   Projects:                ${projectCount} (with ${projectCount * 2} translations, ${projectCount * 2}+ tags, ${projectCount * 2}+ tech)`);
  console.log(`   Tech Skills:             12`);
  console.log(`   Experiences:             ${experienceCount} (${experienceCount / 2} entries × 2 locales)`);
  console.log(`   Experience Items:        ${experienceCount * 3}+ (auto-created)`);
  console.log(`   Education:               ${educationCount} (${educationCount / 2} entries × 2 locales)`);
  console.log(`   Education Highlights:    ${educationCount * 3}+ (auto-created)`);
  console.log(`   Work Habits:             ${workHabitCount}`);
  console.log(`   Snapshot Items:          ${snapshotCount}`);
  console.log(`   Competencies:            ${competencyCount}`);
  console.log(`   Achievements:            ${achievementCount}`);
  console.log(`   Contact Content:         2 locales`);
  console.log(`   Contact Links:           3`);
  console.log(`   Marquee Items:           6`);
  console.log(`   Footer Content:          2 locales`);
  console.log("═══════════════════════════════════════════════════════════");
  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
