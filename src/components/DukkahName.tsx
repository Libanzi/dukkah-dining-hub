/**
 * Inline "Dukkah" wordmark for use inside body text/headings.
 * Renders Du + mirrored-KK monogram (SVG) + ah, all inline.
 * Inherits current text color and font size automatically.
 */
export function DukkahName({ className }: { className?: string }) {
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.04em", whiteSpace: "nowrap" }}
    >
      <span>Du</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 70"
        height="0.7em"
        width="0.95em"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        aria-hidden="true"
        style={{ display: "inline-block", verticalAlign: "middle", marginBottom: "0.08em" }}
      >
        {/* Left K (reversed) — spine at x=38, diagonals open LEFT, wider gap */}
        <path d="M 38 6 L 38 64" />
        <path d="M 38 35 L 14 8" />
        <path d="M 38 35 L 14 62" />
        {/* Right K (normal) — spine at x=62, diagonals open RIGHT, wider gap */}
        <path d="M 62 6 L 62 64" />
        <path d="M 62 35 L 86 8" />
        <path d="M 62 35 L 86 62" />
      </svg>
      <span>ah</span>
    </span>
  );
}

export default DukkahName;
