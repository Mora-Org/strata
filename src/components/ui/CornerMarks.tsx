/**
 * Four `+` glyphs at corners — editorial poster reference (the "retro",
 * "SOLITARY" frame style). Used inside surfaces that should feel like
 * editorial spreads (empty state, main surface).
 *
 * Renders absolute-positioned spans inside a position:relative parent.
 */
export function CornerMarks() {
  const cls =
    'absolute font-mono text-xs text-fg-3 pointer-events-none select-none';
  return (
    <>
      <span aria-hidden className={`${cls} top-2 left-3`}>
        +
      </span>
      <span aria-hidden className={`${cls} top-2 right-3`}>
        +
      </span>
      <span aria-hidden className={`${cls} bottom-2 left-3`}>
        +
      </span>
      <span aria-hidden className={`${cls} bottom-2 right-3`}>
        +
      </span>
    </>
  );
}
