import { getInputElement, getSelectElement } from './type-helpers.js'

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
            // Use case-insensitive comparison to find matching option
            // Prefer visible (non-hidden) options over hidden ones for duplicate values across optgroups
            const pickerValueLower = picker.value.toLowerCase()
            const matchingOption = Array.from(selector.options).find(
                opt => opt.value.toLowerCase() === pickerValueLower &&
                    !opt.hidden &&
                    !(opt.parentElement instanceof HTMLOptGroupElement && opt.parentElement.hidden)
            ) || Array.from(selector.options).find(
                opt => opt.value.toLowerCase() === pickerValueLower
            )
            const el = matchingOption ?? selector.querySelector('[value="custom"]')
            if (el instanceof HTMLOptionElement)
                el.selected = true

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
        // Use case-insensitive comparison to find matching option
        const initialPickerValueLower = picker.value.toLowerCase()
        const initialMatchingOption = Array.from(selector.options).find(
            opt => opt.value.toLowerCase() === initialPickerValueLower
        )
        const el = initialMatchingOption ?? selector.querySelector('[value="custom"]')
        if (el instanceof HTMLOptionElement)
            el.selected = true

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
        if (el.parentElement instanceof HTMLOptGroupElement === true && el.parentElement.hidden === true)
            return true
        return el.hidden ?? false
    }

    /**
     * Hide uniform options based on body shape.
     * @param {HTMLSelectElement} selectorEl the select element
     */
    static hideInvalidSelectOptions (selectorEl) {
        const maybeHiddenEls = selectorEl.querySelectorAll('option[class]')
        for (const el of maybeHiddenEls) {
            if (el instanceof HTMLOptionElement === false)
                continue
            const style = window.getComputedStyle(el)
            el.hidden = style.visibility === 'hidden'
        }
    }

    /**
     * Generate a valid svg element to insert.
     * @param {string} path         location of the SVG file.
     * @param {string} [className]  classes to apply to the svg element.
     * @returns {string}            HTML text.
     */
    static GenerateSVGHTML (path, className = '') {
        if (path.toLowerCase().endsWith('none.svg') ||
            path === 'svg/humanoid/body-overlay.svg')
            return ''

        return `<svg data-src="${path}" class="${className}" data-cache="disabled" width="${SVG_SIZE}" height="${SVG_SIZE}"></svg>`
    }

    /**
     * Build a combined SVG of all visible character layers with drop shadow filter.
     * @param {HTMLElement} imageElement    element to create image of.
     * @param {boolean}     saveBackground  whether to include the background.
     * @returns {SVGSVGElement}             the combined SVG element.
     */
    static buildCharacterSVG (imageElement, saveBackground = true) {
        // Get all SVG elements and filter to only include those whose parent containers are visible
        const allSvgElements = Array.from(imageElement.querySelectorAll('svg[data-src]'))
        const visibleSvgElements = allSvgElements.filter(svg => {
            // Check if the parent element is visible (not hidden by attribute, display:none, or other CSS)
            const parent = svg.parentElement
            if (!parent) return false

            // Check for hidden attribute
            if (parent.hasAttribute('hidden')) return false

            // Check for display:none
            const computedStyle = window.getComputedStyle(parent)
            if (computedStyle.display === 'none') return false

            // Check offsetParent (null means element is not rendered)
            return parent.offsetParent !== null
        })

        // Sort SVG elements by their computed z-index to respect CSS stacking order
        // Elements with higher z-index should be rendered later (on top)
        // Pre-compute z-index values to avoid redundant getComputedStyle calls in sort
        const svgWithZIndex = visibleSvgElements.map(svg => {
            const style = window.getComputedStyle(svg)
            const parentStyle = window.getComputedStyle(svg.parentElement)
            // Check element first then parent, defaulting to 0
            // parseInt('auto') returns NaN (falsy), so we fall back to parent z-index
            const zIndex = parseInt(style.zIndex) || parseInt(parentStyle.zIndex) || 0
            return { svg, zIndex }
        })

        // Sort by z-index and extract the SVG elements
        const svgElements = svgWithZIndex
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(item => item.svg)

        // Get the style element with color classes
        const styleElement = imageElement.querySelector('style')
        const styleContent = styleElement ? styleElement.innerHTML : ''

        // Create the combined SVG
        const combinedSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        combinedSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        combinedSVG.setAttribute('viewBox', `0 0 ${SVG_SIZE} ${SVG_SIZE}`)
        combinedSVG.setAttribute('width', String(SVG_SIZE))
        combinedSVG.setAttribute('height', String(SVG_SIZE))

        // Collect all namespace declarations from source SVGs (use Map to avoid duplicates)
        const namespaces = new Map()
        for (const svgEl of svgElements) {
            if (svgEl instanceof SVGSVGElement) {
                // Get all attributes that are namespace declarations (xmlns:*)
                for (const attr of svgEl.attributes) {
                    if (attr.name.startsWith('xmlns:') && attr.name !== 'xmlns:xmlns') {
                        // Map key is the namespace name, ensuring no duplicates
                        namespaces.set(attr.name, attr.value)
                    }
                }
            }
        }

        // Add collected namespaces to the combined SVG
        for (const [name, value] of namespaces) {
            combinedSVG.setAttribute(name, value)
        }

        // Add style element if exists
        if (styleContent) {
            const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style')
            styleEl.textContent = styleContent
            combinedSVG.appendChild(styleEl)
        }

        // Add defs for drop shadow filter (and background pattern if needed)
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

        // Add drop shadow filter for character border visibility on light backgrounds
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
        filter.setAttribute('id', 'character-shadow')
        filter.setAttribute('x', '-10%')
        filter.setAttribute('y', '-10%')
        filter.setAttribute('width', '120%')
        filter.setAttribute('height', '120%')
        const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow')
        feDropShadow.setAttribute('dx', '0')
        feDropShadow.setAttribute('dy', '0')
        feDropShadow.setAttribute('stdDeviation', '3')
        feDropShadow.setAttribute('flood-color', 'black')
        feDropShadow.setAttribute('flood-opacity', '0.9')
        filter.appendChild(feDropShadow)
        defs.appendChild(filter)

        // Add background pattern if requested
        if (saveBackground) {
            const bgDefs = imageElement.querySelector('bg > svg defs')
            if (bgDefs) {
                for (const child of Array.from(bgDefs.children)) {
                    defs.appendChild(document.importNode(child, true))
                }
            }
        }

        combinedSVG.appendChild(defs)

        // Add background rectangle if requested
        if (saveBackground) {
            const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
            bgRect.setAttribute('width', String(SVG_SIZE))
            bgRect.setAttribute('height', String(SVG_SIZE))
            bgRect.setAttribute('fill', 'url(#holodeck-grid)')
            combinedSVG.appendChild(bgRect)
        }

        // Wrap character content in a group with drop shadow filter
        const shadowGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        shadowGroup.setAttribute('filter', 'url(#character-shadow)')

        // Process each SVG element in order
        for (const svgEl of svgElements) {
            if (svgEl instanceof SVGSVGElement) {
                // Clone the SVG's children into a group
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')

                // Check if parent has mirrored class and apply transform
                const parent = svgEl.parentElement
                if (parent && parent.classList.contains('mirrored')) {
                    // Get the --mirror-offset CSS variable value (default 6px)
                    const computedStyle = window.getComputedStyle(parent)
                    const mirrorOffsetStr = computedStyle.getPropertyValue('--mirror-offset').trim() || '6px'
                    const mirrorOffset = parseFloat(mirrorOffsetStr) || 6

                    // Apply SVG transform with transform-origin center
                    // CSS: transform: scaleX(-1) translateX(offset) with transform-origin: center
                    // In flipped coordinate space, +offset moves left (= right before flip)
                    // So in SVG: translate(center - offset), scale(-1, 1), translate(-center)
                    const centerX = SVG_SIZE / 2
                    group.setAttribute('transform', `translate(${centerX - mirrorOffset}, 0) scale(-1, 1) translate(${-centerX}, 0)`)
                }

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
                    shadowGroup.appendChild(group)
                }
            }
        }

        combinedSVG.appendChild(shadowGroup)

        return combinedSVG
    }

    /**
     * Export character as a combined SVG file.
     * @param {string}      imageName       name for the download.
     * @param {HTMLElement} imageElement    element to create image of.
     * @param {boolean}     saveBackground  whether to save the background image or go transparent.
     * @returns {Promise<void>}             promise that resolves when export is complete.
     */
    static async SaveImageAsSVG (imageName, imageElement, saveBackground = true) {
        const combinedSVG = DomUtil.buildCharacterSVG(imageElement, saveBackground)

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

        // Handle PNG export by rendering the combined SVG to a canvas
        rootElement.classList.add('saving')
        const combinedSVG = DomUtil.buildCharacterSVG(imageElement, saveBackground)

        const serializer = new XMLSerializer()
        const svgString = serializer.serializeToString(combinedSVG)
        const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString)

        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = SVG_SIZE
            canvas.height = SVG_SIZE
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, SVG_SIZE, SVG_SIZE)

            const link = document.createElement('a')
            link.download = imageName
            link.href = canvas.toDataURL('image/png', 1.0)
            link.click()
            rootElement.classList.remove('saving')
        }
        img.onerror = () => {
            console.error('Failed to render SVG to canvas for PNG export')
            alert('Unable to save image. Please try again.')
            rootElement.classList.remove('saving')
        }
        img.src = svgDataUrl
    }
}
