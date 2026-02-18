/**
 * URL Share Manager
 * Handles encoding/decoding of character configurations for URL sharing.
 *
 * IFRAME COMPATIBILITY:
 * This implementation works correctly when the app is embedded in an iframe
 * (e.g., on itch.io) because it only accesses the iframe's own window.location,
 * which is always allowed. Cross-origin restrictions prevent parent↔child access
 * but do NOT prevent an iframe from accessing its own location properties.
 *
 * When embedded:
 * - The iframe can read/write its own window.location.hash ✓
 * - The iframe can use window.history.replaceState() ✓
 * - URL hash fragments are preserved when loading the iframe ✓
 * - Share URLs work whether opened directly or via itch.io embed ✓
 */
export class UrlShareManager {
    /**
     * Encode a character configuration object to a URL-safe base64 string.
     * @param {object} config - The character configuration object
     * @returns {string} Base64-encoded configuration string
     */
    static encode (config) {
        const json = JSON.stringify(config)
        // Convert to base64 and make URL-safe
        const base64 = btoa(json)
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    }

    /**
     * Decode a URL-safe base64 string to a character configuration object.
     * @param {string} encoded - The base64-encoded configuration string
     * @returns {object} The decoded character configuration object
     * @throws {Error} If decoding or parsing fails
     */
    static decode (encoded) {
        try {
            // Restore base64 from URL-safe format
            let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
            // Add padding if needed
            while (base64.length % 4) {
                base64 += '='
            }
            const json = atob(base64)
            return JSON.parse(json)
        } catch (err) {
            throw new Error(`Failed to decode share URL: ${err.message}`)
        }
    }

    /**
     * Generate a shareable URL for the current page with encoded character data.
     * @param {object} config - The character configuration object
     * @returns {string} Complete shareable URL
     */
    static generateShareUrl (config) {
        const encoded = UrlShareManager.encode(config)
        const url = new URL(window.location.href)
        // Clear existing hash and query params
        url.search = ''
        url.hash = `#character=${encoded}`
        return url.toString()
    }

    /**
     * Parse character data from the current URL hash.
     * @returns {object|null} The character configuration object, or null if not present
     */
    static parseFromUrl () {
        const hash = window.location.hash
        if (!hash || !hash.startsWith('#character=')) {
            return null
        }
        const encoded = hash.substring('#character='.length)
        if (!encoded) {
            return null
        }
        return UrlShareManager.decode(encoded)
    }

    /**
     * Copy a shareable URL to the clipboard.
     * @param {string} url - The URL to copy
     * @returns {Promise<void>} Resolves when copy is complete
     * @throws {Error} If clipboard API is not available or copy fails
     */
    static async copyToClipboard (url) {
        if (!navigator.clipboard) {
            throw new Error('Clipboard API not available')
        }
        await navigator.clipboard.writeText(url)
    }
}
