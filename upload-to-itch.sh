#!/bin/bash
CURRENT_DIR=$(dirname "$(readlink -f "$0")")
EXPORT="$CURRENT_DIR/export/"

echo Building...
npm run build

echo Preparing...
rm -r $EXPORT
mkdir $EXPORT
cp index.* $EXPORT
cp -r js $EXPORT
cp -r fonts $EXPORT
cp -r svg $EXPORT

echo Uploading to Itch...
butler -v push $EXPORT "samsarette/simple-trekkie-character-creator:web" --if-changed

echo Cleanup...
rm -r $EXPORT

echo Done.
