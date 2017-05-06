#!/usr/bin/env bash

# Do not proceed if rsvg-convert is not available
if ! type rsvg-convert &> /dev/null; then
  >&2 echo 'librsvg not installed (rsvg-convert not found in PATH)'
  exit
fi

# The path to the SVG from which icon sizes are generated
SVG_PATH=app/icons/app-icon.svg
# The path to the directory where the PNG icons are generated
PNG_DIR=public/icons
# The sizes to generate (all icons are square)
PNG_SIZES=(180 192 256 384 512)

# Create destination directory if it does not exist
mkdir -p "$PNG_DIR"

# Generate favicon separately for the sake of the filename
rsvg-convert \
  --format png \
  --width 32 \
  "$SVG_PATH" \
  --output "$PNG_DIR"/favicon.png

# Generate icon sizes for web app manifest
for size in ${PNG_SIZES[@]}; do
  rsvg-convert \
    --format png \
    --width "$size" \
    "$SVG_PATH" \
    --output "$PNG_DIR"/app-icon-"$size".png
done
