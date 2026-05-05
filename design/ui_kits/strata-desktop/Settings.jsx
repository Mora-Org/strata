/* Settings.jsx */

const Settings = ({ onClose }) => (
  <div className="settings">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
      <div>
        <h2>Settings</h2>
        <div className="sub">Local-first. Everything is on your machine.</div>
      </div>
      <Button variant="ghost" onClick={onClose}>Close</Button>
    </div>

    <div className="group">
      <div className="grp-label">vault</div>
      <div className="field"><div className="f-lbl">Path</div><input defaultValue="~/notes/strata" /></div>
      <div className="field"><div className="f-lbl">Inbox folder</div><input defaultValue="inbox/" /></div>
      <div className="field"><div className="f-lbl">File naming</div><input defaultValue="{date}-{slug}.md" /></div>
    </div>

    <div className="group">
      <div className="grp-label">model</div>
      <div className="field"><div className="f-lbl">Provider</div><select><option>Ollama (local)</option><option>llama.cpp</option><option>OpenAI-compatible endpoint</option></select></div>
      <div className="field"><div className="f-lbl">Default model</div><select><option>llama3.1:8b</option><option>llama3.1:70b</option><option>qwen2.5-coder:14b</option></select></div>
      <div className="field"><div className="f-lbl">Endpoint</div><input defaultValue="http://localhost:11434" /></div>
    </div>

    <div className="group">
      <div className="grp-label">notes</div>
      <div className="field"><div className="f-lbl">Default Bloom level</div><select defaultValue="3"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select></div>
      <div className="field"><div className="f-lbl">Include frontmatter</div><div className="f-val">enabled · YAML</div></div>
      <div className="field"><div className="f-lbl">Auto-link references</div><div className="f-val">enabled</div></div>
    </div>

    <div className="group">
      <div className="grp-label">appearance</div>
      <div className="field"><div className="f-lbl">Theme</div><select defaultValue="dark"><option value="dark">dark (default)</option><option value="light">light</option></select></div>
      <div className="field"><div className="f-lbl">Reading width</div><div className="f-val">72ch</div></div>
    </div>
  </div>
);

window.Settings = Settings;
