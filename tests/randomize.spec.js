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

    test('randomize should allow Custom humanoid with small chance', async ({ page }) => {
        // Custom humanoid has a small weight, so it should be possible but rare
        for (let i = 0; i < 20; i++) {
            await page.click('#randomize-character')
            await page.waitForTimeout(100)
            const selectedOption = page.locator('#body-shape option:checked')
            const specify = await selectedOption.getAttribute('specify')
            const value = await selectedOption.getAttribute('value')
            // All selections should be valid body types
            expect(value).toBeTruthy()
            // If custom humanoid (no specify), ears should be randomized (any valid value)
            if (value === 'humanoid' && !specify) {
                const earValue = await page.locator('#ear-select').inputValue()
                expect(earValue).toBeTruthy()
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

    test('randomize should enforce species-specific ears for Vulcan', async ({ page }) => {
        // Click randomize until we get a Vulcan
        let gotVulcan = false
        for (let i = 0; i < 50; i++) {
            await page.click('#randomize-character')
            await page.waitForTimeout(200)
            const specify = await page.locator('#body-shape option:checked').getAttribute('specify')
            if (specify === 'vulcan') {
                gotVulcan = true
                break
            }
        }

        if (gotVulcan) {
            const earValue = await page.locator('#ear-select').inputValue()
            expect(earValue).toBe('pointy')
        }
    })

    test('randomize should not randomize ears for non-custom humanoid species', async ({ page }) => {
        // Click randomize many times and verify species-standard ears
        for (let i = 0; i < 30; i++) {
            await page.click('#randomize-character')
            await page.waitForTimeout(200)
            const selectedOption = page.locator('#body-shape option:checked')
            const specify = await selectedOption.getAttribute('specify')
            const value = await selectedOption.getAttribute('value')

            // Only check humanoid species with a specify value
            if (value !== 'humanoid' || !specify) continue

            const earValue = await page.locator('#ear-select').inputValue()

            // Verify species-standard ears are used
            if (specify === 'vulcan') {
                expect(earValue).toBe('pointy')
            } else if (specify === 'cat') {
                expect(earValue).toBe('cat')
            } else if (specify === 'ferengi') {
                expect(earValue).toBe('ferengi')
            } else if (['human', 'bajoran', 'trill', 'bolian', 'breen', 'cardassian',
                'orion', 'denobulan', 'zakdorn', 'benzite'].includes(specify)) {
                expect(earValue).toBe('round')
            }
        }
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

    test('randomize should never select Other Series uniforms', async ({ page }) => {
        const otherSeriesUniforms = [
            'Galaxy Quest Captain', 'Galaxy Quest Crew', 'Orville',
            'Stargate SG-1', 'Stargate Atlantis Early', 'Stargate Atlantis Late'
        ]
        for (let i = 0; i < 30; i++) {
            await page.click('#randomize-character')
            await page.waitForTimeout(150)
            const uniformText = await page.locator('#uniform-select option:checked').textContent()
            expect(otherSeriesUniforms).not.toContain(uniformText.trim())
        }
    })

    test('randomize should only select militia uniforms matching the species', async ({ page }) => {
        const militiaPrefixes = {
            andor: 'Andorian', breen: 'Breen', cardassian: 'Cardassian',
            ferengi: 'Ferengi', klingon: 'Klingon', orion: 'Orion', vulcan: 'Romulan'
        }
        for (let i = 0; i < 40; i++) {
            await page.click('#randomize-character')
            await page.waitForTimeout(150)
            const specify = await page.locator('#body-shape option:checked').getAttribute('specify') ?? ''
            const uniformOpt = page.locator('#uniform-select option:checked')
            const uniformText = (await uniformOpt.textContent()).trim()
            const inMilitia = await uniformOpt.evaluate(
                el => el.parentElement?.tagName === 'OPTGROUP' && el.parentElement?.label === 'Other Militia'
            )
            if (!inMilitia) continue
            // If a militia uniform was chosen, the species must match its prefix
            const expectedPrefix = militiaPrefixes[specify]
            expect(expectedPrefix).toBeTruthy()
            expect(uniformText.startsWith(expectedPrefix)).toBe(true)
        }
    })

    test('randomize should not select benzite breather for non-benzite species', async ({ page }) => {
        for (let i = 0; i < 30; i++) {
            await page.click('#randomize-character')
            await page.waitForTimeout(150)
            const specify = await page.locator('#body-shape option:checked').getAttribute('specify')
            if (specify === 'benzite') continue
            const selected = await page.locator('#jewelry-select').evaluate(
                el => Array.from(el.selectedOptions).map(o => o.value)
            )
            expect(selected).not.toContain('benzite-breather')
        }
    })

    test('randomize should not select orion head-bolting for non-orion species', async ({ page }) => {
        for (let i = 0; i < 30; i++) {
            await page.click('#randomize-character')
            await page.waitForTimeout(150)
            const specify = await page.locator('#body-shape option:checked').getAttribute('specify')
            if (specify === 'orion') continue
            const selected = await page.locator('#jewelry-select').evaluate(
                el => Array.from(el.selectedOptions).map(o => o.value)
            )
            expect(selected).not.toContain('orion-head-bolting')
        }
    })
})

test.describe('Ear-dependent jewelry visibility', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('character')
    })

    test('studs and earrings should be hidden when ears are None', async ({ page }) => {
        await page.selectOption('#ear-select', 'none')
        await page.waitForTimeout(300)
        const jewelryOptions = await page.locator('#jewelry-select option:not([hidden])').evaluateAll(
            els => els.map(el => el.value)
        )
        expect(jewelryOptions).not.toContain('bajoran-earring')
        expect(jewelryOptions).not.toContain('lower-stud-l')
        expect(jewelryOptions).not.toContain('hoop-earring-l')
    })

    test('studs and earrings should be hidden when ears are Bear', async ({ page }) => {
        await page.selectOption('#ear-select', 'bear')
        await page.waitForTimeout(300)
        const jewelryOptions = await page.locator('#jewelry-select option:not([hidden])').evaluateAll(
            els => els.map(el => el.value)
        )
        expect(jewelryOptions).not.toContain('bajoran-earring')
        expect(jewelryOptions).not.toContain('upper-stud-r')
        expect(jewelryOptions).not.toContain('upper-hoop-earring-r')
    })

    test('studs and earrings should be visible when ears are Round', async ({ page }) => {
        await page.selectOption('#ear-select', 'round')
        await page.waitForTimeout(300)
        const jewelryOptions = await page.locator('#jewelry-select option:not([hidden])').evaluateAll(
            els => els.map(el => el.value)
        )
        expect(jewelryOptions).toContain('bajoran-earring')
        expect(jewelryOptions).toContain('lower-stud-l')
        expect(jewelryOptions).toContain('hoop-earring-l')
    })
})
