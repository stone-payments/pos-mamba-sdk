# Mamba Web

## Requirements

Make sure all dependencies have been installed before moving on:

* [Node.js](http://nodejs.org/) >= 6.9.x
* [Yarn](https://yarnpkg.com/en/docs/install)
* [Bolt](http://boltpkg.com/)

### Commands

* `bolt start` - Start the styleguide webserver;
* `bolt build` - Build the WebSDK package;
* `bolt lint` - Lint all style and script files;
* `bolt format` - Format all style and script files;
* `bolt ws build` - Execute the build script in all packages;

#### Bolt specific
> [Bolt documentation](https://github.com/boltpkg/bolt/blob/master/README.md#commands)

* `bolt w @mamba/<workspace> <npm-script>` - Run a npm script on a workspace. Examples:
  * `bolt w @mamba/utils build:analyze` - Analyze the `@mamba/utils` bundle;
  * `bolt w @mamba/utils build` - Build the `@mamba/utils`;
  * `bolt w @mamba/utils watch` - Build while watching the `@mamba/utils`;
* `bolt ws <npm-script>` - Run a npm script on all workspaces.
