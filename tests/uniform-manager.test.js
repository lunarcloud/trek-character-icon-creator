import { jest } from '@jest/globals'

jest.unstable_mockModule('../js/util-dom.js', () => ({
    DomUtil: {
        IsOptionInvalid: jest.fn()
    }
}))

const { UniformManager } = await import('../js/uniform-manager.js')

describe('UniformManager.getDefaultUniform', () => {
    test('returns "Prodigy B" for medusan', () => {
        expect(UniformManager.getDefaultUniform('medusan')).toBe('Prodigy B')
    })

    test('returns "Eighteenth Century A" for qofuari', () => {
        expect(UniformManager.getDefaultUniform('qofuari')).toBe('Eighteenth Century A')
    })

    test('returns "Sarell Expanse" for sukhabelan', () => {
        expect(UniformManager.getDefaultUniform('sukhabelan')).toBe('Sarell Expanse')
    })

    test('returns "VOY DS9" for unknown body shapes', () => {
        expect(UniformManager.getDefaultUniform('humanoid')).toBe('VOY DS9')
    })

    test('returns "VOY DS9" for cetaceous', () => {
        expect(UniformManager.getDefaultUniform('cetaceous')).toBe('VOY DS9')
    })

    test('returns "VOY DS9" for exocomp', () => {
        expect(UniformManager.getDefaultUniform('exocomp')).toBe('VOY DS9')
    })

    test('returns "VOY DS9" for cal-mirran', () => {
        expect(UniformManager.getDefaultUniform('cal-mirran')).toBe('VOY DS9')
    })
})
