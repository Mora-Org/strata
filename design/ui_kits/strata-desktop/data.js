/* data.js — seed for the Strata click-thru */

window.__STRATA_DATA = {
  workspace: { name: "strata-cli", path: "~/code/strata-cli" },
  vault:     { name: "notes",       path: "~/notes/strata" },
  ollama:    { model: "llama3.1:8b", connected: true },
  chats: [
    { id: "c1", title: "Rust lifetimes", updated: "5 min ago", active: true },
    { id: "c2", title: "Tokio task lifecycle", updated: "yesterday" },
    { id: "c3", title: "PostgreSQL MVCC", updated: "2 days ago" },
    { id: "c4", title: "Why CRDTs are hard", updated: "last week" },
  ],
  initialMessages: [
    {
      id: "m1", role: "user",
      text: "Why does the borrow checker complain about my parser? It compiles fine until I introduce the lookahead.",
    },
    {
      id: "m2", role: "strata",
      paragraphs: [
        ["The mutable borrow you take on the lookahead at ", { bridge: "src/parser/expr.rs:142" }, " outlives the immutable borrow held by the caller on ", { bridge: "src/parser/expr.rs:118" }, ". The compiler can't prove they don't alias."],
        ["This is a scope problem, not a memory problem — see ", { ref: "Klabnik & Nichols, ch.10", href: "#" }, " for the canonical treatment, or ", { wiki: "borrow-checker-mental-model" }, " in your vault."],
        ["The simplest fix is to take ownership of the token slice before the lookahead, rather than borrowing it across the call boundary."],
      ],
      meta: { bloom: 3, refs: 1, wikis: 1 },
      noteCandidate: true,
    },
  ],
  noteDraft: {
    path: "inbox/2026-05-04-rust-lifetimes.md",
    frontmatter: [
      ["title", "Rust lifetimes — scopes, not memory"],
      ["created", "2026-05-04"],
      ["source", "src/parser/expr.rs:142"],
      ["bloom", "3"],
      ["refs", "[Klabnik §10]"],
      ["tags", "[rust, lifetimes, borrow-checker]"],
    ],
    body: [
      { kind: "h", level: 2, text: "Lifetimes are scopes, not memory." },
      { kind: "p", parts: ["A lifetime is a label the compiler uses to verify two references are valid simultaneously. It does not change runtime behavior — see ", { ref: "Klabnik §10" }, "."] },
      { kind: "p", parts: ["The mutable-borrow conflict in ", { code: "parse_expr" }, " arises because the lookahead extends a borrow past the scope where the caller still holds an immutable reference."] },
      { kind: "h", level: 3, text: "See also" },
      { kind: "p", parts: [{ wiki: "borrow-checker-mental-model" }, " · ", { wiki: "rust-aliasing-rules" }] },
    ],
  },
};
