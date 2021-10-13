const {app, BrowserWindow, Menu} = require('electron')
    const url = require("url");
    const path = require("path");
    
    let mainWindow

    function createWindow () {
      mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        minHeight: 800,
        minWidth: 1100,
        icon: path.join(__dirname, `/dist/assets/images/app.png`),
        webPreferences: {
          nodeIntegration: true
        }
      })
    //   mainWindow.loadURL(`file://${__dirname}/dist/index.html`)
      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, `/dist/index.html`),
          protocol: "file:",
          slashes: true
        })
      );
      // Open the DevTools.
      // mainWindow.webContents.openDevTools()
      // mainWindow.on('resize', function() {
      //   mainWindow.reload()
      //   mainWindow.loadURL(
      //     url.format({
      //       pathname: path.join(__dirname, `/dist/index.html`),
      //       protocol: "file:",
      //       slashes: true
      //     })
      //   );
      // })
      mainWindow.on('closed', function () {
        mainWindow = null
      })
    }

    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {
                    label:'Exit',
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