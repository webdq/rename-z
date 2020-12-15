const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const checkForUpdates = require("./updater.js");
const packageJson = require("../../package.json");

let isDev = process.env.NODE_ENV === "development";

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (!isDev) {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL = isDev
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;

if (!isDev) {
  Menu.setApplicationMenu(null);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1280,
    center: true,
    icon: path.join(__static, "/256x256.png"),
    webPreferences: {
      webSecurity: false,
      preload: path.join(__static, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(winURL);

  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("update", () => {
  checkForUpdates({});
});

ipcMain.on("get-version", (event, arg) => {
  event.reply("get-version", packageJson.version);
});
