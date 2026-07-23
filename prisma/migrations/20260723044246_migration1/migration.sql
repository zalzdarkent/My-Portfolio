-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "display_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_content" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "greeting" TEXT NOT NULL DEFAULT '',
    "name_label" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "btn_project" TEXT NOT NULL DEFAULT '',
    "btn_contact" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT '',
    "sticker_exp" TEXT NOT NULL DEFAULT '',
    "sticker_open" TEXT NOT NULL DEFAULT '',
    "available_text" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "hero_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_content" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "btn_label" TEXT NOT NULL DEFAULT '',
    "cv_modal_title" TEXT NOT NULL DEFAULT '',
    "cv_modal_download" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "about_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "github_url" TEXT NOT NULL DEFAULT '',
    "live_url" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_translations" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "short_desc" TEXT NOT NULL DEFAULT '',
    "long_desc" TEXT NOT NULL DEFAULT '',
    "features" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "project_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tags" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "project_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tech" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "tech_name" TEXT NOT NULL,

    CONSTRAINT "project_tech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '',
    "icon_name" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tech_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT '',
    "place" TEXT NOT NULL DEFAULT '',
    "period" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "logo_path" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience_items" (
    "id" SERIAL NOT NULL,
    "experience_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "experience_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_entries" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "place" TEXT NOT NULL DEFAULT '',
    "period" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "education_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_highlights" (
    "id" SERIAL NOT NULL,
    "education_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "education_highlights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_habits" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "k" TEXT NOT NULL DEFAULT '',
    "v" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "work_habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snapshot_items" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "num" TEXT NOT NULL DEFAULT '',
    "label" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "snapshot_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competencies" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "k" TEXT NOT NULL DEFAULT '',
    "v" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "competencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_content" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description1" TEXT NOT NULL DEFAULT '',
    "description2" TEXT NOT NULL DEFAULT '',
    "form_name" TEXT NOT NULL DEFAULT '',
    "form_email" TEXT NOT NULL DEFAULT '',
    "form_message" TEXT NOT NULL DEFAULT '',
    "form_placeholder" TEXT NOT NULL DEFAULT '',
    "form_submit" TEXT NOT NULL DEFAULT '',
    "form_submitting" TEXT NOT NULL DEFAULT '',
    "toast" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "contact_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_links" (
    "id" SERIAL NOT NULL,
    "icon_name" TEXT NOT NULL DEFAULT '',
    "label" TEXT NOT NULL DEFAULT '',
    "href" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "contact_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marquee_items" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "marquee_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer_content" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "copy_text" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "footer_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "hero_content_locale_key" ON "hero_content"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "about_content_locale_key" ON "about_content"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "project_translations_project_id_locale_key" ON "project_translations"("project_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "contact_content_locale_key" ON "contact_content"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "footer_content_locale_key" ON "footer_content"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_key_key" ON "site_settings"("key");

-- AddForeignKey
ALTER TABLE "project_translations" ADD CONSTRAINT "project_translations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tech" ADD CONSTRAINT "project_tech_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_items" ADD CONSTRAINT "experience_items_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_highlights" ADD CONSTRAINT "education_highlights_education_id_fkey" FOREIGN KEY ("education_id") REFERENCES "education_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
