import Header from "./components/Header";
import Footer from "./components/Footer";
import ProjectCard from "./components/ProjectCard";
import Tag from "./components/Tag";
import CornerFrame from "./components/CornerFrame";
import Image from "next/image";
import {
  getProfile,
  getFeaturedProjects,
  getOtherProjects,
} from "@/lib/content";

export default function Home() {
  const profile = getProfile();
  const projects = getFeaturedProjects();
  const others = getOtherProjects();

  return (
    <>
      <Header />

      <main id="main">
        {/* Hero — name + role first; tagline supports */}
        <section className="mx-auto max-w-[72rem] px-6 pb-20 pt-10 sm:px-10 sm:pb-28 sm:pt-16">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
            {profile.role}
            <span className="text-muted"> — {profile.location}</span>
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {profile.tagline}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="inline-flex min-h-11 cursor-pointer items-center rounded-sm bg-accent px-5 py-3 font-mono text-xs uppercase tracking-widest text-bg transition-opacity hover:opacity-90"
            >
              View Projects
            </a>
            {profile.hasResume ? (
              <a
                href={profile.resumeFile}
                className="inline-flex min-h-11 cursor-pointer items-center rounded-sm border border-line px-5 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:border-accent"
              >
                Download Resume
              </a>
            ) : (
              <a
                href="#contact"
                className="inline-flex min-h-11 cursor-pointer items-center rounded-sm border border-line px-5 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:border-accent"
              >
                Get in Touch
              </a>
            )}
          </div>
        </section>

        {/* Skills — scannable bands */}
        <section className="border-y border-line bg-surface/40">
          <h2 className="sr-only">Focus areas</h2>
          <div className="mx-auto grid max-w-[72rem] gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {profile.skills.map((band) => (
              <div key={band.label} className="bg-bg px-6 py-7 sm:px-8">
                <h3 className="mb-3 font-mono text-[0.7rem] uppercase tracking-widest text-accent">
                  {band.label}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {band.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured projects */}
        <section
          id="projects"
          className="mx-auto max-w-[72rem] px-6 py-20 sm:px-10"
        >
          <h2 className="mb-10 font-display text-2xl font-semibold text-ink">
            Featured Work
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>

        {/* Other projects */}
        <section className="mx-auto max-w-[72rem] px-6 pb-20 sm:px-10">
          <h2 className="mb-8 font-display text-xl font-semibold text-ink">
            Other Projects
          </h2>
          <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
            {others.map((o) => (
              <div key={o.title} className="bg-bg p-6">
                <h3 className="mb-2 font-display text-base font-semibold text-ink">
                  {o.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted">
                  {o.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {o.techStack.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="border-t border-line">
          <div className="mx-auto max-w-[72rem] px-6 py-20 sm:px-10">
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-14">
              {profile.hasPhoto ? (
                <CornerFrame className="w-full shrink-0 md:w-56 lg:w-64">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-line bg-raised">
                    <Image
                      src={profile.photoFile}
                      alt={profile.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 256px"
                    />
                  </div>
                </CornerFrame>
              ) : null}
              <CornerFrame className="max-w-2xl flex-1 p-8 sm:p-10">
                <h2 className="mb-6 font-display text-2xl font-semibold text-ink">
                  About
                </h2>
                <div
                  className="space-y-4 text-[0.95rem] leading-relaxed text-muted"
                  dangerouslySetInnerHTML={{ __html: profile.bioHtml }}
                />
              </CornerFrame>
            </div>
          </div>
        </section>
      </main>

      <Footer profile={profile} />
    </>
  );
}
