import { DomUtil } from './util-dom.js'
import { DataUtil } from './util-data.js'

const DEFAULT_UNIFORM = {
    'medusan': 'Prodigy B',
    'qofuari': 'Eighteenth Century A',
    'sukhabelan': 'Sarell Expanse',
    'other': 'VOY DS9'
}

/**
 * Manages uniform selection and color filtering.
 */
export class UniformManager {
    /**
     * Check if the current uniform is invalid.
     * @param {HTMLSelectElement} uniformSelect The uniform select element
     * @returns {boolean} True if invalid
     */
    static isCurrentUniformInvalid (uniformSelect) {
        return DomUtil.IsOptionInvalid(uniformSelect)
    }

    /**
     * Get the default uniform for a body shape.
     * @param {string} bodyShape The body shape
     * @returns {string} The default uniform value
     */
    static getDefaultUniform (bodyShape) {
        return DEFAULT_UNIFORM[bodyShape] ?? DEFAULT_UNIFORM['other'];
    }

    /**
     * Filter color options based on uniform and filter settings.
     * @param {HTMLElement} mainEl The main element
     * @param {HTMLSelectElement} uniformColorSelect The uniform color select element
     * @param {boolean} filteringColors Whether to filter colors
     * @param {string|null} colorsFilter The colors filter attribute
     */
    static filterColorOptions (mainEl, uniformColorSelect, filteringColors, colorsFilter) {
        mainEl.classList.toggle('filter-color-selection', filteringColors)

        const colorSelectMaybeHiddenEls = uniformColorSelect.querySelectorAll('optgroup')
        for (const el of colorSelectMaybeHiddenEls) {
            if (el instanceof HTMLOptGroupElement === false)
                continue

            // Hide if we're filtering colors and it's not the filter group
            el.hidden = (filteringColors || el.hasAttribute('hidden-until-filter')) &&
                el.getAttribute('filtergroup') !== colorsFilter

            // Hide or show the children of a group
            for (const childEl of el.children) {
                if (childEl instanceof HTMLOptionElement === false)
                    continue
                childEl.hidden = el.hidden
            }
        }
    }

    /**
     * Select an appropriate uniform color when the current one is invalid.
     * @param {HTMLSelectElement} uniformColorSelect The uniform color select element
     * @param {Array<string>} lastUsedUniformColors The last used uniform colors
     * @returns {HTMLOptionElement|null} The selected uniform option
     */
    static selectValidUniformColor (uniformColorSelect, lastUsedUniformColors) {
        const colorOptions = Array.from(uniformColorSelect.querySelectorAll('option:not([hidden])'))

        // Select first possible, or a random valid one
        const selectedUniform = /** @type {HTMLOptionElement} */ (
            colorOptions.filter(el => DataUtil.ListInList(DataUtil.ListStringToArray(el.textContent), lastUsedUniformColors))?.[0] ??
            colorOptions[Math.floor(Math.random() * colorOptions.length)]
        )

        if (selectedUniform instanceof HTMLOptionElement) {
            uniformColorSelect.selectedIndex = selectedUniform.index
            uniformColorSelect.value = selectedUniform.value
            return selectedUniform
        }

        return null
    }
}
