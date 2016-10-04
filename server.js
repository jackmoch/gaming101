'use strict';

const express = require('express')
const { Server } = require('http')
const socketio = require('socket.io')

const app = express()
const server = Server(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server listening on por ${PORT}`))