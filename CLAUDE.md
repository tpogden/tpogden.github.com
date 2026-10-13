# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Setup

1. Install [Quarto CLI](https://quarto.org/docs/get-started/).
2. Install [uv](https://docs.astral.sh/uv/) and sync Python dependencies:
   ```bash
   uv sync
   ```

## Commands

```bash
quarto preview --render html   # dev server with hot reload
quarto render                  # production build → _site/
bash scripts/clean.sh          # remove shadow dirs after build
quarto publish gh-pages        # publish to GitHub Pages (CI does this on push to master)

uv run ruff format .           # black-style formatting + isort
uv run ruff check --fix .      # lint and auto-fix
```

## Architecture

Posts live under `_posts/category/slug/`. Quarto ignores `_`-prefixed directories, so they aren't rendered directly.

`scripts/pre-render.sh` runs before each render. It creates root-level **shadow directories** — real dirs whose contents are symlinks into `_posts/category/slug/`. Quarto renders `slug/index.qmd` → `_site/slug/index.html`, giving flat URLs without any post-processing.

Shadow dirs persist after render so `quarto preview`'s file-hash tracking (`ServeRenderManager.fileRenderHash`) can find source files. They are gitignored (managed by the pre-render script) and can be cleaned up manually with `bash scripts/clean.sh`.

`_metadata.yml` at the repo root applies `freeze: true` to all posts. The `_posts/_metadata.yml` file exists but doesn't cascade through symlinks, so the root-level file is the effective one.

## Post categories

| Category | Path |
|---|---|
| research | `_posts/research/` |
| mf | `_posts/mf/` (Moving Figures) |
| reading | `_posts/reading/` |
| travel | `_posts/travel/` |
| personal | `_posts/personal/` |

`index.qmd` uses five Quarto listings with `contents: "*/index.qmd"` and `include: categories:` filters to separate sections.

## Creating posts

Each post is a directory under `_posts/category/slug/` containing at minimum an `index.qmd`. Minimal frontmatter:

```yaml
---
title: "Post Title"
date: "YYYY-MM-DD"
categories: [research]   # one of: research, mf, reading, travel, personal
---
```

An optional `assets/` subdirectory holds images and data files. After adding a post, run `quarto preview` or `quarto render` — the pre-render script will create the shadow dir and wire it into the listings automatically.

## Shared JavaScript in `{ojs}` cells

Shared modules live in `lib/` (top-level, non-underscore, so Quarto copies it into `_site/` as-is; underscore-prefixed dirs are ignored). `lib/gpu.js` holds the WebGPU setup, buffer helpers and animation loop used by the Moving Figures posts. Import a module from a cell with a dynamic import resolved against the page URL:

```js
const gpu = await import(new URL("../lib/gpu.js", document.baseURI).href);
```

The `../` is relative to the page (`/slug/`), which is also how it works from the shadow dirs. These alternatives were tried and **do not work**:

- `import("../lib/gpu.js")` with a string literal: Quarto resolves it against the OJS runtime script and requests `/site_libs/lib/gpu.js` (404).
- `import { x } from "../lib/gpu.js"` (static), `import(new URL(...))` without `.href`, `import("/lib/gpu.js")`, and `import { x } from "../lib/gpu.ojs"`: the cells silently render as bare source with no output and no error.

## Gotchas

- Quarto skips project files under a hidden path component, so a full `quarto render` or `quarto preview` inside `.claude/worktrees/...` produces no output (single-file renders still work, but without listings). Build from a normal checkout, or from a copy outside `.claude/`.
- A single-file `quarto render slug/index.qmd` does not populate listings; use a full-site build to check layout that depends on them.
- The simulations pause while the page is hidden (`gpu.run` in `lib/gpu.js` runs no frames and schedules none when `document.hidden`; `visibilitychange` resumes it), so a GPU-heavy post does not keep working in a background tab. An embedded or off-screen browser view reports `document.hidden === true`, so a simulation loaded there will not run. To test one anyway, override it and fire the event: `Object.defineProperty(document, 'hidden', {configurable: true, get: () => false}); document.dispatchEvent(new Event('visibilitychange'))`.
- The browser caches `lib/*.js` between local builds. After changing one, force a refresh (`fetch(url, {cache: 'reload'})`, or a hard reload) before concluding the change did not work.

## Styling

`tpogden.scss` defines the custom theme; `_brand.yml` sets brand colours. Both light and dark modes use the same `tpogden.scss` theme (set in `_quarto.yml`). Math renders via KaTeX.

## Python

Dependencies managed with `uv` (`pyproject.toml`, `uv.lock`). Ruff configured for isort (`I`), pycodestyle (`E`), pyflakes (`F`), black-style formatting. `_posts/` excluded from ruff (archived research assets).
