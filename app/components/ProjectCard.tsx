import Link from "next/link";
import CornerFrame from "./CornerFrame";
import Tag from "./Tag";
import type { Project } from "@/lib/content";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="block">
      <CornerFrame className="h-full p-6 sm:p-7 bg-surface border border-line rounded-sm transition-colors hover:border-accent/30">
        <span className="mb-3 block font-mono text-[0.7rem] uppercase tracking-widest text-accent">
          Case Study
        </span>
        <h3 className="mb-3 font-display text-xl font-semibold text-ink">
          {project.title}
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-muted">{project.subtitle}</p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </CornerFrame>
    </Link>
  );
}
