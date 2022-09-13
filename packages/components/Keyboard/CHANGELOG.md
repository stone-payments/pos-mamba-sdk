# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.1.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/keyboard@1.0.3...@mamba/keyboard@1.1.0) (2022-09-13)


### Features

* 🎸 add CSS compact variant to numeric keyboard ([1ed8720](https://github.com/stone-payments/pos-mamba-sdk/commit/1ed87206733fc3d7125ce0d6d9bb142c91d7e476))
* 🎸 add lastValue option to handle post-processing ([6379e85](https://github.com/stone-payments/pos-mamba-sdk/commit/6379e85b36130fec59a2b75d8144f5fbbb06036c))
* 🎸 add more helpers methods ([6923ced](https://github.com/stone-payments/pos-mamba-sdk/commit/6923cedc4311b30666fa9468a8f20feb4c265792))
* 🎸 add readOnly prop ([1f14b06](https://github.com/stone-payments/pos-mamba-sdk/commit/1f14b06bf5e3682ee3fb80573f749815eb07e04b))
* 🎸 add render condition prop for virtual keyboard ([e510a99](https://github.com/stone-payments/pos-mamba-sdk/commit/e510a9919c2b6239e363ce22fc30fed3f5202ff3))
* 🎸 create suggestion box impl ([5b5891a](https://github.com/stone-payments/pos-mamba-sdk/commit/5b5891a54f75d2720f0f69517a8c9bdd5be92656))
* 🎸 filter number only on numeric keybaord input ([10b89f5](https://github.com/stone-payments/pos-mamba-sdk/commit/10b89f5120a51e9f364364cd5eb3e423f42775f9))
* 🎸 implement destroy method/life-cicle ([f6aa7b8](https://github.com/stone-payments/pos-mamba-sdk/commit/f6aa7b8b5a6216aeb3154b31ae6ae37d77c41358))
* 🎸 implement destroy methods ([3d0c7d1](https://github.com/stone-payments/pos-mamba-sdk/commit/3d0c7d1be10aa132175b4e1910472be0ebfbfbe9))
* 🎸 implement suggestion box ([1d07afc](https://github.com/stone-payments/pos-mamba-sdk/commit/1d07afcb185f31c21fc0bb67550030441b9117a3))
* 🎸 implement theme variation required ([32b57a0](https://github.com/stone-payments/pos-mamba-sdk/commit/32b57a0565211e738b0073a9bd2a6d7acc4198a8))
* 🎸 prevent double instance creation ([894e6ea](https://github.com/stone-payments/pos-mamba-sdk/commit/894e6ead54091c99ccc0ab1e1def71f0276a5570))
* 🎸 set keyboard options by html input tag attrb ([c1fd2b0](https://github.com/stone-payments/pos-mamba-sdk/commit/c1fd2b0f1be723ed90fad095abaa6dbd1fced6bf))


### Bug Fixes

* 🐛 avoid external inputs on simulator ([2607c4c](https://github.com/stone-payments/pos-mamba-sdk/commit/2607c4c95bc31fca228e46aeaa10f792c12b6872))
* 🐛 back and backspace key code conflict ([34fbf45](https://github.com/stone-payments/pos-mamba-sdk/commit/34fbf45d0b69d420d2ea66e15b7ac45768f76d46))
* 🐛 deep merge of keyboard options ([01b06ba](https://github.com/stone-payments/pos-mamba-sdk/commit/01b06bae498515a9039ffb03fbcb0f77be6eb09a))
* 🐛 disable input of disabled inputs ([b92ac6e](https://github.com/stone-payments/pos-mamba-sdk/commit/b92ac6e3f00d2b11733611bf23cb3eec34d79dbb))
* 🐛 double instance after destroy ([f144486](https://github.com/stone-payments/pos-mamba-sdk/commit/f14448660c3c5605d3065b91d5b9ba82103ac0df))
* 🐛 fi initial render after set visibility ([8602666](https://github.com/stone-payments/pos-mamba-sdk/commit/8602666fa167960f808d4f85f01a31fa5c8aa3e9))
* 🐛 fix hard coded keys and its events ([7caddec](https://github.com/stone-payments/pos-mamba-sdk/commit/7caddec0f31d60c3fe2adb16970703b4c1ff7765))
* 🐛 fix inital keep visible behavior ([81a1932](https://github.com/stone-payments/pos-mamba-sdk/commit/81a193234c12fbccb7a90ac43438e32eb6879f82))
* 🐛 fix minus unicode char ([d63a22b](https://github.com/stone-payments/pos-mamba-sdk/commit/d63a22bedb2ccdf509c0d119a3f26a66a456f811))
* 🐛 fix options reset adfter route changes ([b4b57c2](https://github.com/stone-payments/pos-mamba-sdk/commit/b4b57c25919d2cdf3a25201c9a24058abb46747a))
* 🐛 fix pos keybaord init of route change along w/ debug logs ([0d3c804](https://github.com/stone-payments/pos-mamba-sdk/commit/0d3c8048e133920cc6115fd555eeeba9d6c7f283))
* 🐛 fix the recreation of physical keyboard handler ([1e1c38b](https://github.com/stone-payments/pos-mamba-sdk/commit/1e1c38b51054a09dd44ea70f342dcdd505827e93))
* 🐛 handle mamba button fixed at bottom ([2a5ec8b](https://github.com/stone-payments/pos-mamba-sdk/commit/2a5ec8b514abba03f588ae83bb5891d58eeac1b5))
* 🐛 keyboard options merge ([46188d7](https://github.com/stone-payments/pos-mamba-sdk/commit/46188d78f5fff927dec2b960740277d33699abd2))
* 🐛 listener cleaning after svelte input destroy ([8314c0c](https://github.com/stone-payments/pos-mamba-sdk/commit/8314c0c27981398d0c4f39a24d3eb55df0c40b44))
* 🐛 physical keyboard instance after set options ([d68ae85](https://github.com/stone-payments/pos-mamba-sdk/commit/d68ae85b9192a494ac72b5006f3c38c330f0f6e8))
* 🐛 reset keyboard type options after change ([1bdeb8e](https://github.com/stone-payments/pos-mamba-sdk/commit/1bdeb8e1fde3ed524214388a46477be7a2c60cbb))
* 🐛 route change keyboard reset ([c308640](https://github.com/stone-payments/pos-mamba-sdk/commit/c308640d4aafee0c2c2ffd9d11b838e606149c18))



### [1.0.3](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/keyboard@1.0.2...@mamba/keyboard@1.0.3) (2022-08-30)

**Note:** Version bump only for package @mamba/keyboard





### [1.0.2](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/keyboard@1.0.0...@mamba/keyboard@1.0.2) (2022-08-09)


### Bug Fixes

* add gitHead hash ([47a9d1a](https://github.com/stone-payments/pos-mamba-sdk/commit/47a9d1a233cc859a4230ef98573bc7152d918e46))



## 1.0.0 (2022-07-21)


### Features

* 🎸 add inital keyboard setup ([a1e8ca3](https://github.com/stone-payments/pos-mamba-sdk/commit/a1e8ca3fc392b14fa9c30cd99dbde67f513c091d))
* 🎸 initiates @mamba/keyboard package ([d347821](https://github.com/stone-payments/pos-mamba-sdk/commit/d347821ccb4cb0262f47f1dea07c92d70dbd5fb3))
* 🎸 try hide keyboard after route change ([ccbb0c0](https://github.com/stone-payments/pos-mamba-sdk/commit/ccbb0c0fd5cabba6794821e189a5c262a41b51b2))
* new mamba keyboard implementation ([23466f2](https://github.com/stone-payments/pos-mamba-sdk/commit/23466f28fbd58067248b308218d4eb91b8889160))


### Bug Fixes

* 🐛 fix compile issues ([415f8de](https://github.com/stone-payments/pos-mamba-sdk/commit/415f8dea92cfe0a7becf657a95b0aa6506d1c91b))
