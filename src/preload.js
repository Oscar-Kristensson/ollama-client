// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('open-file'), // Secure communication
    loadFile: (filePath) => ipcRenderer.invoke('load-file', filePath),
    writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
    createFolder: (filePath) => ipcRenderer.invoke('create-folder', filePath),
    readFolder: (folderPath) => ipcRenderer.invoke('read-dir', folderPath),
    deleteFile: (filePath) => ipcRenderer.invoke("delete-file", filePath),
    launchOllama: () => ipcRenderer.invoke('launch-ollama'),
    openLink: (link) => ipcRenderer.invoke('open-link', link)

});
