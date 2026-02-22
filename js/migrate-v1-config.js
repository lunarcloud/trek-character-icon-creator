/**
 * Map of v1 headFeature values that were renamed in v2.
 * @type {Record<string, string>}
 */
const V1_FEATURE_RENAMES = {
    'kelpian-lines': 'kelpien-lines'
}

/**
 * Map of jewelry/head-feature values corrected for spelling.
 * @type {Record<string, string>}
 */
const SPELLING_CORRECTED_FEATURES = {
    'occular-implant-l': 'ocular-implant-l', // cspell:disable-line
    'occular-implant-r': 'ocular-implant-r' // cspell:disable-line
}

/**
 * Map of uniform names corrected for spelling.
 * @type {Record<string, string>}
 */
const SPELLING_CORRECTED_UNIFORMS = {
    'Leather Jacket Courrier': 'Leather Jacket Courier' // cspell:disable-line
}

/**
 * Migrate a v1 character configuration object in-place to v2 format.
 * @param {object} config - The v1 character configuration object
 * @returns {object} The mutated config object, now compatible with v2
 */
export function migrateV1Config (config) {
    // Rename bodyShape values that changed between v1 and v2
    if (config.bodyShape === 'human') {
        config.bodyShape = 'humanoid'
    }

    // Rename headFeature values that changed between v1 and v2
    if (Array.isArray(config.headFeatures)) {
        config.headFeatures = config.headFeatures.map(
            f => V1_FEATURE_RENAMES[f] ?? f
        )
    }

    // In v1, headFeatures held both species traits and jewelry/tech items.
    // In v2, these are separate selects. Share the reference so that
    // deserialisation picks items into whichever select they belong to.
    config.jewelry = config.headFeatures

    return config
}

/**
 * Apply spelling corrections to a character configuration object.
 * Handles renamed values from older saves where identifiers had typos.
 * @param {object} config - The character configuration object
 * @returns {object} The mutated config object with corrected spellings
 */
export function applySpellingCorrections (config) {
    // Correct jewelry values
    if (Array.isArray(config.jewelry)) {
        config.jewelry = config.jewelry.map(
            f => SPELLING_CORRECTED_FEATURES[f] ?? f
        )
    }

    // Correct headFeature values
    if (Array.isArray(config.headFeatures)) {
        config.headFeatures = config.headFeatures.map(
            f => SPELLING_CORRECTED_FEATURES[f] ?? f
        )
    }

    // Correct uniform name
    if (config.uniform && SPELLING_CORRECTED_UNIFORMS[config.uniform]) {
        config.uniform = SPELLING_CORRECTED_UNIFORMS[config.uniform]
    }

    return config
}
