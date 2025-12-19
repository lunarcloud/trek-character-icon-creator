# Contributing

This is primarily a personal project by @lunarcloud. While contributions are not actively solicited, bug fixes and feature submissions may be considered at the maintainer's discretion.

## Submitting Changes

If you wish to submit a fix or feature:

1. Fork the repository and create a branch for your changes
2. Ensure your code passes all linters: `npm run lint`
3. Test your changes thoroughly using the checklist in TESTING.md
4. Ensure all new functions have JSDoc comments
5. Test at 980px × 800px viewport (itch.io target size)
6. Submit a pull request with a clear description

Pull requests may or may not be accepted based on project needs and priorities.

## Code Style

This project uses automated linting tools:
- **ESLint** for JavaScript (with JavaScript Standard Style)
- **stylelint** for CSS
- **linthtml** for HTML
- **svglint** for SVG files

Run `npm run lint-fix` to automatically fix common issues.

### JavaScript Requirements
- ES6+ module syntax
- JSDoc comments required for all public functions, methods, and classes
- No semicolons (JavaScript Standard Style)
- 4-space indentation
- Use `jsconfig.json` for editor support (NO TypeScript)

### JSDoc Example
```javascript
/**
 * Description of what the function does.
 * @param {string} paramName - Parameter description
 * @returns {ReturnType} Description of return value
 */
export function myFunction(paramName) {
    // implementation
}
```

## Adding SVG Assets

When adding new SVG assets, follow the color customization pattern:

```svg
<style>
    .body-color {
        color: #fee4b3;
    }
</style>
...
<path fill="currentColor" class="body-color" ... >
```

See README.md for the full list of available CSS color classes.

## Testing

Since this project has no automated tests, manual testing is essential:
- See TESTING.md for a comprehensive testing checklist
- Test all changes in a browser with `npm run serve`
- Test at the target viewport size: 980px × 800px
- Test across different body types when making architectural changes
- Verify no console errors or warnings

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE and LICENSE-CODE files).

