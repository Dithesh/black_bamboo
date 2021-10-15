const {
    contextBridge,
    ipcRenderer
} = require("electron");
//
// let currWindow = remote.BrowserWindow.getFocusedWindow();
console.log(ipcRenderer)
window.ipcRenderer = ipcRenderer;
// window.closeCurrentWindow = function(){
//   currWindow.close();
// }
