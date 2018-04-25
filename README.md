# Mamba Websdk

> A framework to build mamba applications

## Project structure

```text
mamba-websdk
├── docs                    # → Documentation used by styleguidist
├── packages                # → Mamba websdk packages
│   ├── components          # → Directory for mamba component packages
│   ├── css-packs           # → Base css packs used by all Mamba components
│   │   ├── core-styles     # → @mamba/core-styles directory
│   │   └── styles-utils    # → @mamba/style-utils directory
│   └── websdk              # → @mamba/websdk directory
├── tests                   # → Generic tests directory
│   └── __mocks__           # → Test mockups
└── tools                   # → Development tools configuration and helpers
    ├── cli                 # → Mamba CLI helper
    ├── styleguidist        # → Styleguidist configuration files
    └── webpack             # → Webpack configuration files
```

## Requirements

Make sure all dependencies have been installed before moving on:

* [Node.js](http://nodejs.org/) >= 6.9.x
* [Yarn](https://yarnpkg.com/en/docs/install)
* [Bolt](http://boltpkg.com/)

## Developing

* [Clone](https://github.com/stone-payments/pos-mamba-websdk) or [Download](#fix-link) this repository

* Install node dependencies for all packages

    ```bash
    $ bolt
    ```

* Build the project

    ```bash
    $ bolt build
    ```

or

* Start developing

    ```bash
    $ bolt start
    ```

### Commands

* `bolt start` - Start the styleguide webserver;
* `bolt build` - Build the WebSDK package;
* `bolt build:styleguide` - Build the styleguide for distribution;
* `bolt test` - Execute tests;
* `bolt lint` - Lint all style and script files;
* `bolt format` - Format all style and script files;
* `bolt ws build` - Execute the build script in all packages;
* `bolt create:element` - Execute helper to create a new Component.

#### Bolt specific
> [Bolt documentation](https://github.com/boltpkg/bolt/blob/master/README.md#commands)

* `bolt w @mamba/<workspace> <npm-script>` - Run a npm script on a workspace. Examples:
  * `bolt w @mamba/websdk build:analyze` - Analyze the `websdk` bundle;
  * `bolt w @mamba/button build` - Build the `button`;
* `bolt ws <npm-script>` - Run a npm script on all workspaces.
