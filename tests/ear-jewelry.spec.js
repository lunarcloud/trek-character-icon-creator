import { test, expect } from '@playwright/test'

test.describe('Ear Jewelry Visibility Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('character')
    })

    test('Ferengi to Denobulan should show ear jewelry options', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await page.waitForTimeout(300)
        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)

        const hasJewelry = await page.evaluate(() =>
            document.body.classList.contains('has-ear-jewelry'))
        expect(hasJewelry).toBe(true)

        const bajoranHidden = await page.locator(
            '#jewelry-select option[value="bajoran-earring"]'
        ).evaluate(el => el.hidden)
        expect(bajoranHidden).toBe(false)
    })

    test('Caitian to Denobulan should show ear jewelry options', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Caitian / Kzinti' })
        await page.waitForTimeout(300)
        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)

        const hasJewelry = await page.evaluate(() =>
            document.body.classList.contains('has-ear-jewelry'))
        expect(hasJewelry).toBe(true)

        const bajoranHidden = await page.locator(
            '#jewelry-select option[value="bajoran-earring"]'
        ).evaluate(el => el.hidden)
        expect(bajoranHidden).toBe(false)
    })

    test('Caitian to Denobulan should not retain cat-ears class', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Caitian / Kzinti' })
        await page.waitForTimeout(300)
        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)

        const hasCatEars = await page.evaluate(() =>
            document.body.classList.contains('cat-ears'))
        expect(hasCatEars).toBe(false)
    })

    test('Ferengi should not have ear jewelry', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await page.waitForTimeout(300)

        const hasJewelry = await page.evaluate(() =>
            document.body.classList.contains('has-ear-jewelry'))
        expect(hasJewelry).toBe(false)
    })

    test('Caitian should not have ear jewelry', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Caitian / Kzinti' })
        await page.waitForTimeout(300)

        const hasJewelry = await page.evaluate(() =>
            document.body.classList.contains('has-ear-jewelry'))
        expect(hasJewelry).toBe(false)
    })

    test('Human should have ear jewelry', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Human' })
        await page.waitForTimeout(300)

        const hasJewelry = await page.evaluate(() =>
            document.body.classList.contains('has-ear-jewelry'))
        expect(hasJewelry).toBe(true)
    })

    test('Denobulan to Ferengi should not have ear jewelry', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await page.waitForTimeout(300)

        const hasJewelry = await page.evaluate(() =>
            document.body.classList.contains('has-ear-jewelry'))
        expect(hasJewelry).toBe(false)
    })
})
