let board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
]
// 0=none, 1=human, 2=bot
let playerTurn = 1;
let gameStillGoing = true;

const columnButtons = document.querySelector('.column-buttons');
const topButtonsHTML = Array.from({ length: 7 }, (_, index) => {
    return `<button class="column-button" id="c${index}" type="button">${index + 1}</button>`;
}).join('');
columnButtons.innerHTML = topButtonsHTML;

let boardGridHTML = '';
for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
        boardGridHTML += `<div class="spot-container" id="${(r * 7) + c}"></div>`;
    }
}
document.querySelector('.board-grid').innerHTML = boardGridHTML;

document.querySelectorAll('.column-button').forEach((element) => {
    element.addEventListener('click', () => {
        if (playerTurn === 1 && gameStillGoing === true) {
            playHumanMove(element.id);
        }
    });
});

function playHumanMove(column) {
    let botMove = [];
    column = Number(column.slice(1)); // from "c0" to 0
    const lowestSpot = findLowestRow(column);
    if (lowestSpot >= 0) {
        board[lowestSpot][column] = 1;
        renderBoard();
        botMove = playBotMove();
        // console.log(botMove);
        updateBoardForBot(botMove);
        renderBoard();
        detectWin();
    }
}

function findLowestRow(column) {
    for (let i = 5; i >= 0; i--) {
        if (board[i][column] === 0) {
            return i;
        }
    }
    return -1;
}

function renderBoard() {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            const spotId = (r * 7) + c;
            const spot = document.getElementById(spotId);
            if (board[r][c] === 1) {
                spot.style.backgroundColor = 'green';
            } else if (board[r][c] === 2) {
                spot.style.backgroundColor = 'red';
            } else {
                spot.style.backgroundColor = '';
            }
        }
    }
}

function playBotMove() {
    let bestMove = [];
    for (let r = 5; r >= 0; r--) {
        for (let c = 0; c < 7; c++) {
            if (board[r][c] === 1) {
                // vertical
                if (r - 3 >= 0 && board[r - 1][c] === 1 && board[r - 2][c] === 1 && board[r - 3][c] === 0) {
                    bestMove.push(r - 3);
                    bestMove.push(c);
                    return bestMove;
                // horizontal right
                } else if (c + 3 < 7 && r === findLowestRow(c + 3) && board[r][c + 1] === 1 && board[r][c + 2] === 1 && board[r][c + 3] === 0) {
                    bestMove.push(r);
                    bestMove.push(c + 3);
                    return bestMove;
                // horizontal left
                } else if (c - 3 >= 0 && r === findLowestRow(c - 3) && board[r][c - 1] === 1 && board[r][c - 2] === 1 && board[r][c - 3] === 0) {
                    bestMove.push(r);
                    bestMove.push(c - 3);
                    return bestMove;
                // diagonal up right
                } else if (r - 3 >= 0 && c + 3 < 7 && r - 3 === findLowestRow(c + 3) && board[r - 1][c + 1] === 1 && board[r - 2][c + 2] === 1 && board[r - 3][c + 3] === 0) {
                    bestMove.push(r - 3);
                    bestMove.push(c + 3);
                    return bestMove;
                // diagonal up left
                } else if (r - 3 >= 0 && c - 3 >= 0 && r - 3 === findLowestRow(c - 3) && board[r - 1][c - 1] === 1 && board[r - 2][c - 2] === 1 && board[r - 3][c - 3] === 0) {
                    bestMove.push(r - 3);
                    bestMove.push(c - 3);
                    return bestMove;
                }
            }
        }
    }
    let randomColumn;
    let randomRow;
    while (true) {
        randomColumn = getRandomInt(0, 6);
        randomRow = findLowestRow(randomColumn)
        if (randomRow >= 0 && board[randomRow][randomColumn] !== 1) {
            bestMove.push(randomRow);
            bestMove.push(randomColumn);
            return bestMove;
        }
    }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateBoardForBot(botMove) {
    board[botMove[0]][botMove[1]] = 2;
}

function detectWin() {
    for (let r = 5; r >= 0; r--) {
        for (let c = 0; c < 7; c++) {
            if (board[r][c] === 1) {
                // vertical
                if (r + 3 < 6 && board[r + 1][c] === 1 && board[r + 2][c] === 1 && board[r + 3][c] === 1) {
                    humanWins();
                    return null;
                // horizontal right
                } else if (c + 3 < 7 && board[r][c + 1] === 1 && board[r][c + 2] === 1 && board[r][c + 3] === 1) {
                    humanWins();
                    return null;
                // diagonal up-right
                } else if (r - 3 >= 0 && c + 3 < 7 && board[r - 1][c + 1] === 1 && board[r - 2][c + 2] === 1 && board[r - 3][c + 3] === 1) {
                    humanWins();
                    return null;
                // diagonal up-left
                } else if (r - 3 >= 0 && c - 3 >= 0 && board[r - 1][c - 1] === 1 && board[r - 2][c - 2] === 1 && board[r - 3][c - 3] === 1) {
                    humanWins();
                    return null;
                }
            } else if (board[r][c] === 2) {
                // vertical
                if (r + 3 < 6 && board[r + 1][c] === 2 && board[r + 2][c] === 2 && board[r + 3][c] === 2) {
                    botWins();
                    return null;
                // horizontal right
                } else if (c + 3 < 7 && board[r][c + 1] === 2 && board[r][c + 2] === 2 && board[r][c + 3] === 2) {
                    botWins();
                    return null;
                // diagonal up-right
                } else if (r - 3 >= 0 && c + 3 < 7 && board[r - 1][c + 1] === 2 && board[r - 2][c + 2] === 2 && board[r - 3][c + 3] === 2) {
                    botWins();
                    return null;
                // diagonal up-left
                } else if (r - 3 >= 0 && c - 3 >= 0 && board[r - 1][c - 1] === 2 && board[r - 2][c - 2] === 2 && board[r - 3][c - 3] === 2) {
                    botWins();
                    return null;
                }
            }
        }
    }
}

function humanWins() {
    gameStillGoing = false;
    document.querySelector('.winner-text').innerText = 'Winner: Human';
}

function botWins() {
    gameStillGoing = false;
    document.querySelector('.winner-text').innerText = 'Winner: Bot';
}

document.querySelector('.new-game-button').addEventListener('click', () => {
    board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ];
    playerTurn = 1;
    gameStillGoing = true;
    document.querySelector('.winner-text').innerText = 'Winner: undecided';
    renderBoard();
});