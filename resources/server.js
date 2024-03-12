import axios from 'axios'
import path from 'node:path'
import asyncHandler from 'express-async-handler'
import fs from 'fs'
import express from 'express'
import { app } from '../main.js'
import { store } from '../myStore.js'

var __dirname = path.resolve()

var port = store.get('PORT')

var token = null
var v = null
var accessKey = null
const expressApp = express()

expressApp.get('/', (req, res) => {
	res.send(`<body bgcolor="black" text="white">
	<h2>Service Running!</h2>
	
	<p>Change Port Number</p>
	<form action="port" method="GET">
		<input type="text" placeholder="8080" value="${port}" name="change">
		<input type="submit" value="Change">
	</form>
	
	<p>Restart App</p>
	<form action="restart" method="GET">
		<input type="submit" value="Restart">
	</form>
	</body>`)
})

expressApp.get('/port', (req, res) => {
	store.set('PORT', req.query.change)
	app.relaunch()
	app.quit()
	res.send(`<body bgcolor="black" text="white">
	<h2>Service Running!</h2>
	
	<p>Change Port Number</p>
	<form action="port" method="GET">
		<input type="text" placeholder="8080" value="${port}" name="change">
		<input type="submit" value="Change">
	</form>
	
	<p>Restart App</p>
	<form action="restart" method="GET">
		<input type="submit" value="Restart">
	</form>
	</body>`)
})

expressApp.get('/restart', (req, res) => {
	app.relaunch()
	app.quit()
	res.send(`<body bgcolor="black" text="white">
	<h2>Service Running!</h2>
	
	<p>Change Port Number</p>
	<form action="port" method="GET">
		<input type="text" placeholder="8080" value="${port}" name="change">
		<input type="submit" value="Change">
	</form>
	
	<p>Restart App</p>
	<form action="restart" method="GET">
		<input type="submit" value="Restart">
	</form>
	</body>`)
})

const getAccessToken = async () => {
	var connectString = null
	var temp = await axios.get('https://duckduckgo.com/local.js?get_mk_token=1')
	token = temp.data

	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	}

	var connectString = await axios.get(
		`https://duckduckgo.com/mapkit/?https://cdn.apple-mapkit.com/ma/bootstrap`,
		config
	)
	return connectString.data.tileSources[2].path
}

if (token === null) {
	token = await getAccessToken()
	var temp = token.split('=')
	accessKey = temp[8]
	var t = temp[7]
	v = t.split('&')
	v = v[0]
}

expressApp.get(
	'/tile',
	asyncHandler(async (req, res) => {
		var style = req.query.style
		var scale = req.query.scale
		var z = req.query.z
		var x = req.query.x
		var y = req.query.y

		var url = `https://sat-cdn4.apple-mapkit.com/tile?style=${style}&size=1&scale=${scale}&z=${z}&x=${x}&y=${y}&v=${v}&accessKey=${accessKey}`

		var map = await axios({
			method: 'get',
			responseType: 'arraybuffer',
			url: url,
		})
		res.setHeader('content-type', 'image/jpeg')
		res.send(map.data)
	})
)

expressApp.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

export { expressApp }
