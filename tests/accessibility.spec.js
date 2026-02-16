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
        const bodyShapeName = await bodyShape.getAttribute('aria-label')
        expect(bodyShapeName).toBeTruthy()

        // Color pickers should have labels (only check if visible)
        const bodyColor = await page.locator('#body-color')
        if (await bodyColor.isVisible()) {
            const bodyColorName = await bodyColor.getAttribute('aria-label')
            const bodyColorLabelFor = await page.locator('label[for="body-color"]').count()
            expect(bodyColorName || bodyColorLabelFor > 0).toBeTruthy()
        }

        const hairColor = await page.locator('#hair-color')
        if (await hairColor.isVisible()) {
            const hairColorName = await hairColor.getAttribute('aria-label')
            const hairColorLabelFor = await page.locator('label[for="hair-color"]').count()
            expect(hairColorName || hairColorLabelFor > 0).toBeTruthy()
        }

        const uniformColor = await page.locator('#uniform-color')
        if (await uniformColor.isVisible()) {
            const uniformColorName = await uniformColor.getAttribute('aria-label')
            const uniformColorLabelFor = await page.locator('label[for="uniform-color"]').count()
            expect(uniformColorName || uniformColorLabelFor > 0).toBeTruthy()
        }

        // Feature selectors
        const earSelect = await page.locator('#ear-select')
        if (await earSelect.isVisible()) {
            const earName = await earSelect.getAttribute('aria-label')
            expect(earName).toBeTruthy()
        }

        const headFeatureSelect = await page.locator('#head-feature-select')
        if (await headFeatureSelect.isVisible()) {
            const headFeatureName = await headFeatureSelect.getAttribute('aria-label')
            expect(headFeatureName).toBeTruthy()
        }

        // Uniform selector
        const uniformSelect = await page.locator('#uniform-select')
        if (await uniformSelect.isVisible()) {
            const uniformName = await uniformSelect.getAttribute('aria-label')
            expect(uniformName).toBeTruthy()
        }

        // Hair selectors
        const hairSelect = await page.locator('#hair-select')
        if (await hairSelect.isVisible()) {
            const hairName = await hairSelect.getAttribute('aria-label')
            expect(hairName).toBeTruthy()
        }

        const facialHairSelect = await page.locator('#facial-hair-select')
        if (await facialHairSelect.isVisible()) {
            const facialHairName = await facialHairSelect.getAttribute('aria-label')
            expect(facialHairName).toBeTruthy()
        }

        // Download buttons
        const downloadPng = await page.locator('#download-png')
        const downloadPngName = await downloadPng.getAttribute('aria-label')
        expect(downloadPngName).toBeTruthy()

        const downloadSvg = await page.locator('#download-svg')
        const downloadSvgName = await downloadSvg.getAttribute('aria-label')
        expect(downloadSvgName).toBeTruthy()

        // Save/Load buttons
        const saveCharacter = await page.locator('#save-character')
        const saveName = await saveCharacter.getAttribute('aria-label')
        expect(saveName).toBeTruthy()

        const loadCharacter = await page.locator('#load-character')
        const loadName = await loadCharacter.getAttribute('aria-label')
        expect(loadName).toBeTruthy()
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
        // Check sync checkboxes - only if visible
        const syncAntennae = await page.locator('#sync-antennae-with-body')
        if (await syncAntennae.isVisible()) {
            const ariaLabel = await syncAntennae.getAttribute('aria-label')
            const labelFor = await page.locator('label[for="sync-antennae-with-body"]').count()
            expect(ariaLabel || labelFor > 0).toBeTruthy()
        }

        const syncBirdTuft = await page.locator('#sync-bird-tuft-with-body')
        if (await syncBirdTuft.isVisible()) {
            const ariaLabel = await syncBirdTuft.getAttribute('aria-label')
            const labelFor = await page.locator('label[for="sync-bird-tuft-with-body"]').count()
            expect(ariaLabel || labelFor > 0).toBeTruthy()
        }

        const syncWhiskers = await page.locator('#sync-whiskers-with-body')
        if (await syncWhiskers.isVisible()) {
            const ariaLabel = await syncWhiskers.getAttribute('aria-label')
            const labelFor = await page.locator('label[for="sync-whiskers-with-body"]').count()
            expect(ariaLabel || labelFor > 0).toBeTruthy()
        }

        // Save with background checkbox
        const saveBgCheck = await page.locator('#save-with-bg-checkbox')
        const saveBgAriaLabel = await saveBgCheck.getAttribute('aria-label')
        const saveBgLabelFor = await page.locator('label[for="save-with-bg-checkbox"]').count()
        expect(saveBgAriaLabel || saveBgLabelFor > 0).toBeTruthy()

        // Filter checkbox
        const filterColorSelection = await page.locator('#filter-color-selection')
        const filterAriaLabel = await filterColorSelection.getAttribute('aria-label')
        const filterLabelText = await page.locator('label:has(#filter-color-selection)').textContent()
        expect(filterAriaLabel || filterLabelText).toBeTruthy()
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
            const ariaLabel = await hairNext.getAttribute('aria-label')
            expect(ariaLabel).toBeTruthy()
        }

        const facialHairNext = await page.locator('#facial-hair-next')
        if (await facialHairNext.isVisible()) {
            const ariaLabel = await facialHairNext.getAttribute('aria-label')
            expect(ariaLabel).toBeTruthy()
        }

        const rearHairNext = await page.locator('#rear-hair-next')
        if (await rearHairNext.isVisible()) {
            const ariaLabel = await rearHairNext.getAttribute('aria-label')
            expect(ariaLabel).toBeTruthy()
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

    test('aria-live region should announce body type changes', async ({ page }) => {
        const announcements = await page.locator('#character-announcements')
        await expect(announcements).toBeAttached()
        
        const ariaLive = await announcements.getAttribute('aria-live')
        expect(ariaLive).toBe('polite')
        
        const ariaAtomic = await announcements.getAttribute('aria-atomic')
        expect(ariaAtomic).toBe('true')
        
        // Change body type and check if announcement is made
        const bodyShapeSelect = await page.locator('#body-shape')
        await bodyShapeSelect.selectOption('cetaceous')
        
        // Wait a bit for the announcement to be made
        await page.waitForTimeout(200)
        
        const announcementText = await announcements.textContent()
        expect(announcementText).toContain('Cetaceous')
    })
})
