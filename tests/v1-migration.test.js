import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { migrateV1Config } from '../js/migrate-v1-config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Load a fixture file and return its parsed JSON.
 * @param {string} filename - fixture filename
 * @returns {object} parsed character config
 */
function loadFixture (filename) {
    const text = readFileSync(resolve(__dirname, 'fixtures', filename), 'utf8')
    return JSON.parse(text)
}

describe('migrateV1Config', () => {
    test('migrates bodyShape "human" to "humanoid"', () => {
        const config = loadFixture('character-2026-01-21T01-47-14.stcc')
        expect(config.bodyShape).toBe('human')

        migrateV1Config(config)

        expect(config.bodyShape).toBe('humanoid')
    })

    test('leaves bodyShape "humanoid" unchanged', () => {
        const config = loadFixture('character-2026-01-21T02-47-28.stcc')
        expect(config.bodyShape).toBe('humanoid')

        migrateV1Config(config)

        expect(config.bodyShape).toBe('humanoid')
    })

    test('renames kelpian-lines to kelpien-lines in headFeatures', () => {
        const config = loadFixture('character-2026-01-21T02-47-28.stcc')
        expect(config.headFeatures).toContain('kelpian-lines')

        migrateV1Config(config)

        expect(config.headFeatures).not.toContain('kelpian-lines')
        expect(config.headFeatures).toContain('kelpien-lines')
    })

    test('preserves non-renamed headFeature values', () => {
        const config = loadFixture('character-2026-01-21T02-47-28.stcc')
        // andorian-antennae, bajoran-earring, cyborg-antenna-l, lab-coat are all unchanged
        migrateV1Config(config)

        expect(config.headFeatures).toContain('andorian-antennae')
        expect(config.headFeatures).toContain('bajoran-earring')
        expect(config.headFeatures).toContain('cyborg-antenna-l')
        expect(config.headFeatures).toContain('lab-coat')
    })

    test('copies headFeatures to jewelry so v2 jewelry items are picked up', () => {
        const config = loadFixture('character-2026-01-21T02-47-28.stcc')
        migrateV1Config(config)

        // jewelry should share the migrated headFeatures content
        expect(config.jewelry).toEqual(config.headFeatures)
        expect(config.jewelry).toContain('bajoran-earring')
        expect(config.jewelry).toContain('cyborg-antenna-l')
        expect(config.jewelry).toContain('lab-coat')
    })

    test('works when headFeatures is empty', () => {
        const config = loadFixture('character-2026-02-16T01-49-38.stcc')
        expect(config.headFeatures).toEqual([])

        migrateV1Config(config)

        expect(config.headFeatures).toEqual([])
        expect(config.jewelry).toEqual([])
    })

    test('migrates headFeatures with only species traits (no jewelry)', () => {
        const config = loadFixture('character-2026-01-21T01-47-14.stcc')
        // headFeatures: ["bolian-line", "bird-beak"] — both are species traits
        migrateV1Config(config)

        expect(config.headFeatures).toContain('bolian-line')
        expect(config.headFeatures).toContain('bird-beak')
        expect(config.jewelry).toContain('bolian-line')
        expect(config.jewelry).toContain('bird-beak')
    })

    test('copies headFeatures cyborg-antenna-r to jewelry', () => {
        const config = loadFixture('character-2026-01-22T02-42-09.stcc')
        // headFeatures: ["andorian-antennae", "cyborg-antenna-r"]
        migrateV1Config(config)

        expect(config.jewelry).toContain('cyborg-antenna-r')
        expect(config.headFeatures).toContain('andorian-antennae')
    })
})
