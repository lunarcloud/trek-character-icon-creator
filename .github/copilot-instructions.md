# AGENTS.md

This document provides detailed information about the Trek Character Icon Creator project for AI agents and automated tools.

## Project Overview

**Name:** Icon-y Character Creator for Star Trek  
**Type:** Browser-based web application  
**License:** CC0 1.0 Universal (content), separate license for code  
**Primary Language:** JavaScript (ES Modules)  
**Environment:** Modern web browsers with ES6+ support  
**Live App:** https://samsarette.itch.io/simple-trekkie-character-creator

### Purpose
A character icon creator for Star Trek-style characters with extensive customization options including multiple species, body types, uniforms, and facial features.

### Viewport Requirements
**Important:** The application should minimize any vertical scrolling and avoid all horizontal scrolling when displayed in a **980px × 800px viewport** for optimal display when hosted on itch.io. All UI changes should be tested at this viewport size to ensure good usability.

## Architecture

### Technology Stack
- **Frontend:** Vanilla JavaScript (ES Modules), HTML5, CSS3
- **Build Tools:** None (runs directly in browser)
- **Dependencies:**
  - `external-svg-loader` (v1.7.1) - Dynamic SVG loading
  - `html2canvas` (v1.4.1) - Canvas export functionality
- **Dev Dependencies:**
  - ESLint with standard config
  - stylelint for CSS
  - linthtml for HTML
  - svglint for SVG validation

### Project Structure

```
/
├── index.html          # Main application UI
├── index.js            # Main controller (orchestrates modules)
├── index.css           # Main stylesheet
├── js/                 # JavaScript modules folder
│   ├── character_elements.js  # DOM element references and initialization
│   ├── color_manager.js    # Color pickers, synchronization, and color state
│   ├── uniform_manager.js  # Uniform validation, filtering, and defaults
│   ├── body_type_manager.js   # Body-type-specific rendering logic
│   ├── type-helpers.js     # HTML element getters with runtime type checking
│   ├── util-data.js        # Data manipulation utilities (DataUtil class)
│   └── util-dom.js         # DOM manipulation utilities (DomUtil class)
├── {body-type}/        # SVG asset directories for each character body type
│   ├── body.svg        # Base body SVG (required)
│   ├── body-overlay.svg # Optional overlay layer
│   ├── body/           # Alternative: body parts as subdirectory
│   ├── ears/           # Species-specific ear variations
│   ├── extra/          # Additional customization options
│   ├── facial-hair/    # Facial hair styles
│   ├── hair/           # Hair styles
│   ├── head-features/  # Species-specific head features (ridges, antennae, etc.)
│   ├── nose/           # Nose variations
│   ├── rear-hair/      # Back hair/ponytails
│   └── uniform/        # Uniform styles for this body type
└── fonts/              # Custom fonts
```

**Note:** Body type directories vary in structure. Each contains `body.svg` or `body/` subdirectory. Subdirectories for customization options (ears, hair, uniform, etc.) differ per body type based on what's applicable.

### Key Components

#### IndexController (`index.js`)
Main application controller that orchestrates the modular architecture:
- Initializes and coordinates all manager modules
- Handles top-level change detection
- Manages character rendering workflow
- Image export functionality

#### CharacterElements (`js/character_elements.js`)
Manages DOM element references:
- Centralizes all element lookups
- Setup for interactive elements (next buttons)
- Provides element collections for change detection

#### ColorManager (`js/color_manager.js`)
Handles all color-related functionality:
- Color picker initialization and pairing with selectors
- Color synchronization (e.g., antennae with body color)
- Last-used color tracking per body type
- Color validation and CSS style generation

#### UniformManager (`js/uniform_manager.js`)
Manages uniform selection logic:
- Uniform validation based on body type
- Color option filtering by uniform type
- Default uniform selection
- Hiding invalid options

#### BodyTypeManager (`js/body_type_manager.js`)
Handles body-type-specific rendering:
- Separate update methods for each body type (humanoid, cetaceous, medusan, cal-mirran, sukhabelan, exocomp)
- SVG asset loading and visibility management
- Body-specific feature rendering
- Reset logic for body changes

#### DataUtil (`js/util-data.js`)
Utility class for data operations:
- `ListStringToArray()` - Parse comma/slash separated strings
- `ListInList()` - Check list intersection

#### DomUtil (`js/util-dom.js`)
Utility class for DOM operations:
- `SetupColorInputWithSelect()` - Wire color pickers with selectors
- `SaveImage()` - Export character as PNG using html2canvas
- SVG manipulation helpers

## Development Workflow

### Setup
```bash
npm install
npm run copy-deps  # Copy external dependencies to lib/
```

### Running Locally
```bash
npm run serve  # Starts development server on http://localhost:3000
```

### Code Quality
All code must pass linting before submission:
```bash
npm run lint        # Run all linters
npm run lint-fix    # Auto-fix issues where possible
npm run eslint      # JavaScript only
npm run htmllint    # HTML only
npm run csslint     # CSS only
npm run svglint     # SVG only
```

**Important:** 
- SVGLint runs with default configuration (no custom .svglintrc needed)
- All JavaScript must have JSDoc comments on public functions/methods/classes
- The project uses `jsconfig.json` for editor IntelliSense and basic type checking
- Follow JavaScript Standard Style (no semicolons, 4-space indentation)

### Testing
- No automated test suite currently exists
- Manual testing required via browser interface - see TESTING.md for comprehensive checklist
- Test all body types when making changes
- Ensure the character (SVGs selected from the selections) is visible on screen
- Verify export functionality
- Always test at 980px × 800px viewport (itch.io target size)

## SVG Asset System

### Color Customization
SVG files use CSS classes for dynamic color changes:

**Available CSS Classes:**
- `.body-color` - Character body/skin color
- `.hair-color` - Hair and facial hair color
- `.uniform-color` - Primary uniform color
- `.uniform-undershirt-color` - Undershirt/secondary uniform color
- `.bird-tuft-color` - Bird tuft feature color
- `.andorian-antennae-color` - Andorian antennae color
- `.whiskers-color` - Whiskers/gills/feathers color

### SVG File Pattern
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <style>
        .body-color {
            color: #fee4b3;
        }
    </style>
    <path fill="currentColor" class="body-color" d="..." />
</svg>
```

### Modifying Existing SVG Assets

**AI agents are forbidden from creating new SVG artwork.** All SVG assets must be hand-crafted by human artists. However, AI agents may modify existing SVG files to fix technical issues:

**Allowed modifications:**
1. **Correcting color class names** - Fix incorrect CSS class references (e.g., `.body-color`, `.hair-color`, `.uniform-color`)
2. **Fixing syntax errors** - Repair malformed XML, missing closing tags, or invalid attributes
3. **Updating viewBox attributes** - Correct viewBox dimensions if incorrect
4. **Fixing xmlns declarations** - Ensure proper `xmlns="http://www.w3.org/2000/svg"` attribute
5. **Correcting style blocks** - Fix CSS syntax errors within `<style>` tags

**After any SVG modification:**
1. Validate with `npm run svglint`
2. Test visually in browser with `npm run serve`
3. Verify color customization still works correctly
4. Test in all relevant body type contexts

## Feature Areas

### Body Types
The application supports multiple character body types, each with unique customization options:
- Traditional bipedal humanoid characters
- Aquatic/cetaceous species
- Robotic entities
- Energy beings with containment suits
- Other non-canon species variants

Each body type has its own asset directory and available customization features.

### Customization Options
- Species-specific features (Vulcan ears, Klingon ridges, etc.)
- Hair styles and facial hair
- Uniform styles from multiple Star Trek series
- Department colors (Command, Ops, Security, Science, Medical, Engineering)
- Body, hair, and uniform colors
- Special features (whiskers, antennae, bird tufts, etc.)

### Export
- PNG export with transparent or colored background
- Uses html2canvas for rendering
- Default size: 512x512 pixels

## Code Style Guidelines

**Note: This project uses JavaScript only - no TypeScript.** The `jsconfig.json` file is used solely for editor IntelliSense support and JSDoc-based type checking.

### JavaScript
- ES6+ modules
- JSDoc comments required for all public methods, classes, and exported functions
- Standard ESLint configuration (JavaScript Standard Style)
- No semicolons (standard style)
- 4-space indentation (per .editorconfig)
- Use `jsconfig.json` for editor type checking support
- Avoid `@ts-ignore` comments unless absolutely necessary for DOM type issues

### HTML
- Semantic HTML5
- Validated by linthtml
- Uses custom `<group>` elements for logical sections

### CSS
- Standard stylelint configuration
- CSS custom properties for theme consistency
- BEM-like naming for SVG color classes

### SVG
- Validated by svglint (uses default configuration)
- Must include proper xmlns="http://www.w3.org/2000/svg"
- Use viewBox for scalability (typically `viewBox="0 0 512 512"`)
- Include style blocks for color classes when color customization is needed
- Use `fill="currentColor"` with color class names for dynamic coloring

## Common Tasks

### Writing JSDoc Comments
All public functions, methods, and classes must have JSDoc comments:

```javascript
/**
 * Get an element by id and validate its type.
 * @param {string} id - The element ID to retrieve
 * @param {Function} type - The expected constructor/class
 * @returns {HTMLElement} The validated element
 * @throws {Error} If element type doesn't match expected type
 */
export function getElementOfType(id, type) {
    // implementation
}
```

**JSDoc Requirements:**
- Brief description of what the function does
- `@param` for each parameter with type and description
- `@returns` with type and description of return value
- `@throws` if function can throw errors
- Use JSDoc types: `{string}`, `{number}`, `{boolean}`, `{HTMLElement}`, `{Array<string>}`, etc.
- The eslint-plugin-jsdoc validates JSDoc syntax

### Modifying Color Options
1. Update color picker in `index.html`
2. Add option to appropriate `std-*-colors` selector
3. Update default colors in `index.js` if needed
4. Test across all body types

## CI/CD

### GitHub Actions
**Workflow:** `.github/workflows/lint.yml`
- Runs on: push to main, pull requests, manual trigger
- Steps: Install dependencies → ESLint → linthtml → stylelint → svglint
- All linters must pass for PR approval

### Deployment
- Manual upload to itch.io via `upload-to-itch.sh`
- No automated deployment pipeline
- Static files served directly

## Contributing Guidelines

This is primarily a personal project by @lunarcloud. Contributions are considered but not actively solicited.

### Pull Request Requirements
1. All linters must pass (`npm run lint`)
2. Thorough manual testing of changes
3. Clear description of changes and reasoning
4. Follow existing code patterns
5. Update documentation if adding features

### Review Process
- PRs reviewed at maintainer's discretion
- May be accepted, modified, or closed based on project needs
- Bug fixes prioritized over feature additions

## Known Limitations

### Browser Support
- Requires modern browser with ES6+ module support
- Tested primarily in Chrome/Firefox
- SVG rendering varies by browser
- Designed to minimize vertical scrolling and avoid horizontal scrolling at 980px × 800px viewport (itch.io hosting)

### Performance
- Large number of SVG assets loaded dynamically
- Export uses html2canvas which may be slow for complex characters
- No lazy loading implemented

### Features
- No undo/redo functionality
- No save/load character presets
- No animation support
- Limited mobile optimization

## AI Agent Guidance

### When Making Changes
1. **Always run linters** before and after changes
2. **Test manually** in browser - no automated tests exist (see TESTING.md)
3. **Maintain minimal dependencies** - avoid adding new packages unless essential
4. **Follow existing patterns** - consistency is critical
5. **Update documentation** if adding features
6. **Consider all body types** - changes may affect multiple character types
7. **NEVER create SVG artwork** - only modify existing SVG files for technical fixes
8. **Use JSDoc comments** - required for all public functions/methods/classes

### Common Pitfalls to Avoid
- Don't modify working SVG files without testing - color changes are fragile
- Don't add complex build processes - this is intentionally simple
- Don't break the uniform/department color system
- Don't introduce external API dependencies
- Don't modify the core export functionality without extensive testing
- **NEVER create new SVG artwork** - all SVG assets are hand-crafted by humans

### Best Practices for AI Agents
- Use `view`, `edit`, and `grep` tools to explore before changing
- Test changes incrementally with `npm run serve`
- Run specific linters (`npm run eslint`) as you work
- Check both visual output and console for errors
- Verify export functionality after UI changes
- Consider edge cases (no selection, custom colors, etc.)
- Follow the manual testing checklist in TESTING.md
- Write JSDoc comments for any new functions

## Resources

- **Repository:** https://github.com/lunarcloud/trek-character-icon-creator
- **Live App:** https://samsarette.itch.io/simple-trekkie-character-creator
- **License:** See LICENSE and LICENSE-CODE files
- **Issues:** GitHub Issues (acceptance not guaranteed)

## Maintainer Notes

**Primary Maintainer:** @lunarcloud  
**Maintenance Status:** Personal project, active as time permits  
**Support:** Limited - this is a hobby project  
**Philosophy:** Keep it simple, browser-native, and fun

---

*Last Updated: 2025-12-16*
*Document Version: 1.0*
