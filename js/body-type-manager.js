import { DomUtil } from './util-dom.js'
import { CharacterElements } from './character-elements.js'

/**
 * Species-specific forced feature configurations.
 * Maps species specify values to arrays of head-feature values that are always applied.
 * @type {Record<string, string[]>}
 */
const FORCED_FEATURES = {
    andor: ['andorian-antennae'],
    bajoran: ['nose-ridges'],
    benzite: ['benzite-nose'],
    bird: ['bird-beak', 'bird-tuft', 'gill-whiskers-or-feathers'],
    bolian: ['bolian-line'],
    cardassian: ['cardassian-forehead', 'cardassian-neck'],
    cat: ['cat-nose', 'gill-whiskers-or-feathers'],
    denobulan: ['denobulan-ridges'],
    ferengi: ['ferengi-brow'],
    kelpien: ['kelpien-lines'],
    tellarite: ['gill-whiskers-or-feathers'],
    tilikaal: ['tilikaal-headpiece'],
    trill: ['trill-spots'],
    vinshari: ['vin-shari-neck'],
    zakdorn: ['zakdorn-cheeks']
}

/**
 * Species-specific default ear values.
 * Maps species specify values to the ear option value to auto-select.
 * @type {Record<string, string>}
 */
const SPECIES_EARS = {
    vulcan: 'pointy'
}

/**
 * Manages body-type-specific rendering and updates.
 */
export class BodyTypeManager {
    /**
     * Get the forced head-feature values for a species, plus species-specific
     * dropdown selections (klingon ridges/forehead, tellarite nose).
     * @param {CharacterElements} elements Character elements
     * @param {string} specify The species specify value
     * @returns {string[]} Array of forced feature values
     */
    static getForcedFeatures (elements, specify) {
        const forced = [...(FORCED_FEATURES[specify] ?? [])]

        if (specify === 'klingon') {
            forced.push(elements.klingonRidgesSelect.value)
            if (elements.klingonForeheadSelect.value !== 'none') {
                forced.push(elements.klingonForeheadSelect.value)
            }
        }

        if (specify === 'tellarite') {
            forced.push(elements.tellariteNoseSelect.value)
            if (elements.tellariteTusksCheck.checked) {
                forced.push('tusks')
            }
        }

        if (specify === 'vulcan') {
            if (elements.vulcanRomulanVCheck.checked) {
                forced.push('north-romulan-v')
            }
        }

        return forced
    }

    /**
     * Update humanoid-specific features.
     * @param {CharacterElements} elements Character elements
     * @param {HTMLOptionElement} selectedUniform Selected uniform option
     * @param {string} specify The species specify value
     */
    static updateHumanoid (elements, selectedUniform, specify) {
        // Change the ears
        elements.characterEarsOrNose.innerHTML = DomUtil.GenerateSVGHTML(`svg/humanoid/ears/${elements.earSelect.value}.svg`)

        // Update the hair (skip rendering if hair section is hidden for the current species)
        if (elements.hairSelect.checkVisibility()) {
            elements.characterHair.innerHTML = DomUtil.GenerateSVGHTML(`svg/humanoid/hair/${elements.hairSelect.value}.svg`)
            elements.characterRearHair.innerHTML = DomUtil.GenerateSVGHTML(`svg/humanoid/rear-hair/${elements.rearHairSelect.value}.svg`)
            elements.characterFacialHair.innerHTML = DomUtil.GenerateSVGHTML(`svg/humanoid/facial-hair/${elements.facialHairSelect.value}.svg`)

            // Handle hair mirroring
            elements.characterHair.classList.toggle('mirrored', elements.hairMirror.checked)
            elements.characterRearHair.classList.toggle('mirrored', elements.rearHairMirror.checked)
        } else {
            elements.characterHair.innerHTML = ''
            elements.characterRearHair.innerHTML = ''
            elements.characterFacialHair.innerHTML = ''
        }

        // Update the head & headgear features
        const selections = (Array.from(elements.headFeatureSelect.selectedOptions) ?? [])
            .concat(Array.from(elements.jewelrySelect.selectedOptions) ?? [])
            .concat(Array.from(elements.eyewearFeatureSelect.selectedOptions) ?? [])
            .concat(Array.from(elements.hatFeatureSelect.selectedOptions) ?? [])

        // Get forced features for the current species (rendered but hidden from multi-select)
        const forcedValues = BodyTypeManager.getForcedFeatures(elements, specify)
        const selectedValues = new Set(selections.map(e => e.value))

        // Build forced feature options that aren't already in selections
        const forcedOptions = forcedValues
            .filter(v => !selectedValues.has(v))
            .map(v => {
                const opt = elements.headFeatureSelect.querySelector(`option[value="${v}"]`)
                return opt instanceof HTMLOptionElement ? opt : null
            })
            .filter(opt => opt !== null)

        const allSelections = selections.concat(forcedOptions)

        elements.characterHeadFeatures.innerHTML = allSelections.reduce(
            (accumulator, e) => {
                // Strip forced-species class - it's only for hiding <option> elements, not rendered SVGs
                const svgClass = e.className.replace(/\bforced-species\b/g, '').replace(/\s+/g, ' ').trim()
                accumulator += DomUtil.GenerateSVGHTML(`svg/humanoid/head-features/${e.value}.svg`, svgClass)
                return accumulator
            }, '')

        // Enable accent color if hat chosen requires it
        if (elements.hatFeatureSelect.selectedOptions[0].classList.contains('accent-color-choice')) {
            elements.mainEl.classList.toggle('accent-color-choice', true)
        }

        // Update extra overlay
        elements.characterExtraOverlay.innerHTML = ''
        if (selectedUniform?.hasAttribute('extra-overlay') ?? false)
            elements.characterExtraOverlay.innerHTML += DomUtil.GenerateSVGHTML(`svg/humanoid/extra/${selectedUniform.getAttribute('extra-overlay')}.svg`)

        // Update extra underlay
        elements.characterExtraUnderlay.innerHTML = ''
        allSelections
            .filter(e => e.hasAttribute('extra-underlay'))
            .forEach((e, _i, _all) => {
                elements.characterExtraUnderlay.innerHTML += DomUtil.GenerateSVGHTML(`svg/humanoid/head-features/${e.getAttribute('extra-underlay')}.svg`)
            })

        // Update document style classes
        const allSelectionNames = allSelections.map(e => e.value)
        if (allSelectionNames.includes('andorian-antennae'))
            elements.mainEl.classList.add('andorian-antennae')
        if (allSelectionNames.includes('bird-tuft'))
            elements.mainEl.classList.add('bird-tuft')
        if (allSelectionNames.includes('gill-whiskers-or-feathers'))
            elements.mainEl.classList.add('whiskers')
        if (allSelectionNames.includes('cat-nose'))
            elements.mainEl.classList.add('cat-nose')
        if (elements.earSelect.value === 'cat')
            elements.mainEl.classList.add('cat-ears')
    }

    /**
     * Update cetaceous-specific features.
     * @param {CharacterElements} elements Character elements
     */
    static updateCetaceous (elements) {
        const isHumpback = elements.noseSelect.value === 'humpback'
        elements.foreheadBumpCheck.parentElement.classList.toggle('hidden', isHumpback)
        elements.mainEl.classList.toggle('rotated-270', isHumpback)

        if (isHumpback) {
            elements.bodyOverlay.innerHTML = ''
            elements.characterHeadFeatures.innerHTML = DomUtil.GenerateSVGHTML(`svg/cetaceous/nose/${elements.noseSelect.value}.svg`, 'underuniform')
            // elements.characterHeadFeatures.innerHTML = ''
            elements.characterEarsOrNose.innerHTML = ''
        } else {
            // Include forehead bump if checked
            elements.characterHeadFeatures.innerHTML = elements.foreheadBumpCheck.checked
                ? DomUtil.GenerateSVGHTML('svg/cetaceous/head-features/forehead-bump.svg')
                : ''

            // Change the nose
            elements.characterEarsOrNose.innerHTML = DomUtil.GenerateSVGHTML(`svg/cetaceous/nose/${elements.noseSelect.value}.svg`, '')
        }
    }

    /**
     * Update medusan-specific features.
     * @param {CharacterElements} elements Character elements
     */
    static updateMedusan (elements) {
        // Alternative Coloring
        elements.characterBody.style.filter = elements.medusanAltColorCheck.checked
            ? 'hue-rotate(65deg) contrast(1.5) saturate(0.5)'
            : ''

        // Box hides the uniform
        const medusanBox = elements.medusanBoxCheck.checked
        elements.uniformSelect.style.visibility = medusanBox ? 'hidden' : 'visible'
        elements.characterUniform.style.visibility = medusanBox ? 'hidden' : 'visible'
        document.getElementById('uniform-header').style.visibility = medusanBox ? 'hidden' : 'visible'

        // Character body set to box or normal style
        elements.characterBody.innerHTML = elements.medusanBoxCheck.checked
            ? DomUtil.GenerateSVGHTML('svg/medusan/body/box.svg')
            : DomUtil.GenerateSVGHTML('svg/medusan/body/visible.svg')
    }

    /**
     * Update cal-mirran-specific features.
     * @param {CharacterElements} elements Character elements
     */
    static updateCalMirran (elements) {
        // Change the shape
        elements.characterUniform.innerHTML = DomUtil.GenerateSVGHTML(`svg/cal-mirran/shape/${elements.calMirranShapeSelect.value}.svg`)
    }

    /**
     * Update qofuari-specific features, uses humanoid hair and hats.
     * @param {CharacterElements} elements Character elements
     * @param {HTMLOptionElement} selectedUniform Selected uniform option
     */
    static updateQofuari (elements, selectedUniform) {
        // ears are rear hair are part of the body
        elements.characterEarsOrNose.innerHTML = ''
        elements.characterRearHair.innerHTML = ''

        // Update the hair
        elements.characterHair.innerHTML = DomUtil.GenerateSVGHTML(`svg/humanoid/hair/${elements.hairSelect.value}.svg`)
        elements.characterFacialHair.innerHTML = DomUtil.GenerateSVGHTML(`svg/humanoid/facial-hair/${elements.facialHairSelect.value}.svg`)

        // Handle hair mirroring
        elements.characterHair.classList.toggle('mirrored', elements.hairMirror.checked)
        elements.characterRearHair.classList.toggle('mirrored', elements.rearHairMirror.checked)

        // Update the head & headgear features
        const selections = (Array.from(elements.headFeatureSelect.selectedOptions) ?? [])
            .concat(Array.from(elements.jewelrySelect.selectedOptions) ?? [])
            .concat(Array.from(elements.hatFeatureSelect.selectedOptions) ?? [])

        elements.characterHeadFeatures.innerHTML = selections.reduce(
            (accumulator, e) => {
                accumulator += DomUtil.GenerateSVGHTML(`svg/humanoid/head-features/${e.value}.svg`, e.className)
                return accumulator
            }, '')

        // Enable accent color if hat chosen requires it
        if (elements.hatFeatureSelect.selectedOptions[0].classList.contains('accent-color-choice')) {
            elements.mainEl.classList.toggle('accent-color-choice', true)
        }
    }

    /**
     * Update sukhabelan-specific features.
     * @param {CharacterElements} elements Character elements
     * @param {HTMLOptionElement} selectedUniform Selected uniform option
     */
    static updateSukhabelan (elements, selectedUniform) {
        // Hide non-applicable humanoid features: hair and ears
        elements.characterEarsOrNose.innerHTML = ''
        elements.characterHair.innerHTML = ''
        elements.characterRearHair.innerHTML = ''
        elements.characterFacialHair.innerHTML = ''

        // Update the hat features
        const selections = Array.from(elements.hatFeatureSelect.selectedOptions) ?? []

        elements.characterHeadFeatures.innerHTML = selections.reduce(
            (accumulator, e) => {
                accumulator += DomUtil.GenerateSVGHTML(`svg/humanoid/head-features/${e.value}.svg`, e.className)
                return accumulator
            }, '')

        // Enable accent color if hat chosen requires it
        if (elements.hatFeatureSelect.selectedOptions[0].classList.contains('accent-color-choice')) {
            elements.mainEl.classList.toggle('accent-color-choice', true)
        }

        // Update extra overlay
        elements.characterExtraOverlay.innerHTML = ''
        if (selectedUniform?.hasAttribute('extra-overlay') ?? false)
            elements.characterExtraOverlay.innerHTML += DomUtil.GenerateSVGHTML(`svg/humanoid/extra/${selectedUniform.getAttribute('extra-overlay')}.svg`)

        // Update extra underlay
        elements.characterExtraUnderlay.innerHTML = ''
        selections
            .filter(e => e.hasAttribute('extra-underlay'))
            .forEach((e, _i, _all) => {
                elements.characterExtraUnderlay.innerHTML += DomUtil.GenerateSVGHTML(`svg/humanoid/head-features/${e.getAttribute('extra-underlay')}.svg`)
            })
    }

    /**
     * Reset any visibility or filter changes made specific to choices.
     * @param {CharacterElements} elements Character elements
     */
    static resetCharacterBodyChanges (elements) {
        elements.characterBody.style.filter = ''
        elements.uniformSelect.style.visibility = 'visible'
        elements.characterUniform.style.visibility = 'visible'
        document.getElementById('uniform-header').style.visibility = 'visible'
    }

    /**
     * Enforce species-specific defaults when a humanoid subspecies is selected.
     * Auto-selects matching ears and deselects head features that are
     * hidden for the current species.
     * @param {CharacterElements} elements Character elements
     * @param {string} specify The species specify value (e.g., 'ferengi', 'klingon', '')
     */
    static enforceSpeciesDefaults (elements, specify) {
        if (!specify) return

        // Auto-select species-specific ears if available
        if (SPECIES_EARS[specify]) {
            elements.earSelect.value = SPECIES_EARS[specify]
        } else {
            const speciesEar = Array.from(elements.earSelect.options)
                .find(opt => opt.classList.contains(`specific-${specify}`))
            if (speciesEar) {
                elements.earSelect.value = speciesEar.value
            } else if (DomUtil.IsOptionInvalid(elements.earSelect)) {
                // If current ear is now hidden, fall back to round
                elements.earSelect.value = 'round'
            }
        }

        // Deselect head features that are now hidden
        for (const option of elements.headFeatureSelect.options) {
            if (option.selected && option.hidden) {
                option.selected = false
            }
        }
    }
}
