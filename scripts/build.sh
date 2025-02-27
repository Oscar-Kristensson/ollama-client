#!/bin/bash

echo "Packaging app"
npm run make

echo "Creating and clearing release dir"

mkdir out

cd out
rm -rf release
mkdir release

cd ollama-client-darwin-arm64
echo "Zipping the packaged app"
zip -r ollama-client-darwin-arm64.zip ./*

cd ..
echo "Moving the packaged app"
mv ollama-client-darwin-arm64/ollama-client-darwin-arm64.zip release

echo "Finished build!"