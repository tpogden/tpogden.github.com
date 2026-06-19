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
quarto publish gh-pages        # publish to GitHub Pages

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
| reading | `_posts/reading/` |
| travel | `_posts/travel/` |
| personal | `_posts/personal/` |

`index.qmd` uses four Quarto listings with `contents: "*/index.qmd"` and `include: categories:` filters to separate sections.

## Creating posts

Each post is a directory under `_posts/category/slug/` containing at minimum an `index.qmd`. Minimal frontmatter:

```yaml
---
title: "Post Title"
date: "YYYY-MM-DD"
categories: [research]   # one of: research, reading, travel, personal
---
```

An optional `assets/` subdirectory holds images and data files. After adding a post, run `quarto preview` or `quarto render` — the pre-render script will create the shadow dir and wire it into the listings automatically.

## Styling

`tpogden.scss` defines the custom theme; `_brand.yml` sets brand colours. Both light and dark modes use the same `tpogden.scss` theme (set in `_quarto.yml`). Math renders via KaTeX.

## Python

Dependencies managed with `uv` (`pyproject.toml`, `uv.lock`). Ruff configured for isort (`I`), pycodestyle (`E`), pyflakes (`F`), black-style formatting. `_posts/` excluded from ruff (archived research assets).
