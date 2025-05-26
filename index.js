import { getButtonElement, getInputElement, getSelectElement, queryStyleElement } from './type-helpers.js'
import { DataUtil } from './util-data.js'
import { DomUtil } from './util-dom.js'

const DEFAULT_UNIFORM = 'VOY DS9'
const DEFAULT_MEDUSAN_SUIT = 'Prodigy B'

const UNIFORM_DEPARTMENTS = [
    'Command',
    'Ops',
    'Security',
    'Science',
    'Medical',
    'Engineering'
]

/**
 * Controller for the Main, Index, Page.
 */
export class IndexController {
    #lastUsedBodyColors = {
        humanoid: '#FEE4B3',
        cetaceous: '#B5BEC8',
        uniform: ['Command']
    }

    /**
     * @type {HTMLElement}
     */
    #mainEl

    /**
     * @type {HTMLStyleElement}
     */
    #characterStyleEl

    /**
     * @type {HTMLElement}
     */
    #characterEarsOrNose

    /**
     * @type {HTMLElement}
     */
    #characterBody

    /**
     * @type {HTMLElement}
     */
    #characterHeadFeatures

    /**
     * @type {HTMLElement}
     */
    #characterHair

    /**
     * @type {HTMLElement}
     */
    #characterRearHair

    /**
     * @type {HTMLElement}
     */
    #characterFacialHair

    /**
     * @type {HTMLElement}
     */
    #characterExtraOverlay

    /**
     * @type {HTMLElement}
     */
    #characterExtraUnderlay

    /**
     * @type {HTMLElement}
     */
    #characterUniform

    /**
     * @type {HTMLElement}
     */
    #bodyOverlay

    /**
     * @type {HTMLInputElement}
     */
    #bodyColorPicker

    /**
     * @type {HTMLInputElement}
     */
    #uniformColorPicker

    /**
     * @type {HTMLInputElement}
     */
    #uniformColorFilterCheck

    /**
     * @type {HTMLInputElement}
     */
    #uniformUndershirtColorPicker

    /**
     * @type {HTMLInputElement}
     */
    #antennaeColorPicker

    /**
     * @type {HTMLInputElement}
     */
    #birdTuftColorPicker

    /**
     * @type {HTMLInputElement}
     */
    #wiskersColorPicker

    /**
     * @type {HTMLSelectElement}
     */
    #shapeSelect

    /**
     * @type {HTMLSelectElement}
     */
    #uniformSelect

    /**
     * @type {HTMLSelectElement}
     */
    #uniformColorSelect

    /**
     * @type {HTMLSelectElement}
     */
    #earSelect

    /**
     * @type {HTMLSelectElement}
     */
    #noseSelect

    /**
     * @type {HTMLInputElement}
     */
    #foreheadBumpCheck

    /**
     * @type {HTMLSelectElement}
     */
    #headFeatureSelect

    /**
     * @type {HTMLSelectElement}
     */
    #hatFeatureSelect

    /**
     * @type {HTMLSelectElement}
     */
    #eyewearFeatureSelect

    /**
     * @type {HTMLSelectElement}
     */
    #facialHairSelect

    /**
     * @type {HTMLSelectElement}
     */
    #hairSelect

    /**
     * @type {HTMLInputElement}
     */
    #hairMirror

    /**
     * @type {HTMLSelectElement}
     */
    #rearHairSelect

    /**
     * @type {HTMLInputElement}
     */
    #rearHairMirror

    /**
     * @type {HTMLInputElement}
     */
    #hairColorPicker

    /**
     * @type {HTMLInputElement}
     */
    #syncAntennaeWithBodyCheck

    /**
     * @type {HTMLInputElement}
     */
    #syncBirdTuftWithBodyCheck

    /**
     * @type {HTMLInputElement}
     */
    #syncWiskersWithBodyCheck

    /**
     * @type {HTMLInputElement}
     */
    #medusanAltColorCheck

    /**
     * @type {HTMLInputElement}
     */
    #medusanBoxCheck

    /**
     * @type {HTMLInputElement}
     */
    #saveBGCheck

    /**
     * Constructor.
     */
    constructor () {
        this.#assignMembers()

        this.#setupPairedElements()

        // Setup change detection on any of the element member variables
        const allChangeEls = [this.#shapeSelect, this.#uniformSelect, this.#uniformColorFilterCheck, this.#earSelect, this.#noseSelect, this.#headFeatureSelect, this.#hatFeatureSelect, this.#eyewearFeatureSelect, this.#syncAntennaeWithBodyCheck, this.#syncBirdTuftWithBodyCheck, this.#syncWiskersWithBodyCheck, this.#foreheadBumpCheck, this.#medusanAltColorCheck, this.#medusanBoxCheck, this.#hairSelect, this.#facialHairSelect, this.#rearHairSelect, this.#hairMirror, this.#rearHairMirror]
        for (const changeEl of allChangeEls) {
            changeEl.addEventListener('change', () => this.onChangeDetected())
        }

        // When user changes the uniform color, update the "last known uniform list"
        this.#uniformColorSelect.addEventListener('change', () => {
            const selectedColorNames = DataUtil.ListStringToArray(this.#uniformColorSelect.selectedOptions[0].textContent)
            if (!this.#uniformColorIsCustom() && !DataUtil.ListInList(selectedColorNames, UNIFORM_DEPARTMENTS))
                return
            this.#lastUsedBodyColors.uniform = selectedColorNames
        })

        // Trigger the change detection to begin, so we won't start in an unsupported/unusual state
        this.onChangeDetected()

        // Setup the save as image functionality
        document.getElementById('download')
            .addEventListener('click', () => DomUtil.SaveImage('star-trek-officer.png',
                this.#mainEl, this.#mainEl.querySelector('character'), this.#saveBGCheck.checked))
    }

    /**
     * Set up element member variables.
     */
    #assignMembers () {
        this.#mainEl = document.body
        this.#characterStyleEl = queryStyleElement('character style')

        this.#characterEarsOrNose = document.getElementById('character-ears-or-nose')
        this.#characterBody = document.getElementById('character-body')
        this.#characterHeadFeatures = document.getElementById('character-head-features')
        this.#characterHair = document.getElementById('character-hair')
        this.#characterRearHair = document.getElementById('character-rear-hair')
        this.#characterFacialHair = document.getElementById('character-facial-hair')
        this.#characterUniform = document.getElementById('character-uniform')
        this.#bodyOverlay = document.getElementById('body-overlay')
        this.#characterExtraOverlay = document.getElementById('extra-overlay')
        this.#characterExtraUnderlay = document.getElementById('extra-underlay')

        // Selection Elements
        this.#shapeSelect = getSelectElement('body-shape')
        this.#antennaeColorPicker = getInputElement('andorian-antennae-color')
        this.#birdTuftColorPicker = getInputElement('bird-tuft-color')
        this.#wiskersColorPicker = getInputElement('wiskers-color')
        this.#uniformSelect = getSelectElement('uniform-select')
        this.#uniformColorSelect = getSelectElement('std-uniform-colors')
        this.#uniformColorFilterCheck = getInputElement('filter-color-selection')
        this.#earSelect = getSelectElement('ear-select')
        this.#noseSelect = getSelectElement('nose-select')
        this.#headFeatureSelect = getSelectElement('head-feature-select')
        this.#hatFeatureSelect = getSelectElement('hat-select')
        this.#eyewearFeatureSelect = getSelectElement('eyewear-select')

        this.#syncAntennaeWithBodyCheck = getInputElement('sync-antennae-with-body')
        this.#syncBirdTuftWithBodyCheck = getInputElement('sync-bird-tuft-with-body')
        this.#syncWiskersWithBodyCheck = getInputElement('sync-wiskers-with-body')
        this.#foreheadBumpCheck = getInputElement('forehead-bump')
        this.#medusanAltColorCheck = getInputElement('medusan-alt-color')
        this.#medusanBoxCheck = getInputElement('medusan-box')

        this.#facialHairSelect = getSelectElement('facial-hair-select')

        this.#hairSelect = getSelectElement('hair-select')
        this.#hairMirror = getInputElement('hair-mirror')
        this.#rearHairSelect = getSelectElement('rear-hair-select')
        this.#rearHairMirror = getInputElement('rear-hair-mirror')
        this.#saveBGCheck = getInputElement('save-with-bg-checkbox')
    }

    /**
     * Set up element pair events, color picker members.
     */
    #setupPairedElements () {
        // Setup color input paired with a select
        this.#bodyColorPicker = DomUtil.SetupColorInputWithSelect('body-color', 'std-body-colors', () => this.onChangeDetected())
        this.#hairColorPicker = DomUtil.SetupColorInputWithSelect('hair-color', 'std-hair-colors', () => this.onChangeDetected())
        this.#uniformColorPicker = DomUtil.SetupColorInputWithSelect('uniform-color', 'std-uniform-colors', () => this.onChangeDetected())
        this.#uniformUndershirtColorPicker = DomUtil.SetupColorInputWithSelect('uniform-undershirt-color', 'std-uniform-undershirt-colors', () => this.onChangeDetected())

        // Setup "Next" buttons for selects
        const facialHairNext = getButtonElement('facial-hair-next')
        facialHairNext.addEventListener('click', ev => {
            this.#facialHairSelect.selectedIndex++
            this.onChangeDetected()
        })

        const hairNext = getButtonElement('hair-next')
        hairNext.addEventListener('click', ev => {
            this.#hairSelect.selectedIndex++
            this.onChangeDetected()
        })

        const rearHairNext = getButtonElement('rear-hair-next')
        rearHairNext.addEventListener('click', ev => {
            this.#rearHairSelect.selectedIndex++
            this.onChangeDetected()
        })

        // Handle Items with a 'sync' - so they un-check when selecting color manually
        this.#antennaeColorPicker.addEventListener('change', () => {
            this.#syncAntennaeWithBodyCheck.checked = false
            this.onChangeDetected()
        })
        this.#birdTuftColorPicker.addEventListener('change', () => {
            this.#syncBirdTuftWithBodyCheck.checked = false
            this.onChangeDetected()
        })
        this.#wiskersColorPicker.addEventListener('change', () => {
            this.#syncWiskersWithBodyCheck.checked = false
            this.onChangeDetected()
        })
    }

    #uniformColorIsCustom = () => this.#uniformColorSelect.selectedOptions?.[0].value === 'custom'

    /**
     * Determine if the current uniform is not currently valid.
     * Usually invalidated by a change in body shape.
     * @returns {boolean} the determination
     */
    #isCurrentUniformInvalid = () => DomUtil.IsOptionInvalid(this.#uniformSelect)

    /**
     * Determine if the current color is not currently valid.
     * Usually invalidated by a change in uniform.
     * @returns {boolean} the determination
     */
    #isCurrentColorInvalid = () => !this.#uniformColorIsCustom() && DomUtil.IsOptionInvalid(this.#uniformColorSelect)

    /**
     * Handle when a change in options occurs.
     * This will setup all the SVG html and CSS styles for the current options.
     */
    onChangeDetected () {
        const bodyShape = this.#shapeSelect.value
        const bodyShapeChanged = !this.#mainEl.classList.contains(bodyShape)

        // Update the classes at the top for hiding/showing elements
        this.#mainEl.className = bodyShape // first one clears the list
        if (window.self !== window.top)
            this.#mainEl.classList.add('embedded')
        // more classes will be added later

        // Handle Body Shape Changes
        if (bodyShapeChanged) {
            // Ensure the "humanoid-only" items are hidden for others
            const uniformSelectMaybeHiddenEls = this.#mainEl.querySelectorAll('option[class]')
            for (const el of uniformSelectMaybeHiddenEls) {
                if (el instanceof HTMLOptionElement === false)
                    continue
                const style = window.getComputedStyle(el)
                el.hidden = style.visibility === 'hidden'
            }

            // Reset color so we don't have oddly-fleshy dolphins by default
            this.#bodyColorPicker.value = this.#lastUsedBodyColors[bodyShape]

            // If currently selecting a hidden uniform, select the body type default
            if (this.#isCurrentUniformInvalid())
                this.#uniformSelect.value = bodyShape === 'medusan' ? DEFAULT_MEDUSAN_SUIT : DEFAULT_UNIFORM
        }

        // Change the body
        this.#characterBody.innerHTML = DomUtil.GenerateSVGHTML(`${bodyShape}/body.svg`)
        this.#bodyOverlay.innerHTML = ['medusan'].includes(bodyShape)
            ? ''
            : DomUtil.GenerateSVGHTML(`${bodyShape}/body-overlay.svg`)

        // Change the uniform
        this.#characterUniform.innerHTML = DomUtil.GenerateSVGHTML(`${bodyShape}/uniform/${this.#uniformSelect.value}.svg`)

        const uniformClassList = this.#uniformSelect.selectedOptions[0].classList

        // No uniform-specific options (mostly about color)
        this.#mainEl.classList.toggle('no-uniform-color', uniformClassList.contains('no-color-choice'))
        this.#mainEl.classList.toggle('undershirt-color-choice', uniformClassList.contains('undershirt-color-choice'))
        const extraOverlay = this.#mainEl.classList.toggle('orville-badge-choice', uniformClassList.contains('orville-badge-choice'))
        this.#mainEl.classList.toggle('extra-overlay', extraOverlay)

        // Filter color selector by uniform's colors
        const filteringColors = this.#uniformColorFilterCheck.checked
        this.#mainEl.classList.toggle('filter-color-selection', filteringColors)
        // get the current filter
        const colorsFilter = this.#uniformSelect.selectedOptions[0].getAttribute('colors-filter')

        // Ensure only the filtered colors are shown
        const colorSelectMaybeHiddenEls = this.#uniformColorSelect.querySelectorAll('optgroup')
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

        // Get selected uniform
        let selectedUniform = this.#uniformColorSelect.selectedOptions[0]

        // If currently selecting a hidden/non-existent uniform
        if (this.#isCurrentColorInvalid()) {
            const colorOptions = Array.from(this.#uniformColorSelect.querySelectorAll('option:not([hidden])'))

            // Select first possible, or a random valid one
            selectedUniform = /** @type {HTMLOptionElement} */ (colorOptions.filter(el => DataUtil.ListInList(DataUtil.ListStringToArray(el.textContent), this.#lastUsedBodyColors.uniform))?.[0] ??
                colorOptions[Math.floor(Math.random() * colorOptions.length)])
            if (selectedUniform instanceof HTMLOptionElement) {
                this.#uniformColorSelect.selectedIndex = selectedUniform.index
                this.#uniformColorSelect.value = selectedUniform.value
                this.#uniformColorPicker.value = selectedUniform.value
            }
        }

        // Reset body changes that could be made via bodyShape-specific actions
        this.#resetCharacterBodyChanges()

        // Perform body-specific actions
        switch (bodyShape) {
        case 'humanoid':
            this.#humanoidChangeUpdate(selectedUniform)
            break
        case 'cetaceous':
            this.#cetaceousChangeUpdate()
            break
        case 'medusan':
            this.#medusanChangeUpdate()
            break
        case 'exocomp':
            break
        default:
            alert(`Unexpected body shape chosen: ${bodyShape}`)
        }

        this.#updateSynchronizedColors()

        // Remember the last used color choice if it's not a color in the "Other" category
        const selectedUniformGroup = selectedUniform?.parentElement
        const selectedUniformGroupLabel = selectedUniformGroup instanceof HTMLOptGroupElement ? selectedUniformGroup : 'Other'
        if (!uniformClassList.contains('no-color-choice') || selectedUniformGroupLabel !== 'Other') {
            this.#lastUsedBodyColors[bodyShape] = this.#bodyColorPicker.value
        }

        // Update the CSS styles for the character based on the choices
        this.#characterStyleEl.innerHTML = `svg .body-color { color: ${this.#bodyColorPicker.value} !important; } ` +
        `svg .hair-color { color: ${this.#hairColorPicker.value} !important; } ` +
        `svg .uniform-color { color: ${this.#uniformColorPicker.value} !important; } ` +
        `svg .uniform-undershirt-color { color: ${this.#uniformUndershirtColorPicker.value} !important;}` +
        `svg .bird-tuft-color { color: ${this.#birdTuftColorPicker.value} !important;}` +
        `svg .andorian-antennae-color { color: ${this.#antennaeColorPicker.value} !important;}` +
        `svg .wiskers-color { color: ${this.#wiskersColorPicker.value} !important;}`
    }

    /**
     * Update color pickers that have been chosen to sync with the body color
     */
    #updateSynchronizedColors () {
        if (this.#syncAntennaeWithBodyCheck.checked)
            this.#antennaeColorPicker.value = this.#bodyColorPicker.value

        if (this.#syncBirdTuftWithBodyCheck.checked)
            this.#birdTuftColorPicker.value = this.#bodyColorPicker.value

        if (this.#syncWiskersWithBodyCheck.checked)
            this.#wiskersColorPicker.value = this.#bodyColorPicker.value
    }

    /**
     * Reset any visibility or filter changes made specific to choices.
     */
    #resetCharacterBodyChanges () {
        this.#characterBody.style.filter = ''
        this.#uniformSelect.style.visibility = 'visible'
        this.#characterUniform.style.visibility = 'visible'
        this.#characterUniform.style.visibility = 'visible'
        document.getElementById('uniform-header').style.visibility = 'visible'
    }

    /**
     * Handle the humanoid-only change detection logic.
     * @param {HTMLOptionElement} selectedUniform the uniform selected
     */
    #humanoidChangeUpdate (selectedUniform) {
        // Change the ears
        this.#characterEarsOrNose.innerHTML = DomUtil.GenerateSVGHTML(`humanoid/ears/${this.#earSelect.value}.svg`)

        // Update the hair
        this.#characterHair.innerHTML = DomUtil.GenerateSVGHTML(`humanoid/hair/${this.#hairSelect.value}.svg`)
        this.#characterRearHair.innerHTML = DomUtil.GenerateSVGHTML(`humanoid/rear-hair/${this.#rearHairSelect.value}.svg`)
        this.#characterFacialHair.innerHTML = DomUtil.GenerateSVGHTML(`humanoid/facial-hair/${this.#facialHairSelect.value}.svg`)

        // Handle hair mirroring
        this.#characterHair.classList.toggle('mirrored', this.#hairMirror.checked)
        this.#characterRearHair.classList.toggle('mirrored', this.#rearHairMirror.checked)

        // Update the head & headgear features
        const selections = (Array.from(this.#headFeatureSelect.selectedOptions) ?? [])
            .concat(Array.from(this.#eyewearFeatureSelect.selectedOptions) ?? [])
            .concat(Array.from(this.#hatFeatureSelect.selectedOptions) ?? [])

        this.#characterHeadFeatures.innerHTML = selections.reduce(
            (accumulator, e) => {
                accumulator += DomUtil.GenerateSVGHTML(`humanoid/head-features/${e.value}.svg`, e.className) // TODO
                return accumulator
            }, '')

        // Update extra overlay
        this.#characterExtraOverlay.innerHTML = ''
        if (selectedUniform?.hasAttribute('extra-overlay') ?? false)
            this.#characterExtraOverlay.innerHTML += DomUtil.GenerateSVGHTML(`humanoid/extra/${selectedUniform.getAttribute('extra-overlay')}.svg`)

        // Update extra underlay
        this.#characterExtraUnderlay.innerHTML = ''
        selections
            .filter(e => e.hasAttribute('extra-underlay'))
            .forEach((e, _i, _all) => {
                this.#characterExtraUnderlay.innerHTML += DomUtil.GenerateSVGHTML(`humanoid/head-features/${e.getAttribute('extra-underlay')}.svg`)
            })

        // Update document style classes
        const selectionNames = selections.map(e => e.value)
        if (selectionNames.includes('andorian-antennae'))
            this.#mainEl.classList.add('andorian-antennae')
        if (selectionNames.includes('bird-tuft'))
            this.#mainEl.classList.add('bird-tuft')
        if (selectionNames.includes('gill-wiskers-or-feathers'))
            this.#mainEl.classList.add('wiskers')
    }

    /**
     * Handle the cetaceous-only change detection logic.
     */
    #cetaceousChangeUpdate () {
        // Change the nose
        this.#characterEarsOrNose.innerHTML = DomUtil.GenerateSVGHTML(`cetaceous/nose/${this.#noseSelect.value}.svg`)

        this.#characterHeadFeatures.innerHTML = this.#foreheadBumpCheck.checked
            ? DomUtil.GenerateSVGHTML('cetaceous/head-features/forehead-bump.svg')
            : ''
    }

    /**
     * Handle the medusan-only change detection logic.
     */
    #medusanChangeUpdate () {
        // Alternative Coloring
        this.#characterBody.style.filter = this.#medusanAltColorCheck.checked
            ? 'hue-rotate(65deg) contrast(1.5) saturate(0.5)'
            : ''

        // Box hides the uniform
        const medusanBox = this.#medusanBoxCheck.checked
        this.#uniformSelect.style.visibility = medusanBox ? 'hidden' : 'visible'
        this.#characterUniform.style.visibility = medusanBox ? 'hidden' : 'visible'
        document.getElementById('uniform-header').style.visibility = medusanBox ? 'hidden' : 'visible'

        // Box hides the uniform layer
        this.#characterUniform.style.visibility = this.#medusanBoxCheck.checked
            ? 'hidden'
            : 'visible'

        // Character body set to box or normal style
        this.#characterBody.innerHTML = this.#medusanBoxCheck.checked
            ? DomUtil.GenerateSVGHTML('medusan/body/box.svg')
            : DomUtil.GenerateSVGHTML('medusan/body/visible.svg')
    }
}

globalThis.Controller = new IndexController()
