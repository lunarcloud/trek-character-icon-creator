import { test, expect } from '@playwright/test'

test.describe('Ear Jewelry Stale Value Debug', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('character')
    })

    const checkState = async (page, label) => {
        const earValue = await page.locator('#ear-select').inputValue()
        const earVisible = await page.locator('#ear-select').isVisible()
        const hasJewelry = await page.evaluate(() => document.body.classList.contains('has-ear-jewelry'))
        const bajoranHidden = await page.locator('#jewelry-select option[value="bajoran-earring"]').evaluate(el => el.hidden)
        const bodyClasses = await page.evaluate(() => document.body.className)
        console.log(`${label}: ear=${earValue}, ear-visible=${earVisible}, has-ear-jewelry=${hasJewelry}, bajoran-hidden=${bajoranHidden}, classes=${bodyClasses}`)
        return { earValue, earVisible, hasJewelry, bajoranHidden }
    }

    test('Ferengi -> Denobulan should have ear jewelry', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await page.waitForTimeout(300)
        await checkState(page, 'Ferengi')

        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)
        const state = await checkState(page, 'Denobulan (from Ferengi)')
        
        // Denobulan should have ear jewelry
        expect(state.bajoranHidden).toBe(false)
    })

    test('Caitian -> Denobulan should have ear jewelry', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Caitian / Kzinti' })
        await page.waitForTimeout(300)
        await checkState(page, 'Caitian')

        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)
        const state = await checkState(page, 'Denobulan (from Caitian)')
        
        expect(state.bajoranHidden).toBe(false)
    })

    test('Custom with bear ears -> Denobulan should have ear jewelry', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Custom' })
        await page.waitForTimeout(200)
        await page.selectOption('#ear-select', 'bear')
        await page.waitForTimeout(300)
        await checkState(page, 'Custom (bear ears)')

        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)
        const state = await checkState(page, 'Denobulan (from Custom bear)')
        
        expect(state.bajoranHidden).toBe(false)
    })

    test('Custom with none ears -> Denobulan should have ear jewelry', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Custom' })
        await page.waitForTimeout(200)
        await page.selectOption('#ear-select', 'none')
        await page.waitForTimeout(300)
        await checkState(page, 'Custom (no ears)')

        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)
        const state = await checkState(page, 'Denobulan (from Custom none)')
        
        expect(state.bajoranHidden).toBe(false)
    })

    test('Cetaceous -> Denobulan should have ear jewelry', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Cetaceous' })
        await page.waitForTimeout(300)
        await checkState(page, 'Cetaceous')

        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)
        const state = await checkState(page, 'Denobulan (from Cetaceous)')
        
        expect(state.bajoranHidden).toBe(false)
    })

    test('Denobulan -> Ferengi ear jewelry check', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)
        await checkState(page, 'Denobulan')

        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await page.waitForTimeout(300)
        const state = await checkState(page, 'Ferengi (from Denobulan)')
        
        // Ferengi should NOT have ear jewelry (ferengi ears are in exclusion list)
        // But since ear select is hidden for Ferengi, has-ear-jewelry should be false
        console.log('Ferengi should not have ear jewelry:', !state.hasJewelry)
    })
})
