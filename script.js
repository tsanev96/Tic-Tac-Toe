const board = document.querySelector('#board');
const cellElements = document.querySelectorAll('.cell');
const winningMsgEl = document.querySelector('#winning-message');
const winnerShow = document.querySelector('#winner');
const singlePlayerBtn = document.querySelector('#singleplayer');
const multiplayerBtn = document.querySelector('#multiplayer');

let isSingleplayer;
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let isWinner = false;
let isDraw = false;
const X_CLASS = 'x';
const O_CLASS = 'o';
let circleTurn = false;
let currentClass = X_CLASS;

// Game Starts here..
function handleClick(ev) {
    const cellEl = ev.target;
    placeMark(cellEl);
    checkEndGame(currentClass);
    // swapTurns/hoverEffects checks if its single or multi player
    swapTurns();
    hoverEffects();

    if (isSingleplayer) {
        robotWrapperFunc();
    }
}

function robotWrapperFunc() {
    let winRobotIndex = checkSureWinBothPlayers(O_CLASS, 2);
    let winPlayerIndex = checkSureWinBothPlayers(X_CLASS, 2);

    if (winRobotIndex !== undefined) {
        makeRobotMove(winRobotIndex, winPlayerIndex);
    } else {
        if (winPlayerIndex !== undefined) {
            makeRobotMove(winRobotIndex, winPlayerIndex);
        } else {
            makeRobotMove(winRobotIndex, winPlayerIndex);
        }
    }
}

function checkSureWinBothPlayers(currClass, constCounter) {
    let counter = 0;
    let index = null;

    for (let combinations of winningCombinations) {
        counter = 0;
        index = null;
        for (let combination of combinations) {
            if (cellElements[combination].classList.contains(currClass)) {
                counter++;
            } else if (!cellElements[combination].classList.contains(X_CLASS) &&
                !cellElements[combination].classList.contains(O_CLASS)) {
                index = combination;
            }

            if (index !== null && counter === constCounter) {
                break;
            }
        }

        if (index !== null && counter === constCounter) {
            break;
        }
    }

    if (index !== null && counter === constCounter) {
        return index;
    }
}

function makeRobotMove(robotIndexWin, playerIndexWin) {
    if (robotIndexWin !== undefined) {
        cellElements[robotIndexWin].classList.add(O_CLASS);
    } else if (playerIndexWin !== undefined) {
        cellElements[playerIndexWin].classList.add(O_CLASS);
    } else {
        // robot predict win
        let lenghtArr = 2;
        let robotPlayedTimes = 1;
        let index = getIndexWinningCombinationRobot(lenghtArr, robotPlayedTimes);
        if (index !== undefined) {
            cellElements[index].classList.add(O_CLASS);
        } else {
            lengthArr = 3;
            robotPlayedTimes = 0;
            index = getIndexWinningCombinationRobot(lengthArr, robotPlayedTimes);
            if (index !== undefined) {
                cellElements[index].classList.add(O_CLASS);
            }
        }
    }
    checkEndGame(O_CLASS);
}

function getIndexWinningCombinationRobot(lengthArr, constCounter) {
    let indexes = [];
    let counter = 0;

    for (let combinations of winningCombinations) {
        indexes = [];
        counter = 0;
        for (let combination of combinations) {
            if (!cellElements[combination].classList.contains(X_CLASS) &&
                !cellElements[combination].classList.contains(O_CLASS)) {
                indexes.push(combination);
            } else if (cellElements[combination].classList.contains(O_CLASS)) {
                counter++;
            }

            if (indexes.length === lengthArr && counter === constCounter) {
                break;
            }
        }

        if (indexes.length === lengthArr && counter === constCounter) {
            break;
        }
    }

    if (indexes.length === lengthArr && counter === constCounter) {
        const randomIndex = Math.floor(Math.random() * indexes.length);
        return indexes[randomIndex];
    }
}

function placeMark(cell) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    if (!isSingleplayer) {
        circleTurn = !circleTurn;
    }
}

function hoverEffects() {
    if (!isSingleplayer) {
        if (currentClass === X_CLASS) {
            currentClass = O_CLASS;
            board.classList = 'board o';
        } else {
            currentClass = X_CLASS;
            board.classList = 'board x';
        }
    }
}

function checkEndGame(currClass) {
    isWinner = checkWin(currClass);
    isDraw = checkDraw();

    if (isWinner) {
        showEndGameMsg(currClass);
    } else if (isDraw) {
        showEndGameMsg();
    }
}

function checkWin(currClass) {
    return winningCombinations.some(combinations => {
        return combinations.every(winCombination => {
            return cellElements[winCombination].classList.contains(currClass);
        });
    })
}

function checkDraw() {
    for (let i = 0; i < cellElements.length; i++) {
        if (cellElements[i].classList.length !== 2) {
            return false;
        }
    }
    return true;
}

function showEndGameMsg(currClass) {
    if (isDraw && !isWinner) {
        winnerShow.innerText = `No One Wins!!`
    } else {
        const winner = currClass === X_CLASS ? X_CLASS : O_CLASS;
        if (isSingleplayer) {
            winnerShow.innerText = 'Robot Won!!'
        } else {
            winnerShow.innerText = `${winner.toUpperCase()} Won!!`;
        }
    }

    winningMsgEl.classList.add('show');
}

function clearAfterGame() {
    winnerShow.innerText = '';
    winningMsgEl.classList.remove('show');
    eventsCell();
    isWinner = false;
    circleTurn = false;
    currentClass = X_CLASS;
    board.classList = 'board x';
}

function eventsCell() {
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.addEventListener('click', handleClick, { once: true });
    });
}

// Robot functions

function checkPossibleWinPlayer() {
    let counter = 0;
    let preventIndex = null;

    for (let combinations of winningCombinations) {
        counter = 0;
        preventIndex = null;
        for (let index of combinations) {
            if (cellElements[index].classList.contains(X_CLASS)) {
                counter++;
            } else if (!cellElements[index].classList.contains(O_CLASS)) {
                preventIndex = index;
            }

            if (preventIndex !== null && counter === 2) {
                break;
            }
        }

        if (preventIndex !== null && counter === 2) {
            break;
        }
    }

    if (preventIndex !== null && counter === 2) {
        return preventIndex;
    }
}


// Event Handlers

singlePlayerBtn.addEventListener('click', () => {
    clearAfterGame();
    isSingleplayer = true;
});

multiplayerBtn.addEventListener('click', () => {
    clearAfterGame();
    isSingleplayer = false;
});