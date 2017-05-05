#!/usr/bin/env bash

# The path to the directory where all icons reside
ICON_DIR=app/assets/icons
# The path to the SVG from which icon sizes are generated
SVG_PATH="$ICON_DIR"/app-icon.svg
# The path to the directory where the PNG icons are generated
PNG_DIR="$ICON_DIR"/png
# The sizes to generate (all icons are square)
PNG_SIZES=(32 48 64 96 192 256 384 512)

mkdir -p "$PNG_DIR"
for size in ${PNG_SIZES[@]}; do
  rsvg-convert \
    --width "$size" \
    "$SVG_PATH" \
    --output "$PNG_DIR"/app-icon-"$size".png
done
