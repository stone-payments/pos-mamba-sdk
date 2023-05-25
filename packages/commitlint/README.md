# @mamba/commitlint-config-standard

[Commitlint](https://commitlint.js.org) and [Commitizen git-cz](https://github.com/streamich/git-cz)
command line configurations of [Stone Payments - Mamba SDK](https://mambasdk-docs.stone.com.br).

Minimal questions config:

```bash
type(scope): subject # scope can be overwritten to make more sense to your project, see step 4...
```

Commit types with disabled Emoji:

```js
{
  chore: {
    description: "Build process or auxiliary tool changes, that don't modify src or test files",
    value: "chore",
    title: "Chores"
  },
  ci: {
    description: "Changes to our CI configuration files",
    value: "ci",
    title: "Continuous Integrations"
  },
  docs: {
    description: "Documentation only changes",
    value: "docs",
    title: "Documentation"
  },
  feat: {
    description: "A new feature",
    value: "feat",
    title: "Features"
  },
  fix: {
    description: "A bug fix",
    value: "fix",
    title: "Bug Fixes"
  },
  perf: {
    description: "A code change that improves performance",
    value: "perf",
    title: "Performance Improvements"
  },
  refactor: {
    description: "A code change that neither fixes a bug or adds a feature",
    value: "refactor",
    title: "Code Refactoring"
  },
  revert: {
    description: "Reverts a previous commit",
    value: "revert",
    title: "Reverts"
  },
  release: {
    description: "Create a release commit",
    value: "release",
    title: "Style"
  },
  fire: {
    description: "Removing code or files",
    value: "fire",
    title: "Fires"
  },
  style: {
    description: "Changes that do not affect the meaning of the code (Markup, white-space, formatting, missing semi-colons...)",
    value: "style",
    title: "Style"
  },
  test: {
    description: "Adding missing tests",
    value: "test",
    title: "Tests"
  },
  shirt: {
    description: "Removing linter warnings",
    value: "shirt",
    title: "Linter fixes"
  },
}
```

## Usage

1. Install [Commitizen](https://github.com/commitizen/cz-cli) globally and
   `@mamba/commitlint-config-standard`, `git-cz` locally:

```bash
npm install -g commitizen
npm install --save-dev @mamba/commitlint-config-standard git-cz
```

2. Add in your `package.json` add:

```json
{
  "config": {
    "commitizen": {
      "path": "git-cz"
    }
  }
}
```

3. Add [Commitlint](https://commitlint.js.org) config file `commitlint.config.js` at your project
   root:

```js
// commitlint.config.js

module.exports = {
  extends: ['mamba'],
};
```

4. Finally add the the `changelog.config.js` at your project root, that git-cz will read:

```js
// changelog.config.js

module.exports = {
  ...require('@mamba/commitlint-config-standard/cz'),
  // scopes: [] // Overrides scopes
};
```

5. Run in your terminal:

```bash
git cz
```

## License

Licensed under the [Apache 2.0 License](/LICENSE).
