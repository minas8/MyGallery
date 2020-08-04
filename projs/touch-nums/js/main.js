'use strict'

// User sees a board with 16 cells, containing numbers 1..16, in a random order
// o Hint: use an HTML table
// o Hint: Nice technique for building the board:
// place the 16 numbers in a simple array, shuffle it, then build the <table> by
// popping a number from the nums array.
// o Note: there is no need to use as matrix in this exercise

// User should click the buttons in a sequence (1, 2, 3,… 16)
// • When user clicks the a button - call a function cellClicked(clickedNum)
// o If right – the button changes its color
// o When user clicks the wrong button noting happen
// • When user clicks the first number, game time starts and presented (3 digits after the
// dot, like in: 12.086)
// • Add difficulties (larger boards: 25, 36)

// TODO: 

var TIMER_FREQ = 100;
var gChosenLevel = 16;
var gNums = null;
var gNextNum;
var gGameStart = null;
var gTimeStamp = null;
var gGameInterval;

function init() {
    // if there is an interval running which was not clear from last game => clear it now!
    if (gGameInterval) {
        clearInterval(gGameInterval);
    }
    gNextNum = 1;
    gNums = createShuffledNums();
    document.querySelector('.game-time').innerHTML = '';
    renderBoard();
}

function chooseYourLevel(level) {
    gChosenLevel = level;
    init();
}

function renderBoard() {
    /*
    From 1D to 2D:
    x = index % width
    y = index / width 
    or
    x = index / height
    y = index % height
    */
    var strHtml = '';
    var boardWidth = Math.sqrt(gNums.length);
    var lastIdx = -Infinity;
    for (var i = 0; i < gNums.length; i++) {
        var rowIdx = parseInt(i / boardWidth);
        if (gNums.length % boardWidth === 0 && rowIdx !== lastIdx) {
            lastIdx = rowIdx;
            strHtml += '<tr>\n';
        }
        var colIdx = i % boardWidth;
        strHtml += `\t<td data-rowIdx="${rowIdx}" data-colIdx="${colIdx}" class="cell" 
            onclick="cellClicked(this,${gNums[i]})">${gNums[i]}</td>\n`;
        if (i === boardWidth - 1) {
            strHtml += '</tr>\n';
        }
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
    var elNextNum = document.querySelector('.next');
    elNextNum.innerText = gNextNum;
}

function cellClicked(elCell, clickedNum) {
    // When user clicks the first number, 
    // game time starts and presented (3 digits after the dot, like in: 12.086)
    if (!gGameStart) {
        gGameStart = Date.now();
        gTimeStamp = gGameStart;
        var elGameTime = document.querySelector('.game-time');
        elGameTime.innerText = ((gTimeStamp - gGameStart) / 1000).toFixed(3);
        gGameInterval = setInterval(showTime, TIMER_FREQ);
    }
    // If right – the button changes its color
    if (clickedNum === gNextNum) {
        //darksalmon
        elCell.style.backgroundColor = 'tomato';
        var elNextNum = document.querySelector('.next');
        elNextNum.innerText = ++gNextNum;
    }

    // if last number
    if (clickedNum == gChosenLevel) {
        clearInterval(gGameInterval);
    }
}

function showTime() {
    gTimeStamp = Date.now();
    var elGameTime = document.querySelector('.game-time');
    elGameTime.innerText = ((gTimeStamp - gGameStart) / 1000).toFixed(3);
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
