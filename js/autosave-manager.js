/**
 * Manages auto-saving and restoring character state to/from localStorage.
 */
export class AutosaveManager {
    /**
     * LocalStorage key for autosaved character state.
     * @type {string}
     */
    static STORAGE_KEY = 'trek-character-autosave'

    /**
     * Debounce delay in milliseconds.
     * @type {number}
     */
    static DEBOUNCE_MS = 500

    /**
     * @type {number|null}
     */
    #debounceTimer = null

    /**
     * Schedule a debounced save of character configuration to localStorage.
     * @param {object} config - The serialized character configuration object
     */
    save (config) {
        if (this.#debounceTimer !== null) {
            clearTimeout(this.#debounceTimer)
        }
        this.#debounceTimer = setTimeout(() => {
            try {
                localStorage.setItem(AutosaveManager.STORAGE_KEY, JSON.stringify(config))
            } catch (err) {
                console.error('Autosave failed:', err)
            }
            this.#debounceTimer = null
        }, AutosaveManager.DEBOUNCE_MS)
    }

    /**
     * Load autosaved character configuration from localStorage.
     * @returns {object|null} The saved configuration object, or null if none exists
     */
    load () {
        try {
            const data = localStorage.getItem(AutosaveManager.STORAGE_KEY)
            if (!data) return null
            return JSON.parse(data)
        } catch (err) {
            console.error('Failed to load autosave:', err)
            return null
        }
    }

    /**
     * Clear the autosaved character state from localStorage.
     */
    clear () {
        try {
            localStorage.removeItem(AutosaveManager.STORAGE_KEY)
        } catch (err) {
            console.error('Failed to clear autosave:', err)
        }
    }
}
