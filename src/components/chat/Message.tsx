import type { Message as MessageType } from '../../types/messages';
import { StrataMark } from '../icons/StrataMark';

interface MessageProps {
  msg: MessageType;
}

/**
 * Chat message renderer — user vs strata.
 *
 * M1.c renders text only. M1.d/M2 will add inline elements (bridge,
 * ref-chip, wiki-chip) + meta footer (bloom, refs, [Preview note]).
 *
 * Editorial pattern from design/ui_kits/strata-desktop/Message.jsx:
 * NO bubble background. The message IS the type itself. Mark glyph
 * before text indicates role.
 */
export function Message({ msg }: MessageProps) {
  if (msg.role === 'user') {
    return (
      <div className="flex gap-3 py-3" data-testid="message-user">
        <span className="font-mono text-fg-3 text-sm flex-shrink-0" aria-hidden>
          [u]
        </span>
        <p className="font-sans text-fg-1 text-sm leading-relaxed">{msg.text}</p>
      </div>
    );
  }

  return (
    <div className="flex gap-3 py-3" data-testid="message-strata">
      <span className="text-fg-3 flex-shrink-0 mt-0.5" aria-hidden>
        <StrataMark size={16} />
      </span>
      <p
        className="font-serif text-fg-1 leading-relaxed"
        style={{
          fontSize: '16px',
          fontVariationSettings: '"opsz" 18, "SOFT" 0',
          lineHeight: 1.7,
        }}
      >
        {msg.text}
      </p>
    </div>
  );
}
