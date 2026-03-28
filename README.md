# ogden.eu

Source for my homepage at https://ogden.eu, rendered and published with [Quarto][quarto].

## Setup

1. Install [Quarto CLI][quarto-install].
2. Install [uv][uv] and sync dependencies:
   ```
   uv sync
   ```

## Development

Preview with hot reload:
```
quarto preview --render html
```

Build the site:
```
quarto render
```

Clean up shadow directories after a build:
```
bash scripts/clean.sh
```

## Publishing

Publish to GitHub Pages via the `gh-pages` branch:
```
quarto publish gh-pages
```

## Python formatting

Format and lint Python files with [ruff][ruff]:
```
uv run ruff format .
uv run ruff check --fix .
```

## Directory structure

Posts live under `_posts/category/slug/` (Quarto ignores `_`-prefixed directories). A pre-render script creates root-level shadow directories so posts render to flat URLs (`/slug/` rather than `/category/slug/`). Shadow directories are gitignored and cleaned up by `scripts/clean.sh`.

```
_posts/
  research/
    optical-solitons/
    simultons/
    …
  reading/
    book-notes-2022/
    …
  travel/
    pennine-way/
    …
  personal/
    …
scripts/
  pre-render.sh   # creates shadow dirs before render
  post-render.sh  # no-op (shadow dirs kept for quarto preview)
  clean.sh        # removes shadow dirs manually
```

[quarto]: https://quarto.org/
[quarto-install]: https://quarto.org/docs/get-started/
[uv]: https://docs.astral.sh/uv/
[ruff]: https://docs.astral.sh/ruff/
