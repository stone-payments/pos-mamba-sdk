#  Mamba Prettier Config

[Prettier](https://prettier.io/docs/en/index.html) config of
[Mamba SDK](https://mambasdk-docs.stone.com.br) with [Svelte](https://svelte.dev) + [TypeScript](https://www.typescriptlang.org).

## Usage

1. Install:

```bash
npm install --save-dev @mamba/prettier-config prettier svelte
```

2. Add the the `.prettierrc.js` (or `.prettierrc.cjs` if you use ESM) at your project root:

```js
module.exports = {
  ...require('@mamba/prettier-config'),
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

```json5
// Normally these configs aren't necessary, but it's an example for enforce format JavaScript files with Prettier.
"editor.formatOnSave": true,
"editor.defaultFormatter": "esbenp.prettier-vscode",
"[javascript]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
},
```

Now every time you save your code, it will be formatted by Prettier...

> For more info about editor and other integrations check the
> [Prettier Docs ](https://prettier.io/docs/en/editors.html)

#### Svelte integration

In order to provide syntax highlighting and rich intellisense for Svelte components in VS Code,
using the svelte language server you need to make some adjustments to your editor.

1. Install the
   [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
   extension

2. Then at your `.vscode/settings.json` file of your workspace, add the following settings:

```json5
// ! Keep Svelte extension to deal with svelte files, instead Prettier extension.
"[svelte]": {
  "editor.defaultFormatter": "svelte.svelte-vscode"
}
```

> You can read all the features it provides at his
> [GitHub Repo](https://github.com/sveltejs/language-tools/tree/master/packages/svelte-vscode)

## License

Licensed under the [Apache 2.0 License](/LICENSE).
