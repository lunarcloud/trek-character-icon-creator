import { CharacterElements } from './js/character-elements.js'
import { ColorManager } from './js/color-manager.js'
import { ColorSwatches } from './js/color-swatches.js'
import { UniformManager } from './js/uniform-manager.js'
import { BodyTypeManager } from './js/body-type-manager.js'
import { DomUtil } from './js/util-dom.js'
import { saveTextAs } from './js/save-file-utils.js'
import { TooltipManager } from './js/tooltip-manager.js'
import { AutosaveManager } from './js/autosave-manager.js'
import { migrateV1Config } from './js/migrate-v1-config.js'
import { Randomizer } from './js/randomizer.js'

/**
 * Default character name used when no name is provided.
 */
const DEFAULT_CHARACTER_NAME = 'Trek Character'

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
     * @type {string|null}
     */
    #lastBodyShape = null

    /**
     * @type {string}
     */
    #lastBodyShapeSpecify = ''

    /**
     * @type {AutosaveManager}
     */
    #autosaveManager

    /**
     * Track whether changes have been made since last save/load.
     * @type {boolean}
     */
    #hasChanges = false

    /**
     * Constructor.
     */
    constructor () {
        // Initialize modules
        this.#elements = new CharacterElements()
        this.#colorManager = new ColorManager(() => this.onChangeDetected())
        this.#uniformManager = new UniformManager()
        this.#autosaveManager = new AutosaveManager()

        // Initialize tooltips
        TooltipManager.initialize()

        // Initialize color swatches
        ColorSwatches.initialize('body-color', 'std-body-colors', 'body-color-swatches')
        ColorSwatches.initialize('hair-color', 'std-hair-colors', 'hair-color-swatches')
        ColorSwatches.initialize('uniform-color', 'std-uniform-colors', 'uniform-color-swatches', this.#colorManager.uniformColorFilterCheck)
        ColorSwatches.initialize('uniform-undershirt-color', 'std-uniform-undershirt-colors', 'uniform-undershirt-color-swatches')

        this.#setupEventListeners()
        this.#setupKeyboardShortcuts()

        // Restore autosaved state or trigger initial change detection
        this.#restoreAutosave()

        // Setup the save as image functionality
        document.getElementById('download-svg')
            .addEventListener('click', () => {
                const filename = this.#getImageFilename('svg')
                DomUtil.SaveImage(filename,
                    this.#elements.mainEl, this.#elements.mainEl.querySelector('character'),
                    this.#elements.saveBGCheck.checked, 'svg')
            })

        document.getElementById('download-png')
            .addEventListener('click', () => {
                const filename = this.#getImageFilename('png')
                DomUtil.SaveImage(filename,
                    this.#elements.mainEl, this.#elements.mainEl.querySelector('character'),
                    this.#elements.saveBGCheck.checked, 'png')
            })

        // Setup the file-based save and load functionality
        document.getElementById('save-character')
            .addEventListener('click', () => this.#saveCharacter())

        document.getElementById('load-character')
            .addEventListener('click', () => this.#loadCharacter())

        // Setup the reset button to clear autosave and reload
        document.getElementById('reset-character')
            .addEventListener('click', () => this.#resetCharacter())

        // Setup the randomize button
        document.getElementById('randomize-character')
            .addEventListener('click', () => Randomizer.randomize(
                this.#elements, this.#colorManager, () => this.onChangeDetected()
            ))
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

        /* Ensure that the two uniform color sections open and close together */
        const uniformColorDetails = document.querySelectorAll('uniform-color-group details')
        for (const details of uniformColorDetails) {
            if (details instanceof HTMLDetailsElement) {
                details.addEventListener('toggle', (/** @type {ToggleEvent} */ evt) => {
                    for (const el of uniformColorDetails) {
                        el.toggleAttribute('open', evt.newState === 'open')
                    }
                })
            }
        }

        // Setup "Next" buttons
        this.#elements.setupNextButtons(() => this.onChangeDetected())
    }

    /**
     * Setup keyboard shortcuts for save and load.
     */
    #setupKeyboardShortcuts () {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S or Cmd+S for save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault()
                this.#saveCharacter()
            }
            // Ctrl+O or Cmd+O for open/load
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault()
                this.#loadCharacter()
            }
        })
    }

    /**
     * Announce a change to screen readers via the aria-live region.
     * @param {string} message - The message to announce
     */
    #announce (message) {
        if (!this.#elements.characterAnnouncements) return

        // Clear and set with a small delay to ensure screen readers pick up the change
        this.#elements.characterAnnouncements.textContent = ''
        setTimeout(() => {
            this.#elements.characterAnnouncements.textContent = message
        }, 100)
    }

    /**
     * Handle when a change in options occurs.
     * This will setup all the SVG html and CSS styles for the current options.
     */
    onChangeDetected () {
        this.#elements.triggerUpdateAnimation()

        const bodyShape = this.#elements.shapeSelect.value
        const bodyShapeChanged = !this.#elements.mainEl.classList.contains(bodyShape)
        const bodyShapeSpecify = this.#elements.shapeSelect.selectedOptions?.[0]?.getAttribute('specify') ?? ''
        const specifyChanged = this.#lastBodyShapeSpecify !== bodyShapeSpecify

        // Announce body shape changes to screen readers
        if ((bodyShapeChanged || specifyChanged) && this.#lastBodyShape !== null) {
            const bodyShapeName = this.#elements.shapeSelect.selectedOptions[0]?.textContent || bodyShape
            this.#announce(`Character body type changed to ${bodyShapeName}`)
        }
        this.#lastBodyShape = bodyShape
        this.#lastBodyShapeSpecify = bodyShapeSpecify

        // Update the classes at the top for hiding/showing elements
        this.#elements.mainEl.className = bodyShape // first one clears the list
        if (bodyShapeSpecify)
            this.#elements.mainEl.classList.add(`specify-${bodyShapeSpecify}`)
        if (window.self !== window.top)
            this.#elements.mainEl.classList.add('embedded')

        // Handle Body Shape Changes
        if (bodyShapeChanged || specifyChanged) {
            // Ensure the invalid items are hidden
            for (const selector of this.#elements.mainEl.getElementsByTagName('select')) {
                if (selector instanceof HTMLSelectElement)
                    DomUtil.hideInvalidSelectOptions(selector)
            }

            // Regenerate color swatches to reflect visibility changes
            ColorSwatches.regenerate('body-color', 'std-body-colors', 'body-color-swatches')
            ColorSwatches.regenerate('hair-color', 'std-hair-colors', 'hair-color-swatches')
            ColorSwatches.regenerate('uniform-color', 'std-uniform-colors', 'uniform-color-swatches')
            ColorSwatches.regenerate('uniform-undershirt-color', 'std-uniform-undershirt-colors', 'uniform-undershirt-color-swatches')

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
            } else {
                this.#elements.hairSelect.selectedIndex = 0
                this.#elements.rearHairSelect.selectedIndex = 0
                this.#elements.facialHairSelect.selectedIndex = 0
            }

            // Handle species-specific enforcement for humanoid subspecies
            if (specifyChanged && bodyShape === 'humanoid') {
                BodyTypeManager.enforceSpeciesDefaults(this.#elements, bodyShapeSpecify)
            }
        }

        // Add ear-dependent class for cat-mouth-beard visibility
        // (must run after enforceSpeciesDefaults to use the correct ear value)
        if (bodyShape === 'humanoid' && this.#elements.earSelect.value === 'cat')
            this.#elements.mainEl.classList.add('cat-ears')
        // Add ear-dependent class for earring/stud jewelry visibility
        // Ear jewelry is available when ear select is humanoid and ears support jewelry
        const earValue = this.#elements.earSelect.value
        if (this.#elements.earSelect.checkVisibility() &&
           !['none', 'bear', 'cat', 'ferengi'].includes(earValue))
            this.#elements.mainEl.classList.add('has-ear-jewelry')
        // Refresh facial hair visibility since it depends on ear selection
        DomUtil.hideInvalidSelectOptions(this.#elements.facialHairSelect)
        // Refresh jewelry visibility since it depends on ear selection
        DomUtil.hideInvalidSelectOptions(this.#elements.jewelrySelect)
        // more classes will be added later

        // Change the body
        this.#elements.characterBody.innerHTML = DomUtil.GenerateSVGHTML(`svg/${bodyShape}/body.svg`)
        this.#elements.bodyOverlay.innerHTML = ['medusan'].includes(bodyShape)
            ? ''
            : DomUtil.GenerateSVGHTML(`svg/${bodyShape}/body-overlay.svg`)

        // Filter body color options by species
        const bodyColorsFilter = this.#elements.shapeSelect.selectedOptions?.[0]?.getAttribute('body-colors-filter')
        UniformManager.filterColorOptions(this.#elements.mainEl, this.#colorManager.bodyColorSelect, !!bodyColorsFilter, bodyColorsFilter)

        // If body color is not custom and is now hidden, switch to first valid one
        if (bodyColorsFilter && this.#colorManager.bodyColorSelect.value !== 'custom' &&
            DomUtil.IsOptionInvalid(this.#colorManager.bodyColorSelect)) {
            const firstVisible = Array.from(this.#colorManager.bodyColorSelect.querySelectorAll('option:not([hidden])'))
                .find(el => el instanceof HTMLOptionElement && el.value !== 'custom')
            if (firstVisible instanceof HTMLOptionElement) {
                this.#colorManager.bodyColorSelect.value = firstVisible.value
                this.#colorManager.bodyColorPicker.value = firstVisible.value
            }
        }

        // Regenerate body color swatches to reflect filter changes
        ColorSwatches.regenerate('body-color', 'std-body-colors', 'body-color-swatches')

        // Change the uniform
        const uniformBodyShape = ['sukhabelan'].includes(bodyShape) ? 'humanoid' : bodyShape
        this.#elements.characterUniform.innerHTML = DomUtil.GenerateSVGHTML(`svg/${uniformBodyShape}/uniform/${this.#elements.uniformSelect.value}.svg`)

        const uniformClassList = this.#elements.uniformSelect.selectedOptions?.[0].classList

        // No uniform-specific options (mostly about color)
        this.#elements.mainEl.classList.toggle('no-uniform-color', uniformClassList?.contains('no-color-choice') ?? false)
        this.#elements.mainEl.classList.toggle('accent-color-choice', uniformClassList?.contains('accent-color-choice') ?? false)
        const extraOverlay = this.#elements.mainEl.classList.toggle('orville-badge-choice', uniformClassList?.contains('orille-badge-choice') ?? false)
        this.#elements.mainEl.classList.toggle('extra-overlay', extraOverlay)

        // Filter color selector by uniform's colors
        const filteringColors = this.#colorManager.uniformColorFilterCheck.checked
        const colorsFilter = this.#elements.uniformSelect.selectedOptions?.[0].getAttribute('colors-filter')
        UniformManager.filterColorOptions(this.#elements.mainEl, this.#colorManager.uniformColorSelect, filteringColors, colorsFilter)

        // Regenerate uniform color swatches to reflect filter changes
        ColorSwatches.regenerate('uniform-color', 'std-uniform-colors', 'uniform-color-swatches')

        // Get selected uniform
        let selectedUniform = this.#colorManager.uniformColorSelect.selectedOptions?.[0]

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
            BodyTypeManager.updateHumanoid(this.#elements, selectedUniform, bodyShapeSpecify)
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

        // Hide Species Traits group when all its options are hidden
        const headFeatureGroup = this.#elements.headFeatureSelect.parentElement
        if (headFeatureGroup) {
            const allHidden = Array.from(this.#elements.headFeatureSelect.options)
                .every(opt => opt.hidden)
            headFeatureGroup.style.display = allHidden ? 'none' : ''
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

        // Sync color displays after any programmatic color changes (e.g. body shape reset, uniform validation)
        ColorSwatches.syncDisplay('body-color', 'body-color-swatches')
        ColorSwatches.syncDisplay('hair-color', 'hair-color-swatches')
        ColorSwatches.syncDisplay('uniform-color', 'uniform-color-swatches')
        ColorSwatches.syncDisplay('uniform-undershirt-color', 'uniform-undershirt-color-swatches')

        // Mark that changes have been made
        this.#hasChanges = true

        // Autosave current state to localStorage
        this.#autosaveManager.save(this.#serializeCharacter())
    }

    /**
     * Apply color values from a config object to the color pickers.
     * @param {object} colors - The colors object from a character config
     */
    #applyColorPickers (colors) {
        if (colors.body) this.#colorManager.bodyColorPicker.value = colors.body
        if (colors.hair) this.#colorManager.hairColorPicker.value = colors.hair
        if (colors.uniform) this.#colorManager.uniformColorPicker.value = colors.uniform
        if (colors.uniformUndershirt) this.#colorManager.uniformUndershirtColorPicker.value = colors.uniformUndershirt
        if (colors.antennae) this.#colorManager.antennaeColorPicker.value = colors.antennae
        if (colors.birdTuft) this.#colorManager.birdTuftColorPicker.value = colors.birdTuft
        if (colors.whiskers) this.#colorManager.whiskersColorPicker.value = colors.whiskers
        if (colors.catNose) this.#colorManager.catNoseColorPicker.value = colors.catNose
    }

    /**
     * Serialize the current character configuration to JSON.
     * @returns {object} The character configuration as a plain object
     */
    #serializeCharacter () {
        const config = {
            version: '2.0',
            name: this.#elements.characterNameInput.value || DEFAULT_CHARACTER_NAME,
            bodyShape: this.#elements.shapeSelect.value,
            bodyShapeSpecify: this.#elements.shapeSelect.selectedOptions?.[0]?.getAttribute('specify'),
            colors: {
                body: this.#colorManager.bodyColorPicker.value,
                hair: this.#colorManager.hairColorPicker.value,
                uniform: this.#colorManager.uniformColorPicker.value,
                uniformUndershirt: this.#colorManager.uniformUndershirtColorPicker.value,
                antennae: this.#colorManager.antennaeColorPicker.value,
                birdTuft: this.#colorManager.birdTuftColorPicker.value,
                whiskers: this.#colorManager.whiskersColorPicker.value,
                catNose: this.#colorManager.catNoseColorPicker.value
            },
            colorSync: {
                antennaeWithBody: this.#colorManager.syncAntennaeWithBodyCheck.checked,
                birdTuftWithBody: this.#colorManager.syncBirdTuftWithBodyCheck.checked,
                whiskersWithBody: this.#colorManager.syncWhiskersWithBodyCheck.checked
            },
            uniform: this.#elements.uniformSelect.value,
            ears: this.#elements.earSelect.value,
            nose: this.#elements.noseSelect.value,
            foreheadBump: this.#elements.foreheadBumpCheck.checked,
            medusanAltColor: this.#elements.medusanAltColorCheck.checked,
            medusanBox: this.#elements.medusanBoxCheck.checked,
            calMirranShape: this.#elements.calMirranShapeSelect.value,
            klingonRidges: this.#elements.klingonRidgesSelect.value,
            klingonForehead: this.#elements.klingonForeheadSelect.value,
            tellariteNose: this.#elements.tellariteNoseSelect.value,
            tellariteTusks: this.#elements.tellariteTusksCheck.checked,
            vulcanRomulanV: this.#elements.vulcanRomulanVCheck.checked,
            headFeatures: Array.from(this.#elements.headFeatureSelect.selectedOptions).map(o => o.value),
            jewelry: Array.from(this.#elements.jewelrySelect.selectedOptions).map(o => o.value),
            hat: this.#elements.hatFeatureSelect.value,
            eyewear: this.#elements.eyewearFeatureSelect.value,
            facialHair: this.#elements.facialHairSelect.value,
            hair: this.#elements.hairSelect.value,
            hairMirror: this.#elements.hairMirror.checked,
            rearHair: this.#elements.rearHairSelect.value,
            rearHairMirror: this.#elements.rearHairMirror.checked
        }
        return config
    }

    /**
     * Deserialize a character configuration from JSON and apply it.
     * @param {object} config The character configuration object
     * @returns {boolean} True if successful, false otherwise
     */
    /**
     * Deserialize a character configuration from JSON and apply it.
     * @param {object} config The character configuration object
     * @returns {boolean} True if successful, false otherwise
     */
    #deserializeCharacter (config) {
        // Validate version
        switch (config?.version) {
        case '2.0':
            console.debug('loaded a v 2.0 config')
            break
        case '1.0':
            migrateV1Config(config)
            console.debug('loaded a v 1.0 config')
            break
        default:
            throw new Error(`Invalid or unsupported configuration version ${config?.version}`)
        }
        // Validate body shape before applying to prevent onChangeDetected errors
        // Extract valid body shapes from the select element options
        const validBodyShapes = Array.from(this.#elements.shapeSelect.options).map(option => option.value)
        if (config.bodyShape && !validBodyShapes.includes(config.bodyShape)) {
            throw new Error(`Invalid body shape: "${config.bodyShape}"`)
        }

        const validBodyShapeSpecifies = Array.from(this.#elements.shapeSelect.options).map(option => option.getAttribute('specify'))
        let bodyShapeSpecify = ''
        if (config.bodyShapeSpecify && validBodyShapeSpecifies.includes(config.bodyShapeSpecify)) {
            bodyShapeSpecify = config.bodyShapeSpecify ?? ''
        }

        // Apply body shape first as it affects available options
        if (config.bodyShape) {
            for (const option of this.#elements.shapeSelect.options) {
                const specified = option.getAttribute('specify') ?? ''
                if (option.value === config.bodyShape && specified === bodyShapeSpecify) {
                    option.selected = true
                }
            }
        }

        // Apply character name
        if (config.name) {
            this.#elements.characterNameInput.value = config.name
        }

        // Pre-seed last-used body color so onChangeDetected's body-shape-change
        // path preserves the saved color instead of using the hardcoded default
        if (config.colors?.body && config.bodyShape) {
            this.#colorManager.setLastUsedBodyColor(config.bodyShape, config.colors.body)
        }

        // Apply colors
        if (config.colors) {
            this.#applyColorPickers(config.colors)
        }

        // Apply color sync settings
        if (config.colorSync) {
            if (typeof config.colorSync.antennaeWithBody === 'boolean') {
                this.#colorManager.syncAntennaeWithBodyCheck.checked = config.colorSync.antennaeWithBody
            }
            if (typeof config.colorSync.birdTuftWithBody === 'boolean') {
                this.#colorManager.syncBirdTuftWithBodyCheck.checked = config.colorSync.birdTuftWithBody
            }
            if (typeof config.colorSync.whiskersWithBody === 'boolean') {
                this.#colorManager.syncWhiskersWithBodyCheck.checked = config.colorSync.whiskersWithBody
            }
        }

        // Apply uniform and filter
        if (config.uniform) this.#elements.uniformSelect.value = config.uniform

        // Apply body-specific features
        if (config.ears) this.#elements.earSelect.value = config.ears
        if (config.nose) this.#elements.noseSelect.value = config.nose
        if (typeof config.foreheadBump === 'boolean') {
            this.#elements.foreheadBumpCheck.checked = config.foreheadBump
        }
        if (typeof config.medusanAltColor === 'boolean') {
            this.#elements.medusanAltColorCheck.checked = config.medusanAltColor
        }
        if (typeof config.medusanBox === 'boolean') {
            this.#elements.medusanBoxCheck.checked = config.medusanBox
        }
        if (config.calMirranShape) {
            this.#elements.calMirranShapeSelect.value = config.calMirranShape
        }
        if (config.klingonRidges) {
            this.#elements.klingonRidgesSelect.value = config.klingonRidges
        }
        if (config.klingonForehead) {
            this.#elements.klingonForeheadSelect.value = config.klingonForehead
        }
        if (config.tellariteNose) {
            this.#elements.tellariteNoseSelect.value = config.tellariteNose
        }
        if (typeof config.tellariteTusks === 'boolean') {
            this.#elements.tellariteTusksCheck.checked = config.tellariteTusks
        }
        if (typeof config.vulcanRomulanV === 'boolean') {
            this.#elements.vulcanRomulanVCheck.checked = config.vulcanRomulanV
        }

        // Apply head features (multi-select)
        if (Array.isArray(config.headFeatures)) {
            // Clear current selections
            for (const option of this.#elements.headFeatureSelect.options) {
                option.selected = false
            }
            // Apply new selections
            for (const value of config.headFeatures) {
                const option = this.#elements.headFeatureSelect.querySelector(`option[value="${value}"]`)
                if (option instanceof HTMLOptionElement) option.selected = true
            }
        }

        // Apply jewelry (multi-select)
        if (Array.isArray(config.jewelry)) {
            // Clear current selections
            for (const option of this.#elements.jewelrySelect.options) {
                option.selected = false
            }
            // Apply new selections
            for (const value of config.jewelry) {
                const option = this.#elements.jewelrySelect.querySelector(`option[value="${value}"]`)
                if (option instanceof HTMLOptionElement) option.selected = true
            }
        }

        // Apply hat and eyewear
        if (config.hat) this.#elements.hatFeatureSelect.value = config.hat
        if (config.eyewear) this.#elements.eyewearFeatureSelect.value = config.eyewear

        // Apply hair options
        if (config.facialHair) this.#elements.facialHairSelect.value = config.facialHair
        if (config.hair) this.#elements.hairSelect.value = config.hair
        if (typeof config.hairMirror === 'boolean') {
            this.#elements.hairMirror.checked = config.hairMirror
        }
        if (config.rearHair) this.#elements.rearHairSelect.value = config.rearHair
        if (typeof config.rearHairMirror === 'boolean') {
            this.#elements.rearHairMirror.checked = config.rearHairMirror
        }

        // Trigger change detection to update the UI
        this.onChangeDetected()

        // Re-apply colors that onChangeDetected may have overwritten
        // (e.g. uniform color filtering/validation replaces the picker value)
        if (config.colors) {
            this.#applyColorPickers(config.colors)
        }
        this.#colorManager.updateSynchronizedColors()
        this.#elements.characterStyleEl.innerHTML = this.#colorManager.generateColorStyles()

        // Sync color displays after re-applying loaded colors
        ColorSwatches.syncDisplay('body-color', 'body-color-swatches')
        ColorSwatches.syncDisplay('hair-color', 'hair-color-swatches')
        ColorSwatches.syncDisplay('uniform-color', 'uniform-color-swatches')
        ColorSwatches.syncDisplay('uniform-undershirt-color', 'uniform-undershirt-color-swatches')

        this.#autosaveManager.save(this.#serializeCharacter())

        return true
    }

    /**
     * Attempt to restore autosaved character state from localStorage.
     * Falls back to initial change detection if no autosave exists or restore fails.
     */
    #restoreAutosave () {
        const saved = this.#autosaveManager.load()
        if (saved) {
            try {
                this.#deserializeCharacter(saved)
                // Clear the changes flag after restoring autosave
                this.#hasChanges = false
                return
            } catch (err) {
                console.error('Failed to restore autosave:', err)
            }
        }
        // Trigger the change detection to begin, so we won't start in an unsupported/unusual state
        this.onChangeDetected()
    }

    /**
     * Check if there are unsaved changes since last save/load.
     * @returns {boolean} True if there are unsaved changes
     */
    #hasUnsavedChanges () {
        return this.#hasChanges
    }

    /**
     * Show confirmation dialog for unsaved changes.
     * @param {string} message - The message to display in the dialog
     * @returns {Promise<boolean>} True if user confirms, false if cancelled
     */
    #showConfirmationDialog (message) {
        return new Promise((resolve) => {
            const dialog = document.getElementById('unsaved-changes-dialog')
            const messageEl = document.getElementById('unsaved-changes-message')
            const confirmBtn = document.getElementById('confirm-action-btn')
            const cancelBtn = document.getElementById('cancel-action-btn')

            if (!(dialog instanceof HTMLDialogElement) || !messageEl || !confirmBtn || !cancelBtn) {
                console.error('Dialog element not found')
                // Fallback to browser confirm if dialog not available
                resolve(confirm(message))
                return
            }

            // Set the message
            messageEl.textContent = message

            // Setup event handlers
            const handleConfirm = () => {
                cleanup()
                dialog.close()
                resolve(true)
            }

            const handleCancel = () => {
                cleanup()
                dialog.close()
                resolve(false)
            }

            const handleDialogCancel = (e) => {
                e.preventDefault()
                handleCancel()
            }

            const cleanup = () => {
                confirmBtn.removeEventListener('click', handleConfirm)
                cancelBtn.removeEventListener('click', handleCancel)
                dialog.removeEventListener('cancel', handleDialogCancel)
            }

            confirmBtn.addEventListener('click', handleConfirm)
            cancelBtn.addEventListener('click', handleCancel)
            dialog.addEventListener('cancel', handleDialogCancel)

            dialog.showModal()
        })
    }

    /**
     * Reset the character to default state and clear autosaved data.
     */
    async #resetCharacter () {
        // Check for unsaved changes
        if (this.#hasUnsavedChanges()) {
            const confirmed = await this.#showConfirmationDialog(
                'You have unsaved changes. Resetting will lose all your current work. Do you want to continue?'
            )
            if (!confirmed) {
                return
            }
        }

        this.#autosaveManager.clear()
        location.reload()
    }

    /**
     * Sanitize a character name for use in filenames.
     * @param {string} name - The character name to sanitize
     * @returns {string} Sanitized filename-safe string
     */
    #sanitizeFilename (name) {
        const sanitized = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        // Return default if sanitization results in empty string
        return sanitized || 'trek-character'
    }

    /**
     * Generate a filename for image export based on character name.
     * @param {string} extension - File extension (e.g., 'png', 'svg')
     * @returns {string} Sanitized filename
     */
    #getImageFilename (extension) {
        const characterName = this.#elements.characterNameInput.value || DEFAULT_CHARACTER_NAME
        const sanitizedName = this.#sanitizeFilename(characterName)
        return `${sanitizedName}-icon.${extension}`
    }

    /**
     * Save the current character configuration to a STCC file.
     */
    async #saveCharacter () {
        const config = this.#serializeCharacter()
        const json = JSON.stringify(config, null, 2)

        const characterName = this.#elements.characterNameInput.value || DEFAULT_CHARACTER_NAME
        const sanitizedName = this.#sanitizeFilename(characterName)
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
        const filename = `${sanitizedName}-${timestamp}.stcc`

        try {
            await saveTextAs(filename, json, {
                description: 'Star Trek Character Creator',
                mimes: [{ 'application/stcc': '.stcc' }]
            })
            // Clear the changes flag after successful save
            this.#hasChanges = false
        } catch (err) {
            console.error('Failed to save character:', err)
            alert('Failed to save character file. Please try again.')
        }
    }

    /**
     * Load a character configuration from a STCC file.
     */
    async #loadCharacter () {
        // Validate file input exists first
        const fileInput = document.getElementById('load-character-input')
        if (!(fileInput instanceof HTMLInputElement)) {
            console.error('File input element not found')
            alert('An error occurred. Please refresh the page.')
            return
        }

        // Check for unsaved changes before opening file picker
        if (this.#hasUnsavedChanges()) {
            const confirmed = await this.#showConfirmationDialog(
                'You have unsaved changes. Loading a character will replace your current work. Do you want to continue?'
            )
            if (!confirmed) {
                return
            }
        }

        // Set up the file input change handler
        const handleFileLoad = async () => {
            if (fileInput.files.length === 0) {
                return
            }

            const file = fileInput.files[0]
            // Save current state before attempting to load
            const savedState = this.#serializeCharacter()

            try {
                if (!file.name.endsWith('.stcc') && !file.name.endsWith('.json')) {
                    throw new Error('File must be a .stcc or .json file')
                }

                const text = await file.text()
                const config = JSON.parse(text)
                this.#deserializeCharacter(config)
                // Clear the changes flag after successful load
                this.#hasChanges = false
            } catch (err) {
                console.error('Failed to load character:', err)
                alert(`Failed to load character: ${err.message}`)
                // Restore previous state on error
                this.#deserializeCharacter(savedState)
            } finally {
                // Clear the file input so the same file can be loaded again
                fileInput.value = ''
                // Remove the event listener
                fileInput.removeEventListener('change', handleFileLoad)
            }
        }

        // Add the event listener and trigger the file picker
        fileInput.addEventListener('change', handleFileLoad)
        fileInput.click()
    }
}

// Create the controller when DOM is ready
globalThis.Controller = new IndexController()
