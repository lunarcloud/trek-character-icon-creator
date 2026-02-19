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
        expect(options).toContain('Cat-like')
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

    test('selecting Ferengi should render ferengi-brow as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        // The ferengi-brow SVG should be rendered in the character head features
        const ferengiSvg = page.locator('#character-head-features svg[data-src*="ferengi-brow"]')
        await expect(ferengiSvg).toBeAttached()
    })

    test('selecting Ferengi should hide bird-specific features', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await page.waitForTimeout(200)
        const birdBeak = page.locator('#head-feature-select option[value="bird-beak"]')
        expect(await birdBeak.getAttribute('hidden')).not.toBeNull()
    })

    test('selecting Klingon should show ridges dropdown', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Klingon' })
        await page.waitForTimeout(200)
        const ridgesSelect = page.locator('#klingon-ridges-select')
        await expect(ridgesSelect).toBeVisible()
    })

    test('selecting Klingon should render klingon ridges as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Klingon' })
        const klingonSvg = page.locator('#character-head-features svg[data-src*="klingon-ridges"]')
        await expect(klingonSvg).toBeAttached()
    })

    test('selecting Cat-like should force cat ears', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Cat-like' })
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

    test('selecting Bird-like should render whiskers as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Bird-like' })
        const whiskersSvg = page.locator('#character-head-features svg[data-src*="gill-whiskers-or-feathers"]')
        await expect(whiskersSvg).toBeAttached()
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

    test('Cardassian should render both forehead and neck as forced features', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Cardassian' })
        const foreheadSvg = page.locator('#character-head-features svg[data-src*="cardassian-forehead"]')
        const neckSvg = page.locator('#character-head-features svg[data-src*="cardassian-neck"]')
        await expect(foreheadSvg).toBeAttached()
        await expect(neckSvg).toBeAttached()
    })

    test('Andorian should render andorian-antennae as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Andorian / Aenar' })
        const antennaeSvg = page.locator('#character-head-features svg[data-src*="andorian-antennae"]')
        await expect(antennaeSvg).toBeAttached()
    })

    test('Tellarite should show nose dropdown', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Tellarite' })
        await page.waitForTimeout(200)
        const noseSelect = page.locator('#tellarite-nose-select')
        await expect(noseSelect).toBeVisible()
    })

    test('Tellarite should render selected nose as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Tellarite' })
        const noseSvg = page.locator('#character-head-features svg[data-src*="tellarite-nose"]')
        await expect(noseSvg).toBeAttached()
    })

    test('forced features should be hidden from head-feature-select for specified humanoids', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await page.waitForTimeout(200)
        // Ferengi brow should be hidden (forced, not selectable)
        const ferengiBrow = page.locator('#head-feature-select option[value="ferengi-brow"]')
        expect(await ferengiBrow.getAttribute('hidden')).not.toBeNull()
    })

    test('Klingon ridges dropdown should not be visible for non-klingons', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Humanoid' })
        await page.waitForTimeout(200)
        const ridgesSelect = page.locator('#klingon-ridges-select')
        await expect(ridgesSelect).not.toBeVisible()
    })

    test('body color should be filtered for Andorian', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Andorian / Aenar' })
        await page.waitForTimeout(200)
        // Only andor-relevant colors should be visible
        const andorianOption = page.locator('#std-body-colors option[value="#41AACC"]')
        expect(await andorianOption.getAttribute('hidden')).toBeNull()
    })

    test('body color should not be filtered for generic Humanoid', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Humanoid' })
        await page.waitForTimeout(200)
        // All colors should be visible
        const andorianOption = page.locator('#std-body-colors option[value="#41AACC"]')
        expect(await andorianOption.getAttribute('hidden')).toBeNull()
        const humanOption = page.locator('#std-body-colors option[value="#FEE4B3"]')
        expect(await humanOption.getAttribute('hidden')).toBeNull()
    })
})
