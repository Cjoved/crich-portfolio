import type { Profile } from "@/lib/content";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer id="contact" className="border-t border-line">
      <div className="mx-auto max-w-[72rem] px-6 py-14 sm:px-10">
        <p className="mb-6 max-w-md font-display text-2xl font-semibold text-ink">
          Let&rsquo;s talk about what you&rsquo;re building.
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm text-muted">
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-accent">
            {profile.email}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            GitHub
          </a>
          {profile.linkedin ? (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-accent"
            >
              LinkedIn
            </a>
          ) : null}
          <a href={profile.resumeFile} className="transition-colors hover:text-accent">
            Resume (PDF)
          </a>
        </div>
        <p className="mt-10 font-mono text-xs text-muted/60">
          {profile.location}
        </p>
      </div>
    </footer>
  );
}
