#!/bin/bash
set -e

echo "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "Installing Claude Code..."
npm install -g @anthropic-ai/claude-code

echo "Starting Quarto preview..."
cd /workspaces/tpogden.github.com
nohup quarto preview --port 4200 --no-browser > /tmp/quarto-preview.log 2>&1 &

echo "Post-attach setup complete!"
