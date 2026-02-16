import { test, expect } from '@playwright/test'

test.describe('Tooltip Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8765')
        // Wait for JavaScript to fully initialize
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(1500)
    })

    test('body type options should have tooltips', async ({ page }) => {
        const bodyShapeSelect = page.locator('#body-shape')

        // Check that tooltips exist
        const humanoidTooltip = await bodyShapeSelect.locator('option[value="humanoid"]').getAttribute('title')
        expect(humanoidTooltip).toBeTruthy()
        expect(humanoidTooltip).toContain('bipedal')

        const cetaceousTooltip = await bodyShapeSelect.locator('option[value="cetaceous"]').getAttribute('title')
        expect(cetaceousTooltip).toBeTruthy()
        expect(cetaceousTooltip).toContain('dolphin')

        const medusanTooltip = await bodyShapeSelect.locator('option[value="medusan"]').getAttribute('title')
        expect(medusanTooltip).toBeTruthy()
        expect(medusanTooltip).toContain('energy beings')
    })

    test('ear type options should have tooltips', async ({ page }) => {
        const earSelect = page.locator('#ear-select')

        const roundTooltip = await earSelect.locator('option[value="round"]').getAttribute('title')
        expect(roundTooltip).toBeTruthy()
        expect(roundTooltip).toContain('human')

        const pointyTooltip = await earSelect.locator('option[value="pointy"]').getAttribute('title')
        expect(pointyTooltip).toBeTruthy()
        expect(pointyTooltip).toContain('Vulcan')
    })

    test('head features should have tooltips', async ({ page }) => {
        const headFeatureSelect = page.locator('#head-feature-select')

        const antennaeTooltip = await headFeatureSelect.locator('option[value="andorian-antennae"]').getAttribute('title')
        expect(antennaeTooltip).toBeTruthy()
        expect(antennaeTooltip).toContain('Andorian')

        const trillTooltip = await headFeatureSelect.locator('option[value="trill-spots"]').getAttribute('title')
        expect(trillTooltip).toBeTruthy()
        expect(trillTooltip).toContain('Trill')
    })

    test('uniform options should have tooltips', async ({ page }) => {
        const uniformSelect = page.locator('#uniform-select')

        const tosTooltip = await uniformSelect.locator('option[value="TOS"]').getAttribute('title')
        expect(tosTooltip).toBeTruthy()
        expect(tosTooltip).toContain('Original Series')

        const tngTooltip = await uniformSelect.locator('option[value="TNG"]').getAttribute('title')
        expect(tngTooltip).toBeTruthy()
        expect(tngTooltip).toContain('Next Generation')
    })

    test('department color options should have tooltips', async ({ page }) => {
        const colorSelect = page.locator('#std-uniform-colors')

        // Get all options and find Command
        const commandOption = colorSelect.locator('option').filter({ hasText: 'Command' }).first()
        const commandTooltip = await commandOption.getAttribute('title')
        expect(commandTooltip).toBeTruthy()
        expect(commandTooltip).toContain('Command')
    })

    test('eyewear options should have tooltips', async ({ page }) => {
        const eyewearSelect = page.locator('#eyewear-select')

        const visorTooltip = await eyewearSelect.locator('option[value="visor"]').getAttribute('title')
        expect(visorTooltip).toBeTruthy()
        expect(visorTooltip).toContain('La Forge')
    })
})
