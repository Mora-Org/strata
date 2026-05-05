/* Sidebar.jsx */

const Sidebar = ({ data, activeChat, onSelectChat, onOpenSettings, onNewChat }) => (
  <aside className="sidebar">
    <div className="side-section">
      <div className="side-label">workspace</div>
      <div className="workspace">
        <Icon name="folder" size={14} color="var(--fg-2)" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="ws-name">{data.workspace.name}</div>
          <div className="ws-path">{data.workspace.path}</div>
        </div>
      </div>
    </div>

    <div className="side-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div className="side-label" style={{ marginBottom: 0 }}>conversations</div>
        <span onClick={onNewChat} style={{ cursor: "pointer", color: "var(--fg-3)", display: "inline-flex" }} title="New conversation">
          <Icon name="plus" size={14} />
        </span>
      </div>
      <div className="chat-list">
        {data.chats.map((c) => (
          <div
            key={c.id}
            className={`chat-item ${c.id === activeChat ? "active" : ""}`}
            onClick={() => onSelectChat(c.id)}
          >
            <div className="ttl">{c.title}</div>
            <div className="meta">{c.updated}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="side-section">
      <div className="side-label">vault</div>
      <div className="status-rows">
        <div className="status-row"><StatusDot tone="accent" /><span className="lbl">{data.vault.path}</span></div>
        <div className="status-row"><StatusDot tone={data.ollama.connected ? "ok" : "error"} /><span className="lbl">ollama · {data.ollama.model}</span></div>
      </div>
    </div>

    <div className="side-section" style={{ borderBottom: 0 }}>
      <div className="chat-item" onClick={onOpenSettings} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Icon name="settings" size={14} color="var(--fg-2)" />
        <span className="ttl">settings</span>
      </div>
    </div>
  </aside>
);

window.Sidebar = Sidebar;
