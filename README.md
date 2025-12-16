Icon-y Character Creator for Star Trek
=============================================================================================

[![app](https://img.shields.io/badge/app-Itch.io-red)](https://samsarette.itch.io/simple-trekkie-character-creator)
[![GitHub License](https://img.shields.io/github/license/lunarcloud/trek-character-icon-creator)](https://github.com/lunarcloud/trek-character-icon-creator/blob/main/LICENSE)
[![GitHub top language](https://img.shields.io/github/languages/top/lunarcloud/trek-character-icon-creator)](https://github.com/lunarcloud/trek-character-icon-creator/pulse)
[![environment](https://img.shields.io/badge/env-Browser-green)](https://developer.mozilla.org/en-US/docs/Glossary/Browser)

![Code Quality](https://github.com/lunarcloud/trek-character-icon-creator/actions/workflows/lint.yml/badge.svg)


Character Creator for Star Trek style character icons

## Features
- Multiple body types: Humanoid, Cetaceous, Exocomp, Medusan, and Sukhabelan (non-canon)
- Extensive uniform options from various Star Trek series
- Customizable hair, facial hair, and facial features
- Species-specific features (Vulcan ears, Klingon ridges, etc.)
- Color customization for body, uniform, and hair
- Export as PNG image with optional background

## Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation
```sh
npm install
npm run copy-deps
```

### Running Locally
```sh
npm run serve
```

This will start a local development server. Open your browser to the URL shown (typically http://localhost:3000).

## Code Quality Tools
The project has linters for the HTML, CSS, and JavaScript all setup and configured.

### Running Linters
```sh
npm run lint        # Run all linters (ESLint, HTML, CSS, SVG)
npm run lint-fix    # Auto-fix issues where possible
npm run eslint      # JavaScript linting only
npm run htmllint    # HTML linting only
npm run csslint     # CSS linting only
npm run svglint     # SVG linting only
```

## Project Structure
- `index.html` - Main HTML file with character creator UI
- `index.js` - Main JavaScript controller
- `index.css` - Main stylesheet
- `util-*.js` - Utility modules for DOM and data manipulation
- `type-helpers.js` - TypeScript-style type helpers for better IDE support
- `humanoid/` - SVG assets for humanoid characters
- `cetaceous/`, `exocomp/`, `medusan/`, `sukhabelan/` - Assets for other body types

## Adding New Features

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
