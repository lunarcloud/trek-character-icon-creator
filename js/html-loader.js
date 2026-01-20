/**
 * HTML Loader Module - Loads HTML fragments dynamically
 * This provides a minimal-dependency solution for breaking up large HTML files
 * into smaller, manageable pieces using native browser fetch API.
 */

/**
 * Load an HTML fragment and insert it into a target element.
 * @param {string} url - The URL of the HTML fragment to load
 * @param {string} targetSelector - CSS selector for the target element
 * @returns {Promise<void>} Promise that resolves when HTML is loaded
 * @throws {Error} If fetch fails or target element not found
 */
async function loadHTMLFragment (url, targetSelector) {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.statusText}`)
        }

        const html = await response.text()
        const targetElement = document.querySelector(targetSelector)

        if (!targetElement) {
            throw new Error(`Target element not found: ${targetSelector}`)
        }

        targetElement.innerHTML = html
    } catch (error) {
        console.error(`Error loading HTML fragment from ${url}:`, error)
        alert(`Error loading page content: ${error.message}`)
        throw error
    }
}

/**
 * Load multiple HTML fragments in parallel.
 * @param {Array<{url: string, target: string}>} fragments - Array of fragment configs
 * @returns {Promise<void>} Promise that resolves when all fragments are loaded
 */
async function loadHTMLFragments (fragments) {
    const loadPromises = fragments.map(({ url, target }) =>
        loadHTMLFragment(url, target)
    )

    await Promise.all(loadPromises)
}

/**
 * Initialize the application by loading all HTML fragments.
 * @returns {Promise<void>} Promise that resolves when all fragments are loaded
 */
export async function initializeHTMLFragments () {
    const fragments = [
        { url: 'html/body-section.html', target: '#body-section-container' },
        { url: 'html/features-section.html', target: '#features-section-container' },
        { url: 'html/uniform-section.html', target: '#uniform-section-container' },
        { url: 'html/hair-section.html', target: '#hair-section-container' },
        { url: 'html/dialogs.html', target: 'dialogs' }
    ]

    try {
        await loadHTMLFragments(fragments)
    } catch (error) {
        console.error('Failed to initialize HTML fragments:', error)
        throw error
    }
}
