import Header from "./components/Header";
import Footer from "./components/Footer";
import ProjectCard from "./components/ProjectCard";
import Tag from "./components/Tag";
import CornerFrame from "./components/CornerFrame";
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

      {/* Hero */}
      <section className="mx-auto max-w-[72rem] px-6 pb-20 pt-10 sm:px-10 sm:pb-28 sm:pt-16">
        <span className="mb-6 block font-mono text-xs uppercase tracking-widest text-accent">
          {profile.role} — {profile.location}
        </span>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.15] text-ink sm:text-5xl">
          {profile.tagline}
        </h1>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-sm bg-accent px-5 py-3 font-mono text-xs uppercase tracking-widest text-bg transition-opacity hover:opacity-90"
          >
            View Projects
          </a>
          <a
            href={profile.resumeFile}
            className="rounded-sm border border-line px-5 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:border-accent"
          >
            Download Resume
          </a>
        </div>
      </section>

      {/* Skills strip */}
      <section className="border-y border-line bg-surface/40">
        <div className="mx-auto max-w-[72rem] px-6 py-8 sm:px-10">
          <div
            className="skills-html flex flex-wrap gap-x-10 gap-y-3 font-mono text-xs text-muted"
            dangerouslySetInnerHTML={{ __html: profile.skillsHtml }}
          />
        </div>
      </section>

      {/* Featured projects */}
      <section id="projects" className="mx-auto max-w-[72rem] px-6 py-20 sm:px-10">
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
          <CornerFrame className="max-w-2xl p-8 sm:p-10">
            <h2 className="mb-6 font-display text-2xl font-semibold text-ink">
              About
            </h2>
            <div
              className="space-y-4 text-[0.95rem] leading-relaxed text-muted"
              dangerouslySetInnerHTML={{ __html: profile.bioHtml }}
            />
          </CornerFrame>
        </div>
      </section>

      <Footer profile={profile} />
    </>
  );
}
