# Tooltip Feature - Visual Guide

## Overview
This document describes the tooltips feature added to the Star Trek Character Icon Creator to help users understand body types, species features, and Star Trek terminology.

## Implementation Summary
- **229 tooltips** added across **10 categories**
- Uses native HTML `title` attributes for browser compatibility
- Tooltips are applied dynamically via JavaScript on page load
- All tooltip text stored in separate data file (`js/tooltip-data.js`)

## Example Tooltips

Here are a few examples of the tooltips users will see:

| Option | Tooltip |
|--------|---------|
| Humanoid (Body Type) | "Standard bipedal form with two arms, two legs, and a head. Most Star Trek species are humanoid." |
| Pointy (Ears) | "Distinctive pointed ears typical of Vulcans, Romulans, and related species" |
| TOS (Uniform) | "The Original Series (2260s) - Classic colored tunics with black pants" |

## How to See Tooltips

### In Desktop Browsers
1. **Hover Method**: Simply move your mouse cursor over any dropdown option
2. **Keyboard Method**: Use Tab to navigate to a dropdown, press Space or Enter to open it, then use arrow keys to navigate options
3. The tooltip will appear after a brief delay (timing controlled by your browser)

### Quick Test
1. Open the app in a browser
2. Find the "Body" dropdown at the top of the controls
3. Click to open it
4. Hover over "Cetaceous"
5. You should see: "Aquatic dolphin-like species. The Xindi-Aquatic are the primary cetaceous species in Star Trek."

## Technical Details

### Implementation
Tooltips use native HTML `title` attributes applied dynamically at page load by `TooltipManager.initialize()`.

### Browser Compatibility
✅ Chrome/Edge, Firefox, Safari, Opera - all modern browsers support the `title` attribute.

### Accessibility
- Native tooltips work with screen readers
- Keyboard navigation reveals tooltips
- Respects user accessibility settings
- No JavaScript required for basic tooltip functionality

## Testing
See `TOOLTIP_TESTING.md` for comprehensive testing instructions.
