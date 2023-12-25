const {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  globalShortcut,
  session,
  clipboard,
} = require("electron");
const url = require("url");
const path = require("path");

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Reciver",
    width: 1280,
    height: 500,
    frame: true,
    focusable: true,
    transparent: false,
    resizable: true,
    // minWidth: 480,
    // minHeight: 280,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      sandbox: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
  });

  //SuperOrSuper

  globalShortcut.register("Shift+N", () => {
    mainWindow.webContents.send("close_run");
    console.log("close run in main");
  });

  //close host
  globalShortcut.register("Shift+Q", () => {
    app.quit();
  });

  //app quitter
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  // Check whether a shortcut is registered.

  // enable or disable menue
  // mainWindow.setMenu(null);
  // aspect ratio
  // const defaultRatio = 16 / 9;

  // mainWindow.setAspectRatio(defaultRatio);

  // mainWindow.on("resize", () => {
  //   const ratio = mainWindow.isFullScreen() ? 0 : defaultRatio;
  //   mainWindow.setAspectRatio(ratio);
  // });

  // ipcMain.on("resize-me-please", (event, data) => {
  //   mainWindow.setSize(data.width, data.height);
  // });

  ipcMain.on("resize-me-please", (event, data) => {
    console.log("hey its resiser data :", data);
    mainWindow.setSize(data.width, data.height);
  });

  function UpsertKeyValue(obj, keyToChange, value) {
    const keyToChangeLower = keyToChange.toLowerCase();
    for (const key of Object.keys(obj)) {
      if (key.toLowerCase() === keyToChangeLower) {
        // Reassign old key
        obj[key] = value;
        // Done
        return;
      }
    }
    // Insert at end instead
    obj[keyToChange] = value;
  }

  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      const { requestHeaders } = details;
      UpsertKeyValue(requestHeaders, "Access-Control-Allow-Origin", ["*"]);
      callback({ requestHeaders });
    }
  );

  mainWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      const { responseHeaders } = details;
      UpsertKeyValue(responseHeaders, "Access-Control-Allow-Origin", ["*"]);
      UpsertKeyValue(responseHeaders, "Access-Control-Allow-Headers", ["*"]);
      callback({
        responseHeaders,
      });
    }
  );

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    delete details.responseHeaders["Content-Security-Policy"];

    callback({
      responseHeaders: details.responseHeaders,
    });
  });

  // const filter = {
  //   urls: ["http://localhost:3000/*"],
  // };

  // session.defaultSession.webRequest.onBeforeSendHeaders(
  //   filter,
  //   (details, callback) => {
  //     console.log(details);
  //     details.requestHeaders["Origin"] = "https://0.peerjs.com";
  //     callback({ requestHeaders: details.requestHeaders });
  //   }
  // );

  // session.defaultSession.webRequest.onHeadersReceived(
  //   filter,
  //   (details, callback) => {
  //     console.log(details);
  //     details.responseHeaders["Access-Control-Allow-Origin"] = [
  //       "capacitor-electron://-",
  //       'http://localhost:3000'
  //     ];
  //     callback({ responseHeaders: details.responseHeaders });
  //   }
  // );

  // // code for production build
  const startUrl = url.format({
    pathname: path.join(__dirname, "./build/index.html"),
    protocol: "file",
  });

  // const startUrl = url.format({
  //     pathname: path.join(__dirname, './webapp/build/index.html'),
  //     protocol : 'file'
  // })

  // mainWindow.loadURL(startUrl);
  mainWindow.loadURL("http://localhost:3000/");
  // mainWindow.loadURL("https://elhost.netlify.app/");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    // mainWindow.setPosition(800, 0);
    //devtool
    mainWindow.webContents.openDevTools();
    // Get available sources for screen capture

    desktopCapturer
      .getSources({ types: ["window", "screen"] })
      .then(async (sources) => {
        console.log("here is my ids", sources[0]);

        for (const source of sources) {
          if (source.name === "Entire screen") {
            console.log(source.id + ": source id");
            mainWindow.webContents.send("SET_SOURCE_ID", source.id);
            return;
          }
        }
      });
  });
}

app.on("ready", createMainWindow);
// app.whenReady(createMainWindow);
app.allowRendererProcessReuse = false;

app.on("will-quit", () => {
  // Unregister a shortcut.
  globalShortcut.unregister("Super");

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
