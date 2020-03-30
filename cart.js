// @ts-check

"use strict";

const cartBookElemTpl = document.querySelector("#cartElemTpl");
const cartBookListElem = document.querySelector("ul#cart");
/** @type {HTMLTemplateElement} */
const bookElemTpl = document.querySelector('#book-elem-tpl');

/**
 * @param { { [x: string]: any }} book
 */
function addBookToCart(book) {
    console.log("Adding book:", book);

    let cartBookElem = createCartBookElement(book);
    cartBookListElem.appendChild(cartBookElem);
}

/**
 * @param {number} cartBookIndex
 * @param {number} newQuantity
 */
function updateBookInCart(cartBookIndex, newQuantity, newAmount) {
    console.log("Updating book[" + cartBookIndex + "]:quantity=" + newQuantity);

    let cartBookElems = document.querySelectorAll("li.cartBook");
    const cartBookElem = cartBookElems[cartBookIndex];
    cartBookElem.querySelector(".bookQuantity").textContent = "" + newQuantity;
    cartBookElem.querySelector(".bookAmount").textContent = "" + newAmount;
}

/**
 *
 * @param { { [x: string]: (string) } } book
 */
function createCartBookElement(book) {
    /** @type {HTMLElement} */
    // @ts-ignore
    var newCartBookElem = cartBookElemTpl.content.cloneNode(true);

    const bookImgElem = newCartBookElem.querySelector("img");
    bookImgElem.src = book.coverUrl;

    const bookQuantityElem = newCartBookElem.querySelector("span.bookQuantity");
    bookQuantityElem.textContent = book.quantity;

    const bookPriceElem = newCartBookElem.querySelector("span.bookPrice");
    bookPriceElem.textContent = book.price;

    const bookTitleElem = newCartBookElem.querySelector("span.bookTitle");
    bookTitleElem.textContent = book.title;

    const bookAuthorElem = newCartBookElem.querySelector("span.bookAuthor");
    bookAuthorElem.textContent = book.author;

    const bookAmountElem = newCartBookElem.querySelector("span.bookAmount");
    bookAmountElem.textContent = book.amount;

    const bookBtn = newCartBookElem.querySelector("button.delete");
    bookBtn.addEventListener("click", e => {
        const elemIndex = cart.findIndex(elem => elem.id === book.id);
        cart.splice(elemIndex, 1); // Remove data from cart

        saveStorageCart(cart);
        const cartElem = document.querySelectorAll("li.cartBook");
        cartElem[elemIndex].remove(); // Remove HTML element from list

        recalculateCartTotals(cart);
    });

    return newCartBookElem;
}

/**
 *
 * @param { { [x: string]: any } } book
 */
function createBookElement(book) {
    /** @type {HTMLElement} */
    // @ts-ignore
    var newBookElem = bookElemTpl.content.cloneNode(true);

    const bookImgElem = newBookElem.querySelector("img");
    bookImgElem.src = book.coverUrl;

    const bookPriceElem = newBookElem.querySelector("span.bookPrice");
    bookPriceElem.textContent = book.price;

    const bookTitleElem = newBookElem.querySelector("h6.bookTitle");
    bookTitleElem.textContent = book.title;

    const bookAuthorElem = newBookElem.querySelector("span.bookAuthor");
    bookAuthorElem.textContent = book.author;

    const bookBtn = newBookElem.querySelector("button.buy");
    bookBtn.addEventListener("click", e => {
        let cartBookIndex = cart.findIndex(b => b.id === book.id);
        if (cartBookIndex === -1) {
            // Cart does not contain the book
            book.quantity = 1;
            book.amount = book.price;
            cart.push(book);
            addBookToCart(book);
        } else {
            const cartBook = cart[cartBookIndex];
            cartBook.quantity++;
            cartBook.amount = cartBook.quantity * book.price;
            updateBookInCart(cartBookIndex, cartBook.quantity, cartBook.amount);
        }

        recalculateCartTotals(cart);
        saveStorageCart(cart);
    });

    return newBookElem;
}

/**
 * @param {any[]} cart
 */
function recalculateCartTotals(cart) {
    const cartQuantity = cart.reduce((acc, elem) => acc + elem.quantity, 0);
    document.querySelector("#cart-quantity").textContent = cartQuantity;

    const cartAmount = cart.reduce((acc, elem) => acc + elem.amount, 0);
    document.querySelector("#cart-amount").textContent = cartAmount.toFixed(2);
}

/**
 * @param { Array<{ [x: string]: any }> } books
 */
function createBookList(books) {
    let bookListHtml = document.querySelector("ul.books");
    books.forEach(book => {
        let bookElem = createBookElement(book);
        bookListHtml.appendChild(bookElem);
    });
}

/**
 *
 * @param { Array<{ [x: string]: any } >} cart
 */
function renderCart(cart) {
    cart.forEach(book => addBookToCart(book));

    recalculateCartTotals(cart);
}

/**
 *
 * @param { Array<{ [x: string]: any } >} cart
 */
function removeAll(cart) {
    document.querySelectorAll("li.cartBook")
        .forEach(e => e.remove());
    cart.length = 0;
    saveStorageCart(cart);
    recalculateCartTotals(cart);
}
