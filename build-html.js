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
    const indent = ' '.repeat(spaces)
    return content.split('\n').map(line => line ? indent + line : line).join('\n')
}

/**
 * Build the index.html file by assembling HTML partials.
 */
function buildIndexHTML () {
    console.log('Building index.html from partials...')

    // Read the template
    const template = readFile('src/index.template.html')

    // Read all partials
    const bodySection = readFile('html/body-section.html')
    const featuresSection = readFile('html/features-section.html')
    const uniformSection = readFile('html/uniform-section.html')
    const hairSection = readFile('html/hair-section.html')
    const dialogs = readFile('html/dialogs.html')

    // Replace placeholders with actual content (with proper indentation)
    let output = template
        .replace('<!-- INSERT: html/body-section.html -->', indentContent(bodySection, 12))
        .replace('<!-- INSERT: html/features-section.html -->', indentContent(featuresSection, 12))
        .replace('<!-- INSERT: html/uniform-section.html -->', indentContent(uniformSection, 12))
        .replace('<!-- INSERT: html/hair-section.html -->', indentContent(hairSection, 12))
        .replace('<!-- INSERT: html/dialogs.html -->', indentContent(dialogs, 8))

    // Write the output
    writeFile('index.html', output)

    console.log('✓ index.html built successfully')
}

// Run the build
try {
    buildIndexHTML()
} catch (error) {
    console.error('Build failed:', error.message)
    process.exit(1)
}
