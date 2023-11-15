'use strict';

/**
 * Basic assistant functions
 * @see https://github.com/arhitov/javascript-helpers
 * @author Alexander Arhitov clgsru@gmail.com
 */

/**
 * Создание события
 * @param {string} name
 * @param {Object|Array} data
 * @param {Element|Document} object объект события
 */
const callEvent = (name, data = null, object = document) => {
    object.dispatchEvent(new CustomEvent(name, {detail: data}));
};

/**
 * Подписка на событие
 * @param {string} type
 * @param {function} callback
 * @param {Element|Document|Window|string} object объект наблюдения
 * @param {Element|Document} parent элемент в котором производится поиск
 */
const listenerEvent = (type, callback, object = document, parent = document) => {
    if ('string' === typeof object) {
        selectAllForEach(object, element => {
            listenerEvent(type, callback, element);
        }, parent);
    } else {
        object.addEventListener(type, event => {
            const detail = event?.detail;
            return callback(
                'object' === typeof detail
                    ? detail
                    : null,
                event
            );
        });
    }
};

/**
 * Подписка на событие загрузки страницы
 * @param {function} callback
 */
const readyEvent = callback => {
    if (document.readyState !== 'loading') callback();
    else document.addEventListener('DOMContentLoaded', callback);
};

/**
 * Получить элемент по селектору
 * @param {string} selector
 * @param {Element|Document} parent элемент в котором производится поиск
 * @return Element|null
 */
const select = (selector, parent = document) => {
    return parent.querySelector(selector);
};

/**
 * Получить элемент по селектору
 * @param {string} selector
 * @param {Element|Document} parent элемент в котором производится поиск
 * @return Element
 * @throws Error
 */
const selectOrFail = (selector, parent = document) => {
    const element = select(selector, parent);
    if (null === element) {
        throw Error('Error: DOM Element not found!')
    }
    return element;
};

/**
 * Получить родительский элемент по селектору
 * @param {Element} node элемент от которого производится поиск
 * @param {string} selector
 * @return Element|null
 */
const parent = (node, selector) => {
    return node.closest(selector);
};

/**
 * Получить родительский элемент по селектору
 * @param {Element} node элемент от которого производится поиск
 * @param {string} selector
 * @return Element
 * @throws Error
 */
const parentOrFail = (node, selector) => {
    const element = parent(node, selector);
    if (null === element) {
        throw Error('Error: DOM Element not found!')
    }
    return element;
};

/**
 * Получить список элементов по селектору
 * @param {string} selector
 */
const selectAll = selector => {
    return [...document.querySelectorAll(selector)];
};

/**
 * Применение коллбэк функцию к элементам
 * @param {string} selector
 * @param {function} callback
 * @param {Element|Document} parent
 */
const selectAllForEach = (selector, callback, parent = document) => {
    ([].slice.call(parent.querySelectorAll(selector))).forEach(element => {
        callback(element);
    });
};

class ErrorData extends Error {
    data;
    constructor(message, data) {
        super(message);
        this.data = data;
    }
}

/**
 * Basic JSON promise fetch handler
 * @param {Promise} promise
 */
const fetchJsonHandler = async (promise) => {
    return await promise
        .then(async response => {
            try {
                return {
                    response: response,
                    answer: await response.json()
                };
            } catch (e) {
                if ([200, 201, 202, 204].indexOf(response.status)) {
                    return {
                        response: response,
                        answer: {}
                    };
                } else {
                    console.error(e);
                    throw new ErrorData(`${response.status} ${response.statusText} ${response.url}`, response);
                }
            }
        })
        .then(data => {
            if (data.response.ok) {
                return {
                    response: data.response,
                    status: data.response.status,
                    answer: data.answer
                };
            } else if (data.answer.message) {
                throw new ErrorData(`${data.answer.message}`, data);
            } else {
                throw new ErrorData(`${data.response.status} ${data.response.statusText} ${data.response.url}`, data);
            }
        })
        .catch(error => {
            throw new ErrorData(error, error.data ?? null);
        });
};

/**
 * Генерирует случайны 4-х значный идентификатор
 * @return {number}
 */
const generateIdx = () => {
    return Math.floor(Math.random() * (9999 - 1000) + 1000);
};

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const dump = function () {
    console.log('Dump:');
    for (let i = 0; i < arguments.length; i++) {
        console.log(`#${i}`, arguments[i]);
    }
    console.trace();
}

const dd = function () {
    dump(...arguments);
    throw new (class Die extends Error{
        constructor(message) {
            super(message);
            this.name = 'Die';
        }
    })('Break!');
}
