---
layout: note
title: Run a Set of Jupyter Notebooks from the Command Line
location: Manchester
category: research
published: true
description: Lorem ipsum
include_math: false
---

You've got a load of Jupyter notebooks in a directory. You're going to put them
on Github to share with the students in your class, users of your library,
readers of your textbook or whoever. Do they all actually run through without
errors? Are you sure? Even though you just ran `conda update` on that
dependency?

You could go into each notebook, hit 'Restart Kernel and Run All Cells…' and
scroll down to make sure there are no exceptions. It'd be nicer to batch
run a set of notebooks from the command line. Here's a script to do that.

<aside><a href="https://gist.github.com/tpogden/ec79f2ebe2baf45655445b575dc7f540">Gist: run_notebooks.py</a></aside>

```py
# ! python
# coding: utf-8

import os
import argparse
import glob

import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
from nbconvert.preprocessors.execute import CellExecutionError

# Parse args
parser = argparse.ArgumentParser(description="Runs a set of Jupyter \
                                              notebooks.")
file_text = """ Notebook file(s) to be run, e.g. '*.ipynb' (default),
'my_nb1.ipynb', 'my_nb1.ipynb my_nb2.ipynb', 'my_dir/*.ipynb'
"""
parser.add_argument('file_list', metavar='F', type=str, nargs='*', 
    help=file_text)
parser.add_argument('-t', '--timeout', help='Length of time (in secs) a cell \
    can run before raising TimeoutError (default 600).', default=600, 
    required=False)
parser.add_argument('-p', '--run-path', help='The path the notebook will be \
    run from (default pwd).', default='.', required=False)
args = parser.parse_args()
print('Args:', args)
if not args.file_list: # Default file_list
    args.file_list = glob.glob('*.ipynb')

# Check list of notebooks
notebooks = []
print('Notebooks to run:')
for f in args.file_list:
    # Find notebooks but not notebooks previously output from this script
    if f.endswith('.ipynb') and not f.endswith('_out.ipynb'):
        print(f[:-6])
        notebooks.append(f[:-6]) # Want the filename without '.ipynb'

# Execute notebooks and output
num_notebooks = len(notebooks)
print('*****')
for i, n in enumerate(notebooks):
    n_out = n + '_out'
    with open(n + '.ipynb') as f:
        nb = nbformat.read(f, as_version=4)
        ep = ExecutePreprocessor(timeout=int(args.timeout), kernel_name='python3')
        try:
            print('Running', n, ':', i, '/', num_notebooks)
            out = ep.preprocess(nb, {'metadata': {'path': args.run_path}})
        except CellExecutionError:
            out = None
            msg = 'Error executing the notebook "%s".\n' % n
            msg += 'See notebook "%s" for the traceback.' % n_out
            print(msg)
        except TimeoutError:
            msg = 'Timeout executing the notebook "%s".\n' % n
            print(msg)
        finally:
            # Write output file
            with open(n_out + '.ipynb', mode='wt') as f:
                nbformat.write(nb, f)
                
```

You can use it to run all cells in a single notebook from the command line with
```py
python run_notebooks.py my_nb1.ipynb
```
You'll get a new notebook `my_nb1_out.ipynb` for you to check the output.
I've chosen not to overwrite the existing notebook because this can introduce
git diffs you didn't want on notebooks that don't need fixing.


Run a set of notebooks with
```py
python run_notebooks.py my_nb1.ipynb my_nb2.ipynb my_nb3.ipynb
```

Again you'll get notebooks `my_nb[1,2,3]_out.ipynb` to check.


Run all the notebooks in a directory with
```py
python run_notebooks.py notebooks/*.ipynb
```

The default is to run all notebooks in the working directory so 
```py
python run_notebooks.py 
```
is the same as 
```py
python run_notebooks.py ./*.ipynb
```

### Flags

- `--help` gives help.
- `--timeout` sets a limit in seconds for cell execution. The default is 600.
  The script will give up and skip to the next notebook after printing a
  message.
- `--run-path` sets the path the notebook will be executed from. If you have
  relative paths in your notebook, you'll probably want the run path to be set
  to the notebook path, so call e.g.
  ```py
  python run_notebooks.py notebooks/*.ipynb --run-path=notebooks/
  ```


## Why I Wrote This

[Notebooks on MaxwellBloch][nbmb] is a repo in which I collect examples of 
nonlinear light propagation problems you can solve with [MaxwellBloch][mb]. I 
find examples the fastest way to learn how to use a library.

As I'm developing MaxwellBloch, the example notebooks must be updated in
parallel as I break things so I tag [notebooks-maxwellbloch][nbmb] with version
numbers matching the semantic versioning of [MaxwellBloch][mb]. For example, all
the [notebooks at `v0.2.0`][nbmb-020] need to run in an environment with
[`v0.2.0` of the MaxwellBloch package][mb-020] installed.

Checking that all the example notebooks ran through without exceptions was 
tedious so I wrote the `run_notebooks.py` script to automate it. Now I 
use it for any project that involves a set of notebooks.

## References

- [Executing Notebooks](https://nbconvert.readthedocs.io/en/latest/execute_api.html#executing-notebooks-using-the-python-api-interface) from the nbconvert Docs
- [Testing Jupyter Notebooks](http://www.christianmoscardi.com/blog/2016/01/20/jupyter-testing.html) by Christian Moscardi

[nbmb]: https://github.com/tpogden/notebooks-maxwellbloch
[mb]: https://github.com/tpogden/maxwellbloch


[nbmb-020]: https://github.com/tpogden/notebooks-maxwellbloch/releases/tag/v0.2.0
[mb-020]: https://github.com/tpogden/maxwellbloch/releases/tag/v0.2.0
