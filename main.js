const {app, BrowserWindow, Menu, ipcMain, ipcRenderer} = require('electron')
const url = require("url");
const path = require("path");

let mainWindow
var fullScreen = true;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minHeight: 800,
    minWidth: 1100,
    fullscreen: fullScreen,
    icon: path.join(__dirname, `dist/assets/icon.ico`),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
    // mainWindow.loadURL(`http://localhost:4200/`)
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  ipcMain.on('print_invoice', (event, arg) => {
    mainWindow.webContents.print({
      deviceName: arg,
      silent: true
    });
  })
  ipcMain.on('get_print_devices', (event, arg) => {
        mainWindow.webContents.send('list_of_printers', mainWindow.webContents.getPrinters());
  })
  // mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null
  })


}

var menu = Menu.buildFromTemplate([
  {
    label: 'Application',
    submenu: [
      {
        id: 'fullscreen',
        // label: 'Toggle Full Screen',
        role: 'togglefullscreen'
      },
      {
        role: 'toggleDevTools'
      },
      {
        label: 'Exit Application',
        click() {
          app.quit()
        }
      }
    ]
  }
])
Menu.setApplicationMenu(menu); //menu is commented for now
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
