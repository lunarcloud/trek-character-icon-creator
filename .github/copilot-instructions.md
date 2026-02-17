# Copilot Instructions for Trek Character Icon Creator

This document provides coding standards and best practices for AI agents working on this project. For comprehensive project documentation, see AGENTS.md in the repository root.

## Quick Reference

**Primary Maintainer:** @lunarcloud (personal project)
**Tech Stack:** Vanilla JavaScript ES6+ (no TypeScript), HTML5, CSS3
**Target Viewport:** 980px × 800px (itch.io hosting)
**Testing:** Manual only (see TESTING.md)
**Key Requirement:** All code must pass linters before PR approval

## Critical Rules from Past PR Feedback

### Code Structure Preferences
1. **HTML over JavaScript DOM creation** - Prefer defining structure in HTML and updating content with JS
   - ✅ Good: `<dialog>` in HTML, JS updates content
   - ❌ Bad: Creating entire `<dialog>` structure dynamically in JS
   
2. **User-facing error messages** - Always alert users about errors, don't just console.log
   - ✅ Good: `alert('Error: ' + message); console.error(details);`
   - ❌ Bad: `console.error('Error:', details);` (user never sees it)

3. **Clean data separation** - Don't include UI state in character/data JSON
   - ✅ Good: Only character attributes in export JSON
   - ❌ Bad: Including filter checkboxes or UI preferences in JSON

### File Naming & Organization
- JavaScript files: kebab-case (e.g., `color-manager.js`)
- SVG files: kebab-case, no underscores or spaces
- All modules go in `/js` directory
- HTML structure should use semantic tags and `<group>` elements

### Documentation Preferences
- **Use Mermaid diagrams for flowcharts and architecture diagrams** - Process flows, state machines, and architecture diagrams should use Mermaid syntax
  - ✅ Good: Mermaid flowcharts, sequence diagrams, state diagrams
  - ❌ Bad: ASCII art flowcharts or architecture boxes
- **Use bullet point lists for file/directory tree structures** - File system hierarchies are clear and concise in heirarchical bullet list format.
  - ✅ Good: Markdown lists for directory listings
  - ❌ Bad: Mermaid graphs for simple file structures or ASCII tree using `├──`, `│`, `└──` characters for directory listings

### SVG Asset Rules
**CRITICAL:** AI agents are **forbidden** from creating new SVG artwork. All SVG assets must be hand-crafted by human artists.

**Allowed SVG modifications:**
- Fix incorrect CSS class references (`.body-color`, `.hair-color`, etc.)
- Repair malformed XML or syntax errors
- Correct viewBox dimensions
- Fix xmlns declarations
- Correct style block CSS syntax

**After any SVG modification:**
1. Run `npm run svglint`
2. Test visually in browser
3. Verify color customization still works
4. Test in all relevant body type contexts

## JSDoc Requirements

All public functions, methods, and classes **must** have JSDoc comments:

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

**Required JSDoc elements:**
- Brief description
- `@param` for each parameter with type and description
- `@returns` with type and return value description
- `@throws` if function can throw errors
- Use proper JSDoc types: `{string}`, `{number}`, `{HTMLElement}`, `{Array<string>}`, etc.

## Code Quality Standards

### Linting is Non-Negotiable
All code must pass all linters before PR approval:
```bash
npm run lint        # Run all linters
npm run lint-fix    # Auto-fix issues where possible
npm run eslint      # JavaScript only
npm run htmllint    # HTML only
npm run csslint     # CSS only
npm run svglint     # SVG only
```

### JavaScript Standard Style
- **No semicolons** (JavaScript Standard Style)
- **4-space indentation** (per .editorconfig)
- ES6+ modules required
- Use const/let, never var

### Code Improvement Checklist
- [ ] Remove duplicate code
- [ ] Extract magic numbers to named constants (e.g., `SVG_SIZE = 512`)
- [ ] Fix any invalid HTML attributes (e.g., `tab-index` → `tabindex="0"`)
- [ ] Enhance error messages with actionable guidance
- [ ] Add console.error for debugging alongside user alerts

## Testing Requirements

**No automated tests exist.** All testing is manual via browser interface.

1. **Before making changes:** Run existing app to understand baseline
2. **After making changes:** 
   - Run all linters
   - Test manually with `npm run serve`
   - Follow checklist in TESTING.md
   - Test at **980px × 800px viewport**
   - Take screenshots for UI changes

3. **Body type testing:** When changes affect rendering, test:
   - Humanoid (full feature set)
   - At least 2 other body types
   - Export functionality

## Build Process

**IMPORTANT:** This project uses a build system to generate `index.html` from partials.

### Initial Setup
```bash
npm install  # Install dependencies (required before first build)
```

### Building the HTML
```bash
npm run build  # Generates index.html from src/ partials
```

The build process:
- Runs `node src/build-html.js`
- Combines HTML partials from `src/` directory
- Copies external dependencies (html2canvas, svg-loader)
- Outputs `index.html` to repository root

### Development Workflow
```bash
npm run serve  # Build + watch + start local server
```

This command:
1. Runs `npm run build` to generate index.html
2. Starts `npm run watch` to rebuild on file changes
3. Starts `npx serve` on http://localhost:3000

### Testing Changes
- Navigate to `http://localhost:3000/index.html` (not just `http://localhost:3000/`)
- The serve command shows a directory listing by default
- Always test UI changes in the actual built `index.html`

### Common Build Issues
- **"Cannot find index.html"**: Run `npm run build` first
- **Dependencies missing**: Run `npm install` then `npm run build`
- **Changes not appearing**: Ensure watch is running or rebuild manually

## Common Tasks

### Adding New Features
1. Update HTML structure first
2. Add JavaScript behavior second
3. Add JSDoc comments for new functions
4. Update documentation (README.md, AGENTS.md if architecture changes)
5. Test at 980px × 800px viewport
6. Update TESTING.md with new test scenarios

### Fixing Bugs
1. Reproduce the bug
2. Make minimal fix
3. Test the specific scenario
4. Ensure no regression in other areas
5. Add user-facing error messages where appropriate

### Refactoring
1. Ensure all linters pass before starting
2. Make changes incrementally
3. Test after each significant change
4. Maintain backward compatibility
5. Update JSDoc comments
6. Don't break existing functionality

## Maintainer Preferences

Based on past PR feedback:

1. **Separation of concerns:** Keep HTML structure, CSS styling, and JS behavior separate
2. **User experience:** Always consider the user - show errors, provide feedback
3. **Code readability:** Prefer verbose, clear code over clever shortcuts
4. **Consistency:** Follow established patterns in the codebase
5. **Documentation:** Keep README, AGENTS.md, and TESTING.md up to date
6. **Minimal changes:** Make surgical, targeted changes rather than wholesale rewrites

## PR Submission Guidelines

1. **PR Description:**
   - Use detailed checklists showing progress
   - Explain reasoning for changes
   - Include "Fixes #issue-number" if applicable
   - Add screenshots for UI changes

2. **Commit Messages:**
   - Short, descriptive summaries
   - Use imperative mood ("Add feature" not "Added feature")

3. **Review Process:**
   - Address all feedback promptly
   - PRs reviewed at maintainer's discretion
   - May be accepted, modified, or closed based on project needs
   - Bug fixes prioritized over feature additions

## Resources

- **Full Documentation:** See `AGENTS.md` in repository root
- **Testing Checklist:** See `TESTING.md`
- **Contributing Guidelines:** See `CONTRIBUTING.md`
- **Repository:** https://github.com/lunarcloud/trek-character-icon-creator
- **Live App:** https://samsarette.itch.io/simple-trekkie-character-creator

---

**Remember:** This is a personal project by @lunarcloud. Contributions are considered but not actively solicited. Be respectful of the maintainer's time and preferences.


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
│   ├── character-elements.js  # DOM element references and initialization
│   ├── color-manager.js    # Color pickers, synchronization, and color state
│   ├── uniform-manager.js  # Uniform validation, filtering, and defaults
│   ├── body-type-manager.js   # Body-type-specific rendering logic
│   ├── type-helpers.js     # HTML element getters with runtime type checking
│   ├── util-data.js        # Data manipulation utilities (DataUtil class)
│   └── util-dom.js         # DOM manipulation utilities (DomUtil class)
├── svg/                # SVG asset directory
│   └── {body-type}/    # SVG asset directories for each character body type
│       ├── body.svg        # Base body SVG (required)
│       ├── body-overlay.svg # Optional overlay layer
│       ├── body/           # Alternative: body parts as subdirectory
│       ├── ears/           # Species-specific ear variations
│       ├── extra/          # Additional customization options
│       ├── facial-hair/    # Facial hair styles
│       ├── hair/           # Hair styles
│       ├── head-features/  # Species-specific head features (ridges, antennae, etc.)
│       ├── nose/           # Nose variations
│       ├── rear-hair/      # Back hair/ponytails
│       └── uniform/        # Uniform styles for this body type
└── fonts/              # Custom fonts
```

**Note:** Body type directories vary in structure. Each contains `body.svg` or `body/` subdirectory. Subdirectories for customization options (ears, hair, uniform, etc.) differ per body type based on what's applicable. Filenames should be kebob-case, no underscores or spaces.

### Key Components

#### IndexController (`index.js`)
Main application controller that orchestrates the modular architecture:
- Initializes and coordinates all manager modules
- Handles top-level change detection
- Manages character rendering workflow
- Image export functionality

#### CharacterElements (`js/character-elements.js`)
Manages DOM element references:
- Centralizes all element lookups
- Setup for interactive elements (next buttons)
- Provides element collections for change detection

#### ColorManager (`js/color-manager.js`)
Handles all color-related functionality:
- Color picker initialization and pairing with selectors
- Color synchronization (e.g., antennae with body color)
- Last-used color tracking per body type
- Color validation and CSS style generation

#### UniformManager (`js/uniform-manager.js`)
Manages uniform selection logic:
- Uniform validation based on body type
- Color option filtering by uniform type
- Default uniform selection
- Hiding invalid options

#### BodyTypeManager (`js/body-type-manager.js`)
Handles body-type-specific rendering:
- Separate update methods for each body type (humanoid, cetaceous, medusan, cal-mirran, qofuari, sukhabelan, exocomp)
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
- Don't add a document that solely describes the PR changes
- Don't add "tests" which are manual web pages to demonstrate a newly-added feature. (Use "spec" unit tests instead)
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
