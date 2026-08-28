const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dpsDesktop', {
  timerFinished: () => ipcRenderer.send('timer-finished'),
  chooseSound: () => ipcRenderer.invoke('choose-sound')
});
