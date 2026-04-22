interface DukkahLogoProps {
  /** Height of the logo in px. */
  height?: number;
  className?: string;
  /** Color of the wordmark + monogram. Defaults to currentColor. */
  color?: string;
  /** Show the "RESTAURANT & BAR" tagline beneath the wordmark. */
  showTagline?: boolean;
}

/**
 * Dukkah wordmark: D U [KK] A H
 * Real typography (thin, wide-tracked) for the letters,
 * plus an SVG double-K monogram in the centre — two K's mirrored
 * back-to-back with their spines toward the middle.
 * Transparent background.
 */
export function DukkahLogo({
  height = 56,
  className,
  color = "currentColor",
  showTagline = true,
}: DukkahLogoProps) {
  // Letter font size scales with overall height
  const letterSize = height * 0.62;
  const monogramSize = height * 0.95;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: height * 0.08,
        color,
        lineHeight: 1,
      }}
      aria-label="Dukkah Restaurant & Bar"
      role="img"
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: letterSize * 0.35,
          fontFamily:
            "'Cormorant Garamond', 'Cormorant', 'Didot', 'Bodoni Moda', Georgia, serif",
          fontWeight: 300,
          fontSize: letterSize,
          letterSpacing: "0.18em",
        }}
      >
        <span>D</span>
        <span>U</span>
        {/* Double-K monogram SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 80 100"
          height={monogramSize}
          width={monogramSize * 0.8}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="square"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          {/* Left K (reversed) — spine on RIGHT, diagonals open LEFT */}
          <path d="M 38 5 L 38 95" />
          <path d="M 38 50 L 8 10" />
          <path d="M 38 50 L 8 90" />
          {/* Right K (normal) — spine on LEFT, diagonals open RIGHT */}
          <path d="M 42 5 L 42 95" />
          <path d="M 42 50 L 72 10" />
          <path d="M 42 50 L 72 90" />
        </svg>
        <span>A</span>
        <span>H</span>
      </span>

      {showTagline && (
        <span
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: height * 0.11,
            letterSpacing: "0.4em",
            opacity: 0.85,
            paddingLeft: "0.4em", // compensate for trailing letter-spacing
          }}
        >
          RESTAURANT &amp; BAR
        </span>
      )}
    </span>
  );
}

export default DukkahLogo;
