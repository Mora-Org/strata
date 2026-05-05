/* Composer.jsx */

const Composer = ({ mode, onSend }) => {
  const [value, setValue] = React.useState("");
  const placeholder = mode === "mestre"
    ? "Ask Strata to read, write, or run something — alterações vão direto ao código."
    : "Ask about the codebase. A note will be drafted; nothing is written without your confirmation.";

  const send = () => {
    const v = value.trim();
    if (!v) return;
    onSend(v);
    setValue("");
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="composer">
      <div className="composer-inner">
        <textarea
          rows={1}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
        />
        <Button variant="primary" onClick={send} disabled={!value.trim()}>Send</Button>
      </div>
      <div className="hint">
        <span className="kbd">↵ send · ⇧↵ newline</span>
        <span className="kbd">·</span>
        <span className="kbd">{mode === "mestre" ? "mestre · changes go to code" : "vereda · explains, never edits"}</span>
      </div>
    </div>
  );
};

window.Composer = Composer;
