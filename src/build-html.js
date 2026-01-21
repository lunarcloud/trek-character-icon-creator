#!/usr/bin/env node
/**
 * Build script to assemble index.html from HTML partials.
 * This is a minimal build tool that concatenates HTML fragments into the main index.html file.
 * Also copies external dependencies to the js/lib directory.
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'fs'
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

    const indent = match[2].length // match[2] is just the spaces, not including newline
    const indentedContent = indentContent(content, indent)

    // Replace the comment but keep the newline if there was one
    return template.replace(regex, match[1] + indentedContent)
}

/**
 * Find all INSERT comments in the template.
 * @param {string} template - The template string
 * @returns {string[]} Array of filenames found in INSERT comments
 */
function findInsertComments (template) {
    const insertRegex = /<!-- INSERT: ([^\s]+) -->/g
    const matches = []
    let match

    while ((match = insertRegex.exec(template)) !== null) {
        matches.push(match[1])
    }

    return matches
}

/**
 * Copy external dependencies to js/lib directory.
 * This replaces the functionality of copy-deps.sh script.
 */
function copyDependencies () {
    console.log('Copying external dependencies...')

    const libDir = join(__dirname, '..', 'js', 'lib')
    const nodeModulesDir = join(__dirname, '..', 'node_modules')

    // Remove existing lib directory if it exists
    try {
        rmSync(libDir, { recursive: true, force: true })
    } catch (error) {
        // Ignore errors if directory doesn't exist
    }

    // Create lib directory
    try {
        mkdirSync(libDir, { recursive: true })
    } catch (error) {
        console.error(`Error creating lib directory: ${error.message}`)
        process.exit(1)
    }

    // Copy html2canvas
    try {
        const html2canvasSrc = join(nodeModulesDir, 'html2canvas', 'dist', 'html2canvas.esm.js')
        const html2canvasDest = join(libDir, 'html2canvas.esm.js')
        cpSync(html2canvasSrc, html2canvasDest)
        console.log('  ✓ Copied html2canvas.esm.js')
    } catch (error) {
        console.error(`Error copying html2canvas: ${error.message}`)
        process.exit(1)
    }

    // Copy external-svg-loader
    try {
        const svgLoaderSrc = join(nodeModulesDir, 'external-svg-loader', 'svg-loader.min.js')
        const svgLoaderDest = join(libDir, 'svg-loader.min.js')
        cpSync(svgLoaderSrc, svgLoaderDest)
        console.log('  ✓ Copied svg-loader.min.js')
    } catch (error) {
        console.error(`Error copying external-svg-loader: ${error.message}`)
        process.exit(1)
    }

    console.log('✓ Dependencies copied successfully')
}

/**
 * Build the index.html file by assembling HTML partials.
 */
function buildIndexHTML () {
    console.log('Building index.html from partials...')

    // Read the template
    let template = readFile('index.template.html')

    // Find all INSERT comments in the template
    const insertFiles = findInsertComments(template)

    // Process each INSERT comment
    for (const filename of insertFiles) {
        try {
            const content = readFile(filename)
            template = replaceInsert(template, filename, content)
        } catch (error) {
            console.error(`Error reading ${filename}: ${error.message}`)
            process.exit(1)
        }
    }

    // Write the output (to parent directory)
    writeFile('../index.html', template)

    console.log('✓ index.html built successfully')
}

// Run the build
try {
    copyDependencies()
    buildIndexHTML()
} catch (error) {
    console.error('Build failed:', error.message)
    process.exit(1)
}
