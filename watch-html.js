#!/usr/bin/env node
/**
 * Watch script to rebuild index.html when HTML partials change.
 * This provides a development workflow with automatic rebuilds.
 */

import { watch } from 'fs'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Run the build script.
 */
function runBuild () {
    console.log('Change detected, rebuilding...')
    exec('node build-html.js', (error, stdout, stderr) => {
        if (error) {
            console.error('Build failed:', stderr)
            return
        }
        console.log(stdout)
    })
}

console.log('👀 Watching HTML files for changes...')
console.log('Press Ctrl+C to stop')

// Watch the template file
watch(join(__dirname, 'src'), { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.html')) {
        runBuild()
    }
})

// Watch the HTML partials directory
watch(join(__dirname, 'html'), { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.html')) {
        runBuild()
    }
})
