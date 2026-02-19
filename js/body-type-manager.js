import { DomUtil } from './util-dom.js'
import { CharacterElements } from './character-elements.js'

/**
 * Manages body-type-specific rendering and updates.
 */
export class BodyTypeManager {
    /**
     * Update humanoid-specific features.
     * @param {CharacterElements} elements Character elements
     * @param {HTMLOptionElement} selectedUniform Selected uniform option
     */
    static updateHumanoid (elements, selectedUniform) {
        // Change the ears
        elements.characterEarsOrNose.innerHTML = DomUtil.GenerateSVGHTML(`svg/humanoid/ears/${elements.earSelect.value}.svg`)

        // Update the hair
        elements.characterHair.innerHTML = DomUtil.GenerateSVGHTML(`svg/humanoid/hair/${elements.hairSelect.value}.svg`)
        elements.characterRearHair.innerHTML = DomUtil.GenerateSVGHTML(`svg/humanoid/rear-hair/${elements.rearHairSelect.value}.svg`)
        elements.characterFacialHair.innerHTML = DomUtil.GenerateSVGHTML(`svg/humanoid/facial-hair/${elements.facialHairSelect.value}.svg`)

        // Handle hair mirroring
        elements.characterHair.classList.toggle('mirrored', elements.hairMirror.checked)
        elements.characterRearHair.classList.toggle('mirrored', elements.rearHairMirror.checked)

        // Update the head & headgear features
        const selections = (Array.from(elements.headFeatureSelect.selectedOptions) ?? [])
            .concat(Array.from(elements.jewelrySelect.selectedOptions) ?? [])
            .concat(Array.from(elements.eyewearFeatureSelect.selectedOptions) ?? [])
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

        // Update document style classes
        const selectionNames = selections.map(e => e.value)
        if (selectionNames.includes('andorian-antennae'))
            elements.mainEl.classList.add('andorian-antennae')
        if (selectionNames.includes('bird-tuft'))
            elements.mainEl.classList.add('bird-tuft')
        if (selectionNames.includes('gill-whiskers-or-feathers'))
            elements.mainEl.classList.add('whiskers')
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
}
