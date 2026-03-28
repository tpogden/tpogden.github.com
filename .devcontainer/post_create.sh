#!/bin/bash
set -e

echo "Setting up Python environment..."
uv sync

echo "Installing Jupyter kernel..."
uv run python -m ipykernel install --user --name python3

echo "Checking Quarto installation..."
quarto check

echo "Post-create setup complete!"
