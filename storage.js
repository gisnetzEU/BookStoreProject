//@ts-check

"use strict";

const DEFAULT_BOOKS = [
    { id: 'ego_is_the_enemy', title: 'Ego is the enemy', price: 23.43, author: 'Ryan Holiday', coverUrl: './img/book1.jpg' },
    { id: 'how_to_have_a_good_day', title: 'How to have a good day', price: 11.40, author: 'Caroline Webs', coverUrl: './img/book4.jpg' },
    { id: 'the_legacy_of_rome', title: 'The Legacy of Rome', price: 39.93, author: 'Cyril Bailey', coverUrl: './img/book6.jpg' },
    { id: 'dracula', title: 'Dracula', price: 23.00, author: 'Bram Stoker', coverUrl: './img/book7.jpg' },
    { id: 'inside_strategy', title: 'Inside Strategy', price: 17.27, author: 'Bram Stoker', coverUrl: './img/book8.jpg' },
    { id: 'map_skill', title: 'Map Skill', price: 7.29, author: 'workbook', coverUrl: './img/book10.jpg' },
];
const DEFAULT_CART = [];

const CART_KEY = "cart";
const BOOKS_KEY = "books";
const FILTER_TEXT_KEY = "filterTxt";

const dummyLocalStorage = {};

if (!window.localStorage) {
    console.warn("LocalStorage is not supported, data will not persist!!");
}


// "Hidden" library functions
/**
 * @param {string} key
 * @param {string} value
 */
function _saveData(key, value) {
    if (window.localStorage) {
        localStorage.setItem(key, value);
    } else {
        dummyLocalStorage[key] = value;
    }
}

/**
 * @param {string} key
 * @return {string} value
 */
function _readData(key) {
    if (window.localStorage) {
        return localStorage.getItem(key);
    } else {
        return dummyLocalStorage[key];
    }
}

/**
 * @param {string} [key]
 * @param {Array} [elements]
 */
function _saveStorageElems(key, elements) {
    _saveData(key, JSON.stringify(elements));
}

/**
 * 
 * @param {string} key
 * @param {Array} defaultValue
 * @returns {Array}
 */
function _readStorageElems(key, defaultValue) {
    let elemsStr = _readData(key);
    let elems = elemsStr ? JSON.parse(elemsStr) : defaultValue;

    return elems;
}


// CART
function readStorageCart() {
    return _readStorageElems(CART_KEY, DEFAULT_CART);
}

/**
 * @param {any[]} cart
 */
function saveStorageCart(cart) {
    _saveStorageElems(CART_KEY, cart);
}


// BOOK STOCK
function readStorageBooks() {
    return _readStorageElems(BOOKS_KEY, DEFAULT_BOOKS);
}

/**
 * @param {any[]} books
 */
function saveStorageBooks(books) {
    _saveStorageElems(BOOKS_KEY, books);
}


// SEARCH FILTER
/**
 * @param {string} filterTxt
 */
function saveStorageFilterTxt(filterTxt) {
    _saveData(FILTER_TEXT_KEY, filterTxt);
}

/**
 * @returns {string}
 */
function readStorageFilterTxt() {
    let localFilterTxt = _readData(FILTER_TEXT_KEY);
    localFilterTxt = localFilterTxt ? localFilterTxt : "";

    return localFilterTxt;
}