import html2canvas from './lib/html2canvas.esm.js'
import { getInputElement, getSelectElement, queryInputElement, queryStyleElement } from './type-helpers.js'

const DEFAULT_UNIFORM = 'VOY DS9'

/**
 * Controller for the Main, Index, Page.
 */
export class IndexController {
    #lastUsedBodyColors = {
        humanoid: '#FEE4B3',
        cetaceous: '#B5BEC8'
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
    #uniformSelect

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
    #facialHairSelect

    /**
     * @type {HTMLSelectElement}
     */
    #hairSelect

    /**
     * @type {HTMLSelectElement}
     */
    #rearHairSelect

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
    #saveBGCheck

    /**
     * Constructor.
     */
    constructor () {
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

        // Selection Elements
        this.#antennaeColorPicker = getInputElement('andorian-antennae-color')
        this.#birdTuftColorPicker = getInputElement('bird-tuft-color')
        this.#wiskersColorPicker = getInputElement('wiskers-color')
        this.#uniformSelect = getSelectElement('uniform-select')
        this.#earSelect = getSelectElement('ear-select')
        this.#noseSelect = getSelectElement('nose-select')
        this.#headFeatureSelect = getSelectElement('head-feature-select')

        this.#syncAntennaeWithBodyCheck = getInputElement('sync-antennae-with-body')
        this.#syncBirdTuftWithBodyCheck = getInputElement('sync-bird-tuft-with-body')
        this.#syncWiskersWithBodyCheck = getInputElement('sync-wiskers-with-body')
        this.#foreheadBumpCheck = getInputElement('forehead-bump')

        this.#hairSelect = getSelectElement('hair-select')
        this.#facialHairSelect = getSelectElement('facial-hair-select')
        this.#rearHairSelect = getSelectElement('rear-hair-select')

        this.#saveBGCheck = getInputElement('save-with-bg-checkbox')

        // Generically handle all the elements changing
        const bodyShapeEls = Array.from(document.querySelectorAll('input[name="body-shape"]'))
        const allChangeEls = bodyShapeEls.concat([this.#uniformSelect, this.#earSelect, this.#noseSelect, this.#headFeatureSelect, this.#syncAntennaeWithBodyCheck, this.#syncBirdTuftWithBodyCheck, this.#syncWiskersWithBodyCheck, this.#foreheadBumpCheck, this.#hairSelect, this.#facialHairSelect, this.#rearHairSelect])
        for (const changeEl of allChangeEls) {
            changeEl.addEventListener('change', () => this.onChangeDetected())
        }

        // Handle Items with an input paired with selector
        this.#bodyColorPicker = this.#setupColorInputWithSelect('body-color', 'std-body-colors')
        this.#hairColorPicker = this.#setupColorInputWithSelect('hair-color', 'std-hair-colors')
        this.#uniformColorPicker = this.#setupColorInputWithSelect('uniform-color', 'std-uniform-colors')
        this.#uniformUndershirtColorPicker = this.#setupColorInputWithSelect('uniform-undershirt-color', 'std-uniform-undershirt-colors')

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

        this.onChangeDetected()

        document.getElementById('download').addEventListener('click', () => this.saveImage())
    }

    /**
     *  Wire together a color input that has a selector of pre-created colors.
     * @param {string} pickerId     Color Input Element's Id.
     * @param {string} selectorId   Color Selector Element's Id.
     * @returns {HTMLInputElement}  Color Input Element.
     */
    #setupColorInputWithSelect (pickerId, selectorId) {
        // get the elements from their ids
        const picker = getInputElement(pickerId)
        const selector = getSelectElement(selectorId)

        // create changed event handlers
        const onChangePicker = () => {
            // Set the "standard" colors selector to what's selected or 'custom'
            const el = selector.querySelector(`[value="${picker.value}"]`) ??
                selector.querySelector('[value="custom"]')
            if (el instanceof HTMLOptionElement)
                selector.value = el.value

            this.onChangeDetected()
        }

        const onChangeSelector = () => {
            if (selector.value !== 'custom')
                picker.value = selector.value
            this.onChangeDetected()
        }

        // wire up the changed events
        picker.addEventListener('change', onChangePicker)
        selector.addEventListener('change', onChangeSelector)

        // Update the selector if the current picker is one of the values
        const el = selector.querySelector(`[value="${picker.value.toUpperCase()}"]`) ??
                    selector.querySelector('[value="custom"]')
        if (el instanceof HTMLOptionElement)
            selector.value = el.value

        // return the setup picker
        return picker
    }

    /**
     * the selected body shape.
     * @returns {string}    the attribute value.
     */
    get bodyShape () {
        const el = queryInputElement('input[name="body-shape"]:checked')
        return el?.value ?? 'humanoid'
    }

    /**
     * the selected body shape.
     * @param {string} value    the attribute value.
     */
    set bodyShape (value) {
        const el = queryInputElement(`input[name="body-shape"][value="${value}"]`)
        if (el instanceof HTMLInputElement === false)
            return
        el.checked = true
    }

    /**
     * Determine if the current uniform is not currently valid. Usually invalidated by a change in body shape.
     * @returns {boolean} the determination
     */
    #isCurrentUniformInvalid () {
        const el = this.#uniformSelect.querySelectorAll('option')[this.#uniformSelect.selectedIndex]
        if (el instanceof HTMLOptionElement === false)
            return false
        return el.hidden ?? true
    }

    /**
     * Handle when a change in options occurs.
     * This will setup all the SVG html and CSS styles for the current options.
     */
    onChangeDetected () {
        const bodyShapeChanged = !this.#mainEl.classList.contains(this.bodyShape)

        // Update the classes at the top for hiding/showing elements
        this.#mainEl.className = this.bodyShape // first one clears the list
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
            this.#bodyColorPicker.value = this.#lastUsedBodyColors[this.bodyShape]

            // If currently selecting a hidden uniform, select the first non-hidden one
            if (this.#isCurrentUniformInvalid())
                this.#uniformSelect.value = DEFAULT_UNIFORM
        }

        // Change the body
        this.#characterBody.innerHTML = IndexController.GenerateSVGHTML(`${this.bodyShape}/body.svg`)
        this.#bodyOverlay.innerHTML = IndexController.GenerateSVGHTML(`${this.bodyShape}/body-overlay.svg`)

        // Change the uniform
        this.#characterUniform.innerHTML = IndexController.GenerateSVGHTML(`${this.bodyShape}/uniform/${this.#uniformSelect.value}.svg`)

        // Allow for uniform-specific options
        if (this.#uniformSelect.value === 'VOY DS9')
            this.#mainEl.classList.add('voy-ds9')

        if (this.#uniformSelect.selectedOptions[0].classList.contains('no-color-choice'))
            this.#mainEl.classList.add('no-uniform-color')

        // Humanoid-only features
        if (this.bodyShape === 'humanoid') {
            // Change the ears
            this.#characterEarsOrNose.innerHTML = IndexController.GenerateSVGHTML(`${this.bodyShape}/ears/${this.#earSelect.value}.svg`)

            // Update the hair
            this.#characterHair.innerHTML = IndexController.GenerateSVGHTML(`${this.bodyShape}/hair/${this.#hairSelect.value}.svg`)
            this.#characterRearHair.innerHTML = IndexController.GenerateSVGHTML(`${this.bodyShape}/rear-hair/${this.#rearHairSelect.value}.svg`)
            this.#characterFacialHair.innerHTML = IndexController.GenerateSVGHTML(`${this.bodyShape}/facial-hair/${this.#facialHairSelect.value}.svg`)

            // Update the head features
            const selections = (Array.from(this.#headFeatureSelect.selectedOptions) ?? []).map(e => e.value)
            this.#characterHeadFeatures.innerHTML = selections.reduce(
                (accumulator, v) => {
                    accumulator += IndexController.GenerateSVGHTML(`${this.bodyShape}/head-features/${v}.svg`)
                    return accumulator
                }, '')

            if (selections.includes('andorian-antennae'))
                this.#mainEl.classList.add('andorian-antennae')
            if (selections.includes('bird-tuft'))
                this.#mainEl.classList.add('bird-tuft')
            if (selections.includes('gill-wiskers-or-feathers'))
                this.#mainEl.classList.add('wiskers')
        }
        // Cetaceous-only features
        if (this.bodyShape === 'cetaceous') {
            // Change the nose
            this.#characterEarsOrNose.innerHTML = IndexController.GenerateSVGHTML(`${this.bodyShape}/nose/${this.#noseSelect.value}.svg`)

            this.#characterHeadFeatures.innerHTML = this.#foreheadBumpCheck.checked
                ? IndexController.GenerateSVGHTML(`${this.bodyShape}/head-features/forehead-bump.svg`)
                : ''
        }

        // Update the colors
        this.#lastUsedBodyColors[this.bodyShape] = this.#bodyColorPicker.value

        if (this.#syncAntennaeWithBodyCheck.checked)
            this.#antennaeColorPicker.value = this.#bodyColorPicker.value

        if (this.#syncBirdTuftWithBodyCheck.checked)
            this.#birdTuftColorPicker.value = this.#bodyColorPicker.value

        if (this.#syncWiskersWithBodyCheck.checked)
            this.#wiskersColorPicker.value = this.#bodyColorPicker.value

        this.#characterStyleEl.innerHTML = `svg .body-color { color: ${this.#bodyColorPicker.value} !important; } ` +
        `svg .hair-color { color: ${this.#hairColorPicker.value} !important; } ` +
        `svg .uniform-color { color: ${this.#uniformColorPicker.value} !important; } ` +
        `svg .uniform-undershirt-color { color: ${this.#uniformUndershirtColorPicker.value} !important;}` +
        `svg .bird-tuft-color { color: ${this.#birdTuftColorPicker.value} !important;}` +
        `svg .andorian-antennae-color { color: ${this.#antennaeColorPicker.value} !important;}` +
        `svg .wiskers-color { color: ${this.#wiskersColorPicker.value} !important;}`
    }

    /**
     * Generate a valid svg element to insert.
     * @param {string} path location of the SVG file.
     * @returns {string} html
     */
    static GenerateSVGHTML (path) {
        return `<svg data-src="${path}" data-cache="disabled" width="512" height="512"></svg>`
    }

    /**
     * Save an image file of the currently selected options.
     */
    saveImage () {
        if (typeof (html2canvas) !== 'function') {
            alert('Cannot create image, canvas library not working.')
            return
        }

        const size1em = parseFloat(getComputedStyle(this.#mainEl).fontSize)

        const options = {
            backgroundColor: (this.#saveBGCheck.checked ? '#363638' : null),
            width: 512 + (size1em * 2),
            height: 512 + (size1em * 2),
            ignoreElements: el => {
                return el.tagName === 'BG' && !this.#saveBGCheck.checked
            }
        }

        this.#mainEl.classList.add('saving')
        html2canvas(document.querySelector('character'), options)
            .then((/** @type {HTMLCanvasElement} */ canvas) => {
                const link = document.createElement('a')
                link.download = 'star-trek-officer.png'
                link.href = canvas.toDataURL('image/png', 1.0)
                link.click()
            }).finally(() => {
                this.#mainEl.classList.remove('saving')
            })
    }
}

globalThis.Controller = new IndexController()
