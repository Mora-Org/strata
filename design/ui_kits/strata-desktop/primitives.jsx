/* primitives.jsx — small reusable bits for the Strata kit */

const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    message:  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    note:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    folder:   <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
    plus:     <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    search:   <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    book:     <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
    chevron:  <polyline points="6 9 12 15 18 9" />,
    x:        <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  };
  return <svg {...common} style={{ display: "block", flex: "0 0 auto" }}>{paths[name]}</svg>;
};

const Button = ({ variant = "default", children, onClick, disabled }) => {
  const cls = variant === "primary" ? "btn btn-primary" : variant === "ghost" ? "btn btn-ghost" : "btn";
  return <button className={cls} onClick={onClick} disabled={disabled}>{children}</button>;
};

const ModeBadge = ({ mode }) => (
  <span className="mode-badge">{mode}</span>
);

const Bridge = ({ children, onClick }) => (
  <span className="bridge" onClick={onClick} role="link" tabIndex={0}>{children}</span>
);

const RefChip = ({ children, href }) => (
  <a className="ref-chip" href={href || "#"} onClick={(e) => e.preventDefault()}>{children}<span aria-hidden> ↗</span></a>
);

const WikiChip = ({ children, onClick }) => (
  <span className="wiki-chip" onClick={onClick} role="link" tabIndex={0}>{children}</span>
);

const Bloom = ({ level, children }) => (
  <span className={`bloom bloom-${level}`}>{children || `L${level}`}</span>
);

const Tag = ({ children }) => <span className="tag">{children}</span>;

const StatusDot = ({ tone = "fg-3" }) => {
  const map = { ok: "var(--success)", accent: "var(--accent)", muted: "var(--fg-3)", error: "var(--error)" };
  return <span className="status-dot" style={{ background: map[tone] || map.muted }} />;
};

Object.assign(window, { Icon, Button, ModeBadge, Bridge, RefChip, WikiChip, Bloom, Tag, StatusDot });
