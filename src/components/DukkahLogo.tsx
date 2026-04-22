interface DukkahLogoProps {
  /** Height of the logo in px. Width scales with the viewBox aspect ratio. */
  height?: number;
  className?: string;
  /** Color of the wordmark + monogram. Defaults to currentColor. */
  color?: string;
  /** Show the "RESTAURANT & BAR" tagline beneath the wordmark. */
  showTagline?: boolean;
}

/**
 * Dukkah wordmark logo: D U [KK] A H
 * The two K's share a central spine and mirror each other,
 * forming a tall X-like monogram in the middle of the word.
 * Transparent background — inherits page color.
 */
export function DukkahLogo({
  height = 56,
  className,
  color = "currentColor",
  showTagline = true,
}: DukkahLogoProps) {
  // viewBox: 420 wide, 140 tall (with tagline) — keeps aspect close to original
  const vbHeight = showTagline ? 140 : 100;
  const width = (420 / vbHeight) * height;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 420 ${vbHeight}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="Dukkah Restaurant & Bar"
      fill={color}
    >
      {/* ===== Wordmark: D U K K A H, baseline ~ y=90, cap height ~ 70 ===== */}
      {/* Letters drawn as thin geometric strokes — stroke width 5 */}
      <g stroke={color} strokeWidth="5" fill="none" strokeLinecap="square" strokeLinejoin="miter">
        {/* D — left vertical + arched right side */}
        <path d="M 20 20 L 20 90" />
        <path d="M 20 20 L 50 20 Q 75 55 50 90 L 20 90" />

        {/* U — two verticals + bottom curve */}
        <path d="M 80 20 L 80 75 Q 80 90 95 90 L 105 90 Q 120 90 120 75 L 120 20" />

        {/* === Double-K: two K's mirrored back-to-back, diagonals pointing OUTWARD === */}
        {/* Left K (reversed) — spine on the RIGHT at x=180, diagonals open LEFT */}
        <path d="M 180 20 L 180 90" />
        <path d="M 180 55 L 152 20" />
        <path d="M 180 55 L 152 90" />

        {/* Right K (normal) — spine on the LEFT at x=200, diagonals open RIGHT */}
        <path d="M 200 20 L 200 90" />
        <path d="M 200 55 L 228 20" />
        <path d="M 200 55 L 228 90" />

        {/* A — two diagonals + crossbar */}
        <path d="M 235 90 L 260 20 L 285 90" />
        <path d="M 245 65 L 275 65" />

        {/* H — two verticals + crossbar */}
        <path d="M 305 20 L 305 90" />
        <path d="M 345 20 L 345 90" />
        <path d="M 305 55 L 345 55" />
      </g>

      {/* ===== Tagline ===== */}
      {showTagline && (
        <text
          x="210"
          y="125"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="11"
          letterSpacing="4"
          fill={color}
          opacity="0.85"
        >
          RESTAURANT &amp; BAR
        </text>
      )}
    </svg>
  );
}

export default DukkahLogo;
