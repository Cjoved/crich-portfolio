export default function Tag({ children }: { children: string }) {
  return (
    <span className="inline-block rounded border border-line bg-surface px-2 py-1 font-mono text-[0.7rem] tracking-tight text-muted">
      {children}
    </span>
  );
}
