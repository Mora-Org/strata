/**
 * Four-stratum brand glyph — sedimentary layers stacked, each one slightly
 * shorter/dimmer than the one above. Placeholder pre-final-brand (ADR-0003).
 *
 * Matches the SVG in design/assets/strata-mark.svg and header glyph used in
 * design/ui_kits/strata-desktop/Header.jsx.
 */
interface StrataMarkProps {
  size?: number;
  className?: string;
}

export function StrataMark({ size = 18, className }: StrataMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <rect x="8" y="14" width="48" height="6" rx="1" opacity="1" />
      <rect x="8" y="24" width="48" height="6" rx="1" opacity="0.65" />
      <rect x="8" y="34" width="48" height="6" rx="1" opacity="0.40" />
      <rect x="8" y="44" width="48" height="6" rx="1" opacity="0.22" />
    </svg>
  );
}
