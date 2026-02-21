import { test, expect } from '@playwright/test'

test.describe('Ear Jewelry Bug Reproduction', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('character')
    })

    test('Denobulan from Human should have ear jewelry options', async ({ page }) => {
        // Start from Human (default)
        await page.selectOption('#body-shape', { label: 'Human' })
        await page.waitForTimeout(300)

        // Switch to Denobulan
        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)

        // Check if ear jewelry options are visible (not hidden)
        const bajoranEarring = page.locator('#jewelry-select option[value="bajoran-earring"]')
        const isHidden = await bajoranEarring.evaluate(el => el.hidden)
        console.log('Human -> Denobulan: bajoran-earring hidden =', isHidden)
        expect(isHidden).toBe(false)
    })

    test('Denobulan from Breen should have ear jewelry options', async ({ page }) => {
        // Start from Human (default)
        await page.selectOption('#body-shape', { label: 'Human' })
        await page.waitForTimeout(300)

        // Switch to Breen first
        await page.selectOption('#body-shape', { label: 'Breen' })
        await page.waitForTimeout(300)

        // Check ear value for Breen
        const earValueBreen = await page.locator('#ear-select').inputValue()
        console.log('Breen ear value:', earValueBreen)

        // Check has-ear-jewelry class for Breen
        const hasJewelryBreen = await page.evaluate(() => document.body.classList.contains('has-ear-jewelry'))
        console.log('Breen has-ear-jewelry:', hasJewelryBreen)

        // Switch to Denobulan
        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)

        // Check ear value for Denobulan
        const earValueDenobulan = await page.locator('#ear-select').inputValue()
        console.log('Denobulan ear value:', earValueDenobulan)

        // Check has-ear-jewelry class for Denobulan
        const hasJewelryDenobulan = await page.evaluate(() => document.body.classList.contains('has-ear-jewelry'))
        console.log('Denobulan (from Breen) has-ear-jewelry:', hasJewelryDenobulan)

        // Check if ear jewelry options are visible (not hidden)
        const bajoranEarring = page.locator('#jewelry-select option[value="bajoran-earring"]')
        const isHidden = await bajoranEarring.evaluate(el => el.hidden)
        console.log('Breen -> Denobulan: bajoran-earring hidden =', isHidden)

        // This should be false (jewelry should be available for Denobulan)
        expect(isHidden).toBe(false)
    })

    test('debug: check all jewelry option states for multiple transitions', async ({ page }) => {
        const checkJewelryState = async (label) => {
            const earValue = await page.locator('#ear-select').inputValue()
            const hasJewelry = await page.evaluate(() => document.body.classList.contains('has-ear-jewelry'))
            const bajoranHidden = await page.locator('#jewelry-select option[value="bajoran-earring"]').evaluate(el => el.hidden)
            const bodyClasses = await page.evaluate(() => document.body.className)
            console.log(`${label}: ear=${earValue}, has-ear-jewelry=${hasJewelry}, bajoran-earring-hidden=${bajoranHidden}, classes=${bodyClasses}`)
            return { earValue, hasJewelry, bajoranHidden }
        }

        // Human (default)
        await page.selectOption('#body-shape', { label: 'Human' })
        await page.waitForTimeout(300)
        const humanState = await checkJewelryState('Human')

        // Breen
        await page.selectOption('#body-shape', { label: 'Breen' })
        await page.waitForTimeout(300)
        const breenState = await checkJewelryState('Breen')

        // Denobulan (from Breen)
        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)
        const denobulanFromBreenState = await checkJewelryState('Denobulan (from Breen)')

        // Go back to Human
        await page.selectOption('#body-shape', { label: 'Human' })
        await page.waitForTimeout(300)
        await checkJewelryState('Human again')

        // Denobulan (from Human)
        await page.selectOption('#body-shape', { label: 'Denobulan' })
        await page.waitForTimeout(300)
        const denobulanFromHumanState = await checkJewelryState('Denobulan (from Human)')

        // Both Denobulan states should be the same
        console.log('\n--- COMPARISON ---')
        console.log(`Denobulan from Breen: ear=${denobulanFromBreenState.earValue}, jewelry-hidden=${denobulanFromBreenState.bajoranHidden}`)
        console.log(`Denobulan from Human: ear=${denobulanFromHumanState.earValue}, jewelry-hidden=${denobulanFromHumanState.bajoranHidden}`)
    })
})
