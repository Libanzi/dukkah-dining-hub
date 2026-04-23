/**
 * Inline "Dukkah" wordmark: Du + mirrored-k + k + ah.
 * Uses CSS scaleX(-1) so the reversed K inherits the exact same font as surrounding text.
 */
export function DukkahName({ className }: { className?: string }) {
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}
    >
      <span>Du</span>
      <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>k</span>
      <span>kah</span>
    </span>
  );
}

export default DukkahName;
