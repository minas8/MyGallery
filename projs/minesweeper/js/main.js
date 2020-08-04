'use strict'

var TIMER_FREQ = 100;
/*
o Beginner (4 * 4 with 2 MINES)
o Medium (8 * 8 with 12 MINES)
o Expert (12 * 12 with 30 MINES)
*/
var gGameLevels = [
    { level: 'beginner', size: 4, minesCount: 2 },
    { level: 'medium', size: 8, minesCount: 12 },
    { level: 'expert', size: 12, minesCount: 30 }
]
var gChosenLevel = 0;

var gBoard;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    countHints: 3,
    usedHints: 0,
    isHintClicked: false
}

var isBeforeFirstClick;
var gGameStart;
var gTimeStamp;
var gGameInterval;

// Add support for HINTS
var gHintTimeout;

function initGame() {

    initGameGlobals();
    resetSmiley();
    resetHints();
    gBoard = buildBoard();
}

function initGameGlobals() {
    gGameStart = null;
    if (gGameInterval || gHintTimeout) {
        clearInterval(gGameInterval);
        clearTimeout(gHintTimeout);
        gGameInterval = null;
        gHintTimeout = null;
    }

    isBeforeFirstClick = true;
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        countHints: 3,
        usedHints: 0,
        isHintClicked: false
    }
}

function resetSmiley() {
    // TODO:  add smiley to init() the game
    document.querySelector('.timer').innerHTML = '';
    var img = document.querySelector('.smiley img');
    img.setAttribute('src', getImgSrc('smiley-init'));
}

function resetHints() {
    // Reset the clicked hints
    var elHints = document.querySelector('.hints');
    var innerHtmlReset = '';
    for (var i = 0; i < gGame.countHints; i++) {
        innerHtmlReset += getHintHtml(i + 1);
    }
    elHints.innerHTML = innerHtmlReset;
}

function getHintHtml(num) {
    return `<img class="hint-${num}" onclick="getHint(${num})" src="images/hint.png" alt="Hint${num}"></img>`;
}

function chooseYourLevel(level) {
    gChosenLevel = level;
    initGame();
}

function buildBoard() {
    // console.log('gGameLevels:', gGameLevels);
    // Get Matrix size by lavel
    var size = gGameLevels[gChosenLevel].size;

    // Build the board
    var board = craeteBoard(size);
    console.table(board);

    renderBoard(board);

    // Return the created board
    return board;
}

function craeteBoard(boradSize) {
    // Create the Matrix
    var board = [];

    for (var i = 0; i < boradSize; i++) {
        board[i] = [];
        for (var j = 0; j < boradSize; j++) {
            // Fill cell as an object
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };

            // Add created cell to The game board
            board[i][j] = cell;
        }
    }
    return board;
}

// Render the board to an HTML table
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            // var currCell = board[i][j];

            var cellClass = getClassName({ i, j })
            // console.log('cellClass:', cellClass);            

            // only if gGame.isOn === true => add onClick to cells
            var addOnClick = '';
            if (gGame.isOn || isBeforeFirstClick) {
                addOnClick += `onclick="cellClicked(this,${i},${j})"`;
            }

            strHTML += `\t<td class="cell ${cellClass}" ${addOnClick}>\n
            \t</td>\n`;
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function getCellImg(imgName) {
    return `<img src="images/${imgName}.png">`;
}

function setMines(board, currentClickedCell = null) {
    var rndLocationsAdded = [];

    // push currently clicked cell location if not null
    if (currentClickedCell) {
        rndLocationsAdded.push(currentClickedCell);

        // update first clicked cell with isMine = false
        var idxI = currentClickedCell.split('-')[0];
        var idxJ = currentClickedCell.split('-')[1];
        board[idxI][idxJ].isMine = false;
    }

    // 1. Randomly locate the 2 mines on the board
    for (var i = 0; i < gGameLevels[gChosenLevel].minesCount; i++) {
        var iRnd = getRndIdx(0, board.length);
        var jRnd = getRndIdx(0, board.length);
        console.log('setMines =>', 'iRnd:', iRnd, 'jRnd:', jRnd);

        if (rndLocationsAdded.indexOf(`${iRnd}-${jRnd}`) !== -1) {
            i--;
            continue;
        }
        board[iRnd][jRnd].isMine = true;
        rndLocationsAdded.push(`${iRnd}-${jRnd}`);
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) continue;
            board[i][j].minesAroundCount = countNeighbors(i, j, board);

        }
    }
}

// catch right click
function onKeyClicked(event) {
    // console.log('event.path[0].nodeName:', event.path[0].nodeName);
    // console.log('onKeyClicked =>', 'event.srcElement.classList:', event.srcElement.classList);
    // // console.log('event:', event);
    // console.log('event.path[0].nodeName:', event.path[1].nodeName);
    // console.log('event.toElement.parentElement.classList:', event.toElement.parentElement.classList);

    if (gGame.isOn) {
        // if I get the flag image event => get classList from parentElement
        var classList = '';
        var elTD = null;
        if (event.path[0].nodeName === 'IMG') {
            classList = event.toElement.parentElement.classList;
            // To fix a bag when I get the IMG and not the CELL
            elTD = event.toElement.parentElement;
        } else {
            classList = event.srcElement.classList;
            elTD = event.srcElement;
        }

        if (classList.length > 1) {

            var classArgs = classList[1].split('-');
            var i = classArgs[1];
            var j = classArgs[2];

            cellClicked(elTD, i, j, true);
        }
    } else return;
}

function cellClicked(elCell, i, j, isRightClick = false) {
    console.log('cellClicked =>');
    // console.log('elCell:', elCell, '\ni:', i, 'j:', j);

    // First click is never a Mine
    if (!gGame.isOn && isBeforeFirstClick) {
        // console.log('First click');
        // Set mines at random locations
        setMines(gBoard, `${i}-${j}`);

        // update neighbors data => call setMinesNegsCount()
        setMinesNegsCount(gBoard);

        //• Show a timer that starts on first click (right / left) and stops when game is over.
        isBeforeFirstClick = false;
        gGameStart = Date.now();
        gTimeStamp = gGameStart;
        // update model
        gGame.isOn = true;
        gGame.secsPassed = (gTimeStamp - gGameStart) / 1000;
        // update DOM
        var elGameTime = document.querySelector('.timer');
        elGameTime.innerText = gGame.secsPassed.toFixed(3);
        // set interval
        gGameInterval = setInterval(showTime, TIMER_FREQ);
    }

    if (gGame.isOn) {

        console.log('cellClicked =>', 'i:', i, 'j:', j);
        console.log('gBoard[i][j].isMine:', gBoard[i][j].isMine);
        // console.log('elCell:', elCell);

        // Add support for HINTS
        // The user has 3 hints
        if (gGame.isHintClicked) {
            console.log('cellClicked => // Add support for HINTS');
            var neighbors = showHint(gBoard, i, j);

            gHintTimeout = setTimeout(() => {
                hideHint(neighbors, i, j);
            }, 1000);

            deleteHint(gGame.usedHints);
            console.log('deleteHint(gGame.usedHints):', gGame.usedHints);
            // return;
        } else {

            // • Right click flags/unflags a suspected cell (you cannot reveal a flagged cell)
            if (isRightClick) {
                // console.log('cellClicked => // if right click and Marked');

                if (gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
                    // if right click and Marked => set the oposite => false
                    // console.log('if right click and Marked => set the oposite => false');
                    gBoard[i][j].isMarked = false;
                    gGame.markedCount--;
                    // console.log('gGame.markedCount:', gGame.markedCount);

                    elCell.classList.remove('marked');
                    elCell.innerHTML = '';
                } else {
                    // console.log('cellClicked => // if right click and Unmarked');

                    // if right click and Unmarked => set the oposite => true
                    console.log('if right click and Unmarked => set the oposite => true');
                    gBoard[i][j].isMarked = true;
                    gGame.markedCount++;
                    console.log('gGame.markedCount:', gGame.markedCount);

                    elCell.classList.add('marked');
                    elCell.innerHTML = getCellImg('flag');
                }

            } else if (!gBoard[i][j].isShown) {

                // • Left click reveals the cell’s content
                // TODO: expand it and its 1st degree neighbors
                // TODO: add expandShown(board, elCell,i, j)
                gBoard[i][j].isShown = true;
                elCell.classList.add('shown');
                if (gBoard[i][j].minesAroundCount > 0) {
                    elCell.innerHTML = getCellImg(gBoard[i][j].minesAroundCount);
                }
                if (!gBoard[i][j].isMine && gBoard[i][j].minesAroundCount === 0) {

                    // Recursive HERE
                    // For each cell I get from expandShown I need send the cell itself as if it was clicked

                    expandShown(gBoard, i, j); // This piece was the issue on FINAL UPLOAD => (gBoard, elCell, i, j)
                }

                // • Game ends when:
                // o LOSE: when clicking a mine, all mines should be revealed
                if (gBoard[i][j].isMine) {
                    gBoard[i][j].isShown = true;
                    elCell.classList.add('shown');
                    elCell.innerHTML = getCellImg('currentMine'); // current clicked cell

                    revealAllMines(gBoard, i, j);
                    // TODO:  add smiley for init()
                    // Add smiley => Sad & Dead – LOSE
                    var img = document.querySelector('.smiley img');
                    img.setAttribute('src', getImgSrc('smiley-sad'));
                    gameOver();
                    return;
                }
                // if not a mine => add to gGame.shownCount
                gGame.shownCount++;
            }

            console.log('cellClicked =>');
            console.log('gGame.shownCount:', gGame.shownCount);
            console.log('gGame.markedCount:', gGame.markedCount);
            console.log('gGame.shownCount + gGame.markedCount:', gGame.shownCount + gGame.markedCount);
            console.log('gBoard.length ** 2:', gBoard.length ** 2);

            // • Game ends when:
            // o WIN: all the mines are flagged, and all the other cells are shown
            if (gGame.shownCount + gGame.markedCount === gBoard.length ** 2) {
                // TODO:  add smiley for init()
                // Add smiley => Sunglasses – WIN
                var img = document.querySelector('.smiley img');
                img.setAttribute('src', getImgSrc('smiley-sunglasses'));
                gameOver();
            };
        }
    }
}

function getImgSrc(imgName) {
    return `images/${imgName}.png`;
}

function revealAllMines(board, currIdx, currJdx) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (i === currIdx && j === currJdx) continue;
            if (board[i][j].isMine) {
                console.log('board[i][j].isMine:', board[i][j].isMine);
                board[i][j].isShown = true;
                // [class*=getClassName({ i, j })]
                var elCell = document.querySelector(`[class*=${getClassName({ i, j })}]`);
                elCell.classList.add('shown');
                elCell.innerHTML = getCellImg('mine');
            }
        }
    }
}

function expandShown(board, i, j) { // (board, elCell, i, j) {
    console.log('expandShown =>');
    var neighbors = getNeighbors(i, j, board);
    console.log('neighbors:', neighbors);

    for (var i = 0; i < neighbors.length; i++) {
        var cell = neighbors[i];

        // update data
        board[cell.i][cell.j].isShown = true;
        gGame.shownCount++;

        // update DOM
        var qs = getClassName(cell);
        var elCell = document.querySelector(`[class*=${qs}]`);
        elCell.classList.add('shown');
        if (board[cell.i][cell.j].minesAroundCount > 0) {
            elCell.innerHTML = getCellImg(board[cell.i][cell.j].minesAroundCount);
        }
    }

    return neighbors.length;
}

function getHint(num) {
    // Add support for HINTS
    // The user has 3 hints
    if (gGame.countHints > 0) {
        gGame.isHintClicked = true;
        gGame.countHints--;
        gGame.usedHints++;

        // update DOM
        // clicked
        var elCell = document.querySelector(`.hint-${num}`);
        elCell.classList.add('clicked');
    }
}

function showHint(board, i, j) {
    console.log('showNeighbors =>');
    // show neighbors include current cell
    var neighbors = getHintNeighbors(i, j, board);
    console.log('neighbors:', neighbors);

    for (var i = 0; i < neighbors.length; i++) {
        var cell = neighbors[i];

        // update data
        board[cell.i][cell.j].isShown = true;

        // update DOM
        var qs = getClassName(cell);
        var elCell = document.querySelector(`[class*=${qs}]`);
        elCell.classList.add('shown');
        if (board[cell.i][cell.j].minesAroundCount > 0) {
            elCell.innerHTML = getCellImg(board[cell.i][cell.j].minesAroundCount);
        } else if (board[cell.i][cell.j].isMine) {
            elCell.innerHTML = getCellImg('mine');
        }
    }
    return neighbors;
}

function hideHint(neighbors, i, j) {
    console.log('hideNeighbors =>');
    // console.log('neighbors:', neighbors);
    // var neighbors = getAllNeighbors(i, j, board);
    console.log('neighbors:', neighbors);

    // hide neighbors include current cell
    for (var i = 0; i < neighbors.length; i++) {
        var cell = neighbors[i];

        // update data
        gBoard[cell.i][cell.j].isShown = false;

        // update DOM
        var qs = getClassName(cell);
        var elCell = document.querySelector(`[class*=${qs}]`);
        elCell.classList.remove('shown');
        elCell.innerHTML = '';
    }

    clearTimeout(gHintTimeout);
    gHintTimeout = null;
}

function deleteHint(num) {
    console.log('deleteHint =>');
    // Add support for HINTS
    // The user has 3 hints
    // When a cell (unrevealed) is clicked => The clicked hint disappears
    var elHint = document.querySelector(`[class*='hint-${num}']`);
    console.log('elHint:', elHint);
    elHint.remove();
    // var elHints = document.querySelector('.hints');
    // console.log('elHints:', elHints);
    // elHints.firstChild //(elHint);

    // After using a hint reset isHintClicked to default
    gGame.isHintClicked = false;
    console.log('gGame.isHintClicked:', gGame.isHintClicked);
    // return;
}

// if you hit a mine or all cells are shown or marked
function gameOver() {
    // • stop the timer when game is over.
    clearInterval(gGameInterval);
    gGameInterval = null;
    gGame.isOn = false;
}