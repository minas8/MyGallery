'use strict'

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function countNeighbors(cellI, cellJ, mat) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;

            if (mat[i][j].isMine) neighborsSum++;
        }
    }
    return neighborsSum;
}

function getNeighbors(cellI, cellJ, mat) {
    var neighbors = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine) continue;
            // if already isShown => do add the ceel again
            if (mat[i][j].isShown) continue;

            // getNeighbors(i, j, mat);
            neighbors.push({ i, j });
        }
    }
    return neighbors;
}

function getHintNeighbors(cellI, cellJ, mat) {
    var neighbors = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            // if already isShown => do not add the cell to array
            if (mat[i][j].isShown) continue;

            // getNeighbors(i, j, mat);
            neighbors.push({ i, j });
        }
    }
    return neighbors;
}

















function runGeneration(board) {
    var newBoard = copyMat(board);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var numOfNeighbors = countNeighbors(i, j, board);
            if ((numOfNeighbors > 2) && (numOfNeighbors < 6)) {
                if (board[i][j] === '') newBoard[i][j] = LIFE;
            }
            else if (board[i][j] === LIFE) newBoard[i][j] = '';
        }
    }

    return newBoard;
}



function createShuffledNums() {
    var nums = [];
    for (var i = 0; i < gChosenLevel;) {
        nums.push(++i);
    }

    var shuffledNums = [];
    for (var i = 0; i < gChosenLevel; i++) {
        var rndNum = getRndNum(nums);
        shuffledNums.push(rndNum);
    }
    return shuffledNums;
}

function getRndNum(nums) {
    var rnd = nums.splice(getRndIdx(0, nums.length), 1)[0];
    return rnd;
}

function getRndIdx(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
    //The maximum is exclusive and the minimum is inclusive
}

function showTime() {
    gTimeStamp = Date.now();
    gGame.secsPassed = (gTimeStamp - gGameStart) / 1000;
    var elGameTime = document.querySelector('.timer');
    elGameTime.innerText = gGame.secsPassed.toFixed(3);
}