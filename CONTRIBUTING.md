# Contributing to Trek Character Icon Creator

Thank you for your interest in contributing to the Trek Character Icon Creator! This document provides guidelines for contributing to the project.

## Code of Conduct

Please be respectful and considerate in all interactions with the project and its community.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Run the copy-deps script: `npm run copy-deps`
5. Start the development server: `npm run serve`

## Development Workflow

### Making Changes

1. Create a new branch for your feature or bugfix
2. Make your changes
3. Test your changes locally
4. Run linters to ensure code quality: `npm run lint`
5. Fix any linting issues: `npm run lint-fix`
6. Commit your changes with a clear, descriptive commit message

### Code Style

This project uses automated linting tools to maintain code quality:
- **ESLint** for JavaScript
- **stylelint** for CSS
- **linthtml** for HTML
- **svglint** for SVG files

Please ensure your code passes all linters before submitting a pull request.

### Adding New Assets

When adding new SVG assets:

1. Place them in the appropriate directory (`humanoid/`, `cetaceous/`, etc.)
2. Follow the existing naming conventions
3. Add color customization classes where appropriate:
   ```svg
   <style>
       .body-color {
           color: #fee4b3;
       }
   </style>
   ...
   <path fill="currentColor" class="body-color" ... >
   ```
4. Test the asset in the character creator to ensure it displays correctly

### Adding New Features

When adding new features to the character creator:

1. Update the HTML in `index.html` to add UI controls
2. Update `index.js` to handle the new feature logic
3. Update styles in `index.css` as needed
4. Test thoroughly with different combinations of options
5. Update documentation in README.md if the feature is user-facing

## Testing

Currently, this project relies on manual testing. When making changes:

1. Test the character creator in multiple browsers (Chrome, Firefox, Safari, Edge)
2. Test different body types and combinations of features
3. Verify the export/save functionality works correctly
4. Check that color customization works as expected

## Submitting Changes

1. Push your changes to your fork
2. Create a pull request to the main repository
3. Provide a clear description of your changes
4. Reference any related issues
5. Wait for code review and address any feedback

## Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and version information
- Screenshots if applicable

## Questions?

If you have questions about contributing, feel free to open an issue for discussion.

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (see LICENSE and LICENSE-CODE files).
