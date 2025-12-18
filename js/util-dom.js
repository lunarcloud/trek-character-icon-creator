import { getInputElement, getSelectElement } from './type-helpers.js'
import html2canvas from '../lib/html2canvas.esm.js'

/** SVG canvas size in pixels */
const SVG_SIZE = 512

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

        return `<svg data-src="${path}" class="${className}" data-cache="disabled" width="${SVG_SIZE}" height="${SVG_SIZE}"></svg>`
    }

    /**
     * Export character as a combined SVG file.
     * @param {string}      imageName       name for the download.
     * @param {HTMLElement} imageElement    element to create image of.
     * @param {boolean}     saveBackground  whether to save the background image or go transparent.
     * @returns {Promise<void>}             promise that resolves when export is complete.
     */
    static async SaveImageAsSVG (imageName, imageElement, saveBackground = true) {
        // Get all SVG elements in z-index order (DOM order = z-index order)
        // Filter to only include SVGs whose parent containers are visible
        const allSvgElements = Array.from(imageElement.querySelectorAll('svg[data-src]'))
        const svgElements = allSvgElements.filter(svg => {
            // Check if the parent element is visible (not hidden by CSS)
            return svg.parentElement && svg.parentElement.offsetParent !== null
        })

        const bgElement = imageElement.querySelector('bg')

        // Get the style element with color classes
        const styleElement = imageElement.querySelector('style')
        const styleContent = styleElement ? styleElement.innerHTML : ''

        // Create the combined SVG
        const combinedSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        combinedSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        combinedSVG.setAttribute('viewBox', `0 0 ${SVG_SIZE} ${SVG_SIZE}`)
        combinedSVG.setAttribute('width', String(SVG_SIZE))
        combinedSVG.setAttribute('height', String(SVG_SIZE))

        // Add style element if exists
        if (styleContent) {
            const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style')
            styleEl.textContent = styleContent
            combinedSVG.appendChild(styleEl)
        }

        // Add background if requested
        if (saveBackground && bgElement) {
            const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
            bgRect.setAttribute('width', String(SVG_SIZE))
            bgRect.setAttribute('height', String(SVG_SIZE))
            bgRect.setAttribute('fill', '#363638')
            combinedSVG.appendChild(bgRect)
        }

        // Process each SVG element in order
        for (const svgEl of svgElements) {
            if (svgEl instanceof SVGSVGElement) {
                // Clone the SVG's children into a group
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')

                // Copy all child nodes from the loaded SVG
                const children = Array.from(svgEl.children)
                for (const child of children) {
                    // Skip the style element as we already have it at the top level
                    if (child.tagName.toLowerCase() !== 'style') {
                        const clonedChild = child.cloneNode(true)
                        group.appendChild(clonedChild)
                    }
                }

                // Only add the group if it has content
                if (group.children.length > 0) {
                    combinedSVG.appendChild(group)
                }
            }
        }

        // Convert to string and create download
        const serializer = new XMLSerializer()
        const svgString = serializer.serializeToString(combinedSVG)
        const blob = new Blob([svgString], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.download = imageName.replace('.png', '.svg')
        link.href = url
        link.click()

        // Clean up
        URL.revokeObjectURL(url)
    }

    /**
     * Save an image file of the currently selected options.
     * @param {string}      imageName       name for the download.
     * @param {HTMLElement} rootElement     root element of the scene.
     * @param {HTMLElement} imageElement    element to create image of.
     * @param {boolean}     saveBackground  whether to save the background image or go transparent.
     * @param {string}      format          export format: 'png' or 'svg'.
     */
    static SaveImage (imageName, rootElement, imageElement, saveBackground = true, format = 'png') {
        // Handle SVG export
        if (format === 'svg') {
            rootElement.classList.add('saving')
            DomUtil.SaveImageAsSVG(imageName, imageElement, saveBackground)
                .finally(() => {
                    rootElement.classList.remove('saving')
                })
            return
        }

        // Handle PNG export with html2canvas
        if (typeof (html2canvas) !== 'function') {
            console.error('html2canvas library is not available')
            alert('Unable to save image. The required library failed to load. Please refresh the page and try again.')
            return
        }

        const size1em = parseFloat(getComputedStyle(rootElement).fontSize)

        const options = {
            backgroundColor: (saveBackground ? '#363638' : null),
            width: SVG_SIZE + (size1em * 2),
            height: SVG_SIZE + (size1em * 2),
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
