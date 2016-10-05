'use strict';

const express = require('express')
const { Server } = require('http')
const mongoose = require('mongoose')
const socketio = require('socket.io')

const app = express()
const server = Server(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/ticktacktoe'

app.set('view engine', 'pug')

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.render('index')
})

mongoose.Promise = Promise
mongoose.connect(MONGODB_URL, () => {
	server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
})

const Game = mongoose.model('Game', {
	board: [
		[String, String, String],
		[String, String, String],
		[String, String, String],
	]
})

io.on('connect', (socket) => {
	Game.create({
		board: [['', '', ''],['', '', ''],['', '', '']]
	})
	.then((game) => {
		socket.game = game
		socket.emit('new game', game)
	})
	.catch((err) => {
		socket.emit('error', err)
		console.error(err)
	})

	socket.on('make move', ({ row, col }) => {
		socket.game.board[row][col] = 'X'
		socket.game.markModified('board') //mongoose method to let db know the array changed
		socket.game.save().then((game) => {
			socket.emit('move made', game)
		})
	})

	console.log(`Socket connected: ${socket.id}`)
	socket.on('disconnect', () => {
		console.log(`Socketed disconnected: ${socket.id}`)
	})
})