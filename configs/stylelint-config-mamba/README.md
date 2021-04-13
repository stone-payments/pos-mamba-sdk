# stylelint-config-mamba

[Stylelint](https://stylelint.io/) configuration for [Mamba SDK](https://mambasdk-docs.stone.com.br)
projects

## Usage

1. Install locally:

```bash
yarn add -D stylelint-config-mamba
```

2. Install `stylelint`:

```bash
yarn add -D stylelint
```

3. Enable this configuration in your Stylelint configuration file (e.g. `.stylelintrc.js`):

```js
module.exports = {
  extends: 'stylelint-config-mamba',
};
```

This shareable config expands to the following:

```js
// stylelint-config-mamba/index.js
{
  extends: [
    'stylelint-config-standard',
    'stylelint-config-rational-order',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': true,
    // other rules ...
  }
}
```

Which uses:

- [Standard Stylelint - The standard shareable config for stylelint](https://github.com/stylelint/stylelint-config-standard)
- [Order plugin - order related linting rules](https://github.com/hudochenkov/stylelint-order)
- [Rational Order - sorts related property declarations by grouping together in the rational order](https://github.com/constverum/stylelint-config-rational-order)
- [Stylelint plugin for Prettier formatting](https://github.com/prettier/stylelint-prettier)

### VSCode integration

To work with [Visual Studio Code](https://code.visualstudio.com), you must install the
[stylelint.vscode-stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
plugin.

## 📑 License

Licensed under the [Apache 2.0 License](/LICENSE).
