
/**
 * @typedef FileMimeTypeOption
 * @property {string}   description
 * @property {Array}    mimes
 */

/**
 * @typedef {FileSystemHandle|"desktop"|"documents"|"downloads"|"music"|"pictures"|"videos"} StartPathType
 */

/**
 * @typedef     SaveFilePickerOptions
 * @property    {boolean} [excludeAcceptAllOption]
 * @property    {string} [id]
 * @property    {StartPathType} [startIn]
 * @property    {string} [suggestedName]
 * @property    {Array<FileMimeTypeOption>} [types]
 */

/**
 * Write text to file, give user the option of location if possible.
 * @param {string} filename                     suggested filename
 * @param {Blob} blobData                       data to write
 * @param {FileMimeTypeOption} mimeOptions      MIME type info options
 * @param {StartPathType}  [startIn]            Where to start the save-as dialog from
 */
export async function saveBlobAs(filename, blobData, mimeOptions, startIn = 'downloads') {
    /**
     * @type {SaveFilePickerOptions}
     */
    const savePickOptions = {
        startIn: startIn,
        suggestedName: filename,
        types: [mimeOptions]
    }

    try {
        /**
         * @type {FileSystemFileHandle}
         */ // @ts-ignore
        let fileHandle = await window.showSaveFilePicker(savePickOptions)

        let writeable = await fileHandle.createWritable()
        await writeable.write(blobData)
        await writeable.close()
    } catch {
        // Classic method, only gives users a choice if they tell their browser to for all downloads
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blobData);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
        return;
    }
}

/**
 * Write text to file, give user the option of location if possible.
 * @param {string} filename     suggested filename
 * @param {string} text         text to write
 * @param {FileMimeTypeOption} typeOption   MIME type info
 */
export async function saveTextAs(filename, text, typeOption) {
    const blobData = new Blob([text], {type: "text/plain;charset=utf-8"});
    await saveBlobAs(filename, blobData, typeOption)
}