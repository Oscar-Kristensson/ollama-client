echo Packaging app
call npm run make

echo Creating and clearing release dir

cd out
del /Q /S release
mkdir release

cd ollama-client-win32-x64
echo Zipping the packaged app
tar -a -c -f ollama-client-win32-x64.zip *

cd ..
echo Moving the packaged app
move ollama-client-win32-x64\ollama-client-win32-x64.zip release
echo Finished build!