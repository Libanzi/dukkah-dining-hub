interface DukkahLogoProps {
  size?: number;
  className?: string;
  /** Stroke color for the K marks. Defaults to current text color. */
  markColor?: string;
  /** Background fill of the circle. Defaults to cream/bg. */
  circleColor?: string;
  /** Optional ring/border color. */
  ringColor?: string;
}

/**
 * Dukkah double-K monogram inside a circle.
 * Two mirrored K letterforms sharing a central vertical spine.
 * Pure geometry — no gradients, no shadows.
 */
export function DukkahLogo({
  size = 64,
  className,
  markColor = "currentColor",
  circleColor = "var(--bg-primary)",
  ringColor,
}: DukkahLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Dukkah monogram"
    >
      {/* Circle background */}
      <circle
        cx="100"
        cy="100"
        r="98"
        fill={circleColor}
        stroke={ringColor ?? "none"}
        strokeWidth={ringColor ? 2 : 0}
      />

      {/* Double-K monogram, centered. Two vertical spines + 4 diagonals. */}
      <g fill={markColor}>
        {/* Left K vertical spine */}
        <rect x="78" y="40" width="10" height="120" />
        {/* Right K vertical spine */}
        <rect x="112" y="40" width="10" height="120" />

        {/* Left K — mirrored (diagonals open to the LEFT) */}
        {/* Upper diagonal: from spine-top-left going down-left to bottom-left */}
        <polygon points="78,98 78,112 38,160 24,160" />
        {/* Lower diagonal: from spine going up-left to top-left */}
        <polygon points="78,88 78,102 38,40 24,40" />

        {/* Right K — normal (diagonals open to the RIGHT) */}
        {/* Upper diagonal: spine to top-right */}
        <polygon points="122,102 122,88 162,40 176,40" />
        {/* Lower diagonal: spine to bottom-right */}
        <polygon points="122,112 122,98 162,160 176,160" />
      </g>
    </svg>
  );
}

export default DukkahLogo;
