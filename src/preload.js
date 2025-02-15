// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('open-file'), // Secure communication
    loadFile: (filePath) => ipcRenderer.invoke('load-file', filePath),
    writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),

});
