# Strata

A study harness for the terminal. You ask about a concept, it looks for sources, keeps the ones it used in a collection that belongs to you, and answers with links you can check.

Strata is at an early stage. One person is building it, it runs only in the terminal, and it has been tried on one machine and one model provider. The parts that do not exist yet are listed further down, under plans.

## Why it exists

Whoever does not dig in does not learn, they only copy and paste code. A language model also invents things and takes no responsibility for them. Sources can be wrong too, but a source has a name and an address, so over time you learn whom to trust. That is the idea behind Strata. The longer version is in the [manifesto](manifesto.md), in English and Portuguese.

## What works today

1. Study mode is the only mode. It does not hurry you. It reads your collection first and searches arXiv and Crossref only when the collection is not enough. It can also write example code when that helps.
2. Every source it uses is saved as a markdown note. Every answer cites its sources as `[fonte:id]` and ends with a list of which saved sources to read next, in order.
3. A citation check refuses an answer that cites a source that is not in the collection.
4. The knowledge of the model itself starts switched off, so a concept has to come from a source. The command `/conhecimento ligado` switches it on, and `/conhecimento desligado` switches it off again.
5. The behavior of the study mode lives in a markdown file, `harness/modos/estudo.md`. Changing how it behaves means editing text.

## The collection

It is a folder of plain markdown, organized as a tree of indexes:

```
acervo/
  INDICE.md          one topic per line
  temas/<topic>.md   one source per line, in reading order
  fontes/<id>.md     one note per source
```

The model chooses the topic, the summary and the order. The program writes the files and rebuilds the indexes. The default folder is `~/Strata/acervo`, and you can change it in the config. Put the folder inside an Obsidian vault if you want to open it there, but nothing depends on Obsidian.

## Try it

You need [Bun](https://bun.sh) and an API key for OpenCode Go in the `OPENCODE_API_KEY` environment variable. Bun is required because the model library needs a newer Node than many machines have.

```
cd harness
bun install
bun test
bun run src/main.ts
```

The test suite uses no network. The commands inside the program are `/conhecimento ligado`, `/conhecimento desligado`, `/acervo` and `/sair`.

Without a config file it uses OpenCode Go with the model `deepseek-v4-flash`. To change that, create `~/.strata/config.json`:

```json
{
  "provedor": "opencode-go",
  "modelo": "deepseek-v4-flash",
  "acervo": "C:\\Users\\you\\Strata\\acervo",
  "conhecimento_ligado": false
}
```

A key written in that file is rejected on purpose. Keys come only from the environment.

`bun build --compile` produces a single executable of about 88 MB, most of it the Bun runtime. The executable looks for the `modos` folder next to itself.

## Known problems

1. arXiv answered with timeouts and rate limit errors on the last day of testing, even for a single request. The program now waits four seconds between arXiv requests, which is a stopgap. The model usually works around a failed search by opening the arXiv page directly.
2. Only the `opencode-go` provider is included in the executable.
3. Pages that are PDFs cannot be read.
4. Only input through a pipe was tested. The interactive prompt was not.

## Plans

None of this exists yet.

1. A desktop window with Tauri, with a memory limit of 400 MB. The folder `src` and `src-tauri` hold only a shell from May that has no chat.
2. An action mode that writes, edits and runs code, which you could make the default.
3. Web search for lessons and course material, and more sources of papers.
4. Marking a source as good or as discarded for good, so the next search never brings it back.
5. Advice about local models, with their cost and privacy trade offs, based on how much memory your machine has.

## Two rules no setting changes

1. Strata never sends your data out. Only what goes to the provider you chose leaves the machine, with no telemetry and no hidden third party. With a local model nothing leaves. With a cloud model, Strata is meant to say plainly what is leaving. This second part is not built yet.
2. Every cited source exists.

## Repository map

1. `harness` is the program.
2. `design` is the visual language for the future window.
3. `.speckit` holds plans, decisions and the direction of the project.

Strata is a [Mora](https://github.com/Mora-Org) project and is released under the MIT license.
