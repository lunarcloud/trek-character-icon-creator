# Manual Testing Checklist

This project does not have automated tests. All testing is done manually through the browser interface. Use this checklist when testing changes.

## Before Testing
- [ ] Run `npm run lint` to ensure code quality
- [ ] Start dev server with `npm run serve`
- [ ] Open browser to http://localhost:3000

## Core Functionality Tests

### Body Type Selection
- [ ] Test each body type selector button
  - [ ] Humanoid
  - [ ] Cetaceous
  - [ ] Exocomp
  - [ ] Medusan
  - [ ] Cal-Mirran
  - [ ] Qofuari
  - [ ] Sukhabelan
- [ ] Verify correct body SVG loads for each type
- [ ] Verify UI options update appropriately for each body type

### Color Customization
- [ ] Test body color selector and color picker
- [ ] Test hair color selector and color picker
- [ ] Test uniform color selector and color picker
- [ ] Test uniform undershirt color selector and color picker
- [ ] Verify color pickers sync with dropdowns
- [ ] Verify colors apply correctly to character preview

### Feature Selection
Test for humanoid body type (most complete feature set):
- [ ] Ears selection (Vulcan, Human, etc.)
- [ ] Nose selection
- [ ] Hair selection
- [ ] Facial hair selection
- [ ] Rear hair/ponytail selection
- [ ] Head features (ridges, antennae, etc.)
- [ ] Extra features (whiskers, bird tuft, etc.)

### Uniform System
- [ ] Test uniform style selection
- [ ] Verify uniform color options filter correctly per style
- [ ] Test department color selection
- [ ] Verify uniform undershirt color options work
- [ ] Test uniform changes across different body types

### Export Functionality
- [ ] Test "Save Image" button
- [ ] Verify PNG exports correctly with transparent background
- [ ] Test background color selector before export
- [ ] Verify exported image is 512x512 pixels
- [ ] Test export with various character configurations

## Cross-Body Type Testing
When making changes that affect multiple body types:
- [ ] Test with humanoid (full feature set)
- [ ] Test with cetaceous (aquatic features)
- [ ] Test with exocomp (minimal features)
- [ ] Test with medusan (containment suit)
- [ ] Test with cal-mirran (sub-shape)
- [ ] Test with qofuari (humanoid with a few options hidden or forced)
- [ ] Test with sukhabelan (non-canon features)

## Browser Testing
- [ ] Test in Chrome/Chromium
- [ ] Test in Firefox
- [ ] Test in Safari (if available)
- [ ] Verify no console errors in any browser

## Viewport Testing
The app is designed for 980px × 800px viewport (itch.io hosting):
- [ ] Test at 980px × 800px
- [ ] Verify minimal vertical scrolling
- [ ] Verify no horizontal scrolling
- [ ] Test UI elements are accessible without scrolling

## Edge Cases
- [ ] Test with no selections (default state)
- [ ] Test with custom colors entered manually
- [ ] Test rapid selection changes
- [ ] Test switching body types multiple times
- [ ] Test browser back/forward buttons (should not affect state)

## SVG Asset Changes
When modifying SVG files:
- [ ] Run `npm run svglint` to validate SVG syntax
- [ ] Verify SVG loads in browser
- [ ] Test color customization classes work (`.body-color`, `.hair-color`, etc.)
- [ ] Check SVG viewBox is correct (typically `0 0 512 512`)
- [ ] Verify no visual artifacts or distortion

## Performance Checks
- [ ] Monitor browser console for errors or warnings
- [ ] Check initial load time is reasonable
- [ ] Verify smooth interaction when changing options
- [ ] Check export doesn't freeze browser

## Documentation Validation
After making changes:
- [ ] Update README.md if adding features
- [ ] Update AGENTS.md if changing architecture
- [ ] Add comments to complex code sections
- [ ] Update JSDoc comments for modified functions

## Notes
- Take screenshots of any visual bugs for reporting
- Note which browser and version when issues occur
- Test both mouse and keyboard navigation when possible
- Pay attention to any console warnings, even if functionality seems correct
