/* NotePreview.jsx — right-aside card shown when previewing a note */

const renderNoteParts = (parts) =>
  parts.map((p, i) => {
    if (typeof p === "string") return <React.Fragment key={i}>{p}</React.Fragment>;
    if (p.ref)  return <RefChip key={i}>{p.ref}</RefChip>;
    if (p.wiki) return <WikiChip key={i}>{p.wiki}</WikiChip>;
    if (p.code) return <code key={i}>{p.code}</code>;
    return null;
  });

const NotePreview = ({ draft, onClose, onWrite }) => (
  <div className="aside-inner">
    <div className="aside-title">
      <span className="lbl">Note preview</span>
      <span style={{ cursor: "pointer", color: "var(--fg-3)" }} onClick={onClose}><Icon name="x" size={14} /></span>
    </div>
    <div className="t-mono-sm" style={{ color: "var(--fg-3)", marginBottom: 10 }}>
      This will create a note at <span style={{ color: "var(--fg-2)" }}>{draft.path}</span>.
    </div>

    <div className="note-card frame marks" style={{ position: "relative", paddingLeft: 4 }}>
      <span className="bloom-rail" style={{ background: "var(--bloom-3)" }} />
      <span className="mark-tl">+</span><span className="mark-br">+</span>
      <div className="note-fm">
        {draft.frontmatter.map(([k, v]) => (
          <div key={k}><span className="key">{k}</span>: <span className="value">{v}</span></div>
        ))}
      </div>
      <div className="note-body note">
        {draft.body.map((b, i) => {
          if (b.kind === "h" && b.level === 2) return <h2 key={i}>{b.text}</h2>;
          if (b.kind === "h" && b.level === 3) return <h3 key={i}>{b.text}</h3>;
          if (b.kind === "p") return <p key={i}>{renderNoteParts(b.parts)}</p>;
          return null;
        })}
      </div>
    </div>

    <div className="aside-actions">
      <Button variant="primary" onClick={onWrite}>Write to vault</Button>
      <Button>Edit first</Button>
      <Button variant="ghost" onClick={onClose}>Discard</Button>
    </div>
  </div>
);

window.NotePreview = NotePreview;
