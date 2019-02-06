# [Mamba SDK](https://mambasdk-docs.stone.com.br/)

[![Greenkeeper badge](https://badges.greenkeeper.io/stone-payments/pos-mamba-sdk.svg)](https://greenkeeper.io/)

## Requirements

Make sure all dependencies have been installed before moving on:

- [Node.js](http://nodejs.org/) >= v8.11.3
- [Lerna](https://github.com/lerna/lerna) >= v3.0.0

### Commands

- `npm run lint` - Lint all style and script files;
- `npm run format` - Format all style and script files;
- `npm run link:packages` - Create a local link of every package for local developing;
- `npm run test` - Run all tests once;
- `npm run test:watch` - Run all tests and keep watching for changes;
- `lerna run x` - Execute the `x` script in all packages;
- `lerna run start --scope=@mamba/component --stream` - Run the dev server for a specific component;

### Contributing

#### Commiting

Our commits follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/) standard:

`<type>[optional scope]: <description>`

You can use `git cz` instead of `git commit` for a interactive commit helper.

## Useful

- [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/)
- [Mamba App Template](https://github.com/stone-payments/pos-mamba-app-template)
- [Mamba SDK documentation](https://mambasdk-docs.stone.com.br/)
- [Lerna documentation](https://github.com/lerna/lerna#readme)
