import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Tag from "../../components/Tag";
import CornerFrame from "../../components/CornerFrame";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  getProfile,
} from "@/lib/content";

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const profile = getProfile();

  if (!project) notFound();

  const isDiagram = project.coverFit === "contain";

  return (
    <>
      <Header />
      <main id="main">
        <article
          className={`mx-auto px-6 pb-24 pt-6 sm:px-10 ${
            isDiagram ? "max-w-5xl" : "max-w-3xl"
          }`}
        >
          <Link
            href="/#projects"
            className="mb-10 inline-flex min-h-11 cursor-pointer items-center font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent"
          >
            ← All Projects
          </Link>

          {project.domain ? (
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
              {project.domain}
            </p>
          ) : null}

          <h1 className="mb-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
            {project.title}
          </h1>
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-muted">
            {project.subtitle}
          </p>

          <div className="mb-10 flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>

          {project.coverImage ? (
            <CornerFrame className="mb-12">
              <div
                className={`relative w-full overflow-hidden rounded-sm border border-line bg-raised ${
                  isDiagram ? "aspect-[3/2]" : "aspect-[16/10]"
                }`}
              >
                <Image
                  src={project.coverImage}
                  alt={`${project.title} architecture`}
                  fill
                  className={
                    isDiagram
                      ? "object-contain object-center p-3 sm:p-4"
                      : "object-cover"
                  }
                  sizes={
                    isDiagram
                      ? "(max-width: 1024px) 100vw, 64rem"
                      : "(max-width: 768px) 100vw, 48rem"
                  }
                  priority
                />
              </div>
            </CornerFrame>
          ) : null}

          <div
            className={`case-study-body ${isDiagram ? "max-w-3xl" : ""}`}
            dangerouslySetInnerHTML={{ __html: project.contentHtml }}
          />
        </article>
      </main>
      <Footer profile={profile} />
    </>
  );
}
