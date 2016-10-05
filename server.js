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
	],
	nextMove: String,
	result: String,
})

io.on('connect', (socket) => {
	Game.create({
		board: [['', '', ''],['', '', ''],['', '', '']],
		nextMove: 'X'
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
		if(socket.game.result) {
			return
		}

		if (socket.game.board[row][col]) {
    	return
  	}

		socket.game.board[row][col] = socket.game.nextMove
		socket.game.nextMove = socket.game.nextMove === 'X' ? 'O' : 'X'
		socket.game.markModified('board') //mongoose method to let db know the array changed
		const result = winner(socket.game.board)

		if(result) {
			socket.game.nextMove = undefined
			socket.game.result = result
		}

		socket.game.save().then((game) => {
			socket.emit('move made', game)
		})
	})

	console.log(`Socket connected: ${socket.id}`)
	socket.on('disconnect', () => {
		console.log(`Socketed disconnected: ${socket.id}`)
	})
})

const winner = b => {
  // Rows
  if (b[0][0] && b[0][0] === b[0][1] && b[0][1] === b[0][2]) {
    return b[0][0]
  }

  if (b[1][0] && b[1][0] === b[1][1] && b[1][1] === b[1][2]) {
    return b[1][0]
  }

  if (b[2][0] && b[2][0] === b[2][1] && b[2][1] === b[2][2]) {
    return b[2][0]
  }

  // Cols
  if (b[0][0] && b[0][0] === b[1][0] && b[1][0] === b[2][0]) {
    return b[0][0]
  }

  if (b[0][1] && b[0][1] === b[1][1] && b[1][1] === b[2][1]) {
    return b[0][1]
  }

  if (b[0][2] && b[0][2] === b[1][2] && b[1][2] === b[2][2]) {
    return b[0][2]
  }

  // Diags
  if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
    return b[0][0]
  }

  if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
    return b[0][2]
  }

  // Tie or In-Progress
  else {
    return null
  }
}