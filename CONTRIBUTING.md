# Contributing to Open Schema Designer

We love your input! We want to make contributing to Open Schema Designer as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/yourusername/schema-visualizer/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/schema-visualizer/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open http://localhost:3000

## Coding Style

- We use TypeScript for type safety
- We use ESLint and Prettier for code formatting
- We follow React best practices
- Keep components small and focused
- Use meaningful variable and function names
- Add comments for complex logic

## Adding New Features

Before starting work on a major feature:

1. Check if there's already an issue for it
2. If not, create an issue to discuss the feature
3. Wait for maintainer feedback before starting work
4. Create a pull request when ready

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── home/              # Homepage components
│   ├── schema/            # Schema designer components
│   ├── layout/            # Layout and navigation
│   └── ui/                # Reusable UI components
├── contexts/              # React Context providers
├── lib/                   # Utilities and business logic
└── types/                 # TypeScript type definitions
```

## Testing

- Write unit tests for utilities and business logic
- Test components with React Testing Library
- Ensure all tests pass before submitting PR

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for complex functions
- Update type definitions when needed

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## References

This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md)
