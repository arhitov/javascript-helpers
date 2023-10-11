'use strict';

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
 * @param {Element|Document|string} object объект наблюдения
 */
const listenerEvent = (type, callback, object = document) => {
    if ('string' === typeof object) {
        selectAllForEach(object, element => {
            listenerEvent(type, callback, element);
        });
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
 * @param {Element|Document} parent объект наблюдения
 */
const select = (selector, parent = document) => {
    return parent.querySelector(selector);
};

/**
 * Получить элемент по селектору
 * @param {string} selector
 * @param {Element|Document} parent объект наблюдения
 */
const selectOrFail = (selector, parent = document) => {
    const element = parent.querySelector(selector);
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
                console.error(e);
                throw new Error(`${response.status} ${response.statusText} ${response.url}`);
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
                throw new Error(`${data.answer.message}`);
            } else {
                throw new Error(`${data.response.status} ${data.response.statusText} ${data.response.url}`);
            }
        })
        .catch((error) => {
            console.error(error);
            throw new Error(error);
        });
};
