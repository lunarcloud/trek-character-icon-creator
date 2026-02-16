# Tooltip Testing Guide

This document describes how to test the tooltips feature that was added to provide helpful information about body types, species features, and Star Trek terminology.

## What Was Added

### Files Created
- `js/tooltip-data.js` - Contains 229 tooltips across 10 categories
- `js/tooltip-manager.js` - Module that applies tooltips to HTML elements

### Files Modified
- `index.js` - Added tooltip initialization on page load

## Tooltip Categories

The system includes tooltips for:

1. **Body Types** (7 tooltips): humanoid, cetaceous, exocomp, medusan, cal-mirran, qofuari, sukhabelan
2. **Cal-Mirran Shapes** (4 tooltips): Prismatic, Spherical, Pinwheel, Cubical
3. **Ear Types** (7 tooltips): none, round, pointy, ferengi, cat, bear, horns
4. **Head Features** (51 tooltips): Andorian antennae, Trill spots, Klingon ridges, etc.
5. **Hats** (20 tooltips): Various headwear from Star Trek series
6. **Eyewear** (8 tooltips): Visors, goggles, glasses
7. **Nose Types** (4 tooltips): For cetaceous body type
8. **Uniform Eras** (79 tooltips): Uniforms from ENT through DISCO 33rd century
9. **Departments** (15 tooltips): Command, Science, Medical, etc.
10. **Casual Wear** (34 tooltips): Civilian clothing options

## How to Test

### 1. Start the Development Server
```bash
npm run serve
```

### 2. Open in Browser
Navigate to `http://localhost:3000` in your browser.

### 3. Test Tooltips

#### Body Type Tooltips
1. Hover over the "Body" dropdown
2. Click to open the dropdown
3. Hover over each option (Humanoid, Cetaceous, Exocomp, Medusan, etc.)
4. You should see a tooltip describing each body type

**Expected Results:**
- **Humanoid**: "Standard bipedal form with two arms, two legs, and a head. Most Star Trek species are humanoid."
- **Cetaceous**: "Aquatic dolphin-like species. The Xindi-Aquatic are the primary cetaceous species in Star Trek."
- **Medusan**: "Non-corporeal energy beings whose appearance is so alien it can drive humanoids insane. They are housed in protective containers." (Note: Canon species from TOS)

#### Ear Type Tooltips
1. Locate the "Ears" dropdown (visible when Humanoid body type is selected)
2. Open the dropdown
3. Hover over options like "Pointy", "Round", "Massive"

**Expected Results:**
- **Pointy**: "Distinctive pointed ears typical of Vulcans, Romulans, and related species"
- **Massive**: "Large, lobed ears characteristic of the profit-driven Ferengi species"

#### Head Features Tooltips
1. Find the "Features, Tech, Jewelry" multi-select dropdown
2. Open it and hover over various options

**Expected Results:**
- **Andorian Antennae**: "Two antennae protruding from the head. Andorians are a blue-skinned species from the ice moon Andoria."
- **Trill Spots**: "Leopard-like spots running from hairline down the sides of the body. Some Trill are joined with a symbiont."
- **Klingon Ridges**: "Pronounced cranial ridges. Klingons are a warrior culture valuing honor above all."

#### Uniform Tooltips
1. Open the "Uniform" dropdown
2. Hover over different uniform options

**Expected Results:**
- **TOS**: "The Original Series (2260s) - Classic colored tunics with black pants"
- **TNG**: "The Next Generation (2360s-2370s) - Two-piece uniform with colored shoulders"
- **VOY DS9**: "Voyager/Deep Space Nine (2370s) - Two-piece with colored shoulders and undershirt"

#### Department Color Tooltips
1. Open the "Color" dropdown under Uniform section
2. Hover over department options

**Expected Results:**
- **Command**: "Command division - Bridge officers, captains, and admirals"
- **Science / Medical**: "Science and Medical divisions"
- **Ops / Security / Engineering**: "Operations, Security, and Engineering divisions"

## Testing Checklist

- [ ] Body type dropdown shows tooltips for all 7 body types
- [ ] Cal-Mirran shape dropdown shows tooltips (when Cal-Mirran is selected)
- [ ] Ear type dropdown shows tooltips (when Humanoid is selected)
- [ ] Nose type dropdown shows tooltips (when Cetaceous is selected)
- [ ] Head features multi-select shows tooltips for species traits
- [ ] Hat dropdown shows tooltips for various headwear
- [ ] Eyewear dropdown shows tooltips
- [ ] Uniform dropdown shows tooltips for all uniform options
- [ ] Department color dropdown shows tooltips
- [ ] Tooltips are informative and help understand unfamiliar terms
- [ ] Tooltips display properly on hover in all modern browsers

## Browser Compatibility

Tooltips use the native HTML `title` attribute, which is supported by all modern browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Opera

## Implementation Details

### How It Works

1. **Data Loading**: `tooltip-data.js` exports a `tooltipData` object with all tooltip text
2. **Initialization**: When the page loads, `index.js` calls `initializeTooltips()`
3. **Application**: The tooltip manager finds all relevant `<select>` elements and `<option>` elements
4. **Matching**: It matches option values or text content to the tooltip data
5. **Setting**: It sets the `title` attribute on matching elements

### Code Example

```javascript
// From tooltip-manager.js
function applyTooltip (element, tooltipText) {
    if (element && tooltipText) {
        element.title = tooltipText
    }
}
```

## Validation

Run the validation script to verify all tooltip data:

```bash
node validate-tooltips.mjs
```

Expected output:
```
🔍 Validating Tooltip Data Structure

✓ bodyTypes: 7 tooltips
✓ calMirranShapes: 4 tooltips
✓ ears: 7 tooltips
✓ headFeatures: 51 tooltips
✓ hats: 20 tooltips
✓ eyewear: 8 tooltips
✓ noseTypes: 4 tooltips
✓ uniformEras: 79 tooltips
✓ departments: 15 tooltips
✓ casual: 34 tooltips

📊 Summary:
  Total categories: 10
  Total tooltips: 229
  Errors: 0

✅ All tooltips are valid!
```

## Notes

- Tooltips use the native browser tooltip mechanism (no additional libraries required)
- Tooltip display timing and styling is controlled by the browser
- Tooltips are accessible via keyboard navigation (focus on dropdown, arrow keys)
- All tooltip text is stored in a separate data file as requested by the maintainer
- No changes were made to HTML files (tooltips applied via JavaScript)

## Future Enhancements

Possible improvements that could be considered:
- Custom styled tooltips with CSS (instead of native browser tooltips)
- Info icons next to section headers with expandable descriptions
- Tooltip delay adjustment for better UX
- Localization support for multiple languages
