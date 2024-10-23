#!/bin/sh

shx rm -rf ./lib
shx mkdir ./lib || exit 1

# Merge the layered svgs into a single canvas
shx cp ./node_modules/html2canvas/dist/html2canvas.esm.js ./lib/

# Embed SVG files into the html document
shx cp ./node_modules/external-svg-loader/svg-loader.min.js ./lib/
