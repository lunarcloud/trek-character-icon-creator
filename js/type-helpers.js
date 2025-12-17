/**
 * Get an element by id and throw if the type is wrong.
 * @param {string} id id of element
 * @param {object} type the type of an object we want to enforce
 * @returns {HTMLElement}   the element
 */
export function getElementOfType (id, type) {
    const el = document.getElementById(id)
    if (el instanceof type === false)
        throw new Error(`Page setup incorrectly, ${id} is not a ${type}`)
    return el
}

/**
 * Get element as HTMLInputElement.
 * @param {string} id id of element
 * @returns {HTMLInputElement} correctly typed element
 */
export function getInputElement (id) {
    // @ts-ignore
    return getElementOfType(id, HTMLInputElement)
}

/**
 * Get element as HTMLButtonElement.
 * @param {string} id id of element
 * @returns {HTMLButtonElement} correctly typed element
 */
export function getButtonElement (id) {
    // @ts-ignore
    return getElementOfType(id, HTMLButtonElement)
}

/**
 * Get element as HTMLSelectElement
 * @param {string} id id of element
 * @returns {HTMLSelectElement} correctly typed element
 */
export function getSelectElement (id) {
    // @ts-ignore
    return getElementOfType(id, HTMLSelectElement)
}

/**
 * Get element as HTMLStyleElement
 * @param {string} query query to select the element
 * @returns {HTMLStyleElement} correctly typed element
 */
export function queryStyleElement (query) {
    const el = document.querySelector(query)
    if (el instanceof HTMLStyleElement === false)
        throw new Error(`Page setup incorrectly, ${query} is not a ${HTMLStyleElement}`)
    return el
}
