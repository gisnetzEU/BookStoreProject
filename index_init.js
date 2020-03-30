// @ts-check

"use strict";

const cart = readStorageCart();
const globalBooks = readStorageBooks();

renderCart(cart);
createBookList(globalBooks);
document
    .querySelector("button#cart-delete-all")
    .addEventListener("click", e => removeAll(cart)); 