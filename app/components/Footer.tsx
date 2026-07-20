import type { Profile } from "@/lib/content";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer id="contact" className="border-t border-line">
      <div className="mx-auto max-w-[72rem] px-6 py-14 sm:px-10">
        <p className="mb-6 max-w-md font-display text-2xl font-semibold text-ink">
          Let&rsquo;s talk about what you&rsquo;re building.
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-sm text-muted sm:gap-x-4">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex min-h-11 cursor-pointer items-center px-1 transition-colors hover:text-accent sm:px-2"
          >
            {profile.email}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 cursor-pointer items-center px-1 transition-colors hover:text-accent sm:px-2"
          >
            GitHub
          </a>
          {profile.linkedin ? (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 cursor-pointer items-center px-1 transition-colors hover:text-accent sm:px-2"
            >
              LinkedIn
            </a>
          ) : null}
          {profile.hasResume ? (
            <a
              href={profile.resumeFile}
              className="inline-flex min-h-11 cursor-pointer items-center px-1 transition-colors hover:text-accent sm:px-2"
            >
              Resume (PDF)
            </a>
          ) : null}
        </div>
        <p className="mt-10 font-mono text-xs text-muted/60">
          {profile.location}
        </p>
      </div>
    </footer>
  );
}
