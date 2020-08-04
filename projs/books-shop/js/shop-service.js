'use strict'

const KEY = 'books';
const PAGE_SIZE = 3;
var gPageIdx = 0;
var gBooks;
var gSortBy;
var gAsc = 1; // ascending

_createBooks();

function _createBooks() {
    var books = loadFromStorage(KEY);
    if (!books || !books.length) {
        var books = [];
        var bookNames = [
            { name: 'Harry Potter', imgUrl: `img/2yTuumP5.jpg` },
            { name: 'The Lord of the Rings', imgUrl: `img/2JflyLZD.jpg` },
            { name: 'The Da Vinci Code', imgUrl: `img/nn6wfwK0.jpg` },
            { name: 'The Alchemist', imgUrl: `img/3MFtnEKq.jpg` },
            { name: 'Pride and Prejudice', imgUrl: `img/Yc1KfX3C.jpg` }
        ];

        books = bookNames.map(function (bookName) {
            return _createBook(bookName);
        })

        gBooks = books;
        saveToStorage(KEY, gBooks);
    }
    gBooks = books;
}

// b. Add a rate property for the book, set 0 as default
function _createBook(bookDetails, price) {
    var book = {
        id: makeId(),
        name: bookDetails.name,
        price: price || getRndInt(15, 121),
        imgUrl: bookDetails.imgUrl,
        rate: 0
    }
    return book;
}

function getBooksForDisplay() {
    var startIdx = gPageIdx * PAGE_SIZE;
    var books;
    if (!gSortBy) books = gBooks;
    else {
        books = gBooks.sort(function (book1, book2) {
            switch (gSortBy) {
                case 'name':
                    var name1 = book1.name.toLowerCase();
                    var name2 = book2.name.toLowerCase();
                    if (name1 < name2) { return -1 * gAsc; }
                    if (name1 > name2) { return 1 * gAsc; }
                    return 0;

                case 'price':
                    return (book1.price - book2.price) * gAsc;

                default:// does nothing
                    break;
            }
        });
    }
    return books.slice(startIdx, startIdx + PAGE_SIZE);
}

function removeBook(bookId) {
    var bookIdx = getBookIdx(bookId);
    gBooks.splice(bookIdx, 1);
    saveToStorage(KEY, gBooks);
}

function addBook(name, price) {
    gBooks.push(_createBook(name, price));
    saveToStorage(KEY, gBooks);
}

function updateBook(bookId, price) {
    var bookIdx = getBookIdx(bookId);
    gBooks[bookIdx].price = price;
    saveToStorage(KEY, gBooks);
}

function getBookDetailsById(bookId) {
    return gBooks.find(function (book) {
        return book.id === bookId;
    })
}

function updateRate(bookId, rate) {
    var bookIdx = getBookIdx(bookId);
    gBooks[bookIdx].rate = rate;
    saveToStorage(KEY, gBooks);
}

function getBookIdx(bookId) {
    return gBooks.findIndex(function (book) {
        return book.id === bookId;
    });
}

function setSort(sortBy) {
    if (sortBy === gSortBy) { gAsc = -gAsc; }
    gSortBy = sortBy;
}

function getNextPage() {
    var countPage = gBooks.length / PAGE_SIZE;
    gPageIdx = gPageIdx + 1 <= countPage ? gPageIdx + 1 : 0;
}

function getCurrentPage() {
    return gPageIdx + 1;
}

function getCountPage() {
    return Math.round(gBooks.length / PAGE_SIZE);
}