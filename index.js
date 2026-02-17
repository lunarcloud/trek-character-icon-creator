import { CharacterElements } from './js/character-elements.js'
import { ColorManager } from './js/color-manager.js'
import { ColorSwatches } from './js/color-swatches.js'
import { UniformManager } from './js/uniform-manager.js'
import { BodyTypeManager } from './js/body-type-manager.js'
import { DomUtil } from './js/util-dom.js'
import { saveTextAs } from './js/save-file-utils.js'
import { TooltipManager } from './js/tooltip-manager.js'
import { AutosaveManager } from './js/autosave-manager.js'

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
            .addEventListener('click', () => DomUtil.SaveImage('star-trek-character.svg',
                this.#elements.mainEl, this.#elements.mainEl.querySelector('character'),
                this.#elements.saveBGCheck.checked, 'svg'))

        document.getElementById('download-png')
            .addEventListener('click', () => DomUtil.SaveImage('star-trek-character.png',
                this.#elements.mainEl, this.#elements.mainEl.querySelector('character'),
                this.#elements.saveBGCheck.checked, 'png'))

        // Setup the file-based save and load functionality
        document.getElementById('save-character')
            .addEventListener('click', () => this.#saveCharacter())

        document.getElementById('load-character')
            .addEventListener('click', () => this.#loadCharacter())

        // Setup the reset button to clear autosave and reload
        document.getElementById('reset-character')
            .addEventListener('click', () => this.#resetCharacter())
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
        const bodyShape = this.#elements.shapeSelect.value
        const bodyShapeChanged = !this.#elements.mainEl.classList.contains(bodyShape)

        // Announce body shape changes to screen readers
        if (bodyShapeChanged && this.#lastBodyShape !== null) {
            const bodyShapeName = this.#elements.shapeSelect.selectedOptions[0]?.textContent || bodyShape
            this.#announce(`Character body type changed to ${bodyShapeName}`)
        }
        this.#lastBodyShape = bodyShape

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
            }
        }

        // Change the body
        this.#elements.characterBody.innerHTML = DomUtil.GenerateSVGHTML(`svg/${bodyShape}/body.svg`)
        this.#elements.bodyOverlay.innerHTML = ['medusan'].includes(bodyShape)
            ? ''
            : DomUtil.GenerateSVGHTML(`svg/${bodyShape}/body-overlay.svg`)

        // Change the uniform
        const uniformBodyShape = ['sukhabelan'].includes(bodyShape) ? 'humanoid' : bodyShape
        this.#elements.characterUniform.innerHTML = DomUtil.GenerateSVGHTML(`svg/${uniformBodyShape}/uniform/${this.#elements.uniformSelect.value}.svg`)

        const uniformClassList = this.#elements.uniformSelect.selectedOptions[0].classList

        // No uniform-specific options (mostly about color)
        this.#elements.mainEl.classList.toggle('no-uniform-color', uniformClassList.contains('no-color-choice'))
        this.#elements.mainEl.classList.toggle('accent-color-choice', uniformClassList.contains('accent-color-choice'))
        const extraOverlay = this.#elements.mainEl.classList.toggle('orville-badge-choice', uniformClassList.contains('orville-badge-choice'))
        this.#elements.mainEl.classList.toggle('extra-overlay', extraOverlay)

        // Filter color selector by uniform's colors
        const filteringColors = this.#colorManager.uniformColorFilterCheck.checked
        const colorsFilter = this.#elements.uniformSelect.selectedOptions[0].getAttribute('colors-filter')
        UniformManager.filterColorOptions(this.#elements.mainEl, this.#colorManager.uniformColorSelect, filteringColors, colorsFilter)

        // Regenerate uniform color swatches to reflect filter changes
        ColorSwatches.regenerate('uniform-color', 'std-uniform-colors', 'uniform-color-swatches')

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
    }

    /**
     * Serialize the current character configuration to JSON.
     * @returns {object} The character configuration as a plain object
     */
    #serializeCharacter () {
        const config = {
            version: '1.0',
            bodyShape: this.#elements.shapeSelect.value,
            colors: {
                body: this.#colorManager.bodyColorPicker.value,
                hair: this.#colorManager.hairColorPicker.value,
                uniform: this.#colorManager.uniformColorPicker.value,
                uniformUndershirt: this.#colorManager.uniformUndershirtColorPicker.value,
                antennae: this.#colorManager.antennaeColorPicker.value,
                birdTuft: this.#colorManager.birdTuftColorPicker.value,
                whiskers: this.#colorManager.whiskersColorPicker.value
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
            headFeatures: Array.from(this.#elements.headFeatureSelect.selectedOptions).map(o => o.value),
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
        if (!config.version || config.version !== '1.0') {
            throw new Error('Invalid or unsupported configuration version')
        }

        // Validate body shape before applying to prevent onChangeDetected errors
        // Extract valid body shapes from the select element options
        const validBodyShapes = Array.from(this.#elements.shapeSelect.options).map(option => option.value)
        if (config.bodyShape && !validBodyShapes.includes(config.bodyShape)) {
            throw new Error(`Invalid body shape: "${config.bodyShape}"`)
        }

        // Apply body shape first as it affects available options
        if (config.bodyShape) {
            this.#elements.shapeSelect.value = config.bodyShape
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
     * Save the current character configuration to a STCC file.
     */
    async #saveCharacter () {
        const config = this.#serializeCharacter()
        const json = JSON.stringify(config, null, 2)

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
        const filename = `character-${timestamp}.stcc`

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
