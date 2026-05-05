/* Header.jsx */

const Header = ({ mode, onToggleMode, data }) => (
  <header className="header">
    <div className="header-inner">
      <div className="header-title">
        <svg viewBox="0 0 64 64" width="16" height="16" fill="currentColor" style={{ color: "var(--fg-2)" }}>
          <rect x="8" y="14" width="48" height="6" rx="1" opacity="1"/>
          <rect x="8" y="24" width="48" height="6" rx="1" opacity="0.65"/>
          <rect x="8" y="34" width="48" height="6" rx="1" opacity="0.40"/>
          <rect x="8" y="44" width="48" height="6" rx="1" opacity="0.22"/>
        </svg>
        <span className="strata">strata</span>
      </div>
      <div className="masthead" style={{ flex: 1, border: 0, padding: "0 18px" }}>
        <div className="col"><span className="lbl">workspace</span><span className="val">{data?.workspace?.name || "—"}</span></div>
        <div className="col"><span className="lbl">vault</span><span className="val">{data?.vault?.path || "—"}</span></div>
        <div className="col"><span className="lbl">model</span><span className="val">{data?.ollama?.model || "—"}</span></div>
      </div>
      <div className="header-actions">
        <span style={{ font: "var(--type-mono-sm)", color: "var(--fg-3)" }}>switch</span>
        <span onClick={onToggleMode} style={{ cursor: "pointer" }} title="Switch mode (requires confirmation)">
          <ModeBadge mode={mode} />
        </span>
      </div>
    </div>
  </header>
);

window.Header = Header;
