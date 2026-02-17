import { getButtonElement, getInputElement, getSelectElement, queryStyleElement } from './type-helpers.js'

/**
 * Manages all DOM element references for the character creator.
 */
export class CharacterElements {
    /**
     * @type {HTMLElement}
     */
    mainEl

    /**
     * @type {HTMLStyleElement}
     */
    characterStyleEl

    /**
     * @type {HTMLElement}
     */
    characterEarsOrNose

    /**
     * @type {HTMLElement}
     */
    characterBody

    /**
     * @type {HTMLElement}
     */
    characterHeadFeatures

    /**
     * @type {HTMLElement}
     */
    characterHair

    /**
     * @type {HTMLElement}
     */
    characterRearHair

    /**
     * @type {HTMLElement}
     */
    characterFacialHair

    /**
     * @type {HTMLElement}
     */
    characterExtraOverlay

    /**
     * @type {HTMLElement}
     */
    characterExtraUnderlay

    /**
     * @type {HTMLElement}
     */
    characterUniform

    /**
     * @type {HTMLElement}
     */
    bodyOverlay

    /**
     * @type {HTMLElement}
     */
    characterAnnouncements

    /**
     * @type {HTMLSelectElement}
     */
    shapeSelect

    /**
     * @type {HTMLSelectElement}
     */
    uniformSelect

    /**
     * @type {HTMLSelectElement}
     */
    earSelect

    /**
     * @type {HTMLSelectElement}
     */
    noseSelect

    /**
     * @type {HTMLInputElement}
     */
    foreheadBumpCheck

    /**
     * @type {HTMLSelectElement}
     */
    headFeatureSelect

    /**
     * @type {HTMLSelectElement}
     */
    hatFeatureSelect

    /**
     * @type {HTMLSelectElement}
     */
    eyewearFeatureSelect

    /**
     * @type {HTMLSelectElement}
     */
    facialHairSelect

    /**
     * @type {HTMLSelectElement}
     */
    hairSelect

    /**
     * @type {HTMLInputElement}
     */
    hairMirror

    /**
     * @type {HTMLSelectElement}
     */
    rearHairSelect

    /**
     * @type {HTMLInputElement}
     */
    rearHairMirror

    /**
     * @type {HTMLInputElement}
     */
    medusanAltColorCheck

    /**
     * @type {HTMLInputElement}
     */
    medusanBoxCheck

    /**
     * @type {HTMLSelectElement}
     */
    calMirranShapeSelect

    /**
     * @type {HTMLInputElement}
     */
    saveBGCheck

    /**
     * @type {HTMLSelectElement}
     */
    saveFormatSelect

    /**
     * @type {HTMLInputElement}
     */
    characterNameInput

    /**
     * Constructor - Initialize all DOM element references.
     */
    constructor () {
        this.mainEl = document.body
        this.characterStyleEl = queryStyleElement('character style')

        this.characterEarsOrNose = document.getElementById('character-ears-or-nose')
        this.characterBody = document.getElementById('character-body')
        this.characterHeadFeatures = document.getElementById('character-head-features')
        this.characterHair = document.getElementById('character-hair')
        this.characterRearHair = document.getElementById('character-rear-hair')
        this.characterFacialHair = document.getElementById('character-facial-hair')
        this.characterUniform = document.getElementById('character-uniform')
        this.bodyOverlay = document.getElementById('body-overlay')
        this.characterExtraOverlay = document.getElementById('extra-overlay')
        this.characterExtraUnderlay = document.getElementById('extra-underlay')
        this.characterAnnouncements = document.getElementById('character-announcements')

        // Selection Elements
        this.shapeSelect = getSelectElement('body-shape')
        this.uniformSelect = getSelectElement('uniform-select')
        this.earSelect = getSelectElement('ear-select')
        this.noseSelect = getSelectElement('nose-select')
        this.headFeatureSelect = getSelectElement('head-feature-select')
        this.hatFeatureSelect = getSelectElement('hat-select')
        this.eyewearFeatureSelect = getSelectElement('eyewear-select')

        this.foreheadBumpCheck = getInputElement('forehead-bump')
        this.medusanAltColorCheck = getInputElement('medusan-alt-color')
        this.medusanBoxCheck = getInputElement('medusan-box')

        this.calMirranShapeSelect = getSelectElement('cal-mirran-shape')

        this.facialHairSelect = getSelectElement('facial-hair-select')

        this.hairSelect = getSelectElement('hair-select')
        this.hairMirror = getInputElement('hair-mirror')
        this.rearHairSelect = getSelectElement('rear-hair-select')
        this.rearHairMirror = getInputElement('rear-hair-mirror')
        this.saveBGCheck = getInputElement('save-with-bg-checkbox')
        this.characterNameInput = getInputElement('character-name')
    }

    /**
     * Setup "Next" button event handlers.
     * @param {Function} onChangeCallback Callback to trigger when a change is detected
     */
    setupNextButtons (onChangeCallback) {
        const facialHairNext = getButtonElement('facial-hair-next')
        facialHairNext.addEventListener('click', () => {
            this.facialHairSelect.selectedIndex++
            onChangeCallback()
        })

        const hairNext = getButtonElement('hair-next')
        hairNext.addEventListener('click', () => {
            this.hairSelect.selectedIndex++
            onChangeCallback()
        })

        const rearHairNext = getButtonElement('rear-hair-next')
        rearHairNext.addEventListener('click', () => {
            this.rearHairSelect.selectedIndex++
            onChangeCallback()
        })
    }

    /**
     * Get all elements that should trigger change detection.
     * @returns {HTMLElement[]} Array of elements
     */
    getChangeDetectionElements () {
        return [
            this.shapeSelect,
            this.uniformSelect,
            this.earSelect,
            this.noseSelect,
            this.headFeatureSelect,
            this.hatFeatureSelect,
            this.eyewearFeatureSelect,
            this.foreheadBumpCheck,
            this.medusanAltColorCheck,
            this.medusanBoxCheck,
            this.hairSelect,
            this.facialHairSelect,
            this.rearHairSelect,
            this.hairMirror,
            this.rearHairMirror,
            this.calMirranShapeSelect,
            this.characterNameInput
        ]
    }
}
