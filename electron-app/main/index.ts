import { app, ipcMain } from 'electron';
import { getWalletLib } from 'shared/enclave/server/wallets';
ipcMain.on('hi', async ev => {
  const wallet = getWalletLib(WalletTypes.LEDGER);
  const result = await wallet.getChainCode("44'/60'/0'/0'/0");
  ev.sender.send('poo');
});
import getWindow from './window';
import { WalletTypes } from 'shared/enclave/types';

// Quit application when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications to stay open
  // until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it is common to re-create a window
  // even after all windows have been closed
  getWindow();
});

// Create main BrowserWindow when electron is ready
app.on('ready', () => {
  getWindow();
});
