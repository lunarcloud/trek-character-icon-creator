Icon-y Character Creator for Star Trek
=============================================================================================

[![app](https://img.shields.io/badge/app-Itch.io-red)](https://samsarette.itch.io/simple-trekkie-character-creator)
[![GitHub License](https://img.shields.io/github/license/lunarcloud/trek-character-icon-creator)](https://github.com/lunarcloud/trek-character-icon-creator/blob/main/LICENSE)
[![GitHub top language](https://img.shields.io/github/languages/top/lunarcloud/trek-character-icon-creator)](https://github.com/lunarcloud/trek-character-icon-creator/pulse)
[![environment](https://img.shields.io/badge/env-Browser-green)](https://developer.mozilla.org/en-US/docs/Glossary/Browser)

![Code Quality](https://github.com/lunarcloud/trek-character-icon-creator/actions/workflows/lint.yml/badge.svg)
![Accessibility Tests](https://github.com/lunarcloud/trek-character-icon-creator/actions/workflows/accessibility-tests.yml/badge.svg)


Character Creator for Star Trek style character icons

## Features
- Multiple body types: Humanoid, Cetaceous, Exocomp, Medusan, and non-canon body types
- Extensive uniform options from various Star Trek series
- Customizable hair, facial hair, and facial features
- Species-specific features (Vulcan ears, Klingon ridges, etc.)
- Color customization for body, uniform, and hair
- Export as PNG image with optional background
- **Fully accessible**: ARIA labels, keyboard navigation, and screen reader support ([see ACCESSIBILITY.md](ACCESSIBILITY.md))

## Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation
```sh
npm install
```

### Running Locally
```sh
npm run serve
```

This will start a local development server. Open your browser to the URL shown (typically http://localhost:3000).

## Code Quality Tools
The project has linters for the HTML, CSS, JavaScript, and SVG files all set up and configured.

### Running Linters
```sh
npm run lint        # Run all linters (ESLint, HTML, CSS, SVG, Spell Check)
npm run lint-fix    # Auto-fix issues where possible
npm run eslint      # JavaScript linting only
npm run htmllint    # HTML linting only
npm run csslint     # CSS linting only
npm run svglint     # SVG linting only
npm run spellcheck  # Spell checking only
```

### JavaScript Code Quality
- **ESLint** with standard configuration enforces code style
- **JSDoc comments** are required for all public functions, methods, and classes
- **jsconfig.json** enables JavaScript type checking in editors with IntelliSense
- Code uses ES6+ modules with 4-space indentation
- No semicolons (JavaScript Standard Style)

## Testing

### Running Tests
The project includes automated accessibility tests using Playwright and axe-core.

```sh
npm test          # Run all tests
npm run test:headed  # Run tests with browser visible
npm run test:ui      # Run tests in Playwright UI mode
```

### Test Suite
- **12 automated accessibility tests** covering:
  - ARIA labels on all interactive elements
  - Keyboard navigation and focus management
  - Screen reader announcements via aria-live regions
  - Proper semantic structure and landmarks
  - Color picker and form labeling
  - No automatically detectable WCAG violations (via axe-core)

### Manual Testing
For comprehensive testing, refer to `TESTING.md` which includes:
- Browser compatibility testing
- Viewport testing (980px × 800px for itch.io)
- Feature testing across all body types
- Export functionality validation

## Project Structure
- `index.html` - Main HTML file with character creator UI
- `index.js` - Main JavaScript controller
- `index.css` - Main stylesheet
- `js/` - JavaScript modules folder
  - **Core Modules:**
    - `character-elements.js` - DOM element references and initialization
    - `color-manager.js` - Color pickers, synchronization, and color state management
    - `uniform-manager.js` - Uniform validation, filtering, and default selection
    - `body-type-manager.js` - Body-type-specific rendering logic
  - **Utilities:**
    - `util-data.js` - Data manipulation utilities
    - `util-dom.js` - DOM manipulation utilities
    - `type-helpers.js` - HTML element getters with runtime type checking
- **Assets:**
  - `svg/` - SVG asset directory containing body type folders
    - `svg/humanoid/` - SVG assets for humanoid characters
    - `svg/cetaceous/`, `svg/exocomp/`, `svg/medusan/`, `svg/cal-mirran/`, `svg/qofuari/`, `svg/sukhabelan/` - Assets for other body types

## Adding New Features

### Module Architecture
The codebase uses a modular architecture with clear separation of concerns:
- **Core modules** (`js/character-elements.js`, `js/color-manager.js`, etc.) handle specific responsibilities
- **Utility modules** (`js/util-*.js`) provide reusable helper functions
- Main controller (`index.js`) orchestrates all modules
- All modules use ES6 export/import syntax

When adding features, follow the existing module patterns and maintain separation of concerns.

### JSDoc Documentation Requirements
All public functions, methods, and classes must have JSDoc comments:

```javascript
/**
 * Brief description of the function.
 * @param {string} id - Description of parameter
 * @returns {HTMLElement} Description of return value
 */
export function getElement(id) {
    // implementation
}
```

The project uses `jsconfig.json` for editor support and basic type checking through JSDoc annotations.

### Adding New SVG Assets
All SVG files have been hand-edited to enable color changing of certain shapes/paths.
New files should follow the same pattern if they want to support color changes.

```svg
    <style>
        .body-color {
            color: #fee4b3;
        }
    </style>
    ...
    <path fill="currentColor" class="body-color" ... >
```

### CSS Color Classes
The following CSS classes are available for SVG color customization:
- `.body-color` - Character body/skin color
- `.hair-color` - Hair and facial hair color
- `.uniform-color` - Primary uniform color
- `.uniform-undershirt-color` - Undershirt/secondary uniform color
- `.bird-tuft-color` - Bird tuft feature color
- `.andorian-antennae-color` - Andorian antennae color
- `.whiskers-color` - Whiskers/gills/feathers color

## License
See [LICENSE](LICENSE) and [LICENSE-CODE](LICENSE-CODE) for details.
