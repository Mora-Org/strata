/* ModeConfirm.jsx — friction modal for switching to Mestre */

const ModeConfirm = ({ from, to, onCancel, onConfirm }) => {
  const goingMestre = to === "mestre";
  return (
    <div className="scrim" onClick={onCancel}>
      <div className="modal frame marks" onClick={(e) => e.stopPropagation()} data-mode={to} style={{
        ["--accent"]: goingMestre ? "var(--accent-mestre)" : "var(--accent-vereda)",
        ["--accent-fg"]: goingMestre ? "var(--accent-mestre-fg)" : "var(--accent-vereda-fg)",
        padding: 0, overflow: "hidden",
      }}>
        <span className="mark-tl">+</span><span className="mark-br">+</span>
        <div className="accent-bar" />
        <div style={{ padding: "18px 22px 18px" }}>
          <div className="masthead" style={{ border: 0, padding: "0 0 12px 0" }}>
            <div className="col"><span className="lbl">mode</span><span className="val">{to}</span></div>
            <div className="col"><span className="lbl">action</span><span className="val">confirm change</span></div>
          </div>
          <div className="italic-display" style={{ fontSize: 30, maxWidth: "20ch", margin: "4px 0 12px" }}>
            {goingMestre ? "Entrar em Modo Mestre?" : "Return to Modo Vereda?"}
          </div>
          <p style={{ margin: "0 0 16px", maxWidth: "46ch" }}>
            {goingMestre
              ? "Mestre permits Strata to read, write, and execute. Changes will go directly to your code. Notes and references continue to be written to your vault."
              : "Vereda explains and writes notes. Strata will not modify code from this conversation."}
          </p>
          <div className="modal-actions">
            <Button variant="ghost" onClick={onCancel}>Stay in {from}</Button>
            <Button variant="primary" onClick={onConfirm}>Enter {to}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

window.ModeConfirm = ModeConfirm;
