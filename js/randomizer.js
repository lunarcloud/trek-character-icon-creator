import { CharacterElements } from './character-elements.js'

/**
 * Species definition with required and compatible features.
 * @typedef {object} SpeciesDefinition
 * @property {string} name - Species name
 * @property {number} weight - Relative probability weight
 * @property {string} bodyType - Required body type
 * @property {string} [ears] - Required ear type for humanoids
 * @property {string[]} [requiredHeadFeatures] - Head features that must be selected
 * @property {string[]} [compatibleHeadFeatures] - Head features that can be selected
 * @property {string[]} [excludedHeadFeatures] - Head features that should not be selected
 * @property {string[]} [facialHair] - Compatible facial hair options
 */

/**
 * Manages character randomization with species-based weighting.
 */
export class Randomizer {
    /**
     * Species definitions with weights and feature requirements.
     * @type {SpeciesDefinition[]}
     */
    static #SPECIES = [
        // Common species - higher weights
        {
            name: 'Human',
            weight: 30,
            bodyType: 'humanoid',
            ears: 'round',
            compatibleHeadFeatures: ['nose-ridges', 'trill-spots', 'bolian-line', 'denobulan-ridges'],
            facialHair: 'any'
        },
        {
            name: 'Klingon',
            weight: 25,
            bodyType: 'humanoid',
            ears: 'round',
            requiredHeadFeatures: ['klingon-ridges', 'bifurcated-forehead-a'],
            compatibleHeadFeatures: ['klingon-ridges-2', 'bifurcated-forehead-b'],
            facialHair: ['worf-beard', 'goatee-a', 'goatee-b', 'beard-and-mustache-a', 'beard-and-mustache-b', 'none']
        },
        {
            name: 'Vulcan',
            weight: 20,
            bodyType: 'humanoid',
            ears: 'pointy',
            compatibleHeadFeatures: ['vulcan-cybernetic-implant'],
            facialHair: ['goatee-a', 'goatee-b', 'mustache-a', 'none']
        },
        {
            name: 'Romulan',
            weight: 15,
            bodyType: 'humanoid',
            ears: 'pointy',
            compatibleHeadFeatures: ['north-romulan-v'],
            facialHair: ['goatee-a', 'mustache-a', 'none']
        },
        {
            name: 'Andorian',
            weight: 15,
            bodyType: 'humanoid',
            ears: 'round',
            requiredHeadFeatures: ['andorian-antennae'],
            facialHair: ['none']
        },
        {
            name: 'Bajoran',
            weight: 12,
            bodyType: 'humanoid',
            ears: 'round',
            requiredHeadFeatures: ['nose-ridges'],
            compatibleHeadFeatures: ['bajoran-earring'],
            facialHair: 'any'
        },
        {
            name: 'Cardassian',
            weight: 12,
            bodyType: 'humanoid',
            ears: 'round',
            requiredHeadFeatures: ['cardassian-forehead'],
            compatibleHeadFeatures: ['cardassian-neck'],
            facialHair: ['none']
        },
        {
            name: 'Ferengi',
            weight: 10,
            bodyType: 'humanoid',
            ears: 'ferengi',
            requiredHeadFeatures: ['ferengi-brow'],
            facialHair: ['none']
        },
        {
            name: 'Trill',
            weight: 10,
            bodyType: 'humanoid',
            ears: 'round',
            requiredHeadFeatures: ['trill-spots'],
            facialHair: 'any'
        },
        {
            name: 'Bolian',
            weight: 8,
            bodyType: 'humanoid',
            ears: 'round',
            requiredHeadFeatures: ['bolian-line'],
            facialHair: ['none']
        },
        {
            name: 'Caitian',
            weight: 8,
            bodyType: 'humanoid',
            ears: 'cat',
            requiredHeadFeatures: ['cat-nose'],
            compatibleHeadFeatures: ['gill-whiskers-or-feathers'],
            facialHair: ['cat-mouth-beard', 'none']
        },
        {
            name: 'Orion',
            weight: 8,
            bodyType: 'humanoid',
            ears: 'round',
            compatibleHeadFeatures: ['orion-head-bolting'],
            facialHair: 'any'
        },
        {
            name: 'Tellarite',
            weight: 6,
            bodyType: 'humanoid',
            ears: 'round',
            requiredHeadFeatures: ['tellarite-nose'],
            facialHair: ['beard-and-mustache-a', 'beard-and-mustache-b', 'wide-beard', 'long-beard']
        },
        {
            name: 'Benzite',
            weight: 5,
            bodyType: 'humanoid',
            ears: 'round',
            requiredHeadFeatures: ['benzite-nose', 'benzite-breather'],
            facialHair: ['none']
        },
        {
            name: 'Denobulan',
            weight: 5,
            bodyType: 'humanoid',
            ears: 'round',
            requiredHeadFeatures: ['denobulan-ridges'],
            facialHair: 'any'
        },
        {
            name: 'Kelpian',
            weight: 5,
            bodyType: 'humanoid',
            ears: 'none',
            requiredHeadFeatures: ['kelpian-lines'],
            facialHair: ['none']
        },
        {
            name: 'Zakdorn',
            weight: 4,
            bodyType: 'humanoid',
            ears: 'round',
            requiredHeadFeatures: ['zakdorn-cheeks'],
            facialHair: ['goatee-a', 'goatee-b', 'none']
        },
        {
            name: 'Cetaceous',
            weight: 8,
            bodyType: 'cetaceous'
        },
        {
            name: 'Exocomp',
            weight: 5,
            bodyType: 'exocomp'
        },
        {
            name: 'Medusan',
            weight: 3,
            bodyType: 'medusan'
        },
        // Rare non-canon species
        {
            name: 'VinShari',
            weight: 2,
            bodyType: 'humanoid',
            ears: 'round',
            requiredHeadFeatures: ['vin-shari-neck'],
            facialHair: ['none']
        },
        {
            name: 'Cal-Mirran',
            weight: 2,
            bodyType: 'cal-mirran'
        },
        {
            name: 'Qofuari',
            weight: 2,
            bodyType: 'qofuari'
        },
        {
            name: 'Sukhabelan',
            weight: 1,
            bodyType: 'sukhabelan'
        }
    ]

    /**
     * Select a random species based on weights.
     * @returns {SpeciesDefinition} Selected species
     */
    static #selectRandomSpecies () {
        const totalWeight = this.#SPECIES.reduce((sum, species) => sum + species.weight, 0)
        let random = Math.random() * totalWeight

        for (const species of this.#SPECIES) {
            random -= species.weight
            if (random <= 0) {
                return species
            }
        }

        // Fallback to human if something goes wrong
        return this.#SPECIES[0]
    }

    /**
     * Get all visible options from a select element.
     * @param {HTMLSelectElement} selectEl - The select element
     * @returns {HTMLOptionElement[]} Array of visible options
     */
    static #getVisibleOptions (selectEl) {
        return Array.from(selectEl.options).filter(option => {
            // Check if option or its optgroup parent is hidden
            const isHidden = option.hidden ||
                           (option.parentElement instanceof HTMLOptGroupElement && option.parentElement.hidden)

            // Check if option has CSS classes that would hide it based on current body type
            return !isHidden && option.checkVisibility()
        })
    }

    /**
     * Select a random option from visible options in a select element.
     * @param {HTMLSelectElement} selectEl - The select element
     * @param {string[]} [preferred] - Preferred values to choose from if available
     * @param {string[]} [excluded] - Values to exclude from selection
     * @returns {string} Selected value
     */
    static #selectRandomOption (selectEl, preferred = null, excluded = []) {
        const visibleOptions = this.#getVisibleOptions(selectEl)

        // Filter out excluded options
        let availableOptions = visibleOptions.filter(opt => !excluded.includes(opt.value))

        // If preferred options provided, try to select from those first
        if (preferred && preferred.length > 0) {
            const preferredOptions = availableOptions.filter(opt => preferred.includes(opt.value))
            if (preferredOptions.length > 0) {
                availableOptions = preferredOptions
            }
        }

        if (availableOptions.length === 0) {
            return selectEl.options[0]?.value || ''
        }

        const randomIndex = Math.floor(Math.random() * availableOptions.length)
        return availableOptions[randomIndex].value
    }

    /**
     * Select multiple random options from a multi-select element.
     * @param {HTMLSelectElement} selectEl - The multi-select element
     * @param {string[]} [required] - Values that must be selected
     * @param {string[]} [compatible] - Values that can be selected
     * @param {string[]} [excluded] - Values that should not be selected
     * @returns {string[]} Array of selected values
     */
    static #selectRandomMultiOptions (selectEl, required = [], compatible = [], excluded = []) {
        const visibleOptions = this.#getVisibleOptions(selectEl)
        const selected = [...required]

        // Filter available options
        const availableOptions = visibleOptions.filter(opt =>
            !required.includes(opt.value) &&
            !excluded.includes(opt.value) &&
            (compatible.length === 0 || compatible.includes(opt.value))
        )

        // Randomly select 0-3 additional features
        const additionalCount = Math.floor(Math.random() * 4)
        for (let i = 0; i < additionalCount && availableOptions.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableOptions.length)
            const selectedOption = availableOptions.splice(randomIndex, 1)[0]
            selected.push(selectedOption.value)
        }

        return selected
    }

    /**
     * Generate a random color value.
     * @returns {string} Hex color string
     */
    static #randomColor () {
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }

    /**
     * Select a random preset color from a color select element.
     * @param {HTMLSelectElement} colorSelect - Color preset select element
     * @returns {string} Selected color hex value
     */
    static #selectRandomPresetColor (colorSelect) {
        const visibleOptions = this.#getVisibleOptions(colorSelect)
        const nonCustomOptions = visibleOptions.filter(opt => opt.value !== 'custom' && opt.value)

        if (nonCustomOptions.length === 0) {
            return this.#randomColor()
        }

        const randomIndex = Math.floor(Math.random() * nonCustomOptions.length)
        return nonCustomOptions[randomIndex].value
    }

    /**
     * Randomize all character features based on a random species.
     * @param {CharacterElements} elements - Character elements reference
     * @returns {SpeciesDefinition} The selected species
     */
    static randomizeCharacter (elements) {
        // Select a random species
        const species = this.#selectRandomSpecies()

        // Set body type
        elements.shapeSelect.value = species.bodyType

        // Apply species-specific features based on body type
        switch (species.bodyType) {
        case 'humanoid':
            this.#randomizeHumanoid(elements, species)
            break
        case 'cetaceous':
            this.#randomizeCetaceous(elements)
            break
        case 'medusan':
            this.#randomizeMedusan(elements)
            break
        case 'cal-mirran':
            this.#randomizeCalMirran(elements)
            break
        case 'exocomp':
            // Exocomp has no customization options
            break
        case 'qofuari':
            this.#randomizeQofuari(elements)
            break
        case 'sukhabelan':
            this.#randomizeSukhabelan(elements)
            break
        }

        return species
    }

    /**
     * Randomize humanoid-specific features.
     * @param {CharacterElements} elements - Character elements reference
     * @param {SpeciesDefinition} species - Species definition
     */
    static #randomizeHumanoid (elements, species) {
        // Set ears if specified
        if (species.ears) {
            elements.earSelect.value = species.ears
        } else {
            elements.earSelect.value = this.#selectRandomOption(elements.earSelect)
        }

        // Set head features
        const selectedHeadFeatures = this.#selectRandomMultiOptions(
            elements.headFeatureSelect,
            species.requiredHeadFeatures || [],
            species.compatibleHeadFeatures || [],
            species.excludedHeadFeatures || []
        )

        // Clear and set multi-select
        Array.from(elements.headFeatureSelect.options).forEach(opt => { opt.selected = false })
        selectedHeadFeatures.forEach(value => {
            const option = elements.headFeatureSelect.querySelector(`option[value="${value}"]`)
            if (option) option.selected = true
        })

        // Set facial hair
        if (species.facialHair === 'any') {
            elements.facialHairSelect.value = this.#selectRandomOption(elements.facialHairSelect)
        } else if (Array.isArray(species.facialHair)) {
            elements.facialHairSelect.value = this.#selectRandomOption(
                elements.facialHairSelect,
                species.facialHair
            )
        } else {
            elements.facialHairSelect.value = 'none'
        }

        // Set hair
        elements.hairSelect.value = this.#selectRandomOption(elements.hairSelect)
        elements.hairMirror.checked = Math.random() > 0.5

        // Set rear hair
        elements.rearHairSelect.value = this.#selectRandomOption(elements.rearHairSelect)
        elements.rearHairMirror.checked = Math.random() > 0.5

        // Randomly set hat and eyewear (mostly none)
        elements.hatFeatureSelect.value = Math.random() > 0.8
            ? this.#selectRandomOption(elements.hatFeatureSelect)
            : 'None'
        elements.eyewearFeatureSelect.value = Math.random() > 0.85
            ? this.#selectRandomOption(elements.eyewearFeatureSelect)
            : 'None'
    }

    /**
     * Randomize cetaceous-specific features.
     * @param {CharacterElements} elements - Character elements reference
     */
    static #randomizeCetaceous (elements) {
        elements.noseSelect.value = this.#selectRandomOption(elements.noseSelect)
        elements.foreheadBumpCheck.checked = Math.random() > 0.5
    }

    /**
     * Randomize medusan-specific features.
     * @param {CharacterElements} elements - Character elements reference
     */
    static #randomizeMedusan (elements) {
        elements.medusanAltColorCheck.checked = Math.random() > 0.5
        elements.medusanBoxCheck.checked = Math.random() > 0.7
    }

    /**
     * Randomize Cal-Mirran-specific features.
     * @param {CharacterElements} elements - Character elements reference
     */
    static #randomizeCalMirran (elements) {
        elements.calMirranShapeSelect.value = this.#selectRandomOption(elements.calMirranShapeSelect)
    }

    /**
     * Randomize Qofuari-specific features.
     * @param {CharacterElements} elements - Character elements reference
     */
    static #randomizeQofuari (elements) {
        // Qofuari has limited hair options
        elements.hairSelect.value = this.#selectRandomOption(elements.hairSelect)
        elements.hairMirror.checked = Math.random() > 0.5

        // Qofuari has no rear hair (hidden in UI)
        elements.rearHairSelect.value = 'none'

        // Facial hair for furry species
        elements.facialHairSelect.value = this.#selectRandomOption(elements.facialHairSelect)

        // Head features (limited for Qofuari)
        const selectedHeadFeatures = this.#selectRandomMultiOptions(
            elements.headFeatureSelect,
            [],
            [],
            []
        )
        Array.from(elements.headFeatureSelect.options).forEach(opt => { opt.selected = false })
        selectedHeadFeatures.forEach(value => {
            const option = elements.headFeatureSelect.querySelector(`option[value="${value}"]`)
            if (option) option.selected = true
        })
    }

    /**
     * Randomize Sukhabelan-specific features.
     * @param {CharacterElements} elements - Character elements reference
     */
    static #randomizeSukhabelan (elements) {
        // Sukhabelan can only have hats
        elements.hatFeatureSelect.value = Math.random() > 0.5
            ? this.#selectRandomOption(elements.hatFeatureSelect)
            : 'None'

        // No hair/facial hair for Sukhabelan
        elements.hairSelect.value = 'none'
        elements.rearHairSelect.value = 'none'
        elements.facialHairSelect.value = 'none'
    }

    /**
     * Randomize uniform selection.
     * @param {HTMLSelectElement} uniformSelect - Uniform select element
     */
    static randomizeUniform (uniformSelect) {
        uniformSelect.value = this.#selectRandomOption(uniformSelect)
    }

    /**
     * Randomize all color pickers with preset colors.
     * @param {object} colorManager - Color manager instance
     */
    static randomizeColors (colorManager) {
        // Get preset color selects
        const bodyColorSelect = document.getElementById('std-body-colors')
        const hairColorSelect = document.getElementById('std-hair-colors')
        const uniformColorSelect = document.getElementById('std-uniform-colors')
        const uniformUndershirtColorSelect = document.getElementById('std-uniform-undershirt-colors')

        // Randomize body color from presets
        if (bodyColorSelect instanceof HTMLSelectElement) {
            colorManager.bodyColorPicker.value = this.#selectRandomPresetColor(bodyColorSelect)
        }

        // Randomize hair color from presets
        if (hairColorSelect instanceof HTMLSelectElement) {
            colorManager.hairColorPicker.value = this.#selectRandomPresetColor(hairColorSelect)
        }

        // Randomize uniform color from presets
        if (uniformColorSelect instanceof HTMLSelectElement) {
            colorManager.uniformColorPicker.value = this.#selectRandomPresetColor(uniformColorSelect)
        }

        // Randomize uniform undershirt color from presets
        if (uniformUndershirtColorSelect instanceof HTMLSelectElement) {
            colorManager.uniformUndershirtColorPicker.value = this.#selectRandomPresetColor(uniformUndershirtColorSelect)
        }

        // Randomize special colors
        colorManager.antennaeColorPicker.value = this.#randomColor()
        colorManager.birdTuftColorPicker.value = this.#randomColor()
        colorManager.whiskersColorPicker.value = this.#randomColor()

        // Randomly set sync checkboxes
        colorManager.syncAntennaeWithBodyCheck.checked = Math.random() > 0.3
        colorManager.syncBirdTuftWithBodyCheck.checked = Math.random() > 0.3
        colorManager.syncWhiskersWithBodyCheck.checked = Math.random() > 0.7
    }
}
