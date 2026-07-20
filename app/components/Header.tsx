import Link from "next/link";

export default function Header() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-bg"
      >
        Skip to content
      </a>
      <header className="mx-auto flex max-w-[72rem] items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
        <Link
          href="/"
          className="inline-flex min-h-11 cursor-pointer items-center font-display text-sm font-semibold tracking-tight text-ink"
        >
          Crich Veridiano
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-muted sm:gap-2"
        >
          <Link
            href="/#projects"
            className="inline-flex min-h-11 cursor-pointer items-center px-2 transition-colors hover:text-accent sm:px-3"
          >
            Projects
          </Link>
          <Link
            href="/#about"
            className="inline-flex min-h-11 cursor-pointer items-center px-2 transition-colors hover:text-accent sm:px-3"
          >
            About
          </Link>
          <Link
            href="/#contact"
            className="inline-flex min-h-11 cursor-pointer items-center px-2 transition-colors hover:text-accent sm:px-3"
          >
            Contact
          </Link>
        </nav>
      </header>
    </>
  );
}
