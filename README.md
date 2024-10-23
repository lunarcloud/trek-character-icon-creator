Icon-y Character Creator for Star Trek
=============================================================================================

[![app](https://img.shields.io/badge/app-Itch.io-red)](https://samsarette.itch.io/simple-trekkie-character-creator)
[![GitHub License](https://img.shields.io/github/license/lunarcloud/trek-character-icon-creator)](https://github.com/lunarcloud/trek-character-icon-creator/blob/main/LICENSE)
[![GitHub top language](https://img.shields.io/github/languages/top/lunarcloud/trek-character-icon-creator)](https://github.com/lunarcloud/trek-character-icon-creator/pulse)
[![environment](https://img.shields.io/badge/env-Browser-green)](https://developer.mozilla.org/en-US/docs/Glossary/Browser)

Character Creator for Star Trek style character icons

## Development Setup
```sh
npm i
npm run copy-deps
npm serve
```

## Code Quality Tools
The project has linters for the HTML, CSS, and JavaScript all setup and configured.
Simply run `npm run lint-fix` to run all of them in "fix what you can automatically" mode.

## CSS Colors in SVG
All SVG files have been hand-edited to enable color changing of certain shapes/paths.
New files will have to, if they want to support color changes, or utilizing existing color change classes, do the same.

```svg
    <style>
        .body-color {
            color: #fee4b3;
        }
    </style>
    ...
    <path fill="currentColor" class="body-color" ... >
```