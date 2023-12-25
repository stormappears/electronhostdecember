const { contextBridge, ipcRenderer, ipcMain } = require("electron");
// const os = require("os");



contextBridge.exposeInMainWorld("electron", {
  //   arch: () => os.arch(),

  getScreenId: (callback) => ipcRenderer.on("SET_SOURCE_ID", callback),
  runCommand: (callback) => ipcRenderer.on("run_run", callback),
  sendRemClose: (callback) => ipcRenderer.on("close_run", callback),
  screenResiser: (callback) => ipcRenderer.send("resize-me-please", callback),
});
