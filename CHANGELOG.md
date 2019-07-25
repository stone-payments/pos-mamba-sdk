# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.10.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.9.1...v2.10.0) (2019-07-25)


### Bug Fixes

* 🐛 changelog duplicate ([97fc20b](https://github.com/stone-payments/pos-mamba-sdk/commit/97fc20b))


### Features

* 🎸 Implement readonlyOnEnter attr on money input ([#452](https://github.com/stone-payments/pos-mamba-sdk/issues/452)) ([ff5df7a](https://github.com/stone-payments/pos-mamba-sdk/commit/ff5df7a))





## [2.9.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.8.3...v2.9.1) (2019-07-19)

### Bug Fixes

- 🐛 method hide app bar updated ([0a58288](https://github.com/stone-payments/pos-mamba-sdk/commit/0a58288))
- 🐛 npm badge link ([7afa671](https://github.com/stone-payments/pos-mamba-sdk/commit/7afa671))
- 🐛 script syntax ([1b786d6](https://github.com/stone-payments/pos-mamba-sdk/commit/1b786d6))
- 🐛 script tag ([53b5875](https://github.com/stone-payments/pos-mamba-sdk/commit/53b5875))
- 🐛 unwanted text removed ([fcb4147](https://github.com/stone-payments/pos-mamba-sdk/commit/fcb4147))

### Features

- 🎸 adds the ability to configure feature flags ([#444](https://github.com/stone-payments/pos-mamba-sdk/issues/444)) ([b512e31](https://github.com/stone-payments/pos-mamba-sdk/commit/b512e31))
- 🎸 New feature add AppBar back icon override method | this.root.meta.setNavigableRoute ([#445](https://github.com/stone-payments/pos-mamba-sdk/issues/445)) ([9a9a0bb](https://github.com/stone-payments/pos-mamba-sdk/commit/9a9a0bb))
- 🎸 New feature remove header appBar ([e636d2d](https://github.com/stone-payments/pos-mamba-sdk/commit/e636d2d))

### Performance Improvements

- ⚡️ remove Boolean check ([2b52cf5](https://github.com/stone-payments/pos-mamba-sdk/commit/2b52cf5))

* release/2.8.2 (#441) ([847ed7a](https://github.com/stone-payments/pos-mamba-sdk/commit/847ed7a)), closes [#441](https://github.com/stone-payments/pos-mamba-sdk/issues/441) [#439](https://github.com/stone-payments/pos-mamba-sdk/issues/439)

### BREAKING CHANGES

- Feature Flags
- add `changeOn` param at Tabs; add `route` param at TabPane

- docs: ✏️ update docs description and for the new params

- fix: 🐛 Remove useless scripts

- fix: 🐛 Fix test case

- chore(release): :robot: publish

## [2.8.3](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.8.2...v2.8.3) (2019-06-10)

### Bug Fixes

- 🐛 adjust dependency cycles of [@mamba](https://github.com/mamba)/pos -> [@mamba](https://github.com/mamba)/app ([ef0e9c8](https://github.com/stone-payments/pos-mamba-sdk/commit/ef0e9c8))
- 🐛 Fix test case ([cd711eb](https://github.com/stone-payments/pos-mamba-sdk/commit/cd711eb))
- 🐛 getVersion system invalid left-hand ([2562178](https://github.com/stone-payments/pos-mamba-sdk/commit/2562178))
- 🐛 getVersion with invalid lef-hand ([d99a000](https://github.com/stone-payments/pos-mamba-sdk/commit/d99a000))
- 🐛 lerna circular dependency ([ff17a32](https://github.com/stone-payments/pos-mamba-sdk/commit/ff17a32))
- 🐛 remove svelte 3 peer deps ([9df5b85](https://github.com/stone-payments/pos-mamba-sdk/commit/9df5b85))

### Features

- 🎸 Add getInfo to Merchant and panel ([ecdc967](https://github.com/stone-payments/pos-mamba-sdk/commit/ecdc967))
- 🎸 add identification type for merchant ([75e416b](https://github.com/stone-payments/pos-mamba-sdk/commit/75e416b))
- 🎸 Create operating mode by route ([#439](https://github.com/stone-payments/pos-mamba-sdk/issues/439)) ([67fccfe](https://github.com/stone-payments/pos-mamba-sdk/commit/67fccfe))
- 🎸 List brands docs ([13d85bf](https://github.com/stone-payments/pos-mamba-sdk/commit/13d85bf))

### BREAKING CHANGES

- add `changeOn` param at Tabs; add `route` param at TabPane

- docs: ✏️ update docs description and for the new params

- fix: 🐛 Remove useless scripts

## [2.8.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.7.2...v2.8.2) (2019-05-27)

### Bug Fixes

- 🐛 HTTP Status Codes do wrapper do simulador ([#433](https://github.com/stone-payments/pos-mamba-sdk/issues/433)) ([81f8f02](https://github.com/stone-payments/pos-mamba-sdk/commit/81f8f02))

### Features

- 🎸 Add compareTime method ([7fdfedb](https://github.com/stone-payments/pos-mamba-sdk/commit/7fdfedb))

## [2.8.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.8.0...v2.8.1) (2019-05-15)

**Note:** Version bump only for package mamba-sdk

# [2.8.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.7.2...v2.8.0) (2019-05-15)

### Features

- 🎸 Add compareTime method ([7fdfedb](https://github.com/stone-payments/pos-mamba-sdk/commit/7fdfedb))

## [2.7.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.7.1...v2.7.2) (2019-04-12)

### Features

- 🎸 allow to mock payment failure ([7d3f992](https://github.com/stone-payments/pos-mamba-sdk/commit/7d3f992))

## [2.7.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.7.0...v2.7.1) (2019-04-10)

### Bug Fixes

- 🐛 linter errors ([872cdc8](https://github.com/stone-payments/pos-mamba-sdk/commit/872cdc8))

# [2.7.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.6.4...v2.7.0) (2019-04-10)

### Bug Fixes

- 🐛 digital printer firing endPrinting twice ([78668a4](https://github.com/stone-payments/pos-mamba-sdk/commit/78668a4))
- **package:** update mini-css-extract-plugin to version 0.6.0 ([0e934c7](https://github.com/stone-payments/pos-mamba-sdk/commit/0e934c7))

### Features

- 🎸 ([#362](https://github.com/stone-payments/pos-mamba-sdk/issues/362)) ([abeca24](https://github.com/stone-payments/pos-mamba-sdk/commit/abeca24))

## [2.6.4](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.6.3...v2.6.4) (2019-04-03)

**Note:** Version bump only for package mamba-sdk

## [2.6.3](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.6.2...v2.6.3) (2019-04-02)

### Bug Fixes

- 🐛 editable text input selected condition ([76b0361](https://github.com/stone-payments/pos-mamba-sdk/commit/76b0361))
- 🐛 forcefocus breaking another consecutive input focus ([72999e3](https://github.com/stone-payments/pos-mamba-sdk/commit/72999e3))
- 🐛 prevent printable content to overflow a page ([9ec53ba](https://github.com/stone-payments/pos-mamba-sdk/commit/9ec53ba))
- 🐛 return null if passed a non-existing storage key ([53fa24c](https://github.com/stone-payments/pos-mamba-sdk/commit/53fa24c))

## [2.6.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.6.1...v2.6.2) (2019-03-25)

### Bug Fixes

- 🐛 check if the input is rendered before blurring ([2bb0c77](https://github.com/stone-payments/pos-mamba-sdk/commit/2bb0c77))

## [2.6.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.6.0...v2.6.1) (2019-03-25)

### Bug Fixes

- 🐛 <Text/> focus on unexistent input ([1eeafbe](https://github.com/stone-payments/pos-mamba-sdk/commit/1eeafbe))

# [2.6.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.5.3...v2.6.0) (2019-03-21)

### Bug Fixes

- **package:** update immer to version 2.1.0 ([2e064aa](https://github.com/stone-payments/pos-mamba-sdk/commit/2e064aa))
- 🐛 add core-js@3 configs ([7bb9bca](https://github.com/stone-payments/pos-mamba-sdk/commit/7bb9bca))
- 🐛 append a hash to imported images filenames ([4d68807](https://github.com/stone-payments/pos-mamba-sdk/commit/4d68807))
- 🐛 babel and core-js@3 breaking the tests ([3be4896](https://github.com/stone-payments/pos-mamba-sdk/commit/3be4896))
- 🐛 input using wrong isValid value ([4163205](https://github.com/stone-payments/pos-mamba-sdk/commit/4163205))
- 🐛 money input validation events and extra beep ([ff54f7b](https://github.com/stone-payments/pos-mamba-sdk/commit/ff54f7b))
- 🐛 remove input border transition ([715a6b9](https://github.com/stone-payments/pos-mamba-sdk/commit/715a6b9))
- typo in readme ([8e8fcd2](https://github.com/stone-payments/pos-mamba-sdk/commit/8e8fcd2))

### Features

- 🎸 Add format date to yyyy/mm/dd to utils ([6d8b1f1](https://github.com/stone-payments/pos-mamba-sdk/commit/6d8b1f1))
- 🎸 add showPrintingDialog prop ([eb6dba2](https://github.com/stone-payments/pos-mamba-sdk/commit/eb6dba2))
- 🎸 add simple mask date formatter ([58c9aa5](https://github.com/stone-payments/pos-mamba-sdk/commit/58c9aa5))
- 🎸 add validate() method ([6aaff5f](https://github.com/stone-payments/pos-mamba-sdk/commit/6aaff5f))
- 🎸virtualkeyboard ([#350](https://github.com/stone-payments/pos-mamba-sdk/issues/350)) ([e9440c8](https://github.com/stone-payments/pos-mamba-sdk/commit/e9440c8)), closes [#375](https://github.com/stone-payments/pos-mamba-sdk/issues/375)

## [2.5.3](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.5.2...v2.5.3) (2019-02-22)

### Bug Fixes

- 🐛 fixed background affecting app performance ([9c7a713](https://github.com/stone-payments/pos-mamba-sdk/commit/9c7a713))

## [2.5.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.4.1...v2.5.2) (2019-02-21)

### Bug Fixes

- 🐛 add simulated System.getVersion() method ([832c24d](https://github.com/stone-payments/pos-mamba-sdk/commit/832c24d))
- 🐛 app initialization without a store ([eb81c94](https://github.com/stone-payments/pos-mamba-sdk/commit/eb81c94))
- 🐛 cancel auth listener on successful logout ([756e90c](https://github.com/stone-payments/pos-mamba-sdk/commit/756e90c))
- 🐛 css being emitted AND injected ([65d966a](https://github.com/stone-payments/pos-mamba-sdk/commit/65d966a))
- 🐛 Filter tabs that not fulfils prerequisites ([ee1f361](https://github.com/stone-payments/pos-mamba-sdk/commit/ee1f361))
- 🐛 Fix active bottom line position ([d3e15f2](https://github.com/stone-payments/pos-mamba-sdk/commit/d3e15f2))
- 🐛 prevent simulator from resetting the url on startup ([87568fe](https://github.com/stone-payments/pos-mamba-sdk/commit/87568fe))
- 🐛 Prop name for locking app exit ([754c5c7](https://github.com/stone-payments/pos-mamba-sdk/commit/754c5c7))
- **package:** update xmlbuilder to version 11.0.0 ([e20d768](https://github.com/stone-payments/pos-mamba-sdk/commit/e20d768))
- 🐛 remove dotter border from row extra slot ([548973f](https://github.com/stone-payments/pos-mamba-sdk/commit/548973f))
- 🐛 simulated keypad not dispatching keys on firefox ([664d894](https://github.com/stone-payments/pos-mamba-sdk/commit/664d894))
- 🐛 Style and send button activating auth method ([cb81e1d](https://github.com/stone-payments/pos-mamba-sdk/commit/cb81e1d))

### Features

- 🎸 add configurable persistent simulated admin password ([3ca8d84](https://github.com/stone-payments/pos-mamba-sdk/commit/3ca8d84))
- 🎸 add new value validation through prop method ([cc68ccf](https://github.com/stone-payments/pos-mamba-sdk/commit/cc68ccf))
- 🎸 add size=fill for 100% buttons with no border-radius ([b62136a](https://github.com/stone-payments/pos-mamba-sdk/commit/b62136a))
- 🎸 add text css helpers ([a204d31](https://github.com/stone-payments/pos-mamba-sdk/commit/a204d31))
- 🎸 AdminLock, App lock and checkPassword simulation ([dee5ea9](https://github.com/stone-payments/pos-mamba-sdk/commit/dee5ea9))
- 🎸 change row label size to 14px ([e74269c](https://github.com/stone-payments/pos-mamba-sdk/commit/e74269c))

### Performance Improvements

- ⚡️ Controls tab index by state update lifecycle ([013eafa](https://github.com/stone-payments/pos-mamba-sdk/commit/013eafa))

## [2.5.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.4.1...v2.5.1) (2019-02-21)

### Bug Fixes

- 🐛 add simulated System.getVersion() method ([832c24d](https://github.com/stone-payments/pos-mamba-sdk/commit/832c24d))
- 🐛 app initialization without a store ([eb81c94](https://github.com/stone-payments/pos-mamba-sdk/commit/eb81c94))
- 🐛 cancel auth listener on successful logout ([756e90c](https://github.com/stone-payments/pos-mamba-sdk/commit/756e90c))
- 🐛 css being emitted AND injected ([65d966a](https://github.com/stone-payments/pos-mamba-sdk/commit/65d966a))
- 🐛 Filter tabs that not fulfils prerequisites ([ee1f361](https://github.com/stone-payments/pos-mamba-sdk/commit/ee1f361))
- 🐛 Fix active bottom line position ([d3e15f2](https://github.com/stone-payments/pos-mamba-sdk/commit/d3e15f2))
- 🐛 prevent simulator from resetting the url on startup ([87568fe](https://github.com/stone-payments/pos-mamba-sdk/commit/87568fe))
- 🐛 Prop name for locking app exit ([754c5c7](https://github.com/stone-payments/pos-mamba-sdk/commit/754c5c7))
- **package:** update xmlbuilder to version 11.0.0 ([e20d768](https://github.com/stone-payments/pos-mamba-sdk/commit/e20d768))
- 🐛 remove dotter border from row extra slot ([548973f](https://github.com/stone-payments/pos-mamba-sdk/commit/548973f))
- 🐛 simulated keypad not dispatching keys on firefox ([664d894](https://github.com/stone-payments/pos-mamba-sdk/commit/664d894))
- 🐛 Style and send button activating auth method ([cb81e1d](https://github.com/stone-payments/pos-mamba-sdk/commit/cb81e1d))

### Features

- 🎸 add configurable persistent simulated admin password ([3ca8d84](https://github.com/stone-payments/pos-mamba-sdk/commit/3ca8d84))
- 🎸 add new value validation through prop method ([cc68ccf](https://github.com/stone-payments/pos-mamba-sdk/commit/cc68ccf))
- 🎸 add text css helpers ([a204d31](https://github.com/stone-payments/pos-mamba-sdk/commit/a204d31))
- 🎸 AdminLock, App lock and checkPassword simulation ([dee5ea9](https://github.com/stone-payments/pos-mamba-sdk/commit/dee5ea9))
- 🎸 change row label size to 14px ([e74269c](https://github.com/stone-payments/pos-mamba-sdk/commit/e74269c))

### Performance Improvements

- ⚡️ Controls tab index by state update lifecycle ([013eafa](https://github.com/stone-payments/pos-mamba-sdk/commit/013eafa))

# [2.5.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.4.1...v2.5.0) (2019-02-21)

### Bug Fixes

- 🐛 add simulated System.getVersion() method ([832c24d](https://github.com/stone-payments/pos-mamba-sdk/commit/832c24d))
- 🐛 app initialization without a store ([eb81c94](https://github.com/stone-payments/pos-mamba-sdk/commit/eb81c94))
- 🐛 cancel auth listener on successful logout ([756e90c](https://github.com/stone-payments/pos-mamba-sdk/commit/756e90c))
- 🐛 Filter tabs that not fulfils prerequisites ([ee1f361](https://github.com/stone-payments/pos-mamba-sdk/commit/ee1f361))
- 🐛 Fix active bottom line position ([d3e15f2](https://github.com/stone-payments/pos-mamba-sdk/commit/d3e15f2))
- 🐛 prevent simulator from resetting the url on startup ([87568fe](https://github.com/stone-payments/pos-mamba-sdk/commit/87568fe))
- 🐛 Prop name for locking app exit ([754c5c7](https://github.com/stone-payments/pos-mamba-sdk/commit/754c5c7))
- **package:** update xmlbuilder to version 11.0.0 ([e20d768](https://github.com/stone-payments/pos-mamba-sdk/commit/e20d768))
- 🐛 remove dotter border from row extra slot ([548973f](https://github.com/stone-payments/pos-mamba-sdk/commit/548973f))
- 🐛 simulated keypad not dispatching keys on firefox ([664d894](https://github.com/stone-payments/pos-mamba-sdk/commit/664d894))
- 🐛 Style and send button activating auth method ([cb81e1d](https://github.com/stone-payments/pos-mamba-sdk/commit/cb81e1d))

### Features

- 🎸 add configurable persistent simulated admin password ([3ca8d84](https://github.com/stone-payments/pos-mamba-sdk/commit/3ca8d84))
- 🎸 add new value validation through prop method ([cc68ccf](https://github.com/stone-payments/pos-mamba-sdk/commit/cc68ccf))
- 🎸 add text css helpers ([a204d31](https://github.com/stone-payments/pos-mamba-sdk/commit/a204d31))
- 🎸 AdminLock, App lock and checkPassword simulation ([dee5ea9](https://github.com/stone-payments/pos-mamba-sdk/commit/dee5ea9))
- 🎸 change row label size to 14px ([e74269c](https://github.com/stone-payments/pos-mamba-sdk/commit/e74269c))

### Performance Improvements

- ⚡️ Controls tab index by state update lifecycle ([013eafa](https://github.com/stone-payments/pos-mamba-sdk/commit/013eafa))

## [2.4.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.4.0...v2.4.1) (2019-02-13)

### Bug Fixes

- 🐛 fix boolean options not working after last yargs update ([cda71e4](https://github.com/stone-payments/pos-mamba-sdk/commit/cda71e4))

# 2.4.0 (2019-02-12)

### Bug Fixes

- **package:** update css-loader to version 2.0.0 ([a809d28](https://github.com/stone-payments/pos-mamba-sdk/commit/a809d28))
- **package:** update eslint-plugin-html to version 5.0.0 ([f23244d](https://github.com/stone-payments/pos-mamba-sdk/commit/f23244d))
- **package:** update eslint-plugin-node to version 8.0.0 ([f48e916](https://github.com/stone-payments/pos-mamba-sdk/commit/f48e916))
- **package:** update eslint-plugin-prettier to version 3.0.0 ([b6a0e08](https://github.com/stone-payments/pos-mamba-sdk/commit/b6a0e08))
- **package:** update mini-css-extract-plugin to version 0.5.0 ([035aed9](https://github.com/stone-payments/pos-mamba-sdk/commit/035aed9))
- **package:** update postcss-calc to version 7.0.0 ([bfe03be](https://github.com/stone-payments/pos-mamba-sdk/commit/bfe03be))
- 🐛 no-scroll not preventing scroll ([85a39fe](https://github.com/stone-payments/pos-mamba-sdk/commit/85a39fe))
- 🐛 Remove invalid "width: block" ([63fe39b](https://github.com/stone-payments/pos-mamba-sdk/commit/63fe39b))
- **package:** update postcss-html to version 0.36.0 ([#299](https://github.com/stone-payments/pos-mamba-sdk/issues/299)) ([8cfc366](https://github.com/stone-payments/pos-mamba-sdk/commit/8cfc366))
- **package:** update yargs to version 13.1.0 ([#354](https://github.com/stone-payments/pos-mamba-sdk/issues/354)) ([a53ca14](https://github.com/stone-payments/pos-mamba-sdk/commit/a53ca14))
- 🐛 reset currentGroupName to 'default' after 'endGroup()' is called ([c17f2ed](https://github.com/stone-payments/pos-mamba-sdk/commit/c17f2ed))

### Features

- 🎸 Add [@mamba](https://github.com/mamba)/utils with basic money utility methods ([19f7315](https://github.com/stone-payments/pos-mamba-sdk/commit/19f7315))
- 🎸 Add currency ceil method ([1260649](https://github.com/stone-payments/pos-mamba-sdk/commit/1260649))
- 🎸 add main entry to facilitate utilities access ([3190b62](https://github.com/stone-payments/pos-mamba-sdk/commit/3190b62))
- 🎸 add timeout() method to promisify setTimeouts ([224840c](https://github.com/stone-payments/pos-mamba-sdk/commit/224840c))
