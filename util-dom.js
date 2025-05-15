import { getInputElement, getSelectElement } from './type-helpers.js'
import html2canvas from './lib/html2canvas.esm.js'

/**
 * DOM-related Utilities
 */
export class DomUtil {
    /**
     *  Wire together a color input that has a selector of pre-created colors.
     * @param {string} pickerId     Color Input Element's Id.
     * @param {string} selectorId   Color Selector Element's Id.
     * @param {Function} callback   Callback to run on either changing.
     * @returns {HTMLInputElement}  Color Input Element.
     */
    static SetupColorInputWithSelect (pickerId, selectorId, callback) {
        // get the elements from their ids
        const picker = getInputElement(pickerId)
        const selector = getSelectElement(selectorId)

        // create changed event handlers
        const onChangePicker = () => {
            // Set the "standard" colors selector to what's selected or 'custom'
            const el = selector.querySelector(`[value="${picker.value}"]`) ??
                selector.querySelector('[value="custom"]')
            if (el instanceof HTMLOptionElement)
                selector.value = el.value

            callback()
        }

        const onChangeSelector = () => {
            if (selector.value !== 'custom')
                picker.value = selector.value
            callback()
        }

        // wire up the changed events
        picker.addEventListener('change', onChangePicker)
        selector.addEventListener('change', onChangeSelector)

        // Update the selector if the current picker is one of the values
        const el = selector.querySelector(`[value="${picker.value.toUpperCase()}"]`) ??
                    selector.querySelector('[value="custom"]')
        if (el instanceof HTMLOptionElement)
            selector.value = el.value

        // return the setup picker
        return picker
    }

    /**
     * @callback OptionToBoolean
     * @param {HTMLOptionElement}   el  element to inspect
     * @returns {boolean}               result of function
     */

    /**
     * Determine if the current uniform is not currently valid.
     * Usually invalidated by a change in body shape.
     * @param {HTMLSelectElement} selectEl          the element to inspect
     * @returns {boolean} the determination
     */
    static IsOptionInvalid (selectEl) {
        const el = selectEl.querySelectorAll('option')[selectEl.selectedIndex]
        if (el instanceof HTMLOptionElement === false)
            return true
        if (el.parentElement instanceof HTMLOptGroupElement === false ||
            el.parentElement.hidden === true)
            return true
        return el.hidden ?? false
    }

    /**
     * Generate a valid svg element to insert.
     * @param {string} path         location of the SVG file.
     * @param {string} [className]  classes to apply to the svg element.
     * @returns {string}            HTML text.
     */
    static GenerateSVGHTML (path, className = '') {
        if (path.toLowerCase().endsWith('none.svg') ||
            path === 'humanoid/body-overlay.svg')
            return ''

        return `<svg data-src="${path}" class="${className}" data-cache="disabled" width="512" height="512"></svg>`
    }

    /**
     * Save an image file of the currently selected options.
     * @param {string}      imageName       name for the download.
     * @param {HTMLElement} rootElement     root element of the scene.
     * @param {HTMLElement} imageElement    element to create image of.
     * @param {boolean}     saveBackground  whether to save the background image or go transparent.
     */
    static SaveImage (imageName, rootElement, imageElement, saveBackground = true) {
        if (typeof (html2canvas) !== 'function') {
            alert('Cannot create image, canvas library not working.')
            return
        }

        const size1em = parseFloat(getComputedStyle(rootElement).fontSize)

        const options = {
            backgroundColor: (saveBackground ? '#363638' : null),
            width: 512 + (size1em * 2),
            height: 512 + (size1em * 2),
            ignoreElements: (/** @type {{ tagName: string; }} */ el) => {
                return el.tagName === 'BG' && !saveBackground
            }
        }

        rootElement.classList.add('saving')
        html2canvas(imageElement, options)
            .then((/** @type {HTMLCanvasElement} */ canvas) => {
                const link = document.createElement('a')
                link.download = imageName
                link.href = canvas.toDataURL('image/png', 1.0)
                link.click()
            }).finally(() => {
                rootElement.classList.remove('saving')
            })
    }
}
