// @ts-check

"use strict";

filterInput.value = readStorageFilterTxt();
const globalBooks = readStorageBooks();
restoreBooks(globalBooks);

// Listeners
addButton.addEventListener('click', e => addBook(e, globalBooks));
deleteAllBooksButton.addEventListener('click', e => deleteAllElems(e, globalBooks));
filterInput.addEventListener('input', e => updateFilterResults(globalBooks))

updateFilterResults(globalBooks);