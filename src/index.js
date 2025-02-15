const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');

// import { app, BrowserWindow } from 'electron';
const path = require('node:path');
const started = require('electron-squirrel-startup');
const { platform } = require('node:os');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
};

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'data', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,  // ✅ Disable for security
            contextIsolation: true,  // ✅ Required for `contextBridge`
        },
    });

    console.log(path.join(__dirname,  'data', 'icon.svg'));

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.





// Securely handle file opening
ipcMain.handle('open-file', async (title, defaultPath = "-desktop-", buttonLabel, filters = [
    { name: 'Text Files', extensions: ['txt', 'md', 'log'] }, // Show only text files
    { name: 'All Files', extensions: ['*'] } // Allow all files
    ], properties = ['openFile', 'showHiddenFiles', 'multiSelections']) => {


  if (defaultPath == "-desktop-")
    defaultPath = app.getPath("desktop");
  
  
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: title, // Custom window title
        defaultPath: defaultPath, // Start in Desktop
        buttonLabel: buttonLabel, // Custom button text
        filters: filters,
        properties: properties // Customize behavior
    });

    if (canceled || filePaths.length === 0) return null;

    // Read first selected file
    return fs.promises.readFile(filePaths[0], 'utf-8');
});


// Securely load a file by path
ipcMain.handle('load-file', async (event, filePath) => {
    try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        return content;
    } catch (error) {
        return `Error: ${error.message}`;
    }
});