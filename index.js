import { CharacterElements } from './js/character-elements.js'
import { ColorManager } from './js/color-manager.js'
import { UniformManager } from './js/uniform-manager.js'
import { BodyTypeManager } from './js/body-type-manager.js'
import { DomUtil } from './js/util-dom.js'

/**
 * Controller for the Main, Index, Page.
 */
export class IndexController {
    /**
     * @type {CharacterElements}
     */
    #elements

    /**
     * @type {ColorManager}
     */
    #colorManager

    /**
     * @type {UniformManager}
     */
    #uniformManager

    /**
     * Constructor.
     */
    constructor () {
        // Initialize modules
        this.#elements = new CharacterElements()
        this.#colorManager = new ColorManager(() => this.onChangeDetected())
        this.#uniformManager = new UniformManager()

        this.#setupEventListeners()

        // Trigger the change detection to begin, so we won't start in an unsupported/unusual state
        this.onChangeDetected()

        // Setup the save as image functionality
        document.getElementById('download')
            .addEventListener('click', () => DomUtil.SaveImage('star-trek-officer.png',
                this.#elements.mainEl, this.#elements.mainEl.querySelector('character'),
                this.#elements.saveBGCheck.checked, this.#elements.saveFormatSelect.value))
    }

    /**
     * Setup event listeners for all change detection elements.
     */
    #setupEventListeners () {
        // Setup change detection on element member variables
        const allChangeEls = [
            ...this.#elements.getChangeDetectionElements(),
            ...this.#colorManager.getChangeDetectionElements()
        ]
        for (const changeEl of allChangeEls) {
            changeEl.addEventListener('change', () => this.onChangeDetected())
        }

        // Setup "Next" buttons
        this.#elements.setupNextButtons(() => this.onChangeDetected())
    }

    /**
     * Handle when a change in options occurs.
     * This will setup all the SVG html and CSS styles for the current options.
     */
    onChangeDetected () {
        const bodyShape = this.#elements.shapeSelect.value
        const bodyShapeChanged = !this.#elements.mainEl.classList.contains(bodyShape)

        // Update the classes at the top for hiding/showing elements
        this.#elements.mainEl.className = bodyShape // first one clears the list
        if (window.self !== window.top)
            this.#elements.mainEl.classList.add('embedded')
        // more classes will be added later

        // Handle Body Shape Changes
        if (bodyShapeChanged) {
            // Ensure the invalid items are hidden
            for (const selector of this.#elements.mainEl.getElementsByTagName('select')) {
                if (selector instanceof HTMLSelectElement)
                    DomUtil.hideInvalidSelectOptions(selector)
            }

            // Reset color so we don't have oddly-fleshy dolphins by default
            this.#colorManager.bodyColorPicker.value = this.#colorManager.getLastUsedBodyColor(bodyShape)

            // If currently selecting a hidden uniform, select the body type default
            if (UniformManager.isCurrentUniformInvalid(this.#elements.uniformSelect))
                this.#elements.uniformSelect.value = UniformManager.getDefaultUniform(bodyShape)

            // Hide invalid hair options and ensure a valid one is selected
            if (this.#elements.hairSelect.checkVisibility()) {
                if (DomUtil.IsOptionInvalid(this.#elements.hairSelect)) {
                    this.#elements.hairSelect.selectedIndex = 0
                }
            }
        }

        // Change the body
        this.#elements.characterBody.innerHTML = DomUtil.GenerateSVGHTML(`${bodyShape}/body.svg`)
        this.#elements.bodyOverlay.innerHTML = ['medusan'].includes(bodyShape)
            ? ''
            : DomUtil.GenerateSVGHTML(`${bodyShape}/body-overlay.svg`)

        // Change the uniform
        const uniformBodyShape = ['sukhabelan'].includes(bodyShape) ? 'humanoid' : bodyShape
        this.#elements.characterUniform.innerHTML = DomUtil.GenerateSVGHTML(`${uniformBodyShape}/uniform/${this.#elements.uniformSelect.value}.svg`)

        const uniformClassList = this.#elements.uniformSelect.selectedOptions[0].classList

        // No uniform-specific options (mostly about color)
        this.#elements.mainEl.classList.toggle('no-uniform-color', uniformClassList.contains('no-color-choice'))
        this.#elements.mainEl.classList.toggle('undershirt-color-choice', uniformClassList.contains('undershirt-color-choice'))
        const extraOverlay = this.#elements.mainEl.classList.toggle('orville-badge-choice', uniformClassList.contains('orville-badge-choice'))
        this.#elements.mainEl.classList.toggle('extra-overlay', extraOverlay)

        // Filter color selector by uniform's colors
        const filteringColors = this.#colorManager.uniformColorFilterCheck.checked
        const colorsFilter = this.#elements.uniformSelect.selectedOptions[0].getAttribute('colors-filter')
        UniformManager.filterColorOptions(this.#elements.mainEl, this.#colorManager.uniformColorSelect, filteringColors, colorsFilter)

        // Get selected uniform
        let selectedUniform = this.#colorManager.uniformColorSelect.selectedOptions[0]

        // If currently selecting a hidden/non-existent uniform
        if (this.#colorManager.isCurrentColorInvalid()) {
            const selected = UniformManager.selectValidUniformColor(
                this.#colorManager.uniformColorSelect,
                this.#colorManager.getLastUsedUniformColors()
            )
            if (selected) {
                this.#colorManager.uniformColorPicker.value = selected.value
                selectedUniform = selected
            }
        }

        // Reset body changes that could be made via bodyShape-specific actions
        BodyTypeManager.resetCharacterBodyChanges(this.#elements)

        // Perform body-specific actions
        switch (bodyShape) {
        case 'humanoid':
            BodyTypeManager.updateHumanoid(this.#elements, selectedUniform)
            break
        case 'cetaceous':
            BodyTypeManager.updateCetaceous(this.#elements)
            break
        case 'medusan':
            BodyTypeManager.updateMedusan(this.#elements)
            break
        case 'cal-mirran':
            BodyTypeManager.updateCalMirran(this.#elements)
            break
        case 'exocomp':
            break
        case 'qofuari':
            BodyTypeManager.updateQofuari(this.#elements, selectedUniform)
            break
        case 'sukhabelan':
            BodyTypeManager.updateSukhabelan(this.#elements, selectedUniform)
            break
        default:
            console.error(`Unexpected body shape selected: "${bodyShape}". Please refresh the page and try again.`)
            alert(`An unexpected error occurred. Body shape "${bodyShape}" is not recognized. Please refresh the page.`)
        }

        this.#colorManager.updateSynchronizedColors()

        // Remember the last used color choice if it's not a color in the "Other" category
        const selectedUniformGroup = selectedUniform?.parentElement
        const selectedUniformGroupLabel = selectedUniformGroup instanceof HTMLOptGroupElement ? selectedUniformGroup : 'Other'
        if (!uniformClassList.contains('no-color-choice') || selectedUniformGroupLabel !== 'Other') {
            this.#colorManager.setLastUsedBodyColor(bodyShape, this.#colorManager.bodyColorPicker.value)
        }

        // Update the CSS styles for the character based on the choices
        this.#elements.characterStyleEl.innerHTML = this.#colorManager.generateColorStyles()
    }
}

globalThis.Controller = new IndexController()
