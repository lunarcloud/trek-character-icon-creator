export class IndexController {

    #lastUsedBodyColors = {
        'humanoid': '#FEE4B3',
        'cetaceous': '#B5BEC8'
    }

    #lastUsedUniformColor = ''

    /**
     * @type {HTMLElement}
     */
    #mainEl

    /**
     * @type {HTMLStyleElement}
     */
    #characterStyleEl

    /**
     * @type {HTMLStyleElement}
     */
    #characterBgEl

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
    #headFeatureSelect

    /**
     * @type {HTMLSelectElement}
     */
    #standardBodyColorSelect

    /**
     * @type {HTMLSelectElement}
     */
    #standardUniformColorSelect

    /**
     * @type {HTMLSelectElement}
     */
    #standardUndershirtColorSelect

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
        this.#characterStyleEl = document.querySelector('character style')
        this.#characterBgEl = document.querySelector('character bg')

        this.#characterEars = document.getElementById('character-ears')
        this.#characterBody = document.getElementById('character-body')
        this.#characterHeadFeatures = document.getElementById('character-head-features')
        this.#characterUniform = document.getElementById('character-uniform')
        this.#bodyOverlay = document.getElementById('body-overlay')

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
        this.#standardBodyColorSelect = document.getElementById('std-body-colors')
        this.#standardUniformColorSelect = document.getElementById('std-uniform-colors')
        this.#standardUndershirtColorSelect = document.getElementById('std-uniform-undershirt-colors')

        this.#syncAntennaeWithBodyCheck = document.getElementById('sync-antennae-with-body')
        this.#syncBirdTuftWithBodyCheck = document.getElementById('sync-bird-tuft-with-body')
        this.#syncWiskersWithBodyCheck = document.getElementById('sync-wiskers-with-body')

        this.#saveBGCheck = document.getElementById('save-with-bg-checkbox')

        // Generically handle all the elements changing
        let bodyShapeEls = Array.from(document.querySelectorAll(`input[name="body-shape"]`))
        let allChangeEls = bodyShapeEls.concat([this.#uniformSelect, this.#earSelect, this.#headFeatureSelect, this.#syncAntennaeWithBodyCheck, this.#syncBirdTuftWithBodyCheck, this.#syncWiskersWithBodyCheck])
        for (let changeEl of allChangeEls) {
            changeEl.addEventListener('change', () => this.onChangeDetected())
        }

        // Handle Items with 2 selectors separately
        this.#setupColorPickerWithStandardSelector(this.#bodyColorPicker, this.#standardBodyColorSelect)
        this.#setupColorPickerWithStandardSelector(this.#uniformColorPicker, this.#standardUniformColorSelect)
        this.#setupColorPickerWithStandardSelector(this.#uniformUndershirtColorPicker, this.#standardUndershirtColorSelect)

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

        this.onChangeDetected();

        document.getElementById('download').addEventListener('click', () => this.saveImage())
    }

    #setupColorPickerWithStandardSelector(picker, selector) {

        let onChangePicker = () => {
            // Set the "standard" colors selector to what's selected or 'custom'
            let el = selector.querySelector(`[value="${picker.value}"]`) ?? selector.querySelector(`[value="custom"]`)
            selector.value = el.value;

            this.onChangeDetected()
        }

        let onChangeSelector = () => {
            if (selector.value !== 'custom')
                picker.value = selector.value
            this.onChangeDetected()
        }

        picker.addEventListener('change', onChangePicker)
        selector.addEventListener('change', onChangeSelector)

        // Update the selector if the current picker is one of the values
        let el = selector.querySelector(`[value="${picker.value.toUpperCase()}"]`) ?? selector.querySelector(`[value="custom"]`)
        selector.value = el.value;
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
        if (window.self !== window.top)
            this.#mainEl.classList.add('embedded')
        // more classes will be added later

        // Handle Body Shape Changes
        if (bodyShapeChanged)
        {
            // Ensure the "humanoid-only" items are hidden for cetaceans
            let uniformSelectMaybeHiddenEls = this.#uniformSelect.querySelectorAll('option[class]')
            for (let el of uniformSelectMaybeHiddenEls) {
                var style = window.getComputedStyle(el);
                el.hidden = style.visibility === "hidden"
            }

            // Reset color so we don't have oddly-fleshy dolphins by default
            this.#bodyColorPicker.value = this.#lastUsedBodyColors[this.bodyShape]

            // If currently selecting a hidden uniform, select the first non-hidden one
            if (this.#isCurrentUniformInvalid())
                this.#uniformSelect.value = this.#uniformSelect.querySelector(':not([hidden])').value
        }

        // Change the body
        this.#characterBody.innerHTML = IndexController.GenerateSVGHTML(`${this.bodyShape}/body.svg`)
        this.#bodyOverlay.innerHTML = IndexController.GenerateSVGHTML(`${this.bodyShape}/body-overlay.svg`)

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

        if (this.#syncAntennaeWithBodyCheck.checked)
            this.#antennaeColorPicker.value = this.#bodyColorPicker.value

        if (this.#syncBirdTuftWithBodyCheck.checked)
            this.#birdTuftColorPicker.value = this.#bodyColorPicker.value

        if (this.#syncWiskersWithBodyCheck.checked)
            this.#wiskersColorPicker.value = this.#bodyColorPicker.value


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

    saveImage() {
        if (typeof(html2canvas) !== 'function') {
            alert("Cannot create image, canvas library not working.")
            return
        }

        let size1em = parseFloat(getComputedStyle(this.#mainEl).fontSize)

        let options = {
            backgroundColor: (this.#saveBGCheck.checked ? '#363638' : null),
            width: 512 + (size1em * 2),
            height: 512 + (size1em * 2),
            ignoreElements: el => {
                return el.tagName === 'BG' && !this.#saveBGCheck.checked
            }
        }

        this.#mainEl.classList.add('saving')
        html2canvas(document.querySelector("character"), options)
        .then(canvas => {
            var link = document.createElement('a')
            link.download = 'star-trek-officer.png'
            link.href = canvas.toDataURL("image/png", 1.0)
            link.click()
            this.#mainEl.classList.remove('saving')
        });

    }
}

globalThis.Controller = new IndexController()
