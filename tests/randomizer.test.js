import { jest } from '@jest/globals'

jest.unstable_mockModule('../js/body-type-manager.js', () => ({
    BodyTypeManager: {}
}))
jest.unstable_mockModule('../js/uniform-manager.js', () => ({
    UniformManager: {}
}))
jest.unstable_mockModule('../js/type-helpers.js', () => ({
    getSelectElement: jest.fn()
}))

const { pickRandom, pickWeightedSpecies, SPECIES_WEIGHTS, MILITIA_SPECIES_PREFIX } = await import('../js/randomizer.js')

describe('pickRandom', () => {
    test('returns undefined for empty array', () => {
        expect(pickRandom([])).toBeUndefined()
    })

    test('returns the only element of single-element array', () => {
        expect(pickRandom(['only'])).toBe('only')
    })

    test('returns an element from the array', () => {
        const arr = ['a', 'b', 'c']
        const result = pickRandom(arr)
        expect(arr).toContain(result)
    })

    test('returns different results over many calls (not always first)', () => {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const results = new Set()
        for (let i = 0; i < 100; i++) {
            results.add(pickRandom(arr))
        }
        expect(results.size).toBeGreaterThan(1)
    })
})

describe('pickWeightedSpecies', () => {
    test('returns a valid species object', () => {
        const species = pickWeightedSpecies()
        expect(species).toHaveProperty('value')
        expect(species).toHaveProperty('specify')
        expect(species).toHaveProperty('weight')
    })

    test('returned species is from the SPECIES_WEIGHTS table', () => {
        const species = pickWeightedSpecies()
        const found = SPECIES_WEIGHTS.some(
            s => s.value === species.value && s.specify === species.specify
        )
        expect(found).toBe(true)
    })

    test('higher-weighted species appear more often', () => {
        const counts = {}
        for (let i = 0; i < 1000; i++) {
            const species = pickWeightedSpecies()
            const key = `${species.value}:${species.specify}`
            counts[key] = (counts[key] || 0) + 1
        }
        // Human (weight 10) should appear more often than tilikaal (weight 1)
        expect(counts['humanoid:human'] || 0).toBeGreaterThan(counts['humanoid:tilikaal'] || 0)
    })
})

describe('SPECIES_WEIGHTS', () => {
    test('every entry has value, specify, and positive weight', () => {
        for (const species of SPECIES_WEIGHTS) {
            expect(typeof species.value).toBe('string')
            expect(typeof species.specify).toBe('string')
            expect(species.weight).toBeGreaterThan(0)
        }
    })

    test('includes all body type values', () => {
        const bodyTypes = new Set(SPECIES_WEIGHTS.map(s => s.value))
        expect(bodyTypes).toContain('humanoid')
        expect(bodyTypes).toContain('cetaceous')
        expect(bodyTypes).toContain('exocomp')
        expect(bodyTypes).toContain('medusan')
        expect(bodyTypes).toContain('cal-mirran')
        expect(bodyTypes).toContain('qofuari')
    })

    test('includes common humanoid species', () => {
        const specifies = new Set(SPECIES_WEIGHTS.map(s => s.specify))
        const expected = ['human', 'klingon', 'vulcan', 'andor', 'bajoran', 'ferengi', 'orion', 'trill']
        for (const species of expected) {
            expect(specifies).toContain(species)
        }
    })
})

describe('MILITIA_SPECIES_PREFIX', () => {
    test('maps species to uniform name prefixes', () => {
        expect(MILITIA_SPECIES_PREFIX.andor).toBe('Andorian')
        expect(MILITIA_SPECIES_PREFIX.klingon).toBe('Klingon')
        expect(MILITIA_SPECIES_PREFIX.ferengi).toBe('Ferengi')
        expect(MILITIA_SPECIES_PREFIX.cardassian).toBe('Cardassian')
        expect(MILITIA_SPECIES_PREFIX.vulcan).toBe('Romulan')
    })

    test('all values are non-empty strings', () => {
        for (const [, value] of Object.entries(MILITIA_SPECIES_PREFIX)) {
            expect(typeof value).toBe('string')
            expect(value.length).toBeGreaterThan(0)
        }
    })
})
