# Mamba Babel Preset

Babel configs and presets:

- It includes an extensible configuration capable to support legacy browsers (targets Safari 5.1) with proper browserlist config.
- Supports Typescript files, Jest + Webpack configurations and Svelte as web framework.
- Resolve path aliases both on Svelte files and Typescript files.
- Includes plugins: `@babel/plugin-proposal-optional-chaining`, `@babel/plugin-proposal-nullish-coalescing-operator`, `@babel/plugin-proposal-class-properties`, `@babel/plugin-syntax-dynamic-import` and others(see source)...

> This package normally is used with Webpack 5(babel-loader) and/or the `.babelrc.js` (or similar) configuration file.

## Usage

```bash
npm install --save-dev @mamba/babel-config
```

#### With `.babelrc.js` (or `.babelrc.cjs` if you use ESM) at your project root:

```js
module.exports = {
  extends: '@mamba/babel-config/common.cjs',
};
```

#### Webpack 5(babel-loader) with Typescript 5+ config:

- `Babel`: Default config along with preset-env and preset-typescript.
- `BabelSvelte`: Used mainly to solve the post-processing of typescript paths alias.
- `BabelCJS`: Used for transpiling (if you need target a ESNext module to old browser).

```ts
import * as webpack from 'webpack';
import { Babel, BabelCJS, BabelSvelte } from '@mamba/babel-preset';

const config: webpack.Configuration = {
  // ...
  module: {
    rules: [
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: [BabelSvelte, Svelte],
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        // You can try to remove `Babel` here to minimize processing,
        // hopefully you won't be seeing an ocean of red squiggles depending on your configurations.
        use: [Babel, TypeScript],
      },

      // This config is purely optional, if you want to blend ESM with CJS in your source folder.
      {
        test: /\.(c|m)?js$/,
        include: [
          /* include your source folder */
        ],
        exclude: [/node_modules/],
        use: [Babel],
      },
    ],
  },
};
```

## License

Licensed under the [Apache 2.0 License](/LICENSE).
