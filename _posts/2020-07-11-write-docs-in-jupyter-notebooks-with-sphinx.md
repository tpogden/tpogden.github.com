---
layout: note
title: Write Docs in Jupyter Notebooks with Sphinx
location: Manchester
category: research
published: true
description:
permalink:
asset_path:
include_math: false
---

MaxwellBloch now has [docs, including a usage guide and a set of
examples][mb-docs]. These are mostly written in Jupyter notebooks for two
reasons. First, notebooks encourage a 'show don't tell' approach. Second, if
something in the library interface changes and I forget to update the docs, the
build will fail and the changes won't be merged before it's fixed.

The docs are built with [Sphinx][sphinx] and notebooks parsed with the [Jupyter
Notebook Tools for Sphinx][nbsphinx] extension. The extension is activated via
the [Sphinx `conf.py`][conf] file.
```py
extensions = [
    'nbsphinx',
    'sphinx.ext.mathjax'
]
```
The MathJax item renders LaTeX blocks. I've set some configuration options to
ensure that long-running cells complete, that any cell errors cause the docs
build to fail, and that notebooks are always executed even if they already have
partial or full output[^1].
```py
nbsphinx_timeout = 3600
nbsphinx_allow_errors = False
nbsphinx_execute = 'always'
```

The docs are [hosted at Read the Docs][mb-docs]. I tried setting this up last
year but found Read the Docs could not at that time support the high memory
requirement in setting up the Conda environment. They've since looked
[specifically at support for scientific project documentation][rtd-conda] and
increased the memory available. So it works now, a great service. The time
constraint on the build means I still have to cache the output of longer-running
example problems rather than have the solver run at build time.

## Write Docs Early

In developing MaxwellBloch I prioritised getting the features I wanted built
before looking to write usage docs and just focused on having some examples
available. From the support emails I get I realise now this was a bad idea. Many
emailers who asked how something works would have been helped just by having a
clear guide, and there are no doubt more people who have just given up and not
used the package even if it might have been of value to them. In future projects
I'll write usage docs as soon as there's something there to use.

[^1]: Though I have `git` clear any output before staging `.ipynb` files.

[sphinx]: https://www.sphinx-doc.org/
[mb-docs]: https://maxwellbloch.readthedocs.io/
[conf]: https://github.com/tpogden/maxwellbloch/blob/master/docs/conf.py
[rtd-conda]: https://blog.readthedocs.com/better-conda-support/
[nbsphinx]: https://nbsphinx.readthedocs.io/
