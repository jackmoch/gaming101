'use strict';

const socket = io()

socket.on('connect', () => {
	console.log(`Socket connected: ${socket.id}`)
})

socket.on('disconnect', () => {
	console.log(`Socket disconnected`)
})

const boardState = [
	['','',''],
	['','',''],
	['','','']
]

const drawBoard = (boardState) => {
	document.querySelector('.board').innerHTML = `
		<table>
			<tr>
				<td>${boardState[0][0]}</td>
				<td>${boardState[0][1]}</td>
				<td>${boardState[0][2]}</td>
			</tr>
			<tr>
				<td>${boardState[1][0]}</td>
				<td>${boardState[1][1]}</td>
				<td>${boardState[1][2]}</td>
			</tr>
			<tr>
				<td>${boardState[2][0]}</td>
				<td>${boardState[2][1]}</td>
				<td>${boardState[2][2]}</td>
			</tr>
		</table>
	`
}

drawBoard(boardState)
let nextPlayer = 'X'

const table = document.querySelector('.board')

table.addEventListener('click', e => {
	const col = e.target.cellIndex
	const row = e.target.closest('tr').rowIndex

	if(boardState[row][col]) {
		return console.log('Cannot move there')
	}

	boardState[row][col] = nextPlayer
	nextPlayer = nextPlayer === 'X' ? 'O' : 'X'
	drawBoard(boardState)
	console.log('You clicked on :', row, col)
})