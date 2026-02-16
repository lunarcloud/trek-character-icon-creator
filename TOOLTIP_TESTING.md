# Tooltip Testing Guide

This document describes how to test the tooltips feature that provides helpful information about body types, species features, and Star Trek terminology.

## What Was Added

- `js/tooltip-data.js` - Contains 229 tooltips across 10 categories
- `js/tooltip-manager.js` - Module that applies tooltips to HTML elements
- Tooltips applied via `TooltipManager.initialize()` in `index.js`

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

#### Ear Type Tooltips
1. Locate the "Ears" dropdown (visible when Humanoid body type is selected)
2. Open the dropdown
3. Hover over options like "Pointy", "Round", "Massive"
4. You should see tooltips explaining each ear type

#### Head Features Tooltips
1. Find the "Features, Tech, Jewelry" multi-select dropdown
2. Open it and hover over various options
3. You should see tooltips for species traits like Andorian Antennae, Trill Spots, etc.

#### Uniform Tooltips
1. Open the "Uniform" dropdown
2. Hover over different uniform options
3. You should see tooltips explaining each uniform era

#### Department Color Tooltips
1. Open the "Color" dropdown under Uniform section
2. Hover over department options
3. You should see tooltips explaining each department

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

## Validation

Run the validation script to verify all tooltip data:

```bash
node validate-tooltips.mjs
```

Expected output shows 229 valid tooltips across 10 categories with 0 errors.
