# Contributing

This is primarily a personal project by @lunarcloud. While contributions are not actively solicited, bug fixes and feature submissions may be considered at the maintainer's discretion.

## Submitting Changes

If you wish to submit a fix or feature:

1. Fork the repository and create a branch for your changes
2. Ensure your code passes all linters: `npm run lint`
3. Test your changes thoroughly
4. Submit a pull request with a clear description

Pull requests may or may not be accepted based on project needs and priorities.

## Code Style

This project uses automated linting tools:
- **ESLint** for JavaScript
- **stylelint** for CSS
- **linthtml** for HTML
- **svglint** for SVG files

Run `npm run lint-fix` to automatically fix common issues.

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

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE and LICENSE-CODE files).

