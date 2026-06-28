import { useStrataStore } from '../../store/strata';

/**
 * Footer com keyboard hints + mode marker, entre `+` corner marks.
 *
 * Editorial pattern from design/ui_kits/strata-desktop/index.html — final
 * row of the main column with mono hints separated by `·` and tagline that
 * adapts per mode ("explica, não edita" vs "executa quando você confirma").
 */
export function FooterHints() {
  const mode = useStrataStore((s) => s.mode);
  const tagline =
    mode === 'vereda' ? 'explica, não edita' : 'executa quando você confirma';

  return (
    <div className="flex items-center justify-between px-4 py-2 font-mono text-xs text-fg-3">
      <span aria-hidden>+</span>
      <div className="flex items-center gap-2">
        <Kbd>↵</Kbd>
        <span>send</span>
        <Sep />
        <Kbd>⇧↵</Kbd>
        <span>newline</span>
        <Sep />
        <span>{mode}</span>
        <Sep />
        <span>{tagline}</span>
      </div>
      <span aria-hidden>+</span>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <span className="text-fg-2">{children}</span>;
}

function Sep() {
  return <span className="text-fg-4">·</span>;
}
