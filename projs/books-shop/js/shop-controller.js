'use strict'

var gCurrPage = 1;
var gPageCount;

function onInit() {
    gPageCount = getCountPage();
    renderBooks();
    renderPagination();
}

function renderBooks() {
    var books = getBooksForDisplay();

    if (books.length > 0) {
        var strHTMLs = books.map(function (book) {
            return `<tr>
                    <td>${book.id}</td>
                    <td>${book.name}</td>
                    <td>$${book.price}</td>
                    <td>
                        <button class="read" type="button" onclick="onReadDetails('${book.id}')">Read</button>
                    </td>
                    <td>
                        <button class="update" type="button" onclick="onShowModal('${book.id}')">Update</button>
                    </td>
                    <td>
                        <button class="delete" type="button" onclick=" onRemoveBook('${book.id}')">Delete</button>
                    </td>
                </tr>
                `
        })
        getEl('.books-list').innerHTML = strHTMLs.join('');
    }
}

function renderPagination() {
    var strHTML = '';

    // for future button (prev...)
    // var classToLeftArrow = gCurrPage === 1 ? 'off' : 'active';
    // And do not add onclick 
    var classToLeftArrow = 'off';
    strHTML += `<div class="${classToLeftArrow}"><button onclick="onPrevPage(-1)">&laquo;</button></div>`;

    for (var i = 1; i <= gPageCount; i++) {
        // for future buttons (1,2...)
        // var classToAdd = i === gCurrPage ? 'off' : 'active';
        // And do not add onclick 
        var classToAdd = 'off';
        strHTML += `<div class="${classToAdd}"><button onclick="onSelectPage(${i})">${i}</button></div>`;

    }

    // for future button (next...)
    // var classToRightArrow = gCurrPage === gPageCount ? 'off' : 'active';
    // And do not add onclick 
    var classToRightArrow = 'active';
    strHTML += `<div class="${classToRightArrow}"><button onclick="onNextPage(1)">&raquo;</button></div>`;

    getEl('.pagination-btns').innerHTML = strHTML;
}

// 4. Handle delete:
function onRemoveBook(bookId) {
    removeBook(bookId);
    renderBooks();
}

// 5. Support adding a new book:
// Bonus 1. Read the data from the user using an <input> instead of prompt
function onAddBook() {
    var elBookName = getEl('.input-name');//var names
    var elBookPrice = getEl('.input-price');
    if (!elBookName.value || !elBookPrice.value) {
        showInputError();
        return;
    }
    addBook({ name: elBookName.value, imgUrl: '' }, +elBookPrice.value);
    // reset input values
    onCloseModal([elBookName, elBookPrice]);
    renderBooks();
}

// 6. Support updating a book:
function onUpdateBook(bookId) {
    var elBookPrice = getEl('.input-price');
    if (!elBookPrice.value) {
        showInputError();
        return;
    }
    updateBook(bookId, +elBookPrice.value);
    // reset input value
    onCloseModal([elBookPrice]);
    renderBooks();
}

function showInputError() {
    var elError = getEl('.error');
    elError.style.display = "block";
    elError.innerHTML = 'Book information is missing, \nplease enter book details';
    return;
}

// if bookId === null => add
// else => update
function onShowModal(bookId = null) {
    if (bookId) {
        var bookDetails = getBookDetailsById(bookId);
        if (!bookDetails) {
            return;
        }
    }
    renderModal(bookDetails);
    var elBookModal = getEl('.add-update-modal');
    elBookModal.style.display = "block";
}

// gets an array of input elements to clear
function onCloseModal(elInputs) {
    if (elInputs) {
        elInputs.forEach(function (input) {
            input.value = '';
        });
    }
    var elBookModal = getEl('.add-update-modal');
    elBookModal.style.display = "none";
}

function renderModal(bookDetails) {
    var strHTML = `
    <div class="details-container">
        <div class="details-input">
            <div class="error"></div>`;

    // !bookDetails => show add modal 
    // else show update modal
    if (!bookDetails) {
        strHTML += `<div class="book-text">
                        <input class="input-name" type="text" placeholder="Enter book name:">`;
    } else {
        strHTML += `<div class="book-name book-text">${bookDetails.name}`;
    }

    strHTML += `</div>
                <div class="book-price">
                    <input type="number" class="input-price" placeholder="Enter book price:">
                    <span class="numbers-only">Numbers only</span>
                </div>
        </div>
        <div class="details-btn">
            <button onclick="${!bookDetails ? 'onAddBook()' : `onUpdateBook('${bookDetails.id}')`}">
                ${!bookDetails ? 'Add Book' : 'Update Book'}
            </button>
        </div>
    </div>
    `;
    var elBookModal = getEl('.add-details');
    elBookModal.innerHTML = strHTML;
}

// 7. Create a modal: Book Details, that shows the details of a
// selected book including its photo
// c. In the Book Details, allow the user to change the rate of
// the book by clicking the + / - buttons:
function onReadDetails(bookId) {
    var bookDetails = getBookDetailsById(bookId);
    renderDetails(bookDetails);
}

function renderDetails(bookDetails) {
    var elBookModal = getEl('.modal');
    elBookModal.style.display = "block";

    var strHTML = `<div class="book-name">${bookDetails.name}</div>
                   <img src="${bookDetails.imgUrl}" alt="${bookDetails.name}">
                   <div class="price">Price: $${bookDetails.price}</div>
                   <div class="current-rate">Rate: ${bookDetails.rate}</div>
                   <div class="rate-book">
                        <span class="rate">Rate (between 0 and 10):</span>
                        <input type="number" onkeyup="onInputClick(event,this)"
                        name="rate" class="rate" min="0" max="10">
                        <button class="rate" type="button" onclick="onRate(event,'${bookDetails.id}')">
                        Update Rate</button>
                    </div>
                  `;
    var elBookDetails = getEl('.details');
    elBookDetails.innerHTML = strHTML;
}

// When the user clicks anywhere outside of the modal, close it
function onCloseDetails() {
    var elBookModal = getEl('.modal');
    elBookModal.style.display = "none";
}

// This func only prevents the input's click event from closing the modal
function onInputClick(ev, el) {
    ev.stopPropagation();
}

function onRate(ev, bookId) {
    ev.stopPropagation();
    if (event.path[0].type === 'button') {
        var elRate = getEl('input.rate').value;
        // if rate value is empty => do nothing
        if (!elRate) return;
        else if (elRate < 0) elRate = 0;
        else if (elRate > 10) elRate = 10;
        updateRate(bookId, elRate);
        renderDetails(getBookDetailsById(bookId));
    }
}

// Bonus 2. Make the header of the table clickable to support sorting by name or price
// a. Note: Sorting is achieved in the same way that we filter the list (use: gSortBy)
function onSetSort(sortBy) {
    setSort(sortBy);
    renderBooks();
}

function getEl(selector) {
    return document.querySelector(selector);
}

// Bonus 3. Add paging:
function onNextPage() {
    getNextPage();
    gCurrPage = getCurrentPage();
    renderBooks();
    renderPagination();
}
























/* <div class="input-group">
  <input type="button" value="-" class="button-minus" data-field="quantity">
  <input type="number" step="1" max="" value="1" name="quantity" class="quantity-field">
  <input type="button" value="+" class="button-plus" data-field="quantity">
</div> */

// function incrementValue(e) {
//     e.preventDefault();
//     var fieldName = $(e.target).data('field');
//     var parent = $(e.target).closest('div');
//     var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

//     if (!isNaN(currentVal)) {
//       parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
//     } else {
//       parent.find('input[name=' + fieldName + ']').val(0);
//     }
//   }

//   function decrementValue(e) {
//     e.preventDefault();
//     var fieldName = $(e.target).data('field');
//     var parent = $(e.target).closest('div');
//     var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

//     if (!isNaN(currentVal) && currentVal > 0) {
//       parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
//     } else {
//       parent.find('input[name=' + fieldName + ']').val(0);
//     }
//   }

//   $('.input-group').on('click', '.button-plus', function(e) {
//     incrementValue(e);
//   });

//   $('.input-group').on('click', '.button-minus', function(e) {
//     decrementValue(e);
//   });