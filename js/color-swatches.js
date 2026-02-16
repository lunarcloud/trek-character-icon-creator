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
        const colorButton = document.getElementById(pickerId + '-button')

        if (!container) {
            console.error(`Swatches container not found: ${swatchesContainerId}`)
            return
        }

        // Initialize color display button
        if (colorButton) {
            ColorSwatches.updateColorButton(colorButton, picker.value)

            // Update button when picker changes
            picker.addEventListener('change', () => {
                ColorSwatches.updateColorButton(colorButton, picker.value)
                ColorSwatches.updateSelectedSwatch(container, picker.value)
            })

            // Button click opens custom color dialog
            colorButton.addEventListener('click', () => {
                ColorSwatches.openCustomColorDialog(picker, selector, container)
            })
        }

        // Generate swatches from selector options
        ColorSwatches.generateSwatches(selector, container, picker, selector)

        // Update selected swatch when selector changes
        selector.addEventListener('change', () => {
            if (selector.value !== 'custom') {
                ColorSwatches.updateSelectedSwatch(container, selector.value)
                if (colorButton) {
                    ColorSwatches.updateColorButton(colorButton, selector.value)
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
     * Update the color display button to show current color.
     * @param {HTMLElement} button - The color display button
     * @param {string} color - The color to display
     */
    static updateColorButton (button, color) {
        button.style.backgroundColor = color
        button.setAttribute('aria-label', `Current color: ${color}`)
    }

    /**
     * Open custom color picker dialog.
     * @param {HTMLInputElement} picker - The hidden color picker input
     * @param {HTMLSelectElement} selector - The select element
     * @param {HTMLElement} swatchContainer - The swatches container
     */
    static openCustomColorDialog (picker, selector, swatchContainer) {
        // Create backdrop
        const backdrop = document.createElement('div')
        backdrop.className = 'dialog-backdrop'

        // Create dialog
        const dialog = document.createElement('div')
        dialog.className = 'custom-color-dialog'
        dialog.innerHTML = `
            <h3>Choose Custom Color</h3>
            <input type="color" id="temp-color-picker" value="${picker.value}">
            <div class="custom-color-dialog-buttons">
                <button type="button" class="cancel-button">Cancel</button>
                <button type="button" class="ok-button">OK</button>
            </div>
        `

        document.body.appendChild(backdrop)
        document.body.appendChild(dialog)

        const tempPicker = dialog.querySelector('#temp-color-picker')
        const okButton = dialog.querySelector('.ok-button')
        const cancelButton = dialog.querySelector('.cancel-button')

        const closeDialog = () => {
            backdrop.remove()
            dialog.remove()
        }

        okButton.addEventListener('click', () => {
            picker.value = tempPicker.value
            selector.value = 'custom'

            // Trigger change events
            const changeEvent = new Event('change', { bubbles: true })
            picker.dispatchEvent(changeEvent)
            selector.dispatchEvent(changeEvent)

            ColorSwatches.updateSelectedSwatch(swatchContainer, tempPicker.value)
            closeDialog()
        })

        cancelButton.addEventListener('click', closeDialog)
        backdrop.addEventListener('click', closeDialog)

        // Focus the temp picker
        tempPicker.focus()
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

        // Add custom color picker swatch (question mark)
        const customSwatch = document.createElement('button')
        customSwatch.type = 'button'
        customSwatch.className = 'color-swatch custom-picker'
        customSwatch.setAttribute('aria-label', 'Choose custom color')
        customSwatch.title = 'Custom color picker'

        customSwatch.addEventListener('click', (e) => {
            e.preventDefault()
            ColorSwatches.openCustomColorDialog(picker, selectElement, container)
        })

        container.appendChild(customSwatch)
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
