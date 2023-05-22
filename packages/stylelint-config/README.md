# Mamba Stylelint Config

> A sharable [Stylelint](https://stylelint.io/) configuration that enforce CSS rules of [Mamba SDK](https://mambasdk-docs.stone.com.br) projects.

## Install

1. Install:

```bash
npm install --save-dev @mamba/stylelint-config stylelint
```
2. Enable this configuration in your Stylelint configuration file (e.g. `.stylelintrc.js`):

```js
module.exports = {
  extends: ' @mamba/stylelint-config',
};
```

This shareable config expands to the following:

```js
/** @mamba/stylelint-config/index.js */
{
  extends: [
    'stylelint-config-html/html',
    'stylelint-config-html/svelte',
    'stylelint-config-standard',
    'stylelint-prettier',
  ],
  customSyntax: 'postcss-html',
  rules: {
    // ...
  }
}
```

### VSCode integration

To work with [Visual Studio Code](https://code.visualstudio.com), you must install the
[stylelint.vscode-stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
plugin.

## License

Licensed under the [Apache 2.0 License](/LICENSE).
