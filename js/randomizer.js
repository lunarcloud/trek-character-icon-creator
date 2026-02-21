import { BodyTypeManager } from './body-type-manager.js'
import { UniformManager } from './uniform-manager.js'
import { getSelectElement } from './type-helpers.js'

/**
 * Weighted species definitions for random selection.
 * Higher weight = more likely to be selected.
 * Common canon species are weighted higher, non-canon species are rare.
 * @type {Array<{value: string, specify: string, weight: number}>}
 */
const SPECIES_WEIGHTS = [
    { value: 'humanoid', specify: 'human', weight: 10 },
    { value: 'humanoid', specify: 'klingon', weight: 10 },
    { value: 'humanoid', specify: 'vulcan', weight: 7 },
    { value: 'humanoid', specify: 'andor', weight: 5 },
    { value: 'humanoid', specify: 'bajoran', weight: 5 },
    { value: 'humanoid', specify: 'cardassian', weight: 5 },
    { value: 'humanoid', specify: 'ferengi', weight: 5 },
    { value: 'humanoid', specify: 'orion', weight: 5 },
    { value: 'humanoid', specify: 'trill', weight: 5 },
    { value: 'humanoid', specify: 'cat', weight: 4 },
    { value: 'humanoid', specify: 'bird', weight: 3 },
    { value: 'humanoid', specify: 'benzite', weight: 3 },
    { value: 'humanoid', specify: 'bolian', weight: 3 },
    { value: 'humanoid', specify: 'denobulan', weight: 3 },
    { value: 'humanoid', specify: 'kelpien', weight: 3 },
    { value: 'humanoid', specify: 'tellarite', weight: 3 },
    { value: 'humanoid', specify: 'zakdorn', weight: 3 },
    { value: 'cetaceous', specify: '', weight: 3 },
    { value: 'exocomp', specify: '', weight: 2 },
    { value: 'medusan', specify: '', weight: 2 },
    { value: 'humanoid', specify: '', weight: 1 },
    { value: 'humanoid', specify: 'vinshari', weight: 1 },
    { value: 'humanoid', specify: 'tilikaal', weight: 1 },
    { value: 'cal-mirran', specify: '', weight: 1 },
    { value: 'qofuari', specify: '', weight: 1 }
]

/**
 * Pick a random element from an array.
 * @param {Array} arr The array to pick from
 * @returns {*} A random element, or undefined if array is empty
 */
function pickRandom (arr) {
    if (arr.length === 0) return undefined
    return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Select a weighted random species from the species table.
 * @returns {{value: string, specify: string, weight: number}} The selected species
 */
function pickWeightedSpecies () {
    const totalWeight = SPECIES_WEIGHTS.reduce((sum, s) => sum + s.weight, 0)
    let random = Math.random() * totalWeight
    for (const species of SPECIES_WEIGHTS) {
        random -= species.weight
        if (random <= 0) return species
    }
    return SPECIES_WEIGHTS[0]
}

/**
 * Get visible (non-hidden) options from a select element, excluding placeholder values.
 * @param {HTMLSelectElement} selectEl The select element to inspect
 * @returns {HTMLOptionElement[]} Array of visible, selectable options
 */
function getVisibleOptions (selectEl) {
    return Array.from(selectEl.options).filter(opt => {
        if (opt.hidden || opt.value === 'custom') return false
        if (opt.parentElement instanceof HTMLOptGroupElement && opt.parentElement.hidden) return false
        return true
    })
}

/**
 * Set a random visible option on a single-selection select element.
 * @param {HTMLSelectElement} selectEl The select element to randomize
 */
function randomizeSelect (selectEl) {
    const options = getVisibleOptions(selectEl)
    if (options.length === 0) return
    const chosen = pickRandom(options)
    chosen.selected = true
}

/**
 * Set a random visible option on a select, with a probability gate for non-"None" values.
 * If the random check fails, the first option (typically "None") is selected.
 * @param {HTMLSelectElement} selectEl The select element to randomize
 * @param {number} chanceOfNonNone Probability (0–1) of selecting a non-"None" option
 */
function randomizeSelectWithChance (selectEl, chanceOfNonNone) {
    const options = getVisibleOptions(selectEl)
    if (options.length === 0) return

    if (Math.random() < chanceOfNonNone) {
        const nonNone = options.filter(opt => opt.value.toLowerCase() !== 'none')
        if (nonNone.length > 0) {
            pickRandom(nonNone).selected = true
            return
        }
    }
    // Select "None" (first option)
    const noneOpt = options.find(opt => opt.value.toLowerCase() === 'none') ?? options[0]
    noneOpt.selected = true
}

/**
 * Randomly select items from a multi-select using a weighted count distribution.
 * @param {HTMLSelectElement} selectEl The multi-select element
 * @param {Array<{count: number, weight: number}>} distribution Weighted count options
 */
function randomizeMultiSelect (selectEl, distribution) {
    const options = getVisibleOptions(selectEl)
    for (const opt of selectEl.options) {
        opt.selected = false
    }
    if (options.length === 0) return

    // Pick a count from the weighted distribution
    const totalWeight = distribution.reduce((sum, d) => sum + d.weight, 0)
    let random = Math.random() * totalWeight
    let count = distribution[0].count
    for (const d of distribution) {
        random -= d.weight
        if (random <= 0) {
            count = d.count
            break
        }
    }

    // Fisher-Yates shuffle and select
    const shuffled = [...options]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
        shuffled[i].selected = true
    }
}

/**
 * Set a color picker to a random visible preset from its paired select.
 * @param {HTMLInputElement} colorPicker The color input element
 * @param {HTMLSelectElement} colorSelect The paired preset color select element
 */
function randomizeColorFromPresets (colorPicker, colorSelect) {
    const options = getVisibleOptions(colorSelect)
    if (options.length === 0) return
    const chosen = pickRandom(options)
    colorPicker.value = chosen.value
    chosen.selected = true
}

/**
 * Manages random character generation with weighted species selection.
 */
export class Randomizer {
    /**
     * Generate a random valid character by selecting random options.
     * Selects a weighted random species, then randomizes all compatible
     * options including uniform, hair, colors, and accessories.
     * @param {import('./character-elements.js').CharacterElements} elements DOM element references
     * @param {import('./color-manager.js').ColorManager} colorManager Color management instance
     * @param {Function} onChangeDetected Callback to trigger UI change detection and rendering
     */
    static randomize (elements, colorManager, onChangeDetected) {
        const species = pickWeightedSpecies()

        // Select the matching body shape option
        for (const option of elements.shapeSelect.options) {
            const specified = option.getAttribute('specify') ?? ''
            if (option.value === species.value && specified === species.specify) {
                option.selected = true
                break
            }
        }

        // First pass: establish valid options for the selected body shape
        onChangeDetected()

        // Randomize uniform from valid options
        randomizeSelect(elements.uniformSelect)

        // Randomize body-specific selects (only when visible)
        // For custom humanoid (no specify), randomize ears freely.
        // For specific species, reset to 'round' as the safe default;
        // enforceSpeciesDefaults() will override for species with
        // specific ears (e.g., vulcan→pointy, cat→cat, ferengi→ferengi).
        if (elements.earSelect.checkVisibility()) {
            if (species.specify) {
                elements.earSelect.value = 'round'
            } else {
                randomizeSelect(elements.earSelect)
            }
        }
        if (elements.noseSelect.checkVisibility()) {
            randomizeSelect(elements.noseSelect)
        }
        if (elements.calMirranShapeSelect.checkVisibility()) {
            randomizeSelect(elements.calMirranShapeSelect)
        }
        if (elements.klingonRidgesSelect.checkVisibility()) {
            randomizeSelect(elements.klingonRidgesSelect)
        }
        if (elements.klingonForeheadSelect.checkVisibility()) {
            randomizeSelect(elements.klingonForeheadSelect)
        }
        if (elements.tellariteNoseSelect.checkVisibility()) {
            randomizeSelect(elements.tellariteNoseSelect)
        }

        // Randomize hair options
        if (elements.hairSelect.checkVisibility()) {
            randomizeSelect(elements.hairSelect)
        }
        if (elements.rearHairSelect.checkVisibility()) {
            randomizeSelectWithChance(elements.rearHairSelect, 0.5)
        }
        if (elements.facialHairSelect.checkVisibility()) {
            randomizeSelectWithChance(elements.facialHairSelect, 0.35)
        }

        // Randomize accessories (60% 0-1, 20% 2, 20% 3, max 3)
        if (elements.jewelrySelect.checkVisibility()) {
            randomizeMultiSelect(elements.jewelrySelect, [
                { count: 0, weight: 30 },
                { count: 1, weight: 30 },
                { count: 2, weight: 20 },
                { count: 3, weight: 20 }
            ])
        }

        // Randomize hat (25% chance) and eyewear (10% chance)
        if (elements.hatFeatureSelect.checkVisibility()) {
            randomizeSelectWithChance(elements.hatFeatureSelect, 0.25)
        }
        if (elements.eyewearFeatureSelect.checkVisibility()) {
            randomizeSelectWithChance(elements.eyewearFeatureSelect, 0.10)
        }

        // Randomize checkboxes
        elements.hairMirror.checked = Math.random() > 0.5
        elements.rearHairMirror.checked = Math.random() > 0.5

        if (elements.foreheadBumpCheck.checkVisibility()) {
            elements.foreheadBumpCheck.checked = Math.random() > 0.5
        }
        if (elements.medusanBoxCheck.checkVisibility()) {
            elements.medusanBoxCheck.checked = Math.random() > 0.5
        }
        if (elements.medusanAltColorCheck.checkVisibility()) {
            elements.medusanAltColorCheck.checked = Math.random() > 0.5
        }
        if (elements.tellariteTusksCheck.checkVisibility()) {
            elements.tellariteTusksCheck.checked = Math.random() > 0.5
        }
        if (elements.vulcanRomulanVCheck.checkVisibility()) {
            elements.vulcanRomulanVCheck.checked = Math.random() > 0.5
        }

        // Randomize body and hair colors from visible presets
        randomizeColorFromPresets(colorManager.bodyColorPicker, colorManager.bodyColorSelect)
        randomizeColorFromPresets(colorManager.hairColorPicker, getSelectElement('std-hair-colors'))
        randomizeColorFromPresets(colorManager.uniformUndershirtColorPicker, getSelectElement('std-uniform-undershirt-colors'))

        // Filter uniform colors based on the chosen uniform, then pick a random one
        const filteringColors = colorManager.uniformColorFilterCheck.checked
        const colorsFilter = elements.uniformSelect.selectedOptions?.[0]?.getAttribute('colors-filter')
        UniformManager.filterColorOptions(elements.mainEl, colorManager.uniformColorSelect, filteringColors, colorsFilter)
        randomizeColorFromPresets(colorManager.uniformColorPicker, colorManager.uniformColorSelect)

        // Re-enforce species-specific defaults (e.g., Vulcan pointy ears)
        if (species.value === 'humanoid' && species.specify) {
            BodyTypeManager.enforceSpeciesDefaults(elements, species.specify)
        }

        // Final pass: render everything with the randomized options
        onChangeDetected()
    }
}
