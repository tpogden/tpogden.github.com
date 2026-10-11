#!/bin/bash
# Create root-level shadow dirs so Quarto renders posts at flat URLs (/slug/).
# Each slug/ is a real directory; its contents are symlinks into _posts/category/slug/.
# Shadow dirs persist after rendering so quarto preview can hash source files.

# Keep .gitignore in sync with current post slugs
# (portable: BSD and GNU sed disagree on -i, so write via a temp file)
tmp=$(mktemp)
sed '/^# post shadow dirs$/,/^# end post shadow dirs$/d' .gitignore > "$tmp"
{
    cat "$tmp"
    echo "# post shadow dirs"
    for post_dir in _posts/*/*/; do
        [ -d "$post_dir" ] || continue
        echo "/$(basename "$post_dir")/"
    done
    echo "# end post shadow dirs"
} > .gitignore
rm -f "$tmp"

# Create shadow dirs (idempotent)
for post_dir in _posts/*/*/; do
    [ -d "$post_dir" ] || continue
    slug=$(basename "$post_dir")
    mkdir -p "$slug"
    for item in "$post_dir"*; do
        [ -e "$item" ] || continue
        name=$(basename "$item")
        ln -sfn "../${post_dir}${name}" "$slug/$name"
    done
done
