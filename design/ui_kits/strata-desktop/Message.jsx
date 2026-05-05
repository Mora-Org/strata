/* Message.jsx — markdown-rich message bubble */

const renderInline = (parts) =>
  parts.map((p, i) => {
    if (typeof p === "string") return <React.Fragment key={i}>{p}</React.Fragment>;
    if (p.bridge) return <Bridge key={i}>{p.bridge}</Bridge>;
    if (p.ref)    return <RefChip key={i} href={p.href}>{p.ref}</RefChip>;
    if (p.wiki)   return <WikiChip key={i}>{p.wiki}</WikiChip>;
    if (p.code)   return <code key={i} style={{ font: "var(--type-mono-sm)", background: "var(--vein)", padding: "1px 5px", borderRadius: 3 }}>{p.code}</code>;
    return null;
  });

const Message = ({ msg, onPreviewNote }) => {
  if (msg.role === "user") {
    return (
      <div className="msg">
        <div className="msg-avatar">u</div>
        <div className="msg-body">
          <div className="text" style={{ font: "400 15px/1.55 var(--font-sans)" }}>{msg.text}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="msg">
      <div className="msg-avatar strata">
        <svg viewBox="0 0 64 64" width="11" height="11" fill="currentColor">
          <rect x="8" y="14" width="48" height="6" rx="1" opacity="1"/>
          <rect x="8" y="24" width="48" height="6" rx="1" opacity="0.65"/>
          <rect x="8" y="34" width="48" height="6" rx="1" opacity="0.40"/>
          <rect x="8" y="44" width="48" height="6" rx="1" opacity="0.22"/>
        </svg>
      </div>
      <div className="msg-body">
        <div className="text">
          {msg.paragraphs.map((parts, i) => <p key={i}>{renderInline(parts)}</p>)}
        </div>
        {msg.meta && (
          <div className="msg-meta">
            <Bloom level={msg.meta.bloom} />
            <span style={{ font: "var(--type-mono-sm)", color: "var(--fg-3)" }}>· {msg.meta.refs} ref · {msg.meta.wikis} link</span>
          </div>
        )}
        {msg.noteCandidate && (
          <div className="msg-actions">
            <Button variant="primary" onClick={onPreviewNote}>Preview note</Button>
            <Button>Ask follow-up</Button>
          </div>
        )}
      </div>
    </div>
  );
};

window.Message = Message;
