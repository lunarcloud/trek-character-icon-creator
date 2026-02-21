import { DataUtil } from '../js/util-data.js'

describe('DataUtil.ListStringToArray', () => {
    test('splits comma-separated values', () => {
        expect(DataUtil.ListStringToArray('a, b, c')).toEqual(['a', 'b', 'c'])
    })

    test('splits slash-separated values', () => {
        expect(DataUtil.ListStringToArray('Command/Security')).toEqual(['Command', 'Security'])
    })

    test('splits backslash-separated values', () => {
        expect(DataUtil.ListStringToArray('Ops\\Engineering')).toEqual(['Ops', 'Engineering'])
    })

    test('splits ampersand-separated values', () => {
        expect(DataUtil.ListStringToArray('Science & Medical')).toEqual(['Science', 'Medical'])
    })

    test('trims whitespace from each part', () => {
        expect(DataUtil.ListStringToArray('  a , b , c  ')).toEqual(['a', 'b', 'c'])
    })

    test('filters out empty strings', () => {
        expect(DataUtil.ListStringToArray('a,,b')).toEqual(['a', 'b'])
    })

    test('returns single-element array for non-delimited string', () => {
        expect(DataUtil.ListStringToArray('Command')).toEqual(['Command'])
    })

    test('returns undefined for undefined input', () => {
        expect(DataUtil.ListStringToArray(undefined)).toBeUndefined()
    })

    test('handles mixed delimiters', () => {
        expect(DataUtil.ListStringToArray('Ops / Security, Engineering')).toEqual(['Ops', 'Security', 'Engineering'])
    })
})

describe('DataUtil.ListInList', () => {
    test('returns true when needle is found in haystack', () => {
        expect(DataUtil.ListInList(['a', 'b'], ['b', 'c', 'd'])).toBe(true)
    })

    test('returns false when no needles are found', () => {
        expect(DataUtil.ListInList(['x', 'y'], ['a', 'b', 'c'])).toBe(false)
    })

    test('returns false for empty needles', () => {
        expect(DataUtil.ListInList([], ['a', 'b'])).toBe(false)
    })

    test('returns false for empty haystack', () => {
        expect(DataUtil.ListInList(['a'], [])).toBe(false)
    })

    test('returns true when all needles match', () => {
        expect(DataUtil.ListInList(['a', 'b'], ['a', 'b', 'c'])).toBe(true)
    })

    test('works with department-style strings', () => {
        expect(DataUtil.ListInList(['Command'], ['Command', 'Science', 'Medical'])).toBe(true)
    })
})
