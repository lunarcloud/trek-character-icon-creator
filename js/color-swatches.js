import { getInputElement, getSelectElement } from './type-helpers.js'

/**
 * Manages color swatches for visual color selection.
 */
export class ColorSwatches {
    /**
     * Initialize color swatches for a color picker and selector pair.
     * @param {string} pickerId - Color input element ID
     * @param {string} selectorId - Color select element ID
     * @param {string} swatchesContainerId - Container element ID for swatches
     * @param {HTMLInputElement|null} filterCheckbox - Optional filter checkbox that affects visibility
     */
    static initialize (pickerId, selectorId, swatchesContainerId, filterCheckbox = null) {
        const picker = getInputElement(pickerId)
        const selector = getSelectElement(selectorId)
        const container = document.getElementById(swatchesContainerId)

        if (!container) {
            console.error(`Swatches container not found: ${swatchesContainerId}`)
            return
        }

        // Generate swatches from selector options
        ColorSwatches.generateSwatches(selector, container, picker, selector)

        // Update selected swatch when picker or selector changes
        picker.addEventListener('change', () => {
            ColorSwatches.updateSelectedSwatch(container, picker.value)
        })

        selector.addEventListener('change', () => {
            if (selector.value !== 'custom') {
                ColorSwatches.updateSelectedSwatch(container, selector.value)
            }
        })

        // Regenerate swatches when filter checkbox changes
        if (filterCheckbox) {
            filterCheckbox.addEventListener('change', () => {
                ColorSwatches.regenerate(pickerId, selectorId, swatchesContainerId)
            })
        }

        // Initial update
        ColorSwatches.updateSelectedSwatch(container, picker.value)
    }

    /**
     * Generate color swatches from select element options.
     * @param {HTMLSelectElement} selector - The select element with color options
     * @param {HTMLElement} container - Container to append swatches to
     * @param {HTMLInputElement} picker - The color picker input
     * @param {HTMLSelectElement} selectElement - The select element to update on click
     */
    static generateSwatches (selector, container, picker, selectElement) {
        // Clear existing swatches
        container.innerHTML = ''

        // Get all options except custom
        const options = Array.from(selector.querySelectorAll('option'))
            .filter(opt => opt.value !== 'custom' && opt.value !== '')

        options.forEach(option => {
            // Skip if option is hidden or parent optgroup is hidden
            if (option.hidden) return
            if (option.parentElement instanceof HTMLOptGroupElement && option.parentElement.hidden) return

            const color = option.value
            const label = option.textContent || ''

            const swatch = document.createElement('button')
            swatch.type = 'button'
            swatch.className = 'color-swatch'
            swatch.style.backgroundColor = color
            swatch.setAttribute('data-color', color)
            swatch.setAttribute('aria-label', `Select color: ${label}`)
            swatch.title = label

            // Add click handler
            swatch.addEventListener('click', (e) => {
                e.preventDefault()
                picker.value = color
                selectElement.value = color

                // Trigger change events to update the character
                const changeEvent = new Event('change', { bubbles: true })
                picker.dispatchEvent(changeEvent)
                selectElement.dispatchEvent(changeEvent)
            })

            container.appendChild(swatch)
        })
    }

    /**
     * Update which swatch appears selected.
     * @param {HTMLElement} container - Container with swatches
     * @param {string} selectedColor - The currently selected color
     */
    static updateSelectedSwatch (container, selectedColor) {
        const swatches = container.querySelectorAll('.color-swatch')
        swatches.forEach(swatch => {
            const swatchColor = swatch.getAttribute('data-color')
            if (swatchColor && swatchColor.toUpperCase() === selectedColor.toUpperCase()) {
                swatch.classList.add('selected')
            } else {
                swatch.classList.remove('selected')
            }
        })
    }

    /**
     * Regenerate swatches (useful when body type changes and options become visible/hidden).
     * @param {string} pickerId - Color input element ID
     * @param {string} selectorId - Color select element ID
     * @param {string} swatchesContainerId - Container element ID for swatches
     */
    static regenerate (pickerId, selectorId, swatchesContainerId) {
        const picker = getInputElement(pickerId)
        const selector = getSelectElement(selectorId)
        const container = document.getElementById(swatchesContainerId)

        if (!container) return

        ColorSwatches.generateSwatches(selector, container, picker, selector)
        ColorSwatches.updateSelectedSwatch(container, picker.value)
    }
}
