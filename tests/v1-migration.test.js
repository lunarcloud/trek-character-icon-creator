import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { migrateV1Config, applySpellingCorrections } from '../js/migrate-v1-config.js'

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

describe('applySpellingCorrections', () => {
    /* cspell:disable -- old spellings are intentional in migration tests */
    test('corrects occular-implant-l to ocular-implant-l in jewelry', () => {
        const config = { jewelry: ['occular-implant-l', 'bajoran-earring'] }
        applySpellingCorrections(config)
        expect(config.jewelry).toContain('ocular-implant-l')
        expect(config.jewelry).not.toContain('occular-implant-l')
        expect(config.jewelry).toContain('bajoran-earring')
    })

    test('corrects occular-implant-r to ocular-implant-r in jewelry', () => {
        const config = { jewelry: ['occular-implant-r'] }
        applySpellingCorrections(config)
        expect(config.jewelry).toContain('ocular-implant-r')
    })

    test('corrects occular implants in headFeatures', () => {
        const config = { headFeatures: ['occular-implant-l', 'occular-implant-r'] }
        applySpellingCorrections(config)
        expect(config.headFeatures).toContain('ocular-implant-l')
        expect(config.headFeatures).toContain('ocular-implant-r')
    })

    test('corrects Leather Jacket Courrier to Courier in uniform', () => {
        const config = { uniform: 'Leather Jacket Courrier' }
        applySpellingCorrections(config)
        expect(config.uniform).toBe('Leather Jacket Courier')
    })
    /* cspell:enable */

    test('leaves correct spellings unchanged', () => {
        const config = {
            jewelry: ['ocular-implant-l', 'bajoran-earring'],
            headFeatures: ['andorian-antennae'],
            uniform: 'TNG'
        }
        applySpellingCorrections(config)
        expect(config.jewelry).toEqual(['ocular-implant-l', 'bajoran-earring'])
        expect(config.headFeatures).toEqual(['andorian-antennae'])
        expect(config.uniform).toBe('TNG')
    })

    test('handles missing arrays gracefully', () => {
        const config = { uniform: 'TNG' }
        expect(() => applySpellingCorrections(config)).not.toThrow()
    })
})
