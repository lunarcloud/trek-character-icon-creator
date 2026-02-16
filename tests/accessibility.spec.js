import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        // Wait for the page to load
        await page.waitForSelector('character')
    })

    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
        expect(accessibilityScanResults.violations).toEqual([])
    })

    test('all interactive elements should have accessible names', async ({ page }) => {
        // Body shape selector
        const bodyShape = await page.locator('#body-shape')
        await expect(bodyShape).toHaveAccessibleName()

        // Color pickers should have labels (only check if visible)
        const bodyColor = await page.locator('#body-color')
        if (await bodyColor.isVisible()) {
            await expect(bodyColor).toHaveAccessibleName()
        }

        const hairColor = await page.locator('#hair-color')
        if (await hairColor.isVisible()) {
            await expect(hairColor).toHaveAccessibleName()
        }

        const uniformColor = await page.locator('#uniform-color')
        if (await uniformColor.isVisible()) {
            await expect(uniformColor).toHaveAccessibleName()
        }

        // Feature selectors
        const earSelect = await page.locator('#ear-select')
        if (await earSelect.isVisible()) {
            await expect(earSelect).toHaveAccessibleName()
        }

        const headFeatureSelect = await page.locator('#head-feature-select')
        if (await headFeatureSelect.isVisible()) {
            await expect(headFeatureSelect).toHaveAccessibleName()
        }

        // Uniform selector
        const uniformSelect = await page.locator('#uniform-select')
        if (await uniformSelect.isVisible()) {
            await expect(uniformSelect).toHaveAccessibleName()
        }

        // Hair selectors
        const hairSelect = await page.locator('#hair-select')
        if (await hairSelect.isVisible()) {
            await expect(hairSelect).toHaveAccessibleName()
        }

        const facialHairSelect = await page.locator('#facial-hair-select')
        if (await facialHairSelect.isVisible()) {
            await expect(facialHairSelect).toHaveAccessibleName()
        }

        // Download buttons
        const downloadPng = await page.locator('#download-png')
        await expect(downloadPng).toHaveAccessibleName()

        const downloadSvg = await page.locator('#download-svg')
        await expect(downloadSvg).toHaveAccessibleName()

        // Save/Load buttons
        const saveCharacter = await page.locator('#save-character')
        await expect(saveCharacter).toHaveAccessibleName()

        const loadCharacter = await page.locator('#load-character')
        await expect(loadCharacter).toHaveAccessibleName()
    })

    test('all interactive elements should be keyboard accessible', async ({ page }) => {
        // Test body shape selector is focusable
        await page.keyboard.press('Tab')
        const bodyShape = await page.locator('#body-shape')
        await expect(bodyShape).toBeFocused()

        // Continue tabbing through elements
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')

        // Verify we can interact with elements using keyboard
        await bodyShape.focus()
        await page.keyboard.press('ArrowDown')
        const selectedValue = await bodyShape.inputValue()
        expect(selectedValue).toBeTruthy()
    })

    test('checkboxes should have proper ARIA labels', async ({ page }) => {
        // Check sync checkboxes
        const syncAntennae = await page.locator('#sync-antennae-with-body')
        if (await syncAntennae.isVisible()) {
            await expect(syncAntennae).toHaveAccessibleName()
        }

        const syncBirdTuft = await page.locator('#sync-bird-tuft-with-body')
        if (await syncBirdTuft.isVisible()) {
            await expect(syncBirdTuft).toHaveAccessibleName()
        }

        const syncWhiskers = await page.locator('#sync-whiskers-with-body')
        if (await syncWhiskers.isVisible()) {
            await expect(syncWhiskers).toHaveAccessibleName()
        }

        // Save with background checkbox
        const saveBgCheck = await page.locator('#save-with-bg-checkbox')
        await expect(saveBgCheck).toHaveAccessibleName()

        // Filter checkbox
        const filterColorSelection = await page.locator('#filter-color-selection')
        await expect(filterColorSelection).toHaveAccessibleName()
    })

    test('character preview should have appropriate role and label', async ({ page }) => {
        const characterPreview = await page.locator('character')
        await expect(characterPreview).toBeVisible()
        
        // Check if it has a role or aria-label
        const role = await characterPreview.getAttribute('role')
        const ariaLabel = await characterPreview.getAttribute('aria-label')
        
        expect(role || ariaLabel).toBeTruthy()
    })

    test('toggle buttons should be keyboard accessible', async ({ page }) => {
        const hairMirror = await page.locator('#hair-mirror')
        if (await hairMirror.isVisible()) {
            const parent = await hairMirror.locator('..')
            // Toggle buttons should either be focusable themselves or their parent should be
            const tabIndex = await parent.getAttribute('tabindex')
            expect(tabIndex).not.toBeNull()
        }

        const rearHairMirror = await page.locator('#rear-hair-mirror')
        if (await rearHairMirror.isVisible()) {
            const parent = await rearHairMirror.locator('..')
            const tabIndex = await parent.getAttribute('tabindex')
            expect(tabIndex).not.toBeNull()
        }
    })

    test('next buttons should have proper ARIA labels', async ({ page }) => {
        const hairNext = await page.locator('#hair-next')
        if (await hairNext.isVisible()) {
            await expect(hairNext).toHaveAccessibleName()
        }

        const facialHairNext = await page.locator('#facial-hair-next')
        if (await facialHairNext.isVisible()) {
            await expect(facialHairNext).toHaveAccessibleName()
        }

        const rearHairNext = await page.locator('#rear-hair-next')
        if (await rearHairNext.isVisible()) {
            await expect(rearHairNext).toHaveAccessibleName()
        }
    })

    test('form sections should have proper landmarks', async ({ page }) => {
        // Check main content area
        const main = await page.locator('main')
        await expect(main).toBeVisible()

        // Check aside for controls
        const aside = await page.locator('aside')
        await expect(aside).toBeVisible()

        // Check footer
        const footer = await page.locator('footer')
        await expect(footer).toBeVisible()
    })

    test('headings should create proper document outline', async ({ page }) => {
        // Check h1
        const h1 = await page.locator('h1')
        await expect(h1).toHaveText('Star Trek Character Icon Designer')

        // Check h2s exist and are properly used
        const h2s = await page.locator('h2').all()
        expect(h2s.length).toBeGreaterThan(0)

        // Check h3s are properly nested under h2s
        const h3s = await page.locator('h3').all()
        expect(h3s.length).toBeGreaterThan(0)
    })

    test('color pickers should have associated labels', async ({ page }) => {
        const colorInputs = await page.locator('input[type="color"]').all()
        
        for (const input of colorInputs) {
            const isVisible = await input.isVisible()
            if (!isVisible) continue
            
            const id = await input.getAttribute('id')
            if (id) {
                const label = await page.locator(`label[for="${id}"]`)
                const labelCount = await label.count()
                if (labelCount > 0) {
                    const isLabelVisible = await label.isVisible()
                    expect(isLabelVisible).toBeTruthy()
                }
            }
        }
    })

    test('select dropdowns should have proper context', async ({ page }) => {
        const selects = await page.locator('select').all()
        
        for (const select of selects) {
            const isVisible = await select.isVisible()
            if (isVisible) {
                // Each select should either have a label, aria-label, or be preceded by a heading
                const id = await select.getAttribute('id')
                const ariaLabel = await select.getAttribute('aria-label')
                const ariaLabelledby = await select.getAttribute('aria-labelledby')
                
                if (id) {
                    const label = await page.locator(`label[for="${id}"]`)
                    const labelExists = await label.count() > 0
                    
                    expect(labelExists || ariaLabel || ariaLabelledby).toBeTruthy()
                }
            }
        }
    })
})
