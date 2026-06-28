import { useStrataStore } from '../../store/strata';
import { StrataMark } from '../icons/StrataMark';
import { ModeBadge } from '../ui/ModeBadge';

/**
 * 56px header bar with:
 *  - Strata mark + italic Fraunces wordmark "strata"
 *  - Inline masthead (hyphen-prefixed cols: workspace / vault / model)
 *  - "switch" label + mode badge on the right
 *
 * Editorial pattern: masthead is part of the header itself, not a separate
 * row (consolidação adotada na v3 do kit Claude Design).
 */
export function Header() {
  const { workspace, vault, modelName, mode, setMode } = useStrataStore();

  // In M1.c, clicking the badge swaps mode directly (no confirmation modal yet).
  // Confirmation modal is M2 (see design/ui_kits/strata-desktop/ModeConfirm.jsx).
  const onToggleMode = () => setMode(mode === 'vereda' ? 'mestre' : 'vereda');

  return (
    <header className="h-14 flex items-center px-4 bg-bedrock border-b border-border-1">
      <div className="flex items-center gap-2 text-fg-2">
        <StrataMark size={18} />
        <span
          className="font-serif text-fg-1 leading-none"
          style={{
            fontStyle: 'italic',
            fontVariationSettings: '"opsz" 72, "SOFT" 60',
            fontSize: '17px',
            letterSpacing: '-0.01em',
          }}
        >
          strata
        </span>
      </div>

      <div className="flex-1 flex items-center gap-6 px-6">
        <MastheadCol label="workspace" value={workspace?.name ?? '—'} />
        <MastheadCol label="vault" value={vault?.path ?? '—'} />
        <MastheadCol label="model" value={modelName ?? '—'} />
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.06em] text-fg-3">
          switch
        </span>
        <ModeBadge mode={mode} onClick={onToggleMode} />
      </div>
    </header>
  );
}

interface MastheadColProps {
  label: string;
  value: string;
}

function MastheadCol({ label, value }: MastheadColProps) {
  return (
    <div className="flex items-baseline gap-2 min-w-0">
      <span className="font-mono text-xs uppercase tracking-[0.06em] text-fg-3 whitespace-nowrap">
        {label}
      </span>
      <span className="font-mono text-xs text-fg-2 truncate">{value}</span>
    </div>
  );
}
