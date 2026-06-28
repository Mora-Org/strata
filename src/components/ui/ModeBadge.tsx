import type { StrataMode } from '../../lib/types';

interface ModeBadgeProps {
  mode: StrataMode;
  onClick?: () => void;
}

/**
 * Mode pill on the header right side. Color comes from --accent which is
 * mode-aware via data-mode on <html> (editorial blue for Vereda, warm
 * mustard for Mestre). Layout NEVER changes between modes (regra dura §4).
 */
export function ModeBadge({ mode, onClick }: ModeBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={`Modo ${mode} — clique pra trocar (M2)`}
      className="font-mono text-xs uppercase tracking-[0.06em] px-2 py-1 rounded-1 border border-accent text-accent hover:bg-hover focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
      data-testid="mode-badge"
    >
      {mode}
    </button>
  );
}
