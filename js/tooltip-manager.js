/**
 * Tooltip Manager Module
 * Manages the application of tooltips to select elements and options
 */

import { tooltipData } from './tooltip-data.js'

/**
 * Apply tooltip to a single element
 * @param {HTMLElement} element - The element to add tooltip to
 * @param {string} tooltipText - The tooltip text
 */
function applyTooltip (element, tooltipText) {
    if (element && tooltipText) {
        element.title = tooltipText
    }
}

/**
 * Apply tooltips to options within a select element
 * @param {HTMLSelectElement} selectElement - The select element
 * @param {Record<string, string>} tooltips - Map of option values to tooltip text
 */
function applyTooltipsToOptions (selectElement, tooltips) {
    if (!selectElement) return

    const options = selectElement.querySelectorAll('option')
    options.forEach(option => {
        const value = option.value || option.textContent.trim()
        if (tooltips[value]) {
            applyTooltip(option, tooltips[value])
        }
    })
}

/**
 * Initialize body type tooltips
 */
function initBodyTypeTooltips () {
    const bodyShapeSelect = document.getElementById('body-shape')
    if (bodyShapeSelect) {
        applyTooltipsToOptions(bodyShapeSelect, tooltipData.bodyTypes)
    }

    // Cal-Mirran shape tooltips
    const calMirranShapeSelect = document.getElementById('cal-mirran-shape')
    if (calMirranShapeSelect) {
        applyTooltipsToOptions(calMirranShapeSelect, tooltipData.calMirranShapes)
    }
}

/**
 * Initialize ear type tooltips
 */
function initEarTooltips () {
    const earSelect = document.getElementById('ear-select')
    if (earSelect) {
        applyTooltipsToOptions(earSelect, tooltipData.ears)
    }
}

/**
 * Initialize nose type tooltips
 */
function initNoseTooltips () {
    const noseSelect = document.getElementById('nose-select')
    if (noseSelect) {
        applyTooltipsToOptions(noseSelect, tooltipData.noseTypes)
    }
}

/**
 * Initialize head features tooltips
 */
function initHeadFeaturesTooltips () {
    const headFeatureSelect = document.getElementById('head-feature-select')
    if (headFeatureSelect) {
        applyTooltipsToOptions(headFeatureSelect, tooltipData.headFeatures)
    }
}

/**
 * Initialize hat tooltips
 */
function initHatTooltips () {
    const hatSelect = document.getElementById('hat-select')
    if (hatSelect) {
        applyTooltipsToOptions(hatSelect, tooltipData.hats)
    }
}

/**
 * Initialize eyewear tooltips
 */
function initEyewearTooltips () {
    const eyewearSelect = document.getElementById('eyewear-select')
    if (eyewearSelect) {
        applyTooltipsToOptions(eyewearSelect, tooltipData.eyewear)
    }
}

/**
 * Initialize uniform tooltips
 */
function initUniformTooltips () {
    const uniformSelect = document.getElementById('uniform-select')
    if (!uniformSelect) return

    // Apply tooltips to uniform options
    const options = uniformSelect.querySelectorAll('option')
    options.forEach(option => {
        const value = option.value || option.textContent.trim()

        // Check uniform eras first
        if (tooltipData.uniformEras[value]) {
            applyTooltip(option, tooltipData.uniformEras[value])
        } else if (tooltipData.casual[value]) {
            applyTooltip(option, tooltipData.casual[value])
        }
    })
}

/**
 * Initialize department color tooltips
 */
function initDepartmentTooltips () {
    const uniformColorSelect = document.getElementById('std-uniform-colors')
    if (!uniformColorSelect) return

    const options = uniformColorSelect.querySelectorAll('option')
    options.forEach(option => {
        const label = option.textContent.trim()

        // Check departments
        if (tooltipData.departments[label]) {
            applyTooltip(option, tooltipData.departments[label])
        }
    })
}

/**
 * Initialize all tooltips on page load
 */
export function initializeTooltips () {
    initBodyTypeTooltips()
    initEarTooltips()
    initNoseTooltips()
    initHeadFeaturesTooltips()
    initHatTooltips()
    initEyewearTooltips()
    initUniformTooltips()
    initDepartmentTooltips()
}
