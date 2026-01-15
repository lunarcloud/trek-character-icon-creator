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
        this.#setupKeyboardShortcuts()

        // Trigger the change detection to begin, so we won't start in an unsupported/unusual state
        this.onChangeDetected()

        // Setup the save as image functionality
        document.getElementById('download-svg')
            .addEventListener('click', () => DomUtil.SaveImage('star-trek-character.svg',
                this.#elements.mainEl, this.#elements.mainEl.querySelector('character'),
                this.#elements.saveBGCheck.checked, 'svg'))

        document.getElementById('download-png')
            .addEventListener('click', () => DomUtil.SaveImage('star-trek-character.png',
                this.#elements.mainEl, this.#elements.mainEl.querySelector('character'),
                this.#elements.saveBGCheck.checked, 'png'))

        // Setup the import and export functionality
        document.getElementById('show-export')
            .addEventListener('click', () => this.#exportCharacter())

        document.getElementById('show-import')
            .addEventListener('click', () => this.#importCharacter())
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
     * Setup keyboard shortcuts for import and export.
     */
    #setupKeyboardShortcuts () {
        document.addEventListener('keydown', (e) => {
            // Ctrl+E or Cmd+E for export
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault()
                this.#exportCharacter()
            }
            // Ctrl+I or Cmd+I for import
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault()
                this.#importCharacter()
            }
        })
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
    #deserializeCharacter (config) {
        try {
            // Validate version
            if (!config.version || config.version !== '1.0') {
                throw new Error('Invalid or unsupported configuration version')
            }

            // Apply body shape first as it affects available options
            if (config.bodyShape) {
                this.#elements.shapeSelect.value = config.bodyShape
            }

            // Apply colors
            if (config.colors) {
                if (config.colors.body) this.#colorManager.bodyColorPicker.value = config.colors.body
                if (config.colors.hair) this.#colorManager.hairColorPicker.value = config.colors.hair
                if (config.colors.uniform) this.#colorManager.uniformColorPicker.value = config.colors.uniform
                if (config.colors.uniformUndershirt) this.#colorManager.uniformUndershirtColorPicker.value = config.colors.uniformUndershirt
                if (config.colors.antennae) this.#colorManager.antennaeColorPicker.value = config.colors.antennae
                if (config.colors.birdTuft) this.#colorManager.birdTuftColorPicker.value = config.colors.birdTuft
                if (config.colors.whiskers) this.#colorManager.whiskersColorPicker.value = config.colors.whiskers
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

            return true
        } catch (error) {
            console.error('Failed to deserialize character:', error)
            alert(`Failed to import character: ${error.message}`)
            return false
        }
    }

    /**
     * Export the current character configuration to JSON.
     * Shows a dialog with the JSON that can be copied.
     */
    #exportCharacter () {
        const config = this.#serializeCharacter()
        const json = JSON.stringify(config, null, 2)

        // Get the dialog and elements
        const dialog = document.getElementById('export-dialog')
        const textarea = document.getElementById('export-json')
        const copyBtn = document.getElementById('export-copy-btn')
        const closeBtn = document.getElementById('export-close-btn')

        // Set the JSON content
        textarea.value = json

        // Select all text when dialog opens
        textarea.select()

        // Copy to clipboard handler
        const handleCopy = async () => {
            try {
                await navigator.clipboard.writeText(json)
                copyBtn.textContent = '✓ Copied!'
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard'
                }, 2000)
            } catch (err) {
                console.error('Failed to copy:', err)
                alert('Failed to copy to clipboard. Please copy manually.')
            }
        }

        // Close dialog handler
        const handleClose = () => {
            dialog.close()
            // Clean up event listeners
            copyBtn.removeEventListener('click', handleCopy)
            closeBtn.removeEventListener('click', handleClose)
            dialog.removeEventListener('keydown', handleKeydown)
        }

        // Escape key handler
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                handleClose()
            }
        }

        // Add event listeners
        copyBtn.addEventListener('click', handleCopy)
        closeBtn.addEventListener('click', handleClose)
        dialog.addEventListener('keydown', handleKeydown)

        dialog.showModal()
    }

    /**
     * Import a character configuration from JSON.
     * Shows a dialog to paste JSON.
     */
    #importCharacter () {
        // Get the dialog and elements
        const dialog = document.getElementById('import-dialog')
        const textarea = document.getElementById('import-json')
        const importBtn = document.getElementById('import-btn')
        const cancelBtn = document.getElementById('import-cancel-btn')

        // Clear previous content
        textarea.value = ''

        // Import configuration handler
        const handleImport = () => {
            try {
                const json = textarea.value.trim()
                if (!json) {
                    alert('Please paste a JSON configuration.')
                    return
                }

                const config = JSON.parse(json)
                const success = this.#deserializeCharacter(config)

                if (success) {
                    handleCancel()
                    alert('Character imported successfully!')
                }
            } catch (err) {
                console.error('Import error:', err)
                alert('Invalid JSON format. Please check your configuration.')
            }
        }

        // Cancel handler
        const handleCancel = () => {
            dialog.close()
            // Clean up event listeners
            importBtn.removeEventListener('click', handleImport)
            cancelBtn.removeEventListener('click', handleCancel)
            dialog.removeEventListener('keydown', handleKeydown)
        }

        // Escape key handler
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                handleCancel()
            }
        }

        // Add event listeners
        importBtn.addEventListener('click', handleImport)
        cancelBtn.addEventListener('click', handleCancel)
        dialog.addEventListener('keydown', handleKeydown)

        dialog.showModal()
        textarea.focus()
    }
}

globalThis.Controller = new IndexController()
