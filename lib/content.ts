import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");

export type Profile = {
  name: string;
  role: string;
  tagline: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  resumeFile: string;
  bioHtml: string;
  skillsHtml: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  featured: boolean;
  order: number;
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

export function getProfile(): Profile {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "profile.md"), "utf8");
  const { data, content } = matter(raw);
  const { bio, skills } = splitProfileBody(content);
  return {
    name: data.name ?? "",
    role: data.role ?? "",
    tagline: data.tagline ?? "",
    email: data.email ?? "",
    github: data.github ?? "",
    linkedin: data.linkedin ?? "",
    location: data.location ?? "",
    resumeFile: data.resumeFile ?? "/resume.pdf",
    bioHtml: marked.parse(bio) as string,
    skillsHtml: marked.parse(skills) as string,
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
