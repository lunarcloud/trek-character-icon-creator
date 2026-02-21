import { tooltipData } from '../js/tooltip-data.js'

describe('tooltipData structure', () => {
    test('has all expected top-level categories', () => {
        const expectedCategories = [
            'bodyTypes', 'calMirranShapes', 'ears', 'headFeatures',
            'jewelry', 'hats', 'eyewear', 'noseTypes',
            'uniformEras', 'departments', 'casual'
        ]
        for (const category of expectedCategories) {
            expect(tooltipData).toHaveProperty(category)
        }
    })

    test('no category is empty', () => {
        for (const [, tooltips] of Object.entries(tooltipData)) {
            expect(Object.keys(tooltips).length).toBeGreaterThan(0)
        }
    })

    test('no tooltip value is empty or whitespace-only', () => {
        for (const [, tooltips] of Object.entries(tooltipData)) {
            for (const [, value] of Object.entries(tooltips)) {
                expect(value.trim()).not.toBe('')
            }
        }
    })

    test('all tooltip values are strings', () => {
        for (const [, tooltips] of Object.entries(tooltipData)) {
            for (const [, value] of Object.entries(tooltips)) {
                expect(typeof value).toBe('string')
            }
        }
    })
})

describe('tooltipData body types', () => {
    test('humanoid tooltip mentions bipedal', () => {
        expect(tooltipData.bodyTypes.humanoid).toContain('bipedal')
    })

    test('cetaceous tooltip mentions dolphin', () => {
        expect(tooltipData.bodyTypes.cetaceous).toContain('dolphin')
    })

    test('medusan tooltip mentions energy beings', () => {
        expect(tooltipData.bodyTypes.medusan).toContain('energy beings')
    })

    test('includes all core species', () => {
        const coreSpecies = [
            'humanoid', 'human', 'vulcan', 'klingon', 'ferengi',
            'andor', 'bajoran', 'trill', 'cardassian', 'orion',
            'cetaceous', 'exocomp', 'medusan'
        ]
        for (const species of coreSpecies) {
            expect(tooltipData.bodyTypes).toHaveProperty(species)
        }
    })
})

describe('tooltipData ears', () => {
    test('round ears tooltip mentions human', () => {
        expect(tooltipData.ears.round).toContain('human')
    })

    test('pointy ears tooltip mentions Vulcan', () => {
        expect(tooltipData.ears.pointy).toContain('Vulcan')
    })

    test('includes all ear types', () => {
        const earTypes = ['none', 'round', 'pointy', 'flat', 'semi-flat', 'ferengi', 'cat', 'webbed', 'bear', 'horns']
        for (const ear of earTypes) {
            expect(tooltipData.ears).toHaveProperty(ear)
        }
    })
})

describe('tooltipData head features', () => {
    test('andorian-antennae tooltip mentions Andorian', () => {
        expect(tooltipData.headFeatures['andorian-antennae']).toContain('Andorian')
    })

    test('trill-spots tooltip mentions Trill', () => {
        expect(tooltipData.headFeatures['trill-spots']).toContain('Trill')
    })

    test('klingon-ridges tooltip mentions Klingon', () => {
        expect(tooltipData.headFeatures['klingon-ridges']).toContain('Klingon')
    })
})

describe('tooltipData uniform eras', () => {
    test('TOS tooltip mentions Original Series', () => {
        expect(tooltipData.uniformEras.TOS).toContain('Original Series')
    })

    test('TNG tooltip mentions Next Generation', () => {
        expect(tooltipData.uniformEras.TNG).toContain('Next Generation')
    })

    test('includes major eras', () => {
        const majorEras = ['ENT', 'TOS', 'TNG', 'VOY DS9', 'Lower Decks', 'SNW']
        for (const era of majorEras) {
            expect(tooltipData.uniformEras).toHaveProperty(era)
        }
    })
})

describe('tooltipData departments', () => {
    test('Command tooltip mentions Command', () => {
        expect(tooltipData.departments.Command).toContain('Command')
    })

    test('includes core departments', () => {
        const departments = ['Command', 'Science', 'Medical', 'Engineering', 'Security']
        for (const dept of departments) {
            expect(tooltipData.departments).toHaveProperty(dept)
        }
    })
})

describe('tooltipData eyewear', () => {
    test('visor tooltip mentions La Forge', () => {
        expect(tooltipData.eyewear.visor).toContain('La Forge')
    })
})
