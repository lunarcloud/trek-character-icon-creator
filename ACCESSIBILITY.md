# Accessibility Features

The Trek Character Icon Creator is designed to be fully accessible to all users, including those using assistive technologies like screen readers and keyboard-only navigation.

## WCAG Compliance

The application strives to meet WCAG 2.1 Level AA standards and includes:

### Perceivable
- **Text Alternatives**: All interactive elements have accessible names via ARIA labels or associated `<label>` elements
- **Semantic Structure**: Proper use of landmarks (`<main>`, `<aside>`, `<footer>`) and heading hierarchy
- **Color Independence**: Controls are labeled and identifiable beyond color alone

### Operable
- **Keyboard Navigation**: All functionality is accessible via keyboard
  - Tab through all interactive elements
  - Space/Enter to activate buttons and checkboxes
  - Arrow keys to navigate select dropdowns
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + S`: Save character to file
  - `Ctrl/Cmd + O`: Load character from file
- **Focus Indicators**: Visible focus indicators on all interactive elements

### Understandable
- **Clear Labels**: All form controls have descriptive labels
- **Consistent Navigation**: Predictable interface layout
- **Error Prevention**: Invalid options are hidden automatically

### Robust
- **ARIA Support**: Comprehensive ARIA attributes for screen reader compatibility
- **Screen Reader Announcements**: Character changes announced via aria-live regions
- **Valid HTML**: Standards-compliant markup

## Interactive Elements with ARIA Labels

All interactive elements include proper labeling:

### Selection Controls
- Body type selector: `aria-label="Body type"`
- Ear type selector: `aria-label="Ear type"`
- Nose selector: `aria-label="Nose type"`
- Head features: `aria-label="Head features, tech, and jewelry"`
- Hat selector: `aria-label="Hat or headgear"`
- Eyewear selector: `aria-label="Eyewear or face covering"`
- Uniform selector: `aria-label="Uniform style"`
- Hair selectors: `aria-label="Head hair style"`, `aria-label="Facial hair style"`, `aria-label="Rear hair style"`

### Color Controls
- Body color picker: Associated with label "Color"
- Hair color picker: Associated with label "Color"
- Uniform color picker: Associated with label "Color"
- Preset color selectors: `aria-label="Preset [type] colors"`

### Action Buttons
- Download PNG: `aria-label="Download as PNG"`
- Download SVG: `aria-label="Download as SVG"`
- Save character: `aria-label="Save character to file"`
- Load character: `aria-label="Load character from file"`
- Next buttons: `aria-label="Next [type] option"`

### Toggle Controls
- Hair mirror: `aria-label="Mirror hair horizontally"`
- Rear hair mirror: `aria-label="Mirror rear hair horizontally"`
- Save with background: `aria-label="Include background in download"`

## Screen Reader Support

### Character Preview
- The character preview has `role="img"` and `aria-label="Character preview"` so screen readers understand it's a visual representation

### Live Announcements
- Body type changes are announced to screen readers via an `aria-live="polite"` region
- Example announcement: "Character body type changed to Cetaceous"

## Testing with Screen Readers

### VoiceOver (macOS)
1. Press `Cmd + F5` to enable VoiceOver
2. Use `Tab` to navigate through controls
3. Press `Ctrl + Option + Space` to activate buttons
4. Use arrow keys in select dropdowns

### NVDA (Windows)
1. Start NVDA
2. Use `Tab` to navigate through controls
3. Press `Space` or `Enter` to activate buttons
4. Use arrow keys in select dropdowns

### Testing Checklist
- [ ] All controls announce their purpose
- [ ] Body type changes are announced
- [ ] Form labels are properly associated
- [ ] Character preview announces its role
- [ ] Buttons announce their action

## Automated Testing

The project includes 12 automated accessibility tests using Playwright and axe-core:

```sh
npm test  # Run all accessibility tests
```

Tests verify:
- ARIA labels on all interactive elements
- Keyboard accessibility (tabindex, focus)
- Screen reader announcements
- Semantic structure (landmarks, headings)
- WCAG compliance (no violations detected)

## Known Limitations

- The visual character preview requires sight to fully appreciate
- Color customization features are primarily visual
- Some species-specific features may not be available in all body types

## Future Improvements

Potential accessibility enhancements being considered:
- Descriptive text alternative for character preview
- High contrast mode
- Reduced motion mode for animations (if any are added)
- More detailed screen reader descriptions of character state

## Feedback

If you encounter accessibility issues, please file an issue on GitHub with:
- Your assistive technology (screen reader, keyboard navigation, etc.)
- The specific problem encountered
- Steps to reproduce the issue
- Your browser and operating system

We're committed to making this tool accessible to everyone!
