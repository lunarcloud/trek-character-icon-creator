/**
 * Handles character randomization functionality.
 */
export class Randomizer {
    /**
     * Validation rules for species-specific feature combinations.
     * Each rule defines an incompatible feature combination.
     */
    static #validationRules = {
        'ferengi-brow': {
            requiredEar: 'ferengi',
            description: 'Ferengi brow requires Ferengi ears'
        },
        'cat-mouth-beard': {
            requiredEar: 'cat',
            description: 'Cat mouth beard requires cat ears'
        },
        'klingon-ridges': {
            requiredHeadFeature: ['bifurcated-forehead-a', 'bifurcated-forehead-b'],
            description: 'Klingon Ridges A requires a bifurcated forehead'
        },
        'klingon-ridges-2': {
            requiredHeadFeature: ['bifurcated-forehead-a', 'bifurcated-forehead-b'],
            description: 'Klingon Ridges B requires a bifurcated forehead'
        }
    }

    /**
     * Color palettes organized by category.
     * Using descriptive names from the dropdown options.
     */
    static #colorPalettes = {
        // Body color palette - skin tones and species colors
        body: [
            '#FEE4B3', // Lighter Human
            '#F4C28F', // Olive Human
            '#D9A066', // Mid Human
            '#C68642', // Mid-Dark Human
            '#8D5524', // Darker Human
            '#654321', // Brown tones
            '#4A2511' // Darker brown
        ],
        // Hair color palette - natural and fantasy colors
        hair: [
            '#000000', // Black
            '#1C1C1C', // Dark Grey
            '#3D2314', // Walnut
            '#5C4033', // Darker Brown
            '#8B4513', // Brown
            '#A0522D', // Lighter Brown
            '#CD853F', // Auburn
            '#DEB887', // Blonde
            '#F5DEB3', // Light Blonde
            '#FFE4B5', // Platinum
            '#FFFFFF' // White
        ],
        // Uniform departments - Starfleet color coding
        departments: [
            'Command',
            'Ops / Security / Engineering',
            'Science / Medical'
        ],
        // Other uniform colors for civilian/non-Starfleet
        other: [
            '#CC0C00', '#B30000', '#990000', // Reds
            '#FF6347', '#FFA500', '#FFD700', // Orange/Gold
            '#0047AB', '#0066CC', '#4169E1', '#6495ED', // Blues
            '#008080', '#20B2AA', // Teals
            '#32CD32', '#00FF00', // Greens
            '#800080', '#9370DB', // Purples
            '#696969', '#A9A9A9' // Greys
        ]
    }

    /**
     * Get all valid (non-hidden) options from a select element.
     * @param {HTMLSelectElement} selectEl - The select element
     * @returns {HTMLOptionElement[]} Array of valid options
     */
    static getValidOptions (selectEl) {
        const options = Array.from(selectEl.options)
        return options.filter(option => !option.hidden && option.value !== '')
    }

    /**
     * Randomize a select element by choosing a random valid option.
     * @param {HTMLSelectElement} selectEl - The select element to randomize
     * @returns {boolean} True if randomized, false if no valid options
     */
    static randomizeSelect (selectEl) {
        const validOptions = Randomizer.getValidOptions(selectEl)
        if (validOptions.length === 0) return false

        const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)]
        selectEl.value = randomOption.value
        return true
    }

    /**
     * Randomize a color picker by choosing a random value.
     * Uses curated color palettes based on the picker type.
     * @param {HTMLInputElement} colorPicker - The color input element
     */
    static randomizeColorPicker (colorPicker) {
        // Determine which palette to use based on the color picker's ID
        let palette = Randomizer.#colorPalettes.other

        if (colorPicker.id.includes('body')) {
            palette = Randomizer.#colorPalettes.body
        } else if (colorPicker.id.includes('hair')) {
            palette = Randomizer.#colorPalettes.hair
        }

        const randomColor = palette[Math.floor(Math.random() * palette.length)]
        colorPicker.value = randomColor
    }

    /**
     * Randomize uniform color based on uniform type.
     * For Starfleet uniforms, picks from department colors.
     * For civilian/other uniforms, picks from broader color palette.
     * @param {HTMLSelectElement} uniformColorSelect - The uniform color select element
     * @param {HTMLSelectElement} uniformSelect - The uniform style select element
     */
    static randomizeUniformColor (uniformColorSelect, uniformSelect) {
        const uniformOption = uniformSelect.selectedOptions[0]

        // Check if this is a civilian/non-color-choice uniform
        if (uniformOption && uniformOption.classList.contains('no-color-choice')) {
            // Don't randomize color for uniforms without color choice
            return
        }

        // Get valid color options
        const validOptions = Randomizer.getValidOptions(uniformColorSelect)
        if (validOptions.length === 0) return

        // Check if uniform is Starfleet (has department colors)
        const isStarfleet = validOptions.some(opt =>
            Randomizer.#colorPalettes.departments.includes(opt.textContent.trim())
        )

        if (isStarfleet) {
            // Pick from department colors
            const departmentOptions = validOptions.filter(opt =>
                Randomizer.#colorPalettes.departments.includes(opt.textContent.trim())
            )
            if (departmentOptions.length > 0) {
                const randomDept = departmentOptions[Math.floor(Math.random() * departmentOptions.length)]
                uniformColorSelect.value = randomDept.value
                return
            }
        }

        // For civilian or if no departments found, pick any valid option
        const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)]
        uniformColorSelect.value = randomOption.value
    }

    /**
     * Check if a species-specific feature combination is valid.
     * Uses a rule-based system for easy expansion.
     * @param {string} earValue - Selected ear value
     * @param {string[]} headFeatureValues - Array of selected head feature values
     * @param {string} facialHairValue - Selected facial hair value
     * @returns {boolean} True if combination is valid
     */
    static isValidFeatureCombination (earValue, headFeatureValues, facialHairValue) {
        // Ensure headFeatureValues is an array
        const features = Array.isArray(headFeatureValues) ? headFeatureValues : [headFeatureValues].filter(Boolean)

        // Check head feature rules
        for (const headFeatureValue of features) {
            if (headFeatureValue && Randomizer.#validationRules[headFeatureValue]) {
                const rule = Randomizer.#validationRules[headFeatureValue]

                // Check if required ear is present
                if (rule.requiredEar && earValue !== rule.requiredEar) {
                    return false
                }

                // Check if required head feature is present
                if (rule.requiredHeadFeature) {
                    const hasRequiredFeature = rule.requiredHeadFeature.some(required =>
                        features.includes(required)
                    )
                    if (!hasRequiredFeature) {
                        return false
                    }
                }
            }
        }

        // Check facial hair rules
        if (facialHairValue && Randomizer.#validationRules[facialHairValue]) {
            const rule = Randomizer.#validationRules[facialHairValue]
            if (rule.requiredEar && earValue !== rule.requiredEar) {
                return false
            }
        }

        return true
    }

    /**
     * Randomize all character features to create a random valid character.
     * @param {object} elements - CharacterElements instance
     * @param {object} colorManager - ColorManager instance
     * @param {Function} onChangeCallback - Callback to trigger change detection
     * @param {Function} announceCallback - Callback to announce changes to screen readers
     */
    static randomizeCharacter (elements, colorManager, onChangeCallback, announceCallback) {
        // First, randomize body shape to determine which options are valid
        Randomizer.randomizeSelect(elements.shapeSelect)

        // Trigger change to update hidden options
        elements.shapeSelect.dispatchEvent(new Event('change'))

        // Small delay to ensure DOM updates
        setTimeout(() => {
            // Randomize uniform
            Randomizer.randomizeSelect(elements.uniformSelect)

            // Randomize colors
            Randomizer.randomizeColorPicker(colorManager.bodyColorPicker)
            Randomizer.randomizeColorPicker(colorManager.hairColorPicker)

            // Smart uniform color randomization
            Randomizer.randomizeUniformColor(colorManager.uniformColorSelect, elements.uniformSelect)
            // Update the color picker to match
            const selectedOption = colorManager.uniformColorSelect.selectedOptions[0]
            if (selectedOption && selectedOption.value !== 'custom') {
                colorManager.uniformColorPicker.value = selectedOption.value
            }

            Randomizer.randomizeColorPicker(colorManager.uniformUndershirtColorPicker)

            // Randomize features with validation
            let attempts = 0
            const maxAttempts = 50
            let validCombination = false

            while (!validCombination && attempts < maxAttempts) {
                Randomizer.randomizeSelect(elements.earSelect)
                Randomizer.randomizeSelect(elements.noseSelect)
                Randomizer.randomizeSelect(elements.headFeatureSelect)
                Randomizer.randomizeSelect(elements.facialHairSelect)

                const earValue = elements.earSelect.value
                // Get all selected head features for multi-select
                const headFeatureValues = Array.from(elements.headFeatureSelect.selectedOptions)
                    .map(option => option.value)
                const facialHairValue = elements.facialHairSelect.value

                // Auto-add required head features if needed
                const updatedHeadFeatures = [...headFeatureValues]
                for (const feature of headFeatureValues) {
                    const rule = Randomizer.#validationRules[feature]
                    if (rule && rule.requiredHeadFeature) {
                        // Check if we have at least one of the required features
                        const hasRequired = rule.requiredHeadFeature.some(req => updatedHeadFeatures.includes(req))
                        if (!hasRequired) {
                            // Randomly pick one of the required features to add
                            const randomRequired = rule.requiredHeadFeature[
                                Math.floor(Math.random() * rule.requiredHeadFeature.length)
                            ]
                            updatedHeadFeatures.push(randomRequired)
                        }
                    }
                }

                // Update the select element if we added features
                if (updatedHeadFeatures.length > headFeatureValues.length) {
                    for (const option of elements.headFeatureSelect.options) {
                        option.selected = updatedHeadFeatures.includes(option.value)
                    }
                }

                validCombination = Randomizer.isValidFeatureCombination(earValue, updatedHeadFeatures, facialHairValue)
                attempts++
            }

            // Randomize other features
            Randomizer.randomizeSelect(elements.hatFeatureSelect)
            Randomizer.randomizeSelect(elements.eyewearFeatureSelect)
            Randomizer.randomizeSelect(elements.hairSelect)
            Randomizer.randomizeSelect(elements.rearHairSelect)

            // Randomize checkboxes
            if (elements.foreheadBumpCheck.checkVisibility()) {
                elements.foreheadBumpCheck.checked = Math.random() > 0.5
            }

            if (elements.hairMirror.checkVisibility()) {
                elements.hairMirror.checked = Math.random() > 0.5
            }

            if (elements.rearHairMirror.checkVisibility()) {
                elements.rearHairMirror.checked = Math.random() > 0.5
            }

            // Randomize body-specific features
            if (elements.medusanAltColorCheck.checkVisibility()) {
                elements.medusanAltColorCheck.checked = Math.random() > 0.5
            }

            if (elements.medusanBoxCheck.checkVisibility()) {
                elements.medusanBoxCheck.checked = Math.random() > 0.5
            }

            if (elements.calMirranShapeSelect.checkVisibility()) {
                Randomizer.randomizeSelect(elements.calMirranShapeSelect)
            }

            // Trigger final change detection to update the character
            onChangeCallback()

            // Announce to screen readers
            announceCallback('Character randomized')
        }, 100)
    }
}
