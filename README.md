# Mamba Web

## Requirements

Make sure all dependencies have been installed before moving on:

* [Node.js](http://nodejs.org/) >= 6.9.x
* [Yarn](https://yarnpkg.com/en/docs/install)
* [Bolt](http://boltpkg.com/)

### Commands

* `bolt run start` - Start the project's main website dev server;
* `bolt run build` - Build the all packages;
* `bolt run lint` - Lint all style and script files;
* `bolt run format` - Format all style and script files;
* `bolt run link:packages` - Create a local link of every package for local developing;
* `bolt ws build` - Execute the build script in all packages;

#### Bolt specific

> [Bolt documentation](https://github.com/boltpkg/bolt/blob/master/README.md#commands)

* `bolt w @mambasdk/<workspace> <npm-script>` - Run a npm script on a workspace. Examples:
  * `bolt w @mambasdk/utils build` - Build the `@mambasdk/utils`;
  * `bolt w @mambasdk/utils start` - Build while watching the `@mambasdk/utils`;
* `bolt ws <npm-script>` - Run a npm script on all workspaces.
