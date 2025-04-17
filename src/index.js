const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');


const fs = require('fs');

const { spawn } = require('child_process');

// Start Ollama

// import { app, BrowserWindow } from 'electron';
const path = require('node:path');
const started = require('electron-squirrel-startup');
const { platform } = require('node:os');
const { copyFileSync } = require('node:fs');
const { rejects } = require('node:assert');
const { error, dir } = require('node:console');
const { exec } = require('node:child_process');

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
        throw new Error(`Error: ${error.message}`);
    }
});


ipcMain.handle('write-file', async (event, filePath, data) => {
    console.log("Writing file", filePath);
    return fs.promises.writeFile(filePath, data, 'utf-8')
        .then(() => {
            console.log("Succesfully wrote file!");
            return true;
        })
        .catch(error => {
            throw new Error('Error saving file: ' + error.message);
        });
});


ipcMain.handle('create-folder', async (event, dirPath) => {
    return new Promise(((resolve, reason) => {
        try {
            fs.promises.mkdir(dirPath, { recursive: true});
            resolve();
    
        } catch (error) {
            console.error("Error when creating a folder", error.message);
            reason(error);
        };
    }));

});


ipcMain.handle('read-dir', async (event, path) => {
    return new Promise((resolve, reason) => {
        try {
            const files = fs.promises.readdir(path);
            console.log("Files: ", files);
            resolve(files);

        } catch (error) {
            console.error("Error reading dir contents: " + error.message);
        };
    });
});

ipcMain.handle('delete-file', (event, filePath) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            console.error("Could not delete file "+ filePath + " because the file does not exist");
            resolve(false);
            return;
        }

        try {
            fs.promises.unlink(filePath)
            .then(response => {
                resolve(true);
            })
            .catch(error => {
                reason(error);
            })
    
        } catch (error) {
            console.error("Error in delete-file", error.message)
            reason(error);
            throw new Error("Error during file deletion: " + error.message);
        };
    });
});



let ollama;

ipcMain.handle('launch-ollama', (event) => {
    ollama = spawn('ollama', ['serve']);
});

ipcMain.handle('open-link', (event, link) => {
    shell.openExternal(link);
});



// Check if a save directory exists, create one otherwise

fs.promises.access("save/", fs.constants.F_OK)
    .catch(() => {
        fs.promises.mkdir("save/")
        .then(() => {
            console.log("Created dir");
        }) 
    })
