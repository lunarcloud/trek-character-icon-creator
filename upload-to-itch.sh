#!/bin/bash
CURRENT_DIR=$(dirname "$(readlink -f "$0")")
EXPORT="$CURRENT_DIR/export/"

echo Preparing...
rm -r $EXPORT
mkdir $EXPORT
cp index.* $EXPORT
cp *.js $EXPORT
cp -r cetaceous $EXPORT
cp -r humanoid $EXPORT

echo Uploading to Itch...
butler -v push $EXPORT "samsarette/simple-trekkie-character-creator:web"

echo Cleanup...
rm -r $EXPORT

echo Done.
