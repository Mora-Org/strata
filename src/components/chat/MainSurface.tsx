import { useStrataStore } from '../../store/strata';
import { Message } from './Message';
import { Composer } from './Composer';
import { FooterHints } from '../layout/FooterHints';
import { CornerMarks } from '../ui/CornerMarks';

/**
 * Main column — chat messages scrollable + composer fixed at bottom + footer
 * hints. Wraps everything in `position:relative` so CornerMarks can absolute-
 * position the four `+` glyphs.
 *
 * M1.c empty state is intentionally minimal placeholder. The full editorial
 * empty state (italic display quote + bloom cheat sheet) lands in M1.f.
 */
export function MainSurface() {
  const messages = useStrataStore((s) => s.messages);

  return (
    <main className="relative flex-1 flex flex-col bg-bedrock min-w-0">
      <CornerMarks />

      <div className="flex-1 overflow-y-auto px-4 pt-12 pb-2">
        {messages.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          <div className="max-w-[720px] mx-auto">
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} />
            ))}
          </div>
        )}
      </div>

      <Composer />
      <FooterHints />
    </main>
  );
}

function EmptyPlaceholder() {
  return (
    <div className="max-w-[600px] mx-auto pt-16">
      <p
        className="font-serif italic text-fg-1"
        style={{
          fontSize: '36px',
          fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
          lineHeight: 1.1,
          letterSpacing: '-0.015em',
        }}
      >
        Cada sessão é uma camada. O resto é seu.
      </p>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.06em] text-fg-3">
        — manifesto §III
      </p>
      <div className="mt-8 h-[3px] bg-accent w-20" aria-hidden />
      <p className="mt-8 text-xs text-fg-3">
        M1.c shell — empty state editorial completa em M1.f.
      </p>
    </div>
  );
}
