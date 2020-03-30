//@ts-check

"use strict";

/**
 * @returns {Array<{ title: string; author: string; price: string; coverUrl: string }>}
 */
// html elements
/** @type {HTMLFormElement} */
const addBookForm = document.querySelector('#add-book-form')
const statusPanel = document.querySelector('#status-panel');
const bookListUI = document.querySelector('.list-group');
const addButton = document.querySelector('#add');
const deleteAllBooksButton = document.querySelector('#delete-all');
/** @type {HTMLInputElement} */
const filterInput = document.querySelector('#filter');
const emptyMessage = document.querySelector('#empty-message');
/** @type {HTMLTemplateElement} */
const bookElemTpl = document.querySelector('#book-elem-tpl');


/**
 * @param {any[]} books
 */
function restoreBooks(books) {
    books.forEach(book => {
        const newBookElem = createBookListElement(books, book);
        bookListUI.appendChild(newBookElem);
    });
    updateFilterResults(books);
}

/**
 * 
 * @param {Event} event 
 * @param {Array<any>} books
 */
function addBook(event, books) {
    event.preventDefault(); // avoid default config

    const todoObj = toDataObject(addBookForm);
    books.push(todoObj);

    saveStorageBooks(books);

    const newElemElem = createBookListElement(books, todoObj);
    bookListUI.appendChild(newElemElem);
    updateFilterResults(books);

    const alertDiv = alertMessage('success', `${todoObj.title} added successfully!`); // generate alert div element

    statusPanel.appendChild(alertDiv); // inserting alert msg element into our secondBody
    setTimeout(function x() { // after 3 seconds alert message element will be deleted.
        alertDiv.remove();
    }, 3000);
}

/**
 * @param {Array<any>} books
 * @param {{ title: string; author: string; price: string; coverUrl: string }} bookObj Object with the TODO information
 * @returns {HTMLElement}
 */
function createBookListElement(books, bookObj) {
    /** @type {HTMLElement} */
    // @ts-ignore
    var newElem = bookElemTpl.content.cloneNode(true);

    const todoForm = newElem.querySelector('form');

    /** @type {HTMLInputElement} */
    const titleCtl = newElem.querySelector('input[name="title"]');
    titleCtl.value = bookObj.title;
    /** @type {HTMLSelectElement} */
    const authorCtl = newElem.querySelector('input[name="author"]');
    authorCtl.value = bookObj.author;
    /** @type {HTMLInputElement} */
    const priceCtl = newElem.querySelector('input[name="price"]');
    priceCtl.value = bookObj.price;
    /** @type {HTMLInputElement} */
    const coverUrlCtl = newElem.querySelector('input[name="coverUrl"]');
    coverUrlCtl.value = bookObj.coverUrl;
    //isPriorityCtl.checked = (todoObj.isPriority === 'Y');

    /** @type {HTMLButtonElement} */
    const saveCtl = newElem.querySelector('button[name="save"]');
    saveCtl.addEventListener('click', (e) => {
        event.preventDefault();

        const elemIndex = books.findIndex(elem => elem === bookObj);
        if (elemIndex === -1) {
            console.error(`Element ${bookObj.title} was not found in the array!!`)
            return;
        }

        const newElemObj = toDataObject(todoForm);
        books[elemIndex] = newElemObj;
        bookObj = newElemObj;
    
        saveStorageBooks(books);

        updateFilterResults(books);
    });

    const deleteCtl = newElem.querySelector('button[name="remove"]');
    deleteCtl.addEventListener('click', (e) => {
        event.preventDefault();

        const elemIndex = books.findIndex(elem => elem === bookObj);
        books.splice(elemIndex, 1); // Remove data from array
        const todoList = document.querySelectorAll('li.list-group-item');
        todoList[elemIndex].remove(); // Remove HTML element from list

        saveStorageBooks(books);
    });

    return newElem;
}

/**
 * @param {string} type
 * @param {string} message
 */
function alertMessage(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`
    // @ts-ignore
    alertDiv.role = "alert";

    let alertMsg = document.createTextNode(message);
    alertDiv.appendChild(alertMsg);

    return alertDiv;
}

/**
 * @param {Event} event
 * @param {Array<any>} books
 */
function deleteAllElems(event, 
    books) {
    event.preventDefault();

    document.querySelectorAll('li.list-group-item')
        .forEach(e => e.remove());
    books.length = 0;
    saveStorageBooks(books);
}

/**
 * 
 * @param {HTMLFormElement} form 
 * @returns {{title: string; author: string; price: string; coverUrl: string }}
 */
function toDataObject(form) {
    const formDataObj = {
        title: null,
        author: null,
        price: null,
        coverUrl: null,
    };

    const formData = new FormData(form);

    for (let propertyName of formData.keys()) {
        formDataObj[propertyName] = formData.get(propertyName);
        if (propertyName === 'price' || propertyName === 'quantity') {
            formDataObj[propertyName] = new Number(formDataObj[propertyName]);
        }
    }

    return formDataObj;
}

/**
 * @param {Array<any>} books
 */
function updateFilterResults(books) {
    const filterTxt = filterInput.value.toLowerCase();
    const bookElems = document.querySelectorAll('li.list-group-item');

    let nMatchingElems = 0;
    if (!filterTxt) {
        // make visible all TODOs
        bookElems.forEach(e => e.className = 'list-group-item d-flex justify-content-between');
        nMatchingElems = bookElems.length;
    } else {
        let index = 0;
        bookElems.forEach(bookElem => {
            const todoTxt = books[index].title.toLowerCase();
            const todoMatchesFilter = todoTxt.indexOf(filterTxt) >= 0;
            if (todoMatchesFilter) nMatchingElems++;

            bookElem.className = (todoMatchesFilter) ?
                'list-group-item d-flex justify-content-between' :
                'list-group-item d-none justify-content-between';

            index++;
        });
    }

    const hideEmptyElemList = nMatchingElems > 0;
    emptyMessage.classList.toggle('hidden', hideEmptyElemList);

    saveStorageFilterTxt(filterTxt);
}