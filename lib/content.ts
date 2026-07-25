import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");

export type SkillBand = {
  label: string;
  detail: string;
};

export type Profile = {
  name: string;
  role: string;
  tagline: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  resumeFile: string;
  hasResume: boolean;
  photoFile: string;
  hasPhoto: boolean;
  bioHtml: string;
  skills: SkillBand[];
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  featured: boolean;
  order: number;
  domain: string;
  coverImage: string;
  /** How the cover sits in the card crop. Use "contain" for dense diagrams. */
  coverFit: "cover" | "contain";
  techStack: string[];
  contentHtml: string;
};

export type OtherProject = {
  title: string;
  description: string;
  techStack: string[];
};

/** Splits the profile body into the bio (before "## Skills") and the skills section. */
function splitProfileBody(body: string): { bio: string; skills: string } {
  const marker = "## Skills";
  const idx = body.indexOf(marker);
  if (idx === -1) return { bio: body, skills: "" };
  return {
    bio: body.slice(0, idx).trim(),
    skills: body.slice(idx + marker.length).trim(),
  };
}

/** Parses `- **Label** — detail` skill lines into scannable bands. */
function parseSkillBands(skillsMarkdown: string): SkillBand[] {
  return skillsMarkdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => {
      const match = line.match(/^-\s+\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
      if (!match) return null;
      return { label: match[1].trim(), detail: match[2].trim() };
    })
    .filter((band): band is SkillBand => band !== null);
}

export function getProfile(): Profile {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "profile.md"), "utf8");
  const { data, content } = matter(raw);
  const { bio, skills } = splitProfileBody(content);
  const resumeFile = data.resumeFile ?? "/resume.pdf";
  const resumePath = path.join(
    process.cwd(),
    "public",
    resumeFile.replace(/^\//, ""),
  );
  const photoFile = data.photoFile ?? "/photo.png";
  const photoPath = path.join(
    process.cwd(),
    "public",
    photoFile.replace(/^\//, ""),
  );

  return {
    name: data.name ?? "",
    role: data.role ?? "",
    tagline: data.tagline ?? "",
    email: data.email ?? "",
    github: data.github ?? "",
    linkedin: data.linkedin ?? "",
    location: data.location ?? "",
    resumeFile,
    hasResume: fs.existsSync(resumePath),
    photoFile,
    hasPhoto: fs.existsSync(photoPath),
    bioHtml: marked.parse(bio) as string,
    skills: parseSkillBands(skills),
  };
}

function readProjectFile(filename: string): Project {
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle ?? "",
    featured: !!data.featured,
    order: data.order ?? 999,
    domain: data.domain ?? "",
    coverImage: data.coverImage ?? "",
    coverFit: data.coverFit === "contain" ? "contain" : "cover",
    techStack: data.techStack ?? [],
    contentHtml: marked.parse(content) as string,
  };
}

export function getFeaturedProjects(): Project[] {
  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "other-projects.md");
  return files
    .map(readProjectFile)
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | null {
  const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return readProjectFile(`${slug}.md`);
}

export function getAllProjectSlugs(): string[] {
  return getFeaturedProjects().map((p) => p.slug);
}

export function getOtherProjects(): OtherProject[] {
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, "other-projects.md"), "utf8");
  const { data } = matter(raw);
  return data.items ?? [];
}
