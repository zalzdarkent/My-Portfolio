-- Portfolio Database Migration for PostgreSQL
-- Database: portfolio
-- Run: psql -U postgres -d portfolio -f sql/init.sql

-- ============================================================
-- USERS (Admin Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- HERO CONTENT (i18n)
-- ============================================================
CREATE TABLE IF NOT EXISTS hero_content (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
  greeting VARCHAR(100) DEFAULT '',
  name_label VARCHAR(100) DEFAULT '',
  description TEXT DEFAULT '',
  btn_project VARCHAR(200) DEFAULT '',
  btn_contact VARCHAR(200) DEFAULT '',
  status VARCHAR(200) DEFAULT '',
  sticker_exp VARCHAR(100) DEFAULT '',
  sticker_open VARCHAR(100) DEFAULT '',
  available_text VARCHAR(200) DEFAULT '',
  UNIQUE(locale)
);

-- ============================================================
-- ABOUT CONTENT (i18n)
-- ============================================================
CREATE TABLE IF NOT EXISTS about_content (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
  title VARCHAR(200) DEFAULT '',
  description TEXT DEFAULT '',
  btn_label VARCHAR(200) DEFAULT '',
  cv_modal_title VARCHAR(200) DEFAULT '',
  cv_modal_download VARCHAR(200) DEFAULT '',
  UNIQUE(locale)
);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  image VARCHAR(500) DEFAULT '',
  github_url VARCHAR(500) DEFAULT '',
  live_url VARCHAR(500) DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_translations (
  id SERIAL PRIMARY KEY,
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  locale VARCHAR(10) NOT NULL,
  name VARCHAR(300) DEFAULT '',
  short_desc TEXT DEFAULT '',
  long_desc TEXT DEFAULT '',
  features TEXT DEFAULT '[]',
  UNIQUE(project_id, locale)
);

CREATE TABLE IF NOT EXISTS project_tags (
  id SERIAL PRIMARY KEY,
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_tech (
  id SERIAL PRIMARY KEY,
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tech_name VARCHAR(100) NOT NULL
);

-- ============================================================
-- TECH SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS tech_skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  level VARCHAR(30) NOT NULL DEFAULT 'Intermediate',
  color VARCHAR(20) DEFAULT '',
  icon_name VARCHAR(100) DEFAULT '',
  sort_order INT DEFAULT 0
);

-- ============================================================
-- EXPERIENCES (i18n)
-- ============================================================
CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
  role VARCHAR(300) DEFAULT '',
  place VARCHAR(300) DEFAULT '',
  period VARCHAR(100) DEFAULT '',
  sort_order INT DEFAULT 0,
  logo_path VARCHAR(500) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS experience_items (
  id SERIAL PRIMARY KEY,
  experience_id INT NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  text TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);

-- ============================================================
-- EDUCATION (i18n)
-- ============================================================
CREATE TABLE IF NOT EXISTS education_entries (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
  title VARCHAR(300) DEFAULT '',
  place VARCHAR(300) DEFAULT '',
  period VARCHAR(100) DEFAULT '',
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS education_highlights (
  id SERIAL PRIMARY KEY,
  education_id INT NOT NULL REFERENCES education_entries(id) ON DELETE CASCADE,
  text TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);

-- ============================================================
-- SIDEBAR DATA (i18n)
-- ============================================================
CREATE TABLE IF NOT EXISTS work_habits (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
  k VARCHAR(300) DEFAULT '',
  v TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS snapshot_items (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
  num VARCHAR(50) DEFAULT '',
  label VARCHAR(300) DEFAULT '',
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS competencies (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
  k VARCHAR(300) DEFAULT '',
  v TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
  text TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);

-- ============================================================
-- CONTACT SECTION (i18n)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_content (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
  title VARCHAR(200) DEFAULT '',
  description1 TEXT DEFAULT '',
  description2 TEXT DEFAULT '',
  form_name VARCHAR(200) DEFAULT '',
  form_email VARCHAR(200) DEFAULT '',
  form_message VARCHAR(200) DEFAULT '',
  form_placeholder TEXT DEFAULT '',
  form_submit VARCHAR(200) DEFAULT '',
  form_submitting VARCHAR(200) DEFAULT '',
  toast TEXT DEFAULT '',
  UNIQUE(locale)
);

CREATE TABLE IF NOT EXISTS contact_links (
  id SERIAL PRIMARY KEY,
  icon_name VARCHAR(100) DEFAULT '',
  label VARCHAR(300) DEFAULT '',
  href VARCHAR(500) DEFAULT '',
  sort_order INT DEFAULT 0
);

-- ============================================================
-- MARQUEE
-- ============================================================
CREATE TABLE IF NOT EXISTS marquee_items (
  id SERIAL PRIMARY KEY,
  text VARCHAR(300) DEFAULT '',
  sort_order INT DEFAULT 0
);

-- ============================================================
-- FOOTER (i18n)
-- ============================================================
CREATE TABLE IF NOT EXISTS footer_content (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
  copy_text TEXT DEFAULT '',
  UNIQUE(locale)
);

-- ============================================================
-- SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT DEFAULT ''
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_project_translations_locale ON project_translations(locale);
CREATE INDEX IF NOT EXISTS idx_experiences_locale ON experiences(locale);
CREATE INDEX IF NOT EXISTS idx_education_entries_locale ON education_entries(locale);
CREATE INDEX IF NOT EXISTS idx_work_habits_locale ON work_habits(locale);
CREATE INDEX IF NOT EXISTS idx_snapshot_items_locale ON snapshot_items(locale);
CREATE INDEX IF NOT EXISTS idx_competencies_locale ON competencies(locale);
CREATE INDEX IF NOT EXISTS idx_achievements_locale ON achievements(locale);
CREATE INDEX IF NOT EXISTS idx_project_tags_project_id ON project_tags(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tech_project_id ON project_tech(project_id);
CREATE INDEX IF NOT EXISTS idx_experience_items_experience_id ON experience_items(experience_id);
CREATE INDEX IF NOT EXISTS idx_education_highlights_education_id ON education_highlights(education_id);
