'use strict';

const socket = io()

socket.on('connect', () => {
	console.log(`Socket connected: ${socket.id}`)
})

socket.on('disconnect', () => {
	console.log(`Socket disconnected`)
})

const table = document.querySelector('.board')
const status = document.querySelector('.status')

const boardState = [
	['','',''],
	['','',''],
	['','','']
]

let nextPlayer = 'X'

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
	status.innerText = `${nextPlayer}'s Turn`
}

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

drawBoard(boardState)

table.addEventListener('click', e => {
	const col = e.target.cellIndex
	const row = e.target.closest('tr').rowIndex

	if(boardState[row][col]) {
		return console.log('Cannot move there')
	}

	if (winner(boardState)) {
		return console.log('Game is over!')
	}

	boardState[row][col] = nextPlayer
	drawBoard(boardState)
	console.log('You clicked on :', row, col)

	if (winner(boardState)) {
    return status.innerText = `${nextPlayer} WON!`
  }

	nextPlayer = nextPlayer === 'X' ? 'O' : 'X'
	status.innerText = `${nextPlayer}'s Turn!`
})