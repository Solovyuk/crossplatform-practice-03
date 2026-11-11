const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs/promises');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 700,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  win.loadFile('index.html');
}

ipcMain.handle('list-dir', async (_event, dir) => {
  try {
    const directory = path.resolve(__dirname, dir);
    const entries = await fs.readdir(directory, {
      withFileTypes: true
    });

    return entries.map(entry => ({
      name: entry.name,
      isDir: entry.isDirectory()
    }));
  } catch (error) {
    throw new Error('Не удалось прочитать каталог: ' + error.message);
  }
});

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
