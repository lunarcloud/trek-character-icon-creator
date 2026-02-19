/**
 * Tooltip Manager Module
 * Manages the application of tooltips to select elements and options
 */

import { tooltipData } from './tooltip-data.js'

/**
 * Tooltip Manager class for applying tooltips to UI elements
 */
export class TooltipManager {
    /**
     * Apply tooltip to a single element
     * @param {HTMLElement} element - The element to add tooltip to
     * @param {string} tooltipText - The tooltip text
     */
    static applyTooltip (element, tooltipText) {
        if (element && tooltipText) {
            element.title = tooltipText
        }
    }

    /**
     * Apply tooltips to options within a select element
     * @param {HTMLSelectElement} selectElement - The select element
     * @param {Record<string, string>} tooltips - Map of option values to tooltip text
     */
    static applyTooltipsToOptions (selectElement, tooltips) {
        if (!selectElement) return

        const options = selectElement.querySelectorAll('option')
        options.forEach(option => {
            const value = option.value || option.textContent.trim()
            if (tooltips[value]) {
                TooltipManager.applyTooltip(option, tooltips[value])
            }
        })
    }

    /**
     * Initialize body type tooltips
     */
    static initBodyTypeTooltips () {
        const bodyShapeSelect = document.getElementById('body-shape')
        if (bodyShapeSelect instanceof HTMLSelectElement) {
            TooltipManager.applyTooltipsToOptions(bodyShapeSelect, tooltipData.bodyTypes)
        }

        // Cal-Mirran shape tooltips
        const calMirranShapeSelect = document.getElementById('cal-mirran-shape')
        if (calMirranShapeSelect instanceof HTMLSelectElement) {
            TooltipManager.applyTooltipsToOptions(calMirranShapeSelect, tooltipData.calMirranShapes)
        }
    }

    /**
     * Initialize ear type tooltips
     */
    static initEarTooltips () {
        const earSelect = document.getElementById('ear-select')
        if (earSelect instanceof HTMLSelectElement) {
            TooltipManager.applyTooltipsToOptions(earSelect, tooltipData.ears)
        }
    }

    /**
     * Initialize nose type tooltips
     */
    static initNoseTooltips () {
        const noseSelect = document.getElementById('nose-select')
        if (noseSelect instanceof HTMLSelectElement) {
            TooltipManager.applyTooltipsToOptions(noseSelect, tooltipData.noseTypes)
        }
    }

    /**
     * Initialize head features tooltips
     */
    static initHeadFeaturesTooltips () {
        const headFeatureSelect = document.getElementById('head-feature-select')
        if (headFeatureSelect instanceof HTMLSelectElement) {
            TooltipManager.applyTooltipsToOptions(headFeatureSelect, tooltipData.headFeatures)
        }

        const jewelrySelect = document.getElementById('jewelry-select')
        if (jewelrySelect instanceof HTMLSelectElement) {
            TooltipManager.applyTooltipsToOptions(jewelrySelect, tooltipData.jewelry)
        }
    }

    /**
     * Initialize hat tooltips
     */
    static initHatTooltips () {
        const hatSelect = document.getElementById('hat-select')
        if (hatSelect instanceof HTMLSelectElement) {
            TooltipManager.applyTooltipsToOptions(hatSelect, tooltipData.hats)
        }
    }

    /**
     * Initialize eyewear tooltips
     */
    static initEyewearTooltips () {
        const eyewearSelect = document.getElementById('eyewear-select')
        if (eyewearSelect instanceof HTMLSelectElement) {
            TooltipManager.applyTooltipsToOptions(eyewearSelect, tooltipData.eyewear)
        }
    }

    /**
     * Initialize uniform tooltips
     */
    static initUniformTooltips () {
        const uniformSelect = document.getElementById('uniform-select')
        if (!uniformSelect) return

        // Apply tooltips to uniform options
        const options = uniformSelect.querySelectorAll('option')
        options.forEach(option => {
            const value = option.value || option.textContent.trim()

            // Check uniform eras first
            if (tooltipData.uniformEras[value]) {
                TooltipManager.applyTooltip(option, tooltipData.uniformEras[value])
            } else if (tooltipData.casual[value]) {
                TooltipManager.applyTooltip(option, tooltipData.casual[value])
            }
        })
    }

    /**
     * Initialize department color tooltips
     */
    static initDepartmentTooltips () {
        const uniformColorSelect = document.getElementById('std-uniform-colors')
        if (!uniformColorSelect) return

        const options = uniformColorSelect.querySelectorAll('option')
        options.forEach(option => {
            const label = option.textContent.trim()

            // Check departments
            if (tooltipData.departments[label]) {
                TooltipManager.applyTooltip(option, tooltipData.departments[label])
            }
        })
    }

    /**
     * Initialize all tooltips on page load
     */
    static initialize () {
        TooltipManager.initBodyTypeTooltips()
        TooltipManager.initEarTooltips()
        TooltipManager.initNoseTooltips()
        TooltipManager.initHeadFeaturesTooltips()
        TooltipManager.initHatTooltips()
        TooltipManager.initEyewearTooltips()
        TooltipManager.initUniformTooltips()
        TooltipManager.initDepartmentTooltips()
    }
}
