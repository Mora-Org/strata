import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainSurface } from '../chat/MainSurface';

/**
 * App shell grid:
 *   ┌──── header (56px) ──────────┐
 *   │ ▦ strata · masthead · [mode] │
 *   ├────────────┬────────────────┤
 *   │            │                 │
 *   │  Sidebar   │  Main          │
 *   │  260px     │  1fr           │
 *   │            │                 │
 *   └────────────┴────────────────┘
 *
 * When note preview aside opens (M2.4), grid extends to a third column 420px.
 * When branch tree column appears (M3.1), inserts 80px col between sidebar+main.
 * Both are layout changes — but the MODE never changes layout (Director §4).
 */
export function AppShell() {
  return (
    <div className="h-screen w-screen flex flex-col bg-bedrock text-fg-1">
      <Header />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <MainSurface />
      </div>
    </div>
  );
}
