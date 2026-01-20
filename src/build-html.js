#!/usr/bin/env node
/**
 * Build script to assemble index.html from HTML partials.
 * This is a minimal build tool that concatenates HTML fragments into the main index.html file.
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Read a file and return its contents as a string.
 * @param {string} filePath - Path to the file to read
 * @returns {string} File contents
 */
function readFile (filePath) {
    return readFileSync(join(__dirname, filePath), 'utf-8')
}

/**
 * Write content to a file.
 * @param {string} filePath - Path to the file to write
 * @param {string} content - Content to write
 */
function writeFile (filePath, content) {
    writeFileSync(join(__dirname, filePath), content, 'utf-8')
}

/**
 * Add indentation to each line of HTML content.
 * @param {string} content - HTML content to indent
 * @param {number} spaces - Number of spaces to indent
 * @returns {string} Indented HTML content
 */
function indentContent (content, spaces) {
    if (spaces === 0) return content
    
    const indent = ' '.repeat(spaces)
    const lines = content.split('\n')
    
    // Add indentation to each non-empty line
    return lines
        .map(line => {
            // Don't indent empty lines
            if (line.trim() === '') {
                return ''
            }
            // Add the specified indentation
            return indent + line
        })
        .join('\n')
}

/**
 * Replace an INSERT comment with indented content.
 * @param {string} template - The template string
 * @param {string} filename - The filename to look for in INSERT comment
 * @param {string} content - The content to insert
 * @returns {string} Template with content inserted
 */
function replaceInsert (template, filename, content) {
    // Find the INSERT comment and capture its indentation
    // Match: optional newline, then spaces (not including newline), then the comment
    const regex = new RegExp(`(^|\\n)( *)<!-- INSERT: ${filename.replace(/\./g, '\\.')} -->`, 'g')
    const match = regex.exec(template)
    
    if (!match) {
        console.warn(`Warning: INSERT comment for ${filename} not found`)
        return template
    }
    
    const indent = match[2].length  // match[2] is just the spaces, not including newline
    const indentedContent = indentContent(content, indent)
    
    // Replace the comment but keep the newline if there was one
    return template.replace(regex, match[1] + indentedContent)
}

/**
 * Build the index.html file by assembling HTML partials.
 */
function buildIndexHTML () {
    console.log('Building index.html from partials...')

    // Read the template
    let template = readFile('index.template.html')

    // Read all partials
    const characterDisplaySection = readFile('html/character-display-section.html')
    const bodySection = readFile('html/body-section.html')
    const featuresSection = readFile('html/features-section.html')
    const uniformSection = readFile('html/uniform-section.html')
    const hairSection = readFile('html/hair-section.html')
    const footerSection = readFile('html/footer-section.html')
    const dialogs = readFile('html/dialogs.html')

    // Replace placeholders with actual content
    // The template already has the correct indentation for the INSERT comments
    template = replaceInsert(template, 'html/main-section.html', characterDisplaySection)
    template = replaceInsert(template, 'html/body-section.html', bodySection)
    template = replaceInsert(template, 'html/features-section.html', featuresSection)
    template = replaceInsert(template, 'html/uniform-section.html', uniformSection)
    template = replaceInsert(template, 'html/hair-section.html', hairSection)
    template = replaceInsert(template, 'html/footer-section.html', footerSection)
    template = replaceInsert(template, 'html/dialogs.html', dialogs)

    // Write the output (to parent directory)
    writeFile('../index.html', template)

    console.log('✓ index.html built successfully')
}

// Run the build
try {
    buildIndexHTML()
} catch (error) {
    console.error('Build failed:', error.message)
    process.exit(1)
}
