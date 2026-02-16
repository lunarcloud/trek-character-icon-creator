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
        const colorDisplay = document.getElementById(pickerId + '-display')

        if (!container) {
            console.error(`Swatches container not found: ${swatchesContainerId}`)
            return
        }

        // Initialize color display
        if (colorDisplay) {
            ColorSwatches.updateColorDisplay(colorDisplay, picker.value)

            // Update display when picker changes
            picker.addEventListener('change', () => {
                ColorSwatches.updateColorDisplay(colorDisplay, picker.value)
                ColorSwatches.updateSelectedSwatch(container, picker.value)
            })

            // Color display is just for showing the current color
            // (It's not interactive - clicking the summary opens/closes the details)
        }

        // Generate swatches from selector options
        ColorSwatches.generateSwatches(selector, container, picker, selector)

        // Update selected swatch when selector changes
        selector.addEventListener('change', () => {
            if (selector.value !== 'custom') {
                ColorSwatches.updateSelectedSwatch(container, selector.value)
                if (colorDisplay) {
                    ColorSwatches.updateColorDisplay(colorDisplay, selector.value)
                }
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
     * Update the color display element to show current color.
     * @param {HTMLElement} display - The color display element
     * @param {string} color - The color to display
     */
    static updateColorDisplay (display, color) {
        display.style.backgroundColor = color
        display.setAttribute('aria-label', 'Current selected color')
        display.title = color
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

                // Find and select the matching option in the dropdown (case-insensitive comparison)
                const matchingOption = Array.from(selectElement.options).find(
                    opt => opt.value.toLowerCase() === color.toLowerCase()
                )
                if (matchingOption) {
                    selectElement.value = matchingOption.value // Use the actual option value to preserve case
                } else {
                    console.warn(`No matching option found for color: ${color}`)
                }

                // Trigger change events to update the character
                const changeEvent = new Event('change', { bubbles: true })
                picker.dispatchEvent(changeEvent)
                selectElement.dispatchEvent(changeEvent)
            })

            container.appendChild(swatch)
        })

        // Add custom color picker swatch (color input with question mark overlay)
        const customSwatchWrapper = document.createElement('div')
        customSwatchWrapper.className = 'color-swatch-wrapper custom-picker'
        customSwatchWrapper.style.position = 'relative'
        customSwatchWrapper.style.display = 'inline-block'

        const customColorInput = document.createElement('input')
        customColorInput.type = 'color'
        customColorInput.className = 'color-swatch custom-picker-input'
        customColorInput.value = picker.value
        customColorInput.setAttribute('aria-label', 'Choose custom color')
        customColorInput.title = 'Custom color picker'

        const questionMark = document.createElement('span')
        questionMark.className = 'custom-picker-label'
        questionMark.textContent = '?'
        questionMark.setAttribute('aria-hidden', 'true')

        customColorInput.addEventListener('change', () => {
            picker.value = customColorInput.value
            selectElement.value = 'custom'

            // Trigger change events to update the character
            const changeEvent = new Event('change', { bubbles: true })
            picker.dispatchEvent(changeEvent)
            selectElement.dispatchEvent(changeEvent)

            ColorSwatches.updateSelectedSwatch(container, customColorInput.value)
        })

        customSwatchWrapper.appendChild(customColorInput)
        customSwatchWrapper.appendChild(questionMark)
        container.appendChild(customSwatchWrapper)
    }

    /**
     * Update which swatch appears selected.
     * @param {HTMLElement} container - Container with swatches
     * @param {string} selectedColor - The currently selected color
     */
    static updateSelectedSwatch (container, selectedColor) {
        const swatches = container.querySelectorAll('.color-swatch:not(.custom-picker)')
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
