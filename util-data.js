/**
 * Data-related Utilities
 */
export class DataUtil {
    /**
     * Split a name into it's multiple parts
     * @param {string|undefined} name       string list to split
     * @returns {Array<string>|undefined}   list of individual names
     */
    static ListStringToArray (name) {
        return name
            ?.split(/\s*[,/\\&]\s*/i)
            ?.map(i => i.trim())
            ?.filter(i => i !== '')
    }

    /**
     * if any elements of the first list are in the second
     * @param {Array} needles     first list
     * @param {Array} haystack    second list
     * @returns {boolean}         if any needles are in the haystack
     */
    static ListInList (needles, haystack) {
        return haystack.some(el => needles.includes(el))
    }
}
