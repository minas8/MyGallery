'use strict'

var gProjs;

_createProjects();

function _createProjects() {

    gProjs = [
        {
            id: 'chess',
            name: 'Chess',
            // title: 'Better push those boxes',
            desc: 'Board Games',
            url: 'projs/chess',
            publishedAt: new Date('2020-7-15').getTime(),
            labels: ['Games', 'Board', 'Chess']
        },
        {
            id: 'in-picture-game',
            name: 'In-Picture Game',
            // title: 'Better push those boxes',
            desc: 'HTML-CSS-JS GAMES',
            url: 'projs/in-picture-game',
            publishedAt: new Date('2020-7-16').getTime(),
            labels: ['Games', 'HTML', 'CSS', 'JS']
        },
        {
            id: 'touch-nums',
            name: 'Touch Nums',
            // title: 'Better push those boxes',
            desc: 'HTML-CSS-JS GAMES',
            url: 'projs/touch-nums',
            publishedAt: new Date('2020-7-16').getTime(),
            labels: ['Games', 'HTML', 'CSS', 'JS']
        },
        {
            id: 'minesweeper',
            name: 'Minesweeper',
            // title: 'Better push those boxes',
            desc: 'Sprint 1 - Build a Game from scratch',
            url: 'projs/minesweeper',
            publishedAt: new Date('2020-7-23').getTime(),
            labels: ['Game', 'scratch']
        },
        {
            id: 'books-shop',
            name: 'Books Shop',
            // title: 'Better push those boxes',
            desc: 'CRUDL and some more',
            url: 'projs/books-shop',
            publishedAt: new Date('2020-7-30').getTime(),
            labels: ['CRUDL', 'books', 'shop']
        }
    ];
}

function getProjects() {
    return gProjs;
}

function getProjById(projectId) {
    var project = gProjs.find(function (proj) {
        return proj.id === projectId;
    });
    return project;
}