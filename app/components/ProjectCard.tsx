import Image from "next/image";
import Link from "next/link";
import CornerFrame from "./CornerFrame";
import Tag from "./Tag";
import type { Project } from "@/lib/content";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block cursor-pointer transition-opacity active:opacity-90"
    >
      <CornerFrame className="flex h-full flex-col rounded-sm border border-line bg-surface transition-colors hover:border-accent/30">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-raised">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={`${project.title} preview`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-between p-5">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-accent">
                {project.domain || "Case Study"}
              </span>
              <span
                aria-hidden
                className="font-mono text-[0.65rem] tracking-widest text-line"
              >
                [{project.slug}]
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <span className="mb-3 block font-mono text-[0.7rem] uppercase tracking-widest text-accent">
            Case Study
          </span>
          <h3 className="mb-3 font-display text-xl font-semibold text-ink">
            {project.title}
          </h3>
          <p className="mb-5 flex-1 text-sm leading-relaxed text-muted">
            {project.subtitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 4).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </CornerFrame>
    </Link>
  );
}
