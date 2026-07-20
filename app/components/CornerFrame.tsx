import { ReactNode } from "react";

/**
 * The site's one signature visual element: four L-shaped corner marks, styled after a
 * computer-vision bounding box (a nod to the YOLO/detection work in Crich's projects).
 * They sit quiet at low opacity and brighten + expand slightly on hover/focus.
 *
 * Reuse this for emphasis moments (project cards, featured images). Don't build a second,
 * competing signature element elsewhere — see AGENTS.md.
 */
export default function CornerFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const corner =
    "absolute h-4 w-4 border-accent/40 transition-all duration-300 group-hover:border-accent group-hover:h-5 group-hover:w-5";

  return (
    <div className={`group relative ${className}`}>
      <span className={`${corner} -top-px -left-px border-l-2 border-t-2`} />
      <span className={`${corner} -top-px -right-px border-r-2 border-t-2`} />
      <span className={`${corner} -bottom-px -left-px border-l-2 border-b-2`} />
      <span className={`${corner} -bottom-px -right-px border-r-2 border-b-2`} />
      {children}
    </div>
  );
}
