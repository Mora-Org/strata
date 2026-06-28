import { useStrataStore } from '../../store/strata';

/**
 * 260px sidebar (fixed) with 3 sections:
 *  WORKSPACE — current workspace name + path
 *  CONVERSATIONS — list (empty placeholder in M1.c — populated in M1.e)
 *  VAULT — status bullets (vault path + ollama reachability)
 *
 * Bottom row: "+ nova" button (placeholder) + ⚙ Settings button (placeholder).
 * Real wireup comes in M1.e.
 */
export function Sidebar() {
  const { workspace, vault, ollamaStatus, modelName } = useStrataStore();

  return (
    <aside className="w-[260px] shrink-0 flex flex-col bg-vein border-r border-border-1">
      <SideSection label="workspace">
        {workspace ? (
          <div>
            <div className="text-sm text-fg-1">{workspace.name}</div>
            <div className="font-mono text-xs text-fg-3 truncate">{workspace.path}</div>
          </div>
        ) : (
          <div className="text-xs text-fg-3">— não definido —</div>
        )}
      </SideSection>

      <SideSection label="conversações" grow>
        <div className="text-xs text-fg-3">— nenhuma conversa ainda —</div>
      </SideSection>

      <SideSection label="vault">
        <StatusRow status={vault ? 'ok' : 'unknown'} label={vault?.path ?? '— não definido —'} />
        <StatusRow
          status={ollamaStatus === 'reachable' ? 'ok' : ollamaStatus === 'unreachable' ? 'error' : 'unknown'}
          label={`ollama${modelName ? ` · ${modelName}` : ''}`}
        />
      </SideSection>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border-1">
        <button
          type="button"
          className="font-mono text-xs text-fg-2 hover:text-fg-1 focus:outline-none focus-visible:underline"
          data-testid="sidebar-new-chat"
        >
          + nova
        </button>
        <button
          type="button"
          aria-label="Configurações"
          className="text-fg-3 hover:text-fg-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-1"
          data-testid="sidebar-settings"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

interface SideSectionProps {
  label: string;
  children: React.ReactNode;
  grow?: boolean;
}

function SideSection({ label, children, grow = false }: SideSectionProps) {
  return (
    <div className={`px-4 py-3 ${grow ? 'flex-1 overflow-y-auto' : ''}`}>
      <div className="font-mono text-xs uppercase tracking-[0.06em] text-fg-3 mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}

interface StatusRowProps {
  status: 'ok' | 'error' | 'unknown';
  label: string;
}

function StatusRow({ status, label }: StatusRowProps) {
  const dotColor =
    status === 'ok' ? 'bg-success' : status === 'error' ? 'bg-error' : 'bg-fg-4';
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`inline-block w-2 h-2 rounded-full ${dotColor}`} aria-hidden />
      <span className="font-mono text-fg-2 truncate">{label}</span>
    </div>
  );
}
