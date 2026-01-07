#!/bin/bash
CURRENT_DIR=$(dirname "$(readlink -f "$0")")
EXPORT="$CURRENT_DIR/export/"

echo Preparing...
rm -r $EXPORT
mkdir $EXPORT
cp index.* $EXPORT
cp *.js $EXPORT
cp -r js $EXPORT
cp -r lib $EXPORT
cp -r fonts $EXPORT
cp -r cetaceous $EXPORT
cp -r humanoid $EXPORT
cp -r exocomp $EXPORT
cp -r medusan $EXPORT
cp -r cal-mirran $EXPORT

echo Uploading to Itch...
butler -v push $EXPORT "samsarette/simple-trekkie-character-creator:web" --if-changed

echo Cleanup...
rm -r $EXPORT

echo Done.
