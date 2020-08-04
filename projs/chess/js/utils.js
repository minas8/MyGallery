'use strict'

function countNeighbours(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;

            if (i === rowIdx && j === colIdx) continue;

            if (board[i][j] === LIFE) {
                count++;
            }
        }
    }
    return count;
}