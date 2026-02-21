import { test, expect } from '@playwright/test'

test.describe('Species Selection Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('character')
    })

    test('body shape dropdown should have all species-specific options', async ({ page }) => {
        const bodyShape = page.locator('#body-shape')
        const options = await bodyShape.locator('option').allTextContents()
        expect(options).toContain('Custom')
        expect(options).toContain('Human')
        expect(options).toContain('Ferengi')
        expect(options).toContain('Klingon')
        expect(options).toContain('Orion')
        expect(options).toContain('Klowahkan / Aurelian')
        expect(options).toContain('Caitian / Kzinti')
        expect(options).toContain('Andorian / Aenar')
        expect(options).toContain('Bajoran')
        expect(options).toContain('Benzite')
        expect(options).toContain('Bolian')
        expect(options).toContain('Breen')
        expect(options).toContain('Cardassian')
        expect(options).toContain('Denobulan')
        expect(options).toContain('Kelpien')
        expect(options).toContain('Tellarite')
        expect(options).toContain('Tilikaal')
        expect(options).toContain('Trill')
        expect(options).toContain('VinShari')
        expect(options).toContain('Vulcan / Romulan / Kellerun')
        expect(options).toContain('Zakdorn')
    })

    test('selecting Ferengi should force ferengi ears', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await expect(page.locator('#ear-select')).toHaveValue('ferengi')
    })

    test('selecting Ferengi should render ferengi-brow as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        const ferengiSvg = page.locator('#character-head-features svg[data-src*="ferengi-brow"]')
        await expect(ferengiSvg).toBeAttached()
    })

    test('selecting Ferengi should hide bird-specific features', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await expect(page.locator('#head-feature-select option[value="bird-beak"]')).toHaveJSProperty('hidden', true)
    })

    test('selecting Ferengi should hide ears dropdown', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Ferengi' })
        await expect(page.locator('#ear-select')).not.toBeVisible()
    })

    test('selecting Klingon should show ridges dropdown', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Klingon' })
        await expect(page.locator('#klingon-ridges-select')).toBeVisible()
    })

    test('selecting Klingon should render klingon ridges as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Klingon' })
        const klingonSvg = page.locator('#character-head-features svg[data-src*="klingon-ridges"]')
        await expect(klingonSvg).toBeAttached()
    })

    test('selecting Caitian / Kzinti should force cat ears', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Caitian / Kzinti' })
        await expect(page.locator('#ear-select')).toHaveValue('cat')
    })

    test('selecting Aurelian should hide cat-specific features', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Klowahkan / Aurelian' })
        await expect(page.locator('#head-feature-select option[value="cat-nose"]')).toHaveJSProperty('hidden', true)
    })

    test('selecting Aurelian should render whiskers as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Klowahkan / Aurelian' })
        const whiskersSvg = page.locator('#character-head-features svg[data-src*="gill-whiskers-or-feathers"]')
        await expect(whiskersSvg).toBeAttached()
    })

    test('Custom Humanoid should have no duplicate body color options', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Custom' })
        await expect(page.locator('#head-feature-select')).toBeVisible()
        const visibleValues = await page.locator('#std-body-colors option:not([hidden])').evaluateAll(
            els => els.filter(el => !el.closest('optgroup[hidden]') && el.value !== 'custom')
                .map(el => el.value)
        )
        const uniqueValues = new Set(visibleValues)
        expect(visibleValues.length).toBe(uniqueValues.size)
    })

    test('Custom Humanoid should show all features', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Custom' })
        await expect(page.locator('#head-feature-select option[value="ferengi-brow"]')).toHaveJSProperty('hidden', false)
        await expect(page.locator('#head-feature-select option[value="bird-beak"]')).toHaveJSProperty('hidden', false)
        await expect(page.locator('#head-feature-select option[value="cat-nose"]')).toHaveJSProperty('hidden', false)
    })

    test('selecting Human should hide all species-specific features', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Human' })
        await expect(page.locator('#head-feature-select option[value="ferengi-brow"]')).toHaveJSProperty('hidden', true)
        await expect(page.locator('#head-feature-select option[value="bird-beak"]')).toHaveJSProperty('hidden', true)
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
        await expect(page.locator('#tellarite-nose-select')).toBeVisible()
    })

    test('Tellarite should render selected nose as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Tellarite' })
        const noseSvg = page.locator('#character-head-features svg[data-src*="tellarite-nose"]')
        await expect(noseSvg).toBeAttached()
    })

    test('Vulcan should force pointy ears', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Vulcan / Romulan / Kellerun' })
        await expect(page.locator('#ear-select')).toHaveValue('pointy')
    })

    test('Bolian should render bolian-line as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Bolian' })
        const bolianSvg = page.locator('#character-head-features svg[data-src*="bolian-line"]')
        await expect(bolianSvg).toBeAttached()
    })

    test('Trill should render trill-spots as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Trill' })
        const trillSvg = page.locator('#character-head-features svg[data-src*="trill-spots"]')
        await expect(trillSvg).toBeAttached()
    })

    test('Bajoran should render nose-ridges as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Bajoran' })
        const bajoranSvg = page.locator('#character-head-features svg[data-src*="nose-ridges"]')
        await expect(bajoranSvg).toBeAttached()
    })

    test('Benzite should render benzite-nose as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Benzite' })
        const benziteSvg = page.locator('#character-head-features svg[data-src*="benzite-nose"]')
        await expect(benziteSvg).toBeAttached()
    })

    test('Denobulan should render denobulan-ridges as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Denobulan' })
        const denobulanSvg = page.locator('#character-head-features svg[data-src*="denobulan-ridges"]')
        await expect(denobulanSvg).toBeAttached()
    })

    test('Zakdorn should render zakdorn-cheeks as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Zakdorn' })
        const zakdornSvg = page.locator('#character-head-features svg[data-src*="zakdorn-cheeks"]')
        await expect(zakdornSvg).toBeAttached()
    })

    test('Kelpien should render kelpien-lines as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Kelpien' })
        const kelpienSvg = page.locator('#character-head-features svg[data-src*="kelpien-lines"]')
        await expect(kelpienSvg).toBeAttached()
    })

    test('VinShari should render vin-shari-neck as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'VinShari' })
        const vinshariSvg = page.locator('#character-head-features svg[data-src*="vin-shari-neck"]')
        await expect(vinshariSvg).toBeAttached()
    })

    test('Klingon body colors should include black, grey, and white', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Klingon' })
        const klingonGroup = page.locator('#std-body-colors optgroup[filtergroup="klingon"]')
        await expect(klingonGroup).toHaveJSProperty('hidden', false)
        await expect(klingonGroup.locator('option[value="#0A0A0A"]')).toHaveJSProperty('hidden', false)
        await expect(klingonGroup.locator('option[value="#B5BEC8"]')).toHaveJSProperty('hidden', false)
        await expect(klingonGroup.locator('option[value="#F4F4F6"]')).toHaveJSProperty('hidden', false)
    })

    test('Caitian body colors should include Caitian and Kzinti', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Caitian / Kzinti' })
        const catGroup = page.locator('#std-body-colors optgroup[filtergroup="cat"]')
        await expect(catGroup).toHaveJSProperty('hidden', false)
        await expect(catGroup.locator('option[value="#B3673D"]')).toHaveJSProperty('hidden', false)
        await expect(catGroup.locator('option[value="#A92902"]')).toHaveJSProperty('hidden', false)
    })

    test('body color auto-switches to valid color when filter hides current selection', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Andorian / Aenar' })
        await expect(page.locator('#ear-select')).toHaveValue('round')
        await page.locator('#std-body-colors').evaluate((el, val) => { el.value = val }, '#41AACC')
        await page.locator('#body-color').evaluate((el, val) => { el.value = val }, '#41AACC')
        await page.selectOption('#body-shape', { label: 'Human' })
        await expect(page.locator('#body-color')).toHaveValue('#fee4b3')
    })

    test('Vulcan should show Romulan V checkbox', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Vulcan / Romulan / Kellerun' })
        await expect(page.locator('#vulcan-romulan-v-check')).toBeVisible()
    })

    test('Vulcan Romulan V checkbox should render north-romulan-v when checked', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Vulcan / Romulan / Kellerun' })
        await expect(page.locator('#vulcan-romulan-v-check')).toBeVisible()
        await page.locator('#vulcan-romulan-v-check').check()
        const vSvg = page.locator('#character-head-features svg[data-src*="north-romulan-v"]')
        await expect(vSvg).toBeAttached()
    })

    test('Vulcan Romulan V checkbox should not be visible for non-vulcans', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Custom' })
        await expect(page.locator('#vulcan-romulan-v-check')).not.toBeVisible()
    })

    test('Tellarite should show tusks checkbox', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Tellarite' })
        await expect(page.locator('#tellarite-tusks-check')).toBeVisible()
    })

    test('Tellarite tusks checkbox should render tusks when checked', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Tellarite' })
        await expect(page.locator('#tellarite-tusks-check')).toBeVisible()
        await page.locator('#tellarite-tusks-check').check()
        const tusksSvg = page.locator('#character-head-features svg[data-src*="tusks"]')
        await expect(tusksSvg).toBeAttached()
    })

    test('Tilikaal should render tilikaal-headpiece as forced feature', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Tilikaal' })
        const tilikaalSvg = page.locator('#character-head-features svg[data-src*="tilikaal-headpiece"]')
        await expect(tilikaalSvg).toBeAttached()
    })

    test('Tilikaal body color should be light blue', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Tilikaal' })
        await expect(page.locator('#std-body-colors optgroup[filtergroup="tilikaal"]')).toHaveJSProperty('hidden', false)
    })

    test('Species Traits multi-select should be hidden when all options are hidden', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Human' })
        await expect(page.locator('#head-feature-select')).not.toBeVisible()
    })

    test('Species Traits multi-select should be visible for Custom Humanoid', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Custom' })
        await expect(page.locator('#head-feature-select')).toBeVisible()
    })

    test('cat-mouth-beard should be hidden when non-cat ears are selected', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Custom' })
        await page.selectOption('#ear-select', 'round')
        await expect(page.locator('#facial-hair-select option[value="cat-mouth-beard"]')).toHaveJSProperty('hidden', true)
    })

    test('cat-mouth-beard should be visible when cat ears are selected', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Custom' })
        await page.selectOption('#ear-select', 'cat')
        await expect(page.locator('#facial-hair-select option[value="cat-mouth-beard"]')).toHaveJSProperty('hidden', false)
    })

    test('Orion should have green body color options', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Orion' })
        await expect(page.locator('#std-body-colors optgroup[filtergroup="orion"]')).toHaveJSProperty('hidden', false)
        await expect(page.locator('#std-body-colors optgroup[filtergroup="orion"] option[value="#A6F3A8"]')).toHaveJSProperty('hidden', false)
    })

    test('Orion body shape dropdown should include Orion', async ({ page }) => {
        const bodyShape = page.locator('#body-shape')
        const options = await bodyShape.locator('option').allTextContents()
        expect(options).toContain('Orion')
    })

    test('cat-nose color picker should be visible when cat-nose is forced', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Caitian / Kzinti' })
        await expect(page.locator('.cat-nose-only')).toBeVisible()
    })

    test('cat-nose color picker should not be visible for non-cat species', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Human' })
        await expect(page.locator('.cat-nose-only')).not.toBeVisible()
    })

    test('cat-nose color picker should not have sync-with-body checkbox', async ({ page }) => {
        await page.selectOption('#body-shape', { label: 'Caitian / Kzinti' })
        await expect(page.locator('.cat-nose-only')).toBeVisible()
        const syncCheckbox = page.locator('#sync-cat-nose-with-body')
        expect(await syncCheckbox.count()).toBe(0)
    })

    test('switching to Bolian should hide previously assigned hair', async ({ page }) => {
        // Select a hair style first
        await page.selectOption('#hair-select', 'b')
        await expect(page.locator('#character-hair svg[data-src*="/hair/b.svg"]')).toBeAttached()

        // Switch to Bolian (a species without hair)
        await page.selectOption('#body-shape', { label: 'Bolian' })

        // Hair should be cleared but select value preserved
        await expect(page.locator('#character-hair svg')).not.toBeAttached()
        await expect(page.locator('#hair-select')).toHaveValue('b')
    })

    test('switching to Breen should hide previously assigned hair', async ({ page }) => {
        await page.selectOption('#hair-select', 'b')
        await expect(page.locator('#character-hair svg[data-src*="/hair/b.svg"]')).toBeAttached()
        await page.selectOption('#body-shape', { label: 'Breen' })
        await expect(page.locator('#character-hair svg')).not.toBeAttached()
    })

    test('switching to Kelpien should hide previously assigned hair', async ({ page }) => {
        await page.selectOption('#hair-select', 'b')
        await expect(page.locator('#character-hair svg[data-src*="/hair/b.svg"]')).toBeAttached()
        await page.selectOption('#body-shape', { label: 'Kelpien' })
        await expect(page.locator('#character-hair svg')).not.toBeAttached()
    })

    test('hair selection should be restored when switching back to species with hair', async ({ page }) => {
        // Select a hair style
        await page.selectOption('#hair-select', 'b')
        await expect(page.locator('#character-hair svg[data-src*="/hair/b.svg"]')).toBeAttached()

        // Switch to hairless species
        await page.selectOption('#body-shape', { label: 'Bolian' })
        await expect(page.locator('#character-hair svg')).not.toBeAttached()

        // Switch back to species with hair - selection should be restored
        await page.selectOption('#body-shape', { label: 'Custom' })
        await expect(page.locator('#hair-select')).toHaveValue('b')
        await expect(page.locator('#character-hair svg[data-src*="/hair/b.svg"]')).toBeAttached()
    })
})
