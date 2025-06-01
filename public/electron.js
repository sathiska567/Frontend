import { app, BrowserWindow } from 'electron';
import path from 'path';

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load HTML with some text inside the Electron window
  win.loadURL('http://localhost:5173');  // Vite app during development

  // Alternatively, load inline HTML (basic example)
  // win.loadURL('data:text/html;charset=utf-8,' + encodeURI('<h1>Hello, Electron!</h1><p>This is some text displayed in the Electron window.</p>'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
