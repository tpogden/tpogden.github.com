#!/bin/bash
# Remove root-level post shadow dirs created by pre-render
for post_dir in _posts/*/*/; do
    [ -d "$post_dir" ] || continue
    slug=$(basename "$post_dir")
    rm -rf "$slug"
done
