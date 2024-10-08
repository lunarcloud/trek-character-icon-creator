const StandardColors = {
    Body: {
        Humanoid: '#FEE4B3',
        Bolian: '#b3b3fe',
        Andorian: '#41AACC',
        Cetacean: '#B5BEC8'
    },
    Uniform: {
        Early: {
            'Command': '#AAA41F',
            'Ops': '#CE3C34',
            'Science': '#476795',
            'Medical': '#C2E7F2'
        },
        Later: {
            'Command': '#CE3C34',
            'Ops': '#CEBD37',
            'Science': '#23BDC0',
            'Medical': '#23BDC0'
        },
        Darker: {
            'Command': '#6C1C25',
            'Ops': '#6C651E',
            'Science': '#1E6C6A',
            'Medical': '#1E6C6A'
        },
        Metals: {
            'Command': '#B27010',
            'Ops': '#BE7639',
            'Science': '#78736D',
        },
        Timeship: {
            'Command': '#222360',
            'Ops': '#9B5411',
            'Science': '#505050',
        }
    },
}

export class IndexController {

    #lastUsedBodyColors = {
        'humanoid': '#FEE4B3',
        'cetaceous': '#B5BEC8'
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
    #characterEars

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
    #characterUniform

    /**
     * @type {HTMLElement}
     */
    #characterFlipper

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
    #headFeatureSelect


    /**
     * Constructor.
     */
    constructor () {
        this.#mainEl = document.getElementsByTagName('main')[0]
        this.#characterStyleEl = document.querySelector('character style')

        this.#characterEars = document.getElementById('character-ears')
        this.#characterBody = document.getElementById('character-body')
        this.#characterHeadFeatures = document.getElementById('character-head-features')
        this.#characterUniform = document.getElementById('character-uniform')
        this.#characterFlipper = document.getElementById('character-flipper')

        // Selection Elements
        this.#bodyColorPicker = document.getElementById('body-color')
        this.#uniformColorPicker = document.getElementById('uniform-color')
        this.#uniformUndershirtColorPicker = document.getElementById('uniform-undershirt-color')
        this.#antennaeColorPicker = document.getElementById('andorian-antennae-color')
        this.#birdTuftColorPicker = document.getElementById('bird-tuft-color')
        this.#wiskersColorPicker = document.getElementById('wiskers-color')
        this.#uniformSelect = document.getElementById('uniform-select')
        this.#earSelect = document.getElementById('ear-select')
        this.#headFeatureSelect = document.getElementById('head-feature-select')

        let bodyShapeEls = Array.from(document.querySelectorAll(`input[name="body-shape"]`))

        let allChangeEls = bodyShapeEls.concat([this.#bodyColorPicker, this.#uniformColorPicker, this.#uniformUndershirtColorPicker, this.#antennaeColorPicker, this.#birdTuftColorPicker, this.#wiskersColorPicker, this.#uniformSelect, this.#earSelect, this.#headFeatureSelect])

        for (let changeEl of allChangeEls) {
            changeEl.addEventListener('change', () => this.onChangeDetected())
        }

        this.onChangeDetected();
    }

    get bodyShape() {
        return document.querySelector('input[name="body-shape"]:checked')?.value ?? "humanoid";
    }

    set bodyShape (value) {
        let el = document.querySelector(`input[name="body-shape"][value="${value}"]`)
        if (el instanceof HTMLInputElement === false)
            return
        el.checked = true;
    }

    #isCurrentUniformInvalid() {
        return this.#uniformSelect.children[this.#uniformSelect.selectedIndex].hidden
    }

    onChangeDetected() {
        let bodyShapeChanged = !this.#mainEl.classList.contains(this.bodyShape)

        // Update the classes at the top for hiding/showing elements
        this.#mainEl.className = this.bodyShape // first one clears the list
        // more classes will be added later

        // Handle Body Shape Changes
        if (bodyShapeChanged)
        {
            // Update the class at the top for hiding/showing elements
            this.#mainEl.className = this.bodyShape

            // Ensure the "humanoid-only" items are hidden for cetaceans
            let uniformSelectMaybeHiddenEls = this.#uniformSelect.querySelectorAll('option[class]')
            for (let el of uniformSelectMaybeHiddenEls)
                el.hidden = !el.classList.contains(`${this.bodyShape}-only`)

            // Reset color so we don't have oddly-fleshy dolphins by default
            this.#bodyColorPicker.value = this.#lastUsedBodyColors[this.bodyShape]

            // If currently selecting a hidden uniform, select the first non-hidden one
            if (this.#isCurrentUniformInvalid())
                this.#uniformSelect.value = this.#uniformSelect.querySelector(':not([hidden])').value
        }

        // Change the body
        this.#characterBody.innerHTML = IndexController.GenerateSVGHTML(`${this.bodyShape}/body.svg`)

        // Change the uniform
        this.#characterUniform.innerHTML = IndexController.GenerateSVGHTML(`${this.bodyShape}/uniform/${this.#uniformSelect.value}.svg`)

        // Allow for uniform-specific options
        if (this.#uniformSelect.value === 'VOY DS9')
            this.#mainEl.classList.add('voy-ds9')

        // Humanoid-only features
        if (this.bodyShape === 'humanoid') {

            // Change the ears
            this.#characterEars.innerHTML = IndexController.GenerateSVGHTML(`${this.bodyShape}/ears/${this.#earSelect.value}.svg`)

            // Update the head features
            let selections = (Array.from(this.#headFeatureSelect.selectedOptions) ?? []).map(e => e.value)
            this.#characterHeadFeatures.innerHTML = selections.reduce((accumulator, v) => accumulator += IndexController.GenerateSVGHTML(`${this.bodyShape}/head-features/${v}.svg`), '')

            if (selections.includes('andorian-antennae'))
                this.#mainEl.classList.add('andorian-antennae')
            if (selections.includes('bird-tuft'))
                this.#mainEl.classList.add('bird-tuft')
            if (selections.includes('gill-wiskers-or-feathers'))
                this.#mainEl.classList.add('wiskers')
        }

        // Update the colors
        this.#lastUsedBodyColors[this.bodyShape] = this.#bodyColorPicker.value
        this.#characterStyleEl.innerHTML = `svg .body-color { color: ${this.#bodyColorPicker.value} !important; } `
        + `svg .uniform-color { color: ${this.#uniformColorPicker.value} !important; } `
        + `svg .uniform-undershirt-color { color: ${this.#uniformUndershirtColorPicker.value} !important;}`
        + `svg .bird-tuft-color { color: ${this.#birdTuftColorPicker.value} !important;}`
        + `svg .andorian-antennae-color { color: ${this.#antennaeColorPicker.value} !important;}`
        + `svg .wiskers-color { color: ${this.#wiskersColorPicker.value} !important;}`
    }

    static GenerateSVGHTML(path) {
        return `<svg data-src="${path}" data-cache="disabled" width="512" height="512"></svg>`
    }
}

globalThis.App ??= { Page: undefined }
globalThis.App.Page = new IndexController()
