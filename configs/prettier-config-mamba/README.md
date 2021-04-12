# prettier-config-mamba

[Prettier](https://prettier.io/docs/en/index.html) config of
[Stone Payments - Mamba SDK](https://mambasdk-docs.stone.com.br).

## Usage

1. Install locally:

```bash
yarn add -D prettier-config-mamba prettier
```

2. Add the the `.prettierrc.js` at your project root:

```
module.exports = {
  ...require('prettier-config-mamba'),
  // semi: false, // Override some property
};
```

## Editor support

In order to format code automatically when you save it, you can tell your editor which tool to use.
Or you can just do a [Husky](https://github.com/typicode/husky) +
[lint-staged](https://github.com/okonet/lint-staged) config to only format your code when you commit
it for example.

### VSCode integration

Install VSCode
[Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode),
and add `.vscode/settings.json` file to your workspace, add the following settings:

```
"editor.formatOnSave": true,

"editor.defaultFormatter": "esbenp.prettier-vscode",
"[javascript]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
},
```

Now every time you save your code, it will be formatted by Prettier...

> For more info about editor and other integrations check the
> [Prettier Docs ](https://prettier.io/docs/en/editors.html)

## 📑 License

Licensed under the [Apache 2.0 License](/LICENSE).
