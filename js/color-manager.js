import { getInputElement, getSelectElement } from './type-helpers.js'
import { DomUtil } from './util-dom.js'
import { DataUtil } from './util-data.js'

const UNIFORM_DEPARTMENTS = [
    'Command',
    'Ops',
    'Security',
    'Science',
    'Medical',
    'Engineering'
]

/**
 * Manages all color-related functionality.
 */
export class ColorManager {
    /**
     * @type {HTMLInputElement}
     */
    bodyColorPicker

    /**
     * @type {HTMLInputElement}
     */
    uniformColorPicker

    /**
     * @type {HTMLInputElement}
     */
    uniformColorFilterCheck

    /**
     * @type {HTMLInputElement}
     */
    uniformUndershirtColorPicker

    /**
     * @type {HTMLInputElement}
     */
    antennaeColorPicker

    /**
     * @type {HTMLInputElement}
     */
    birdTuftColorPicker

    /**
     * @type {HTMLInputElement}
     */
    whiskersColorPicker

    /**
     * @type {HTMLSelectElement}
     */
    uniformColorSelect

    /**
     * @type {HTMLInputElement}
     */
    hairColorPicker

    /**
     * @type {HTMLInputElement}
     */
    syncAntennaeWithBodyCheck

    /**
     * @type {HTMLInputElement}
     */
    syncBirdTuftWithBodyCheck

    /**
     * @type {HTMLInputElement}
     */
    syncWhiskersWithBodyCheck

    #lastUsedBodyColors = {
        humanoid: '#FEE4B3',
        cetaceous: '#B5BEC8',
        sukhabelan: '#472865',
        qofuari: '#765321',
        uniform: ['Command']
    }

    /**
     * Constructor - Setup color pickers and synchronization.
     * @param {Function} onChangeCallback Callback to trigger when a change is detected
     */
    constructor (onChangeCallback) {
        // Setup color input paired with a select
        this.bodyColorPicker = DomUtil.SetupColorInputWithSelect('body-color', 'std-body-colors', onChangeCallback)
        this.hairColorPicker = DomUtil.SetupColorInputWithSelect('hair-color', 'std-hair-colors', onChangeCallback)
        this.uniformColorPicker = DomUtil.SetupColorInputWithSelect('uniform-color', 'std-uniform-colors', onChangeCallback)
        this.uniformUndershirtColorPicker = DomUtil.SetupColorInputWithSelect('uniform-undershirt-color', 'std-uniform-undershirt-colors', onChangeCallback)

        this.antennaeColorPicker = getInputElement('andorian-antennae-color')
        this.birdTuftColorPicker = getInputElement('bird-tuft-color')
        this.whiskersColorPicker = getInputElement('whiskers-color')
        this.uniformColorSelect = getSelectElement('std-uniform-colors')
        this.uniformColorFilterCheck = getInputElement('filter-color-selection')

        this.syncAntennaeWithBodyCheck = getInputElement('sync-antennae-with-body')
        this.syncBirdTuftWithBodyCheck = getInputElement('sync-bird-tuft-with-body')
        this.syncWhiskersWithBodyCheck = getInputElement('sync-whiskers-with-body')

        // Handle sync checkboxes - uncheck when selecting color manually
        this.antennaeColorPicker.addEventListener('change', () => {
            this.syncAntennaeWithBodyCheck.checked = false
            onChangeCallback()
        })
        this.birdTuftColorPicker.addEventListener('change', () => {
            this.syncBirdTuftWithBodyCheck.checked = false
            onChangeCallback()
        })
        this.whiskersColorPicker.addEventListener('change', () => {
            this.syncWhiskersWithBodyCheck.checked = false
            onChangeCallback()
        })

        // When user changes the uniform color, update the "last known uniform list"
        this.uniformColorSelect.addEventListener('change', () => {
            const selectedOption = this.uniformColorSelect.selectedOptions?.[0]
            if (!selectedOption) return
            const selectedColorNames = DataUtil.ListStringToArray(selectedOption.textContent)
            if (!this.isUniformColorCustom() && !DataUtil.ListInList(selectedColorNames, UNIFORM_DEPARTMENTS))
                return
            this.#lastUsedBodyColors.uniform = selectedColorNames
        })
    }

    /**
     * Get all elements that should trigger change detection.
     * @returns {HTMLElement[]} Array of elements
     */
    getChangeDetectionElements () {
        return [
            this.uniformColorFilterCheck,
            this.syncAntennaeWithBodyCheck,
            this.syncBirdTuftWithBodyCheck,
            this.syncWhiskersWithBodyCheck
        ]
    }

    /**
     * Check if the uniform color is set to custom.
     * @returns {boolean} True if custom color is selected
     */
    isUniformColorCustom () {
        return this.uniformColorSelect.selectedOptions?.[0]?.value === 'custom'
    }

    /**
     * Check if the current uniform color is invalid.
     * @returns {boolean} True if invalid
     */
    isCurrentColorInvalid () {
        return !this.isUniformColorCustom() && DomUtil.IsOptionInvalid(this.uniformColorSelect)
    }

    /**
     * Update color pickers that have been chosen to sync with the body color.
     */
    updateSynchronizedColors () {
        if (this.syncAntennaeWithBodyCheck.checked)
            this.antennaeColorPicker.value = this.bodyColorPicker.value

        if (this.syncBirdTuftWithBodyCheck.checked)
            this.birdTuftColorPicker.value = this.bodyColorPicker.value

        if (this.syncWhiskersWithBodyCheck.checked)
            this.whiskersColorPicker.value = this.bodyColorPicker.value
    }

    /**
     * Generate CSS styles for character colors.
     * @returns {string} CSS style string
     */
    generateColorStyles () {
        return `svg .body-color { color: ${this.bodyColorPicker.value} !important; } ` +
            `svg .hair-color { color: ${this.hairColorPicker.value} !important; } ` +
            `svg .uniform-color { color: ${this.uniformColorPicker.value} !important; } ` +
            `svg .uniform-undershirt-color { color: ${this.uniformUndershirtColorPicker.value} !important;}` +
            `svg .bird-tuft-color { color: ${this.birdTuftColorPicker.value} !important;}` +
            `svg .andorian-antennae-color { color: ${this.antennaeColorPicker.value} !important;}` +
            `svg .whiskers-color { color: ${this.whiskersColorPicker.value} !important;}`
    }

    /**
     * Get the last used body color for a specific body shape.
     * @param {string} bodyShape The body shape
     * @returns {string} The color value
     */
    getLastUsedBodyColor (bodyShape) {
        return this.#lastUsedBodyColors[bodyShape]
    }

    /**
     * Set the last used body color for a specific body shape.
     * @param {string} bodyShape The body shape
     * @param {string} color The color value
     */
    setLastUsedBodyColor (bodyShape, color) {
        this.#lastUsedBodyColors[bodyShape] = color
    }

    /**
     * Get the last used uniform colors.
     * @returns {Array<string>} The uniform color names
     */
    getLastUsedUniformColors () {
        return this.#lastUsedBodyColors.uniform
    }
}
