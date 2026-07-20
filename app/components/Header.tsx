import Link from "next/link";

export default function Header() {
  return (
    <header className="mx-auto flex max-w-[72rem] items-center justify-between px-6 py-8 sm:px-10">
      <Link href="/" className="font-display text-sm font-semibold tracking-tight text-ink">
        Crich Veridiano
      </Link>
      <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-muted">
        <Link href="/#projects" className="transition-colors hover:text-accent">
          Projects
        </Link>
        <Link href="/#about" className="transition-colors hover:text-accent">
          About
        </Link>
        <Link href="/#contact" className="transition-colors hover:text-accent">
          Contact
        </Link>
      </nav>
    </header>
  );
}
