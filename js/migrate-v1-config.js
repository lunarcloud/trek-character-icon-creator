/**
 * Map of v1 headFeature values that were renamed in v2.
 * @type {Record<string, string>}
 */
const V1_FEATURE_RENAMES = {
    'kelpian-lines': 'kelpien-lines'
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
