import { app, BrowserWindow, Menu } from 'electron/main'
import path from 'node:path'
import fs from 'fs'
import Store from 'electron-store'
var __dirname = path.resolve()
import { store } from './myStore.js'
var port = store.get('PORT')

import { expressApp } from './resources/server.js'
console.log(app.getPath('userData'))
function createWindow() {
	const win = new BrowserWindow({
		width: 250,
		height: 300,
		title: 'MapProxy',
		webPreferences: {
			preload: path.join(process.cwd(), 'preload.js'),
		},
	})
	console.log(process.cwd())
	console.log(port)
	win.loadURL(`http://localhost:${port}`)
}

app.on('ready', () => {})

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

export { app }
