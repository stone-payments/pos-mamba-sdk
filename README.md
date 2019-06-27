<p align="center">
  <a href="http://ant.design">
    <img width="300" src="https://mambasdk-docs.stone.com.br/images/logoMamba.svg">
  </a>
</p>

<div align="center">

The solution that turns a POS(point of Sale) into much more than payment!

Develop applications using only web technology, without worrying about the complications of the capabilities of a POS.
<br/>
<br/>
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![npm package](https://img.shields.io/npm/v/@mamba/app.svg?style=flat-square)](https://www.npmjs.org/package/mamba) 
<br/>
</div>
<br/>

<br/>
<div align="center">
<div><a href="https://www.stone.co" target="_blank">📝 Documentation</a></div><br/>
<div><img height="21" align="top" src="https://www.stone.com.br/static/images/favicon.png" hspace="1"><a href="https://www.stone.co" target="_blank">&nbsp;Stone.co</a></div> 
</div>
<br/>
<br/>


## ✅ Requirements

Make sure all dependencies have been installed before moving on:

- [Node.js](http://nodejs.org/) >= v8.11.3
- [Lerna](https://github.com/lerna/lerna) >= v3.0.0



## 📦 Getting Started

### With `@mamba/cli`

```shell
# Install the mamba cli globally if doesn't already have it
npm i -g @mamba/cli

# Create a new mamba app at 'my-mamba-app' directory
mamba new app my-mamba-app

? Name: My Mamba App
? Version: 0.0.1
? Description: My new Mamba app

```


### Manually

```shell
# Create and enter your new app directory
mkdir my-mamba-app
cd my-mamba-app

# Install the standard mamba app template
npx degit stone-payments/pos-mamba-app-template

```

## ⌨️ Development

Once you have completed the installation step, you are ready to start the project!

```bash
cd my-mamba-app # Your project folder

# Install its dependencies
npm i

# Run the development server
npm run start
```

Open your browser and visit http://127.0.0.1:8080 , see more at [Development](https://mambasdk-docs.stone.com.br/guide#desenvolvendo).



## 🔨 Components usage

For Web Components, install the component / package that you want to use in the project:

```bash
npm install @mamba/button # Button component


# If you want to use the dialog component for example:

npm install @mamba/dialog

```

To import the installed component, simply do one of the following:


```bash
<script>
import Button from '@mamba/button';

export default {
  components: { Button }
}

<script>
export default {
  components: {
    Button: '@mamba/button'
  }
}
</script>
```


## 🧰 Commands

- `npm run lint` - Lint all style and script files;
- `npm run format` - Format all style and script files;
- `npm run link:packages` - Create a local link of every package for local developing;
- `npm run test` - Run all tests once;
- `npm run test:watch` - Run all tests and keep watching for changes;
- `npm run release` - Release a new version of the SDK;
- `lerna run x` - Execute the `x` script in all packages;
- `lerna run start --scope=@mamba/component --stream` - Run the dev server for a specific component;

## Contributing

### ✏️ Commiting

Our commits follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/) standard:

`<type>[optional scope]: <description>`

By installing `git-cz` _globally_ (`npm i -g git-cz`) it's possible to use `git cz` instead of `git commit` for a interactive commit helper.

## 🔗 Useful links

- [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/)
- [Mamba App Template](https://github.com/stone-payments/pos-mamba-app-template)
- [Mamba SDK documentation](https://mambasdk-docs.stone.com.br/)
- [Lerna documentation](https://github.com/lerna/lerna#readme)
