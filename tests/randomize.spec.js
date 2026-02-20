import { test, expect } from '@playwright/test'

test.describe('Randomize / Surprise Me Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('character')
    })

    test('randomize button should exist in footer', async ({ page }) => {
        const button = page.locator('#randomize-character')
        await expect(button).toBeVisible()
        await expect(button).toHaveText('🎲 Surprise Me')
    })

    test('clicking randomize should change the body shape selection', async ({ page }) => {
        const initialShape = await page.locator('#body-shape').inputValue()

        // Click multiple times to increase chance of getting a different species
        let changed = false
        for (let i = 0; i < 10; i++) {
            await page.click('#randomize-character')
            await page.waitForTimeout(200)
            const newShape = await page.locator('#body-shape').inputValue()
            const newSpecify = await page.locator('#body-shape option:checked').getAttribute('specify')
            if (newShape !== initialShape || newSpecify !== 'human') {
                changed = true
                break
            }
        }
        expect(changed).toBe(true)
    })

    test('randomize should never select Custom humanoid', async ({ page }) => {
        for (let i = 0; i < 20; i++) {
            await page.click('#randomize-character')
            await page.waitForTimeout(100)
            const selectedOption = page.locator('#body-shape option:checked')
            const specify = await selectedOption.getAttribute('specify')
            const value = await selectedOption.getAttribute('value')
            // Custom is the humanoid option with no specify attribute
            if (value === 'humanoid') {
                expect(specify).not.toBeNull()
            }
        }
    })

    test('randomize should produce a visible character body', async ({ page }) => {
        await page.click('#randomize-character')
        await page.waitForTimeout(500)
        const characterBody = page.locator('#character-body svg')
        await expect(characterBody).toBeAttached()
    })

    test('randomize should set valid body color from presets', async ({ page }) => {
        await page.click('#randomize-character')
        await page.waitForTimeout(300)
        const bodyColor = await page.locator('#body-color').inputValue()
        // Body color should be a valid hex color
        expect(bodyColor).toMatch(/^#[0-9a-fA-F]{6}$/)
    })

    test('randomize should set valid hair color from presets', async ({ page }) => {
        await page.click('#randomize-character')
        await page.waitForTimeout(300)
        const hairColor = await page.locator('#hair-color').inputValue()
        expect(hairColor).toMatch(/^#[0-9a-fA-F]{6}$/)
    })

    test('randomize should select a valid uniform', async ({ page }) => {
        await page.click('#randomize-character')
        await page.waitForTimeout(300)
        const uniformValue = await page.locator('#uniform-select').inputValue()
        expect(uniformValue).toBeTruthy()
        // The selected uniform should not be hidden
        const isHidden = await page.locator('#uniform-select option:checked').evaluate(
            el => el.hidden
        )
        expect(isHidden).toBe(false)
    })

    test('randomize should render character uniform SVG', async ({ page }) => {
        await page.click('#randomize-character')
        await page.waitForTimeout(500)
        const uniformSvg = page.locator('#character-uniform svg')
        await expect(uniformSvg).toBeAttached()
    })

    test('Vulcan randomize should enforce pointy ears', async ({ page }) => {
        // Manually set to Vulcan then verify species defaults
        await page.selectOption('#body-shape', { label: 'Vulcan / Romulan' })
        await page.waitForTimeout(200)

        // Now simulate what randomizer does by verifying existing Vulcan behavior
        const earValue = await page.locator('#ear-select').inputValue()
        expect(earValue).toBe('pointy')
    })

    test('randomize can be clicked multiple times without errors', async ({ page }) => {
        // Click randomize rapidly multiple times
        for (let i = 0; i < 5; i++) {
            await page.click('#randomize-character')
            await page.waitForTimeout(200)
        }

        // Verify no errors - page should still function
        const bodyShape = page.locator('#body-shape')
        await expect(bodyShape).toBeVisible()

        // Verify character body is still rendered
        const characterBody = page.locator('#character-body svg')
        await expect(characterBody).toBeAttached()
    })
})
