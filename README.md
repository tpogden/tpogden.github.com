# ogden.eu

This repo holds the source of my homepage at https://ogden.eu.

The source is rendered and published using [Quarto][quarto]. Read the docs there for details. The basic process is that QMarkdown (*.qmd) files are converted to Jupyter Notebooks (*.ipynb) and then into HTML (*.html) files for publication.

## Render and Publish

1. Download and install [Quarto CLI][quarto-install].
2. Install [miniconda][miniconda].
3. Create and activate the Conda environment with the neede dependencies:
```
conda env create -f environment.yml
conda activate ogden-eu
```
4. Render the source with `quarto render`.
5. Preview the rendered site with `quarto preview  --port 8000`
6. Publish to Github Pages via the `gh-pages` branch of this repo, via `quarto publish gh-pages`.

[quarto]: https://quarto.org/
[quarto-install]: https://quarto.org/docs/get-started/
[miniconda]: https://docs.conda.io/en/latest/miniconda.html