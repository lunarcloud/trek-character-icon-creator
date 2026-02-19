import { test, expect } from '@playwright/test'

test.describe('Species Selection Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('character')
    })

    test('body shape dropdown should have species-specific options', async ({ page }) => {
        const bodyShape = page.locator('#body-shape')
        const options = await bodyShape.locator('option').allTextContents()
        expect(options).toContain('Humanoid')
        expect(options).toContain('Human')
        expect(options).toContain('Ferengi')
        expect(options).toContain('Klingon')
        expect(options).toContain('Bird-like')
        expect(options).toContain('Cait-like')
        expect(options).toContain('Andorian / Aenar')
        expect(options).toContain('Cardassian')
        expect(options).toContain('Tellarite')
    })

    test('selecting Ferengi should force ferengi ears', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await page.waitForTimeout(200)
        const earValue = await page.locator('#ear-select').inputValue()
        expect(earValue).toBe('ferengi')
    })

    test('selecting Ferengi should auto-select ferengi-brow', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await page.waitForTimeout(200)
        const selectedFeatures = await page.locator('#head-feature-select option:checked').allTextContents()
        expect(selectedFeatures.some(f => f.includes('Ferengi Brow'))).toBeTruthy()
    })

    test('selecting Ferengi should hide bird-specific features', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await page.waitForTimeout(200)
        const birdBeak = page.locator('#head-feature-select option[value="bird-beak"]')
        expect(await birdBeak.getAttribute('hidden')).not.toBeNull()
    })

    test('selecting Klingon should auto-select a klingon feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Klingon' })
        await page.waitForTimeout(200)
        const selectedFeatures = await page.locator('#head-feature-select option:checked').allTextContents()
        expect(selectedFeatures.some(f => f.includes('Klingon') || f.includes('Bifurcated'))).toBeTruthy()
    })

    test('selecting Cait-like should force cat ears', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Cait-like' })
        await page.waitForTimeout(200)
        const earValue = await page.locator('#ear-select').inputValue()
        expect(earValue).toBe('cat')
    })

    test('selecting Bird-like should hide cat-specific features', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Bird-like' })
        await page.waitForTimeout(200)
        const catNose = page.locator('#head-feature-select option[value="cat-nose"]')
        expect(await catNose.getAttribute('hidden')).not.toBeNull()
    })

    test('selecting Bird-like should not hide shared features', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Bird-like' })
        await page.waitForTimeout(200)
        // Gills/Whiskers/Feathers is shared between bird and cat (has both specific-bird and specific-cat)
        const whiskers = page.locator('#head-feature-select option[value="gill-whiskers-or-feathers"]')
        const hidden = await whiskers.getAttribute('hidden')
        expect(hidden).toBeNull()
    })

    test('generic Humanoid should show all features', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Humanoid' })
        await page.waitForTimeout(200)
        // All species-specific features should be visible for generic humanoid
        const ferengiOption = page.locator('#head-feature-select option[value="ferengi-brow"]')
        const birdBeakOption = page.locator('#head-feature-select option[value="bird-beak"]')
        const catNoseOption = page.locator('#head-feature-select option[value="cat-nose"]')
        expect(await ferengiOption.getAttribute('hidden')).toBeNull()
        expect(await birdBeakOption.getAttribute('hidden')).toBeNull()
        expect(await catNoseOption.getAttribute('hidden')).toBeNull()
    })

    test('selecting Human should hide all species-specific features', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Human' })
        await page.waitForTimeout(200)
        const ferengiOption = page.locator('#head-feature-select option[value="ferengi-brow"]')
        const birdBeakOption = page.locator('#head-feature-select option[value="bird-beak"]')
        expect(await ferengiOption.getAttribute('hidden')).not.toBeNull()
        expect(await birdBeakOption.getAttribute('hidden')).not.toBeNull()
    })

    test('switching from Ferengi to Humanoid should show all features again', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await page.waitForTimeout(200)
        await page.selectOption('#body-shape', { label: 'Humanoid' })
        await page.waitForTimeout(200)
        const catNoseOption = page.locator('#head-feature-select option[value="cat-nose"]')
        expect(await catNoseOption.getAttribute('hidden')).toBeNull()
    })

    test('switching from Ferengi to Klingon should deselect ferengi features and select klingon', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await page.waitForTimeout(200)
        await page.selectOption('#body-shape', { label: 'Klingon' })
        await page.waitForTimeout(200)
        const selectedFeatures = await page.locator('#head-feature-select option:checked').allTextContents()
        expect(selectedFeatures.some(f => f.includes('Ferengi'))).toBeFalsy()
        expect(selectedFeatures.some(f => f.includes('Klingon') || f.includes('Bifurcated'))).toBeTruthy()
    })

    test('Andorian should auto-select andorian-antennae', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Andorian / Aenar' })
        await page.waitForTimeout(200)
        const selectedFeatures = await page.locator('#head-feature-select option:checked').allTextContents()
        expect(selectedFeatures.some(f => f.includes('Andorian Antennae'))).toBeTruthy()
    })
})
