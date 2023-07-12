# @mamba/commitlint-config-standard

[Commitlint](https://commitlint.js.org) and [Commitizen git-cz](https://github.com/streamich/git-cz)
command line configurations of [Stone Payments - Mamba SDK](https://mambasdk-docs.stone.com.br).

Minimal questions config:

```bash
type(scope): subject # scope can be overwritten to make more sense to your project, see step 4...
```

Commit types with disabled Emoji:

```js
{ value: 'feat', name: 'feat:     ✨  A new feature', emoji: ':sparkles:' },
{ value: 'fix', name: 'fix:      🐛  A bug fix', emoji: ':bug:' },
{ value: 'docs', name: 'docs:     📝  Documentation only changes', emoji: ':memo:' },
{
  value: 'style',
  name: 'style:    💄  Changes that do not affect the meaning of the code',
  emoji: ':lipstick:',
},
{
  value: 'refactor',
  name: 'refactor: ♻️   A code change that neither fixes a bug nor adds a feature',
  emoji: ':recycle:',
},
{ value: 'perf', name: 'perf:     ⚡️  A code change that improves performance', emoji: ':zap:' },
{
  value: 'test',
  name: 'test:     ✅  Adding missing tests or correcting existing tests',
  emoji: ':white_check_mark:',
},
{
  value: 'build',
  name: 'build:    📦️  Changes that affect the build system or external dependencies',
  emoji: ':package:',
},
{
  value: 'ci',
  name: 'ci:       🎡  Changes to our CI configuration files and scripts',
  emoji: ':ferris_wheel:',
},
{
  value: 'chore',
  name: "chore:    🛠   Other changes that don't modify src or test files",
  emoji: ':hammer:',
},
{ value: 'revert', name: 'revert:   ⏪️  Reverts a previous commit', emoji: ':rewind:' },
{ value: 'release', name: 'release:  🏹  Create a release commit', emoji: ':bow_and_arrow:' },
{ value: 'fire', name: 'fire:     🔥  Removing code or files', emoji: ':fire:' },
{
  value: 'conf',
  name: 'conf:     🏗   A commit related to configs or scaffolding',
  emoji: ':gear:',
},
{ value: 'shirt', name: 'shirt:    👔  Removing linter warnings', emoji: ':shirt:' },
{ value: 'wip', name: 'wip:      🚧  A work in progress commit', emoji: ':construction:' },
{
  value: 'security',
  name: 'security: 🔒  A commit that improves or fixes security',
  emoji: ':lock:',
}
```

## Usage

1. Install [Commitizen](https://github.com/commitizen/cz-cli) globally and
   `@mamba/commitlint-config-standard` locally:

```bash
npm install -g commitizen #optional
npm install --save-dev @mamba/commitlint-config-standard
```

1. Add in your `package.json` add:

```json
{
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

1. Add [Commitlint](https://commitlint.js.org) config file `.commitlintrc` at your project
   root:

```json
{
  "extends": ["@mamba/commitlint-config-standard"]
}
```

1. Run in your terminal:

```bash
cz
```

## License

Licensed under the [Apache 2.0 License](/LICENSE).
