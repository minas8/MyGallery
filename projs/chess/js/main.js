'use strict'

// Pieces Types
var KING_WHITE = '♔';
var QUEEN_WHITE = '♕';
var ROOK_WHITE = '♖';
var BISHOP_WHITE = '♗';
var KNIGHT_WHITE = '♘';
var PAWN_WHITE = '♙';
var KING_BLACK = '♚';
var QUEEN_BLACK = '♛';
var ROOK_BLACK = '♜';
var BISHOP_BLACK = '♝';
var KNIGHT_BLACK = '♞';
var PAWN_BLACK = '♟';

// var KING_WHITE = '&#x2654;'; //'♔';
// var QUEEN_WHITE = '&#x2655;'; //'♕';
// var ROOK_WHITE = '&#x2656;'; //'♖';
// var BISHOP_WHITE = '&#x2657;'; //'♗';
// var KNIGHT_WHITE = '&#x2658;'; //'♘';
// var PAWN_WHITE = '&#x2659;'; //'♙';
// var KING_BLACK = '&#x265A;'; //'♚';
// var QUEEN_BLACK = '&#x265B;'; //'♛';
// var ROOK_BLACK = '&#x265C;'; //'♜';
// var BISHOP_BLACK = '&#x265D;'; //'♝';
// var KNIGHT_BLACK = '&#x265E;'; //'♞';
// var PAWN_BLACK = '&#x265F;'; //'♟';

// The Chess Board
var gBoard;
var gSelectedElCell = null;

function restartGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < 8; i++) {
        board[i] = [];
        for (var j = 0; j < 8; j++) {
            var piece = ''
            if (i === 1) piece = PAWN_BLACK;
            if (i === 6) piece = PAWN_WHITE;
            board[i][j] = piece;
        }
    }

    board[0][0] = board[0][7] = ROOK_BLACK;
    board[0][1] = board[0][6] = KNIGHT_BLACK;
    board[0][2] = board[0][5] = BISHOP_BLACK;
    board[0][3] = QUEEN_BLACK;
    board[0][4] = KING_BLACK;

    board[7][0] = board[7][7] = ROOK_WHITE;
    board[7][1] = board[7][6] = KNIGHT_WHITE;
    board[7][2] = board[7][5] = BISHOP_WHITE;
    board[7][3] = QUEEN_WHITE;
    board[7][4] = KING_WHITE;

    // TODO: build the board 8 * 8
    console.table(board);
    return board;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            // TODO: figure class name
            var className = ((i + j) % 2 === 0) ? 'white' : 'black';
            var tdId = `cell-${i}-${j}`;

            strHtml += `<td id="${tdId}" class="${className}" onclick="cellClicked(this)">
                            ${cell}
                        </td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}


function cellClicked(elCell) {

    // TODO: if the target is marked - move the piece!
    if (elCell.classList.contains('mark')) {
        // console.log('AHA');
        movePiece(gSelectedElCell, elCell);
        cleanBoard();
        return;
    }

    cleanBoard();

    elCell.classList.add('selected');
    gSelectedElCell = elCell;

    // console.log('elCell.id: ', elCell.id);
    var cellCoord = getCellCoord(elCell.id);
    var piece = gBoard[cellCoord.i][cellCoord.j];

    var possibleCoords = [];
    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord);
            break;
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord);
            break;
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            // • BONUS: Implement the function: getAllPossibleCoordsKnight
            possibleCoords = getAllPossibleCoordsKnight(cellCoord);
            break;
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE);
            break;
        case KING_BLACK:
        case KING_WHITE:
            // • Implement the function: getAllPossibleCoordsKing
            possibleCoords = getAllPossibleCoordsKing(cellCoord);
            break;
            break;
        case QUEEN_BLACK:
        case QUEEN_WHITE:
            // • Implement the function: getAllPossibleCoordsQueen
            possibleCoords = getAllPossibleCoordsQueen(cellCoord);
            break;

    }
    markCells(possibleCoords);
}

function movePiece(elFromCell, elToCell) {

    var fromCoord = getCellCoord(elFromCell.id);
    var toCoord = getCellCoord(elToCell.id);

    // update the MODEL
    var piece = gBoard[fromCoord.i][fromCoord.j];
    gBoard[fromCoord.i][fromCoord.j] = '';
    gBoard[toCoord.i][toCoord.j] = piece;
    // update the DOM
    elFromCell.innerText = '';
    elToCell.innerText = piece;

}

function markCells(coords) {
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        var elCell = document.querySelector(`#cell-${coord.i}-${coord.j}`);
        elCell.classList.add('mark')
    }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
}

function cleanBoard() {
    var elTds = document.querySelectorAll('.mark, .selected');
    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mark', 'selected');
    }
}

function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}

// The queen can move forwards, backwards, sideways and diagonally like a king. 
// However, unlike the king, the queen can move as far as it wants to in each of these directions. 
// The only thing that the queen can’t do is jump over any pieces along the way.
function getAllPossibleCoordsQueen(cellCoord) {
    var rook = getAllPossibleCoordsRook(cellCoord);
    var bishop = getAllPossibleCoordsBishop(cellCoord);
    var res = rook.concat(bishop);
    return res;
}

// The king can move to any square that’s directly next to it: 
// up, down, sideways or diagonal.
function getAllPossibleCoordsKing(cellCoord) {
    var res = [];

    for (var i = cellCoord.i - 1; i <= cellCoord.i + 1; i++) {
        if (i < 0 || i >= 8) continue;

        for (var j = cellCoord.j - 1; j <= cellCoord.j + 1; j++) {
            if (j < 0 || j >= 8) continue;

            if (i === cellCoord.i && j === cellCoord.j) continue;

            var coord = { i, j };
            if (!isEmptyCell(coord)) continue;
            res.push(coord);
        }
    }
    return res;
}

function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    var res = [];

    var diff = (isWhite) ? -1 : 1;
    var nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
    if (isEmptyCell(nextCoord)) res.push(nextCoord);
    else return res;

    if ((pieceCoord.i === 1 && !isWhite) || (pieceCoord.i === 6 && isWhite)) {
        diff *= 2;
        nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
        if (isEmptyCell(nextCoord)) res.push(nextCoord);
    }
    return res;
}


// The rook can move forwards, backwards and sideways like a queen. 
// However, unlike the queen, the rook can't move diagonally.
// The rook cannot jump over any other piece.
function getAllPossibleCoordsRook(pieceCoord) {
    var res = [];
    // up
    if (pieceCoord.i - 1 >= 0) {
        for (var idx = pieceCoord.i - 1; idx >= 0; idx--) {
            var coord = { i: idx, j: pieceCoord.j };
            if (!isEmptyCell(coord)) break;
            res.push(coord);
        }
    }
    // down
    if (pieceCoord.i + 1 < 8) {
        for (var idx = pieceCoord.i + 1; idx < 8; idx++) {
            var coord = { i: idx, j: pieceCoord.j };
            if (!isEmptyCell(coord)) break;
            res.push(coord);
        }
    }
    // left
    if (pieceCoord.j - 1 >= 0) {
        for (var idx = pieceCoord.j - 1; idx >= 0; idx--) {
            var coord = { i: pieceCoord.i, j: idx };
            if (!isEmptyCell(coord)) break;
            res.push(coord);
        }
    }
    // right
    if (pieceCoord.j + 1 < 8) {
        for (var idx = pieceCoord.j + 1; idx < 8; idx++) {
            var coord = { i: pieceCoord.i, j: idx };
            if (!isEmptyCell(coord)) break;
            res.push(coord);
        }
    }
    return res;
}

// The bishop can move diagonally like a queen, but not forward, backwards or sideways. 
// Each side starts with two bishops, one on a light square and one on a dark square.
// The bishop cannot jump over any other piece.
function getAllPossibleCoordsBishop(pieceCoord) {
    var res = [];
    // up & right
    var i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
        var coord = { i: i--, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    // console.log(res)
    // TODO: 3 more directions - the Bishop 
    // up & left
    var i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j - 1; i >= 0 && idx >= 0; idx--) {
        var coord = { i: i--, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    // console.log(res)
    // down & left
    var i = pieceCoord.i + 1;
    for (var idx = pieceCoord.j - 1; i < 8 && idx >= 0; idx--) {
        var coord = { i: i++, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    // console.log(res)
    // down & right
    var i = pieceCoord.i + 1;
    for (var idx = pieceCoord.j + 1; i < 8 && idx < 8; idx++) {
        var coord = { i: i++, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    // console.log(res)
    return res;
}

function getAllPossibleCoordsKnight(pieceCoord) {
    var res = [];

    for (var i = pieceCoord.i - 2; i <= pieceCoord.i + 2; i++) {
        for (var j = pieceCoord.j - 2; j <= pieceCoord.j + 2; j++) {
            if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard.length) continue;

            if (Math.abs(i - pieceCoord.i) + Math.abs(j - pieceCoord.j) === 3) {
                if (isEmptyCell({ i, j })) res.push({ i, j });
            }
        }

        return res;
    }
}
