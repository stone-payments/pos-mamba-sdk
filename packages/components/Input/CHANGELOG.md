# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [8.0.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.33.2...v8.0.0) (2023-01-13)


### ⚠ BREAKING CHANGES

* 🧨 n

### Features

* :sparkles: development of the new version of the numeric keypad ([3d58a59](https://github.com/stone-payments/pos-mamba-sdk/commit/3d58a59131d415a3d9dcd4de6c6636e6369abbb3))
* 🎸 add d199 MoneyInput like ([cbe9885](https://github.com/stone-payments/pos-mamba-sdk/commit/cbe9885b6ee87eef3f0ee466605594a189165c40))
* 🎸 add invalidate method to NumericKeyboard and fix warnings ([3f724b2](https://github.com/stone-payments/pos-mamba-sdk/commit/3f724b2b646ceb83e36b0101d6ff19a5db6c257a))
* 🎸 add legacy numeric keyboard ([86c709e](https://github.com/stone-payments/pos-mamba-sdk/commit/86c709e10e76c0ae8bc65310aa8b213b162cadd6))
* 🎸 add money input instance referênce for virtual keyboard ([f4f68f5](https://github.com/stone-payments/pos-mamba-sdk/commit/f4f68f552f8c4130c2c43f09cd048574d17d6b45))
* 🎸 implement Input compact prop ([4d3e478](https://github.com/stone-payments/pos-mamba-sdk/commit/4d3e478ce0e51a91e43198eb5d51ffc264223caf))
* 🎸 implements showPasswordToggle prop for input, with POS hasTouch default value ([51f14ee](https://github.com/stone-payments/pos-mamba-sdk/commit/51f14eefcd07da3fe8481cf751eb21616757acfd))
* 🎸 Include waring state to show a warning ([1734c0e](https://github.com/stone-payments/pos-mamba-sdk/commit/1734c0edc803e5890a67db94e2a7513b69f8b840))
* 🎸 Keyboard has invalidate() input method ([1f010c1](https://github.com/stone-payments/pos-mamba-sdk/commit/1f010c18f1ada3601f36e2bab5b89400d18ec1e6))
* 🎸 Math Keyboard ([116b864](https://github.com/stone-payments/pos-mamba-sdk/commit/116b8644b39cecd896d7cb8c1e4e537232831197))
* 🎸 NumericKeyboard receiving props ([be8d540](https://github.com/stone-payments/pos-mamba-sdk/commit/be8d540a85b892bf0bf690fe0b7bd379b5be3984))
* 🎸 Rebrand keyboard ([426d98f](https://github.com/stone-payments/pos-mamba-sdk/commit/426d98fe7c62ca3746460ed2ee44eae21b68c2cd))
* 🎸 set keyboard options by html input tag attrb ([c1fd2b0](https://github.com/stone-payments/pos-mamba-sdk/commit/c1fd2b0f1be723ed90fad095abaa6dbd1fced6bf))
* 🎸 started NumericKeyboard ([1c550bd](https://github.com/stone-payments/pos-mamba-sdk/commit/1c550bd59f02131b5fd8212952b45e7ccedfd6a5))
* 🎸 Update packages ([b8044fe](https://github.com/stone-payments/pos-mamba-sdk/commit/b8044fe52daa682e98b71c275f509acd60c77f40))
* 🎸 validation on numeric keyboard ([fca72d9](https://github.com/stone-payments/pos-mamba-sdk/commit/fca72d97e5d4c849e3bfa69c76b7b9b3cd30bcd8))
* add beep on NumericKeyboard clicks ([2af2cba](https://github.com/stone-payments/pos-mamba-sdk/commit/2af2cba077b5b4f19947f543e0a1d53b8054017b))
* **configkeyboard:**  modeling of the versatile keyboard configuration ([a5cc528](https://github.com/stone-payments/pos-mamba-sdk/commit/a5cc528a394212dab7e87584d14dcbf965ecf72a))
* new mamba keyboard implementation ([23466f2](https://github.com/stone-payments/pos-mamba-sdk/commit/23466f28fbd58067248b308218d4eb91b8889160))
* **numerickeyboard.html:**  Decoupling the numeric keypad ([a2986c1](https://github.com/stone-payments/pos-mamba-sdk/commit/a2986c1d2235441fe2d213a48b9dc490a6b8d034))


### Bug Fixes

* :bug: math keyboard layout ([2abc974](https://github.com/stone-payments/pos-mamba-sdk/commit/2abc9745690aed7437474c007f260686bc625df6))
* 🐛 alphanumeric and numeric methods were switched ([0965cbb](https://github.com/stone-payments/pos-mamba-sdk/commit/0965cbb2e55c54903170938f5073881cc6697417))
* 🐛 create normalized keyCode/keyName parse methods from keyboard event ([f2f0a1a](https://github.com/stone-payments/pos-mamba-sdk/commit/f2f0a1a0fa97724288f1fa0ad568fedd85ad1f11))
* 🐛 cursor position reference ([18c44cb](https://github.com/stone-payments/pos-mamba-sdk/commit/18c44cb44043669ea27054aae031494297976847))
* 🐛 default maxlength ([909cfc5](https://github.com/stone-payments/pos-mamba-sdk/commit/909cfc5b681006816523d593ea51ca79c5c649e1))
* 🐛 enter and clear 'hitboxes' ([6afaaf1](https://github.com/stone-payments/pos-mamba-sdk/commit/6afaaf1c5332aa556224b4655720e801c56130b3))
* 🐛 fix alphanumeric input values ([c862501](https://github.com/stone-payments/pos-mamba-sdk/commit/c862501150d57d168d99a97b332a52a1df8c91fd))
* 🐛 fix dead-locks flows ([038aa93](https://github.com/stone-payments/pos-mamba-sdk/commit/038aa937bf76a365b72bd4956973aa53c8450980))
* 🐛 fix enter key on onput ([6379e39](https://github.com/stone-payments/pos-mamba-sdk/commit/6379e3961783012c1bf91f760276b59d3865d7ef))
* 🐛 fix hard coded keys and its events ([7caddec](https://github.com/stone-payments/pos-mamba-sdk/commit/7caddec0f31d60c3fe2adb16970703b4c1ff7765))
* 🐛 fix input tokens param parse ([7cbfe39](https://github.com/stone-payments/pos-mamba-sdk/commit/7cbfe39163fde8bb48ea8cb42b510c25cf54c9d3))
* 🐛 fix keyboard input validation ([fccee6d](https://github.com/stone-payments/pos-mamba-sdk/commit/fccee6d5e4665d87e2bafcdce497a73f78f35379))
* 🐛 Fix money input ([2e23554](https://github.com/stone-payments/pos-mamba-sdk/commit/2e235541f884847a84013b74ea75955988148dc4))
* 🐛 fix numeric keyboard position and improve key distribution ([06ea9a7](https://github.com/stone-payments/pos-mamba-sdk/commit/06ea9a72a19184d8519ed25c1b653fca94f702d2))
* 🐛 fix numeric keyboard validation commit mistakes ([7004394](https://github.com/stone-payments/pos-mamba-sdk/commit/70043947018b530ac770cb2cd365f66f51840e26))
* 🐛 fix several issues related with cursors and/or suggestions ([d4a3b62](https://github.com/stone-payments/pos-mamba-sdk/commit/d4a3b62673a69ee01974b3668954322389e410bb))
* 🐛 fiz keyboardOptions property of input that was not working ([ad2f502](https://github.com/stone-payments/pos-mamba-sdk/commit/ad2f502641a7e3ebe27840e636cf89f6d0af0d09))
* 🐛 normalize the dependencies across packages ([43103d7](https://github.com/stone-payments/pos-mamba-sdk/commit/43103d718ba93909cb34ca459f674ceea9354a06))
* 🐛 old variables remnants ([ec23f34](https://github.com/stone-payments/pos-mamba-sdk/commit/ec23f349a499ac5e966ae5ff564bfa048bcf2a29))
* 🐛 old variables remnants ([c5cb2df](https://github.com/stone-payments/pos-mamba-sdk/commit/c5cb2dff0350752286b973bd401a0d5d952d501d))
* 🐛 remove global body from examples ([0f64e61](https://github.com/stone-payments/pos-mamba-sdk/commit/0f64e61f28eec0a18c3405dad78520a53e04335c))
* 🐛 remove useless code ([a5e8af9](https://github.com/stone-payments/pos-mamba-sdk/commit/a5e8af94c1ae07298301655151a2ec141ae28b92))
* 🐛 revert remnants ([75e0d23](https://github.com/stone-payments/pos-mamba-sdk/commit/75e0d239a539201b0bcd11fae7a05441ea7cdcab))
* 🐛 revert remnants ([1bebb18](https://github.com/stone-payments/pos-mamba-sdk/commit/1bebb18832717b14c2080e3159d65e5af6059e39))
* 🐛 update MP35P classes to has-small-screen ([20abe2d](https://github.com/stone-payments/pos-mamba-sdk/commit/20abe2df37d384bf7b3fb3eac501808372278501))
* 🐛 update variables to camcelCase ([ae7e14a](https://github.com/stone-payments/pos-mamba-sdk/commit/ae7e14a9b18bb5373d5f508096134b3a6d343321))
* 🐛 update variables to camcelCase ([87bbeeb](https://github.com/stone-payments/pos-mamba-sdk/commit/87bbeeb494eeba68991d04361d304b20f3e29ce8))
* 🐛 validation bugs on warning flag ([3199bcb](https://github.com/stone-payments/pos-mamba-sdk/commit/3199bcb3807e2bf6a4d94ed40b0b1e910ad716df))


### Performance Improvements

* ⚡️ use keyboard input pattern to avoid unnecessary processing of money input values ([9d57df2](https://github.com/stone-payments/pos-mamba-sdk/commit/9d57df2e05ad6063eb0650dd587bbfdeff8bda42))


### Styles

* 💄 alteraçao de fonte para mp35 e mp35p ([fd3a4f0](https://github.com/stone-payments/pos-mamba-sdk/commit/fd3a4f005a83435ba44a886973300886f2d5dc28))



### [8.0.2](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@8.0.1...@mamba/input@8.0.2) (2023-01-04)

**Note:** Version bump only for package @mamba/input





### [8.0.1](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@8.0.0...@mamba/input@8.0.1) (2022-12-28)

**Note:** Version bump only for package @mamba/input





## [8.0.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@7.0.0...@mamba/input@8.0.0) (2022-12-26)


### Bug Fixes

* 🐛 alphanumeric and numeric methods were switched ([0965cbb](https://github.com/stone-payments/pos-mamba-sdk/commit/0965cbb2e55c54903170938f5073881cc6697417))



## [7.0.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@6.3.0...@mamba/input@7.0.0) (2022-12-19)

**Note:** Version bump only for package @mamba/input





### [6.3.1](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@6.3.0...@mamba/input@6.3.1) (2022-12-16)

**Note:** Version bump only for package @mamba/input





## [6.3.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@6.2.1...@mamba/input@6.3.0) (2022-12-13)

**Note:** Version bump only for package @mamba/input





### [6.2.1](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@6.2.0...@mamba/input@6.2.1) (2022-12-13)


### Features

* 🎸 implements showPasswordToggle prop for input, with POS hasTouch default value ([51f14ee](https://github.com/stone-payments/pos-mamba-sdk/commit/51f14eefcd07da3fe8481cf751eb21616757acfd))



## [6.2.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@6.1.3...@mamba/input@6.2.0) (2022-11-15)

**Note:** Version bump only for package @mamba/input





### [6.1.3](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@6.1.2...@mamba/input@6.1.3) (2022-10-04)

**Note:** Version bump only for package @mamba/input





### [6.1.2](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@6.1.1...@mamba/input@6.1.2) (2022-09-30)

**Note:** Version bump only for package @mamba/input





### [6.1.1](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@6.1.0...@mamba/input@6.1.1) (2022-09-30)

**Note:** Version bump only for package @mamba/input





## [6.1.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@6.0.2...@mamba/input@6.1.0) (2022-09-13)


### Features

* 🎸 add money input instance referênce for virtual keyboard ([f4f68f5](https://github.com/stone-payments/pos-mamba-sdk/commit/f4f68f552f8c4130c2c43f09cd048574d17d6b45))
* 🎸 set keyboard options by html input tag attrb ([c1fd2b0](https://github.com/stone-payments/pos-mamba-sdk/commit/c1fd2b0f1be723ed90fad095abaa6dbd1fced6bf))


### Bug Fixes

* 🐛 fix hard coded keys and its events ([7caddec](https://github.com/stone-payments/pos-mamba-sdk/commit/7caddec0f31d60c3fe2adb16970703b4c1ff7765))



### [6.0.2](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@6.0.1...@mamba/input@6.0.2) (2022-08-30)

**Note:** Version bump only for package @mamba/input





### [6.0.1](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@6.0.0...@mamba/input@6.0.1) (2022-08-09)

**Note:** Version bump only for package @mamba/input





## [6.0.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@4.1.3...@mamba/input@6.0.0) (2022-07-21)


### ⚠ BREAKING CHANGES

* 🧨 n

### Features

* new mamba keyboard implementation ([23466f2](https://github.com/stone-payments/pos-mamba-sdk/commit/23466f28fbd58067248b308218d4eb91b8889160))


### Bug Fixes

* 🐛 fix enter key on onput ([6379e39](https://github.com/stone-payments/pos-mamba-sdk/commit/6379e3961783012c1bf91f760276b59d3865d7ef))
* 🐛 fix keyboard input validation ([fccee6d](https://github.com/stone-payments/pos-mamba-sdk/commit/fccee6d5e4665d87e2bafcdce497a73f78f35379))
* 🐛 normalize the dependencies across packages ([43103d7](https://github.com/stone-payments/pos-mamba-sdk/commit/43103d718ba93909cb34ca459f674ceea9354a06))
* 🐛 update MP35P classes to has-small-screen ([20abe2d](https://github.com/stone-payments/pos-mamba-sdk/commit/20abe2df37d384bf7b3fb3eac501808372278501))


### Styles

* 💄 alteraçao de fonte para mp35 e mp35p ([fd3a4f0](https://github.com/stone-payments/pos-mamba-sdk/commit/fd3a4f005a83435ba44a886973300886f2d5dc28))



### [4.1.5](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@4.1.0...@mamba/input@4.1.5) (2022-05-11)

**Note:** Version bump only for package @mamba/input





### [4.1.4](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@4.1.0...@mamba/input@4.1.4) (2022-05-06)

**Note:** Version bump only for package @mamba/input





### [4.1.3](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@4.1.2...@mamba/input@4.1.3) (2022-04-08)

**Note:** Version bump only for package @mamba/input





### [4.1.2](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@4.1.1...@mamba/input@4.1.2) (2022-04-08)

**Note:** Version bump only for package @mamba/input





### [4.1.1](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@4.1.0...@mamba/input@4.1.1) (2022-04-08)

**Note:** Version bump only for package @mamba/input





## [4.1.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.6.0...@mamba/input@4.1.0) (2022-04-07)


### Features

* :sparkles: development of the new version of the numeric keypad ([3d58a59](https://github.com/stone-payments/pos-mamba-sdk/commit/3d58a59131d415a3d9dcd4de6c6636e6369abbb3))
* 🎸 add d199 MoneyInput like ([cbe9885](https://github.com/stone-payments/pos-mamba-sdk/commit/cbe9885b6ee87eef3f0ee466605594a189165c40))
* 🎸 add invalidate method to NumericKeyboard and fix warnings ([3f724b2](https://github.com/stone-payments/pos-mamba-sdk/commit/3f724b2b646ceb83e36b0101d6ff19a5db6c257a))
* 🎸 add legacy numeric keyboard ([86c709e](https://github.com/stone-payments/pos-mamba-sdk/commit/86c709e10e76c0ae8bc65310aa8b213b162cadd6))
* 🎸 Math Keyboard ([116b864](https://github.com/stone-payments/pos-mamba-sdk/commit/116b8644b39cecd896d7cb8c1e4e537232831197))
* 🎸 NumericKeyboard receiving props ([be8d540](https://github.com/stone-payments/pos-mamba-sdk/commit/be8d540a85b892bf0bf690fe0b7bd379b5be3984))
* 🎸 started NumericKeyboard ([1c550bd](https://github.com/stone-payments/pos-mamba-sdk/commit/1c550bd59f02131b5fd8212952b45e7ccedfd6a5))
* 🎸 validation on numeric keyboard ([fca72d9](https://github.com/stone-payments/pos-mamba-sdk/commit/fca72d97e5d4c849e3bfa69c76b7b9b3cd30bcd8))
* add beep on NumericKeyboard clicks ([2af2cba](https://github.com/stone-payments/pos-mamba-sdk/commit/2af2cba077b5b4f19947f543e0a1d53b8054017b))
* **configkeyboard:**  modeling of the versatile keyboard configuration ([a5cc528](https://github.com/stone-payments/pos-mamba-sdk/commit/a5cc528a394212dab7e87584d14dcbf965ecf72a))
* **numerickeyboard.html:**  Decoupling the numeric keypad ([a2986c1](https://github.com/stone-payments/pos-mamba-sdk/commit/a2986c1d2235441fe2d213a48b9dc490a6b8d034))


### Bug Fixes

* :bug: math keyboard layout ([2abc974](https://github.com/stone-payments/pos-mamba-sdk/commit/2abc9745690aed7437474c007f260686bc625df6))
* 🐛 cursor position reference ([18c44cb](https://github.com/stone-payments/pos-mamba-sdk/commit/18c44cb44043669ea27054aae031494297976847))
* 🐛 default maxlength ([909cfc5](https://github.com/stone-payments/pos-mamba-sdk/commit/909cfc5b681006816523d593ea51ca79c5c649e1))
* 🐛 enter and clear 'hitboxes' ([6afaaf1](https://github.com/stone-payments/pos-mamba-sdk/commit/6afaaf1c5332aa556224b4655720e801c56130b3))
* 🐛 fix numeric keyboard position and improve key distribution ([06ea9a7](https://github.com/stone-payments/pos-mamba-sdk/commit/06ea9a72a19184d8519ed25c1b653fca94f702d2))
* 🐛 fix numeric keyboard validation commit mistakes ([7004394](https://github.com/stone-payments/pos-mamba-sdk/commit/70043947018b530ac770cb2cd365f66f51840e26))
* 🐛 remove useless code ([a5e8af9](https://github.com/stone-payments/pos-mamba-sdk/commit/a5e8af94c1ae07298301655151a2ec141ae28b92))
* 🐛 validation bugs on warning flag ([3199bcb](https://github.com/stone-payments/pos-mamba-sdk/commit/3199bcb3807e2bf6a4d94ed40b0b1e910ad716df))



# [3.6.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.5.1...@mamba/input@3.6.0) (2021-06-02)


### Bug Fixes

* 🐛 Fix money input ([2e23554](https://github.com/stone-payments/pos-mamba-sdk/commit/2e235541f884847a84013b74ea75955988148dc4))


### Features

* 🎸 Include waring state to show a warning ([1734c0e](https://github.com/stone-payments/pos-mamba-sdk/commit/1734c0edc803e5890a67db94e2a7513b69f8b840))





## [3.5.1](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.5.0...@mamba/input@3.5.1) (2021-05-11)

**Note:** Version bump only for package @mamba/input





# [3.5.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.4.1...@mamba/input@3.5.0) (2021-05-11)

**Note:** Version bump only for package @mamba/input





## [3.4.1](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.4.0...@mamba/input@3.4.1) (2021-04-16)

**Note:** Version bump only for package @mamba/input





# [3.4.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.2.0...@mamba/input@3.4.0) (2021-04-01)


### Bug Fixes

* 🐛 remove global body from examples ([0f64e61](https://github.com/stone-payments/pos-mamba-sdk/commit/0f64e61f28eec0a18c3405dad78520a53e04335c))


### Features

* 🎸 Rebrand keyboard ([426d98f](https://github.com/stone-payments/pos-mamba-sdk/commit/426d98fe7c62ca3746460ed2ee44eae21b68c2cd))





# [3.3.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.2.0...@mamba/input@3.3.0) (2021-03-31)


### Bug Fixes

* 🐛 remove global body from examples ([0f64e61](https://github.com/stone-payments/pos-mamba-sdk/commit/0f64e61f28eec0a18c3405dad78520a53e04335c))


### Features

* 🎸 Rebrand keyboard ([426d98f](https://github.com/stone-payments/pos-mamba-sdk/commit/426d98fe7c62ca3746460ed2ee44eae21b68c2cd))





# [3.2.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.1.1...@mamba/input@3.2.0) (2021-03-23)

**Note:** Version bump only for package @mamba/input





## [3.1.1](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.1.0...@mamba/input@3.1.1) (2021-03-22)

**Note:** Version bump only for package @mamba/input





# [3.1.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.0.8...@mamba/input@3.1.0) (2021-03-16)

**Note:** Version bump only for package @mamba/input





## [3.0.8](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.0.7...@mamba/input@3.0.8) (2021-03-12)

**Note:** Version bump only for package @mamba/input





## [3.0.7](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.0.6...@mamba/input@3.0.7) (2021-03-12)

**Note:** Version bump only for package @mamba/input





## [3.0.6](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.0.5...@mamba/input@3.0.6) (2021-03-11)

**Note:** Version bump only for package @mamba/input





## [3.0.5](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.0.4...@mamba/input@3.0.5) (2021-03-11)

**Note:** Version bump only for package @mamba/input





## [3.0.4](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.0.2...@mamba/input@3.0.4) (2021-03-02)


### Features

* 🎸 Keyboard has invalidate() input method ([1f010c1](https://github.com/stone-payments/pos-mamba-sdk/commit/1f010c18f1ada3601f36e2bab5b89400d18ec1e6))





## [3.0.3](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.0.2...@mamba/input@3.0.3) (2021-02-25)


### Features

* 🎸 Keyboard has invalidate() input method ([1f010c1](https://github.com/stone-payments/pos-mamba-sdk/commit/1f010c18f1ada3601f36e2bab5b89400d18ec1e6))





## [3.0.2](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.0.1...@mamba/input@3.0.2) (2021-02-24)

**Note:** Version bump only for package @mamba/input





## [3.0.1](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@3.0.0...@mamba/input@3.0.1) (2021-02-15)

**Note:** Version bump only for package @mamba/input





# [3.0.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@2.37.2...@mamba/input@3.0.0) (2021-02-12)


### Bug Fixes

* 🐛 merge conflicts ([7ade8ac](https://github.com/stone-payments/pos-mamba-sdk/commit/7ade8ac3f487fd4c2b26b5febf9fee76afa0a2fc))
* 🐛 old variables remnants ([ec23f34](https://github.com/stone-payments/pos-mamba-sdk/commit/ec23f349a499ac5e966ae5ff564bfa048bcf2a29))
* 🐛 revert remnants ([75e0d23](https://github.com/stone-payments/pos-mamba-sdk/commit/75e0d239a539201b0bcd11fae7a05441ea7cdcab))
* 🐛 update variables to camcelCase ([ae7e14a](https://github.com/stone-payments/pos-mamba-sdk/commit/ae7e14a9b18bb5373d5f508096134b3a6d343321))





## [2.37.2](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@2.37.1...@mamba/input@2.37.2) (2021-02-11)

**Note:** Version bump only for package @mamba/input





## [2.37.1](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@2.37.0...@mamba/input@2.37.1) (2021-02-11)


### Bug Fixes

* 🐛 merge conflicts ([a87b071](https://github.com/stone-payments/pos-mamba-sdk/commit/a87b07144dda857e3529bf1aafb8524f70a8c6c4))
* 🐛 old variables remnants ([c5cb2df](https://github.com/stone-payments/pos-mamba-sdk/commit/c5cb2dff0350752286b973bd401a0d5d952d501d))
* 🐛 revert remnants ([1bebb18](https://github.com/stone-payments/pos-mamba-sdk/commit/1bebb18832717b14c2080e3159d65e5af6059e39))
* 🐛 update variables to camcelCase ([87bbeeb](https://github.com/stone-payments/pos-mamba-sdk/commit/87bbeeb494eeba68991d04361d304b20f3e29ce8))





# [2.37.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@2.34.3...@mamba/input@2.37.0) (2021-02-10)
## [2.36.1](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@2.36.0...@mamba/input@2.36.1) (2021-02-09)

**Note:** Version bump only for package @mamba/input





# [2.36.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@2.34.3...@mamba/input@2.36.0) (2021-02-08)


### Bug Fixes

* 🐛 old variables remnants ([c5cb2df](https://github.com/stone-payments/pos-mamba-sdk/commit/c5cb2dff0350752286b973bd401a0d5d952d501d))
* 🐛 update variables to camcelCase ([87bbeeb](https://github.com/stone-payments/pos-mamba-sdk/commit/87bbeeb494eeba68991d04361d304b20f3e29ce8))





# [2.35.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@2.34.3...@mamba/input@2.35.0) (2021-02-08)


### Bug Fixes

* 🐛 old variables remnants ([c5cb2df](https://github.com/stone-payments/pos-mamba-sdk/commit/c5cb2dff0350752286b973bd401a0d5d952d501d))
* 🐛 update variables to camcelCase ([87bbeeb](https://github.com/stone-payments/pos-mamba-sdk/commit/87bbeeb494eeba68991d04361d304b20f3e29ce8))





## [2.34.3](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@2.34.2...@mamba/input@2.34.3) (2021-01-26)

**Note:** Version bump only for package @mamba/input





## [2.34.2](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@2.34.1...@mamba/input@2.34.2) (2021-01-13)

**Note:** Version bump only for package @mamba/input





## [2.34.1](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@2.34.0...@mamba/input@2.34.1) (2021-01-08)

**Note:** Version bump only for package @mamba/input





# [2.34.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@2.33.3...@mamba/input@2.34.0) (2021-01-04)


### Features

* 🎸 Update packages ([b8044fe](https://github.com/stone-payments/pos-mamba-sdk/commit/b8044fe52daa682e98b71c275f509acd60c77f40))





# [2.34.0](https://github.com/stone-payments/pos-mamba-sdk/compare/@mamba/input@2.33.3...@mamba/input@2.34.0) (2021-01-04)

**Note:** Version bump only for package @mamba/input





## 2.33.3 (2020-11-24)



## 2.33.2 (2020-11-14)


### Bug Fixes

* 🐛 Include padding bottom on input ([8ee2413](https://github.com/stone-payments/pos-mamba-sdk/commit/8ee24134a063e69d51b8dc99d8ad1c357cc54e51))



## 2.33.1 (2020-10-27)


### Bug Fixes

* 🐛 Fix input and app component ([8702f55](https://github.com/stone-payments/pos-mamba-sdk/commit/8702f553f21546de0f1178d0a1adedfcf8bd4a20))



## 2.32.4 (2020-09-23)



## 2.32.3 (2020-09-15)



## 2.32.2 (2020-09-14)



## 2.32.1 (2020-08-19)



# 2.32.0 (2020-08-18)



## 2.31.2 (2020-08-03)



# 2.31.0 (2020-07-21)



# 2.30.0 (2020-07-06)


### Bug Fixes

* 🐛 Fix merge ([d4d3b55](https://github.com/stone-payments/pos-mamba-sdk/commit/d4d3b550a9313bca041b113c795208eb4c65a32e))



## 2.29.6 (2020-06-18)


### Bug Fixes

* 🐛 Remove event when ondestroy is called ([cb01a95](https://github.com/stone-payments/pos-mamba-sdk/commit/cb01a9567848e4dbd59b335a1559f1ceccfdb856))



## 2.29.5 (2020-06-18)


### Bug Fixes

* 🐛 Fix input bugs ([d935a44](https://github.com/stone-payments/pos-mamba-sdk/commit/d935a4478c53a11dab014f1f72b342314a65764f))
* 🐛 Update code ([9f6ed03](https://github.com/stone-payments/pos-mamba-sdk/commit/9f6ed03fa9f830a83d5447d3e434c232ee3c9940))


### Features

* 🎸 Create a new method to activate another stonecode ([be87d06](https://github.com/stone-payments/pos-mamba-sdk/commit/be87d06f7d19f28ddfcdc231654822204663c90d))



## 2.29.4 (2020-06-16)



## 2.29.3 (2020-05-18)



## 2.29.1 (2020-05-18)



# 2.28.0 (2020-05-11)



## 2.27.2 (2020-04-15)



## 2.27.1 (2020-04-03)



# 2.27.0 (2020-04-01)



## 2.26.3 (2020-03-13)


### Bug Fixes

* 🐛 fixed input test ([60c305e](https://github.com/stone-payments/pos-mamba-sdk/commit/60c305e82dd6d5dadb1f90bf2b0daaf22b2a09d8))
* 🐛 Fixed input text color when itś disabled ([6a2ee58](https://github.com/stone-payments/pos-mamba-sdk/commit/6a2ee5839a343f7ccb689c32d7f12162d4d70076))



## 2.26.2 (2020-03-12)


### Bug Fixes

* 🐛 Fixed eye button to show password when input is disabled ([8b93eaa](https://github.com/stone-payments/pos-mamba-sdk/commit/8b93eaa1cdc96f83a859d98a43efe07dfd600d34))
* 🐛 iframe embed https ([a5a5ede](https://github.com/stone-payments/pos-mamba-sdk/commit/a5a5ede812cd34b82e4c4a851b984a87c1671095))



## 2.26.1 (2020-03-01)



# 2.26.0 (2020-02-28)



# 2.25.0 (2020-02-17)



## 2.23.4 (2020-01-30)



## 2.23.2 (2020-01-27)



## 2.23.1 (2020-01-07)



# 2.23.0 (2020-01-02)



# 2.18.0 (2019-11-21)



# 2.17.0 (2019-11-18)



# 2.16.0 (2019-11-08)


### Bug Fixes

* bug from route not being scrollable after open keyboard ([ef0af6d](https://github.com/stone-payments/pos-mamba-sdk/commit/ef0af6daab34e2696c896e6f7f5fa188145ab5ac))


### Features

* 🎸 add value to validation callback ([2737e93](https://github.com/stone-payments/pos-mamba-sdk/commit/2737e930b98696961c65752f4f38caa475b06ec1))



# 2.14.0 (2019-10-15)



# 2.13.0 (2019-09-20)


### Features

* 🎸 Implement readonlyOnEnter attr on money input ([#452](https://github.com/stone-payments/pos-mamba-sdk/issues/452)) ([ff5df7a](https://github.com/stone-payments/pos-mamba-sdk/commit/ff5df7ac0b3dcb1fd0f0ffd9158c837cb328a148))
* 🎸 input feedback also on Capitalize and Backspace keys ([d2e1207](https://github.com/stone-payments/pos-mamba-sdk/commit/d2e120754d9aa7d9a30db222440e5577680c9dbf))
* 🎸 Input now supports maxLength props ([3d0c6c5](https://github.com/stone-payments/pos-mamba-sdk/commit/3d0c6c5ab17a6a75fc585d4569a24506391a05dc))
* 🎸 keyboard now has max length ([a2abe83](https://github.com/stone-payments/pos-mamba-sdk/commit/a2abe83b757656b8962a59551410bea0db10a0e8))
* 🎸 keyboard now has special characters as suggestions ([3da3e40](https://github.com/stone-payments/pos-mamba-sdk/commit/3da3e40a8fc90a188d2a5749185a8760bd17e6c9))
* 🎸 Keyboard with new icons and green submit button ([a243b77](https://github.com/stone-payments/pos-mamba-sdk/commit/a243b77c561b19ea492617aab27b8b5bebd2edc3))
* 🎸 visual feedback & font size changes on length ([04e1d74](https://github.com/stone-payments/pos-mamba-sdk/commit/04e1d7442d224c5f85330979b6865ae3c6b03d11))


* develop -> Release/v2.10.0 (#453) ([af211c3](https://github.com/stone-payments/pos-mamba-sdk/commit/af211c3757de3d49199aec19eb295fc780089cf2)), closes [#453](https://github.com/stone-payments/pos-mamba-sdk/issues/453) [#448](https://github.com/stone-payments/pos-mamba-sdk/issues/448) [#444](https://github.com/stone-payments/pos-mamba-sdk/issues/444)
* master -> Release/v2.10.0 (#454) ([95f4e1d](https://github.com/stone-payments/pos-mamba-sdk/commit/95f4e1da2f1ca8b59fc11b7573c3cbd4b1add4a7)), closes [#454](https://github.com/stone-payments/pos-mamba-sdk/issues/454) [#444](https://github.com/stone-payments/pos-mamba-sdk/issues/444) [#449](https://github.com/stone-payments/pos-mamba-sdk/issues/449) [#452](https://github.com/stone-payments/pos-mamba-sdk/issues/452)
* Release/v2.9.1 (#448) ([f54e177](https://github.com/stone-payments/pos-mamba-sdk/commit/f54e1779081c2cdcd854023746c5d1a136496010)), closes [#448](https://github.com/stone-payments/pos-mamba-sdk/issues/448) [#444](https://github.com/stone-payments/pos-mamba-sdk/issues/444)


### BREAKING CHANGES

* Feature Flags

* Update README.md

Removed wrong text.

* chore(release): :robot: publish

* chore(release): :robot: publish

* chore(release): :robot: publish

* fix: 🐛 changelog duplicate

* test: 💍 remove some appBar test temporally

* chore(release): :robot: publish
* Feature Flags

* Update README.md

Removed wrong text.

* chore(release): :robot: publish

* chore(release): :robot: publish

* chore(release): :robot: publish

* fix: 🐛 changelog duplicate
* Feature Flags

* Update README.md

Removed wrong text.

* chore(release): :robot: publish

* chore(release): :robot: publish

* chore(release): :robot: publish

* fix: 🐛 changelog duplicate



## 2.9.1 (2019-07-19)



## 2.8.3 (2019-06-10)


### Features

* 🎸 Create operating mode by route ([#439](https://github.com/stone-payments/pos-mamba-sdk/issues/439)) ([67fccfe](https://github.com/stone-payments/pos-mamba-sdk/commit/67fccfe63201b0c12f95908c2d7cca9ff0c1beff))


### BREAKING CHANGES

* add `changeOn` param at Tabs; add `route` param at TabPane

* docs: ✏️ update docs description and for the new params

* fix: 🐛 Remove useless scripts



## 2.8.2 (2019-05-27)


### Bug Fixes

* 🐛 lerna circular dependency ([ff17a32](https://github.com/stone-payments/pos-mamba-sdk/commit/ff17a325e8e59480cfc40e78730ecd3927f6a70e))



## 2.7.1 (2019-04-10)



# 2.7.0 (2019-04-10)



## 2.6.4 (2019-04-03)



## 2.6.3 (2019-04-02)


### Bug Fixes

* 🐛 forcefocus breaking another consecutive input focus ([72999e3](https://github.com/stone-payments/pos-mamba-sdk/commit/72999e3150458fcec08d7c4701047652c1fa9faa))



## 2.6.2 (2019-03-25)


### Bug Fixes

* 🐛 check if the input is rendered before blurring ([2bb0c77](https://github.com/stone-payments/pos-mamba-sdk/commit/2bb0c777c5a9a432bbe4956455e377a79ee3ce69))



## 2.6.1 (2019-03-25)


### Bug Fixes

* 🐛 <Text/> focus on unexistent input ([1eeafbe](https://github.com/stone-payments/pos-mamba-sdk/commit/1eeafbe615765d74a9caddfed9011865d7c3204b))



# 2.6.0 (2019-03-21)


### Bug Fixes

* 🐛 input using wrong isValid value ([4163205](https://github.com/stone-payments/pos-mamba-sdk/commit/41632053ed97c1da108e0a4edb7f957706bd2390))
* 🐛 money input validation events and extra beep ([ff54f7b](https://github.com/stone-payments/pos-mamba-sdk/commit/ff54f7b3c7bca5180d44b710b7a21f0bc091476b))
* 🐛 remove input border transition ([715a6b9](https://github.com/stone-payments/pos-mamba-sdk/commit/715a6b9c238994a8335879c2cb265a886ad14d72))


### Features

* 🎸 add validate() method ([6aaff5f](https://github.com/stone-payments/pos-mamba-sdk/commit/6aaff5ff5f31d823ce280c9f4375c5c028ca5d20))
* 🎸virtualkeyboard ([#350](https://github.com/stone-payments/pos-mamba-sdk/issues/350)) ([e9440c8](https://github.com/stone-payments/pos-mamba-sdk/commit/e9440c8274fbc5b5adfa4ca55100942feda915a4)), closes [#375](https://github.com/stone-payments/pos-mamba-sdk/issues/375)



## 2.5.3 (2019-02-22)



## 2.5.2 (2019-02-21)


### Features

* 🎸 change row label size to 14px ([e74269c](https://github.com/stone-payments/pos-mamba-sdk/commit/e74269cc54037e5e340b3e54c498b67c9821472d))



# 2.4.0 (2019-02-12)


### Bug Fixes

* 🐛 Remove invalid "width: block" ([63fe39b](https://github.com/stone-payments/pos-mamba-sdk/commit/63fe39bf46afa0f654866c34f11784c50454d776))



# 2.2.0 (2019-01-31)



# 2.0.0 (2018-12-11)



# 1.0.0-rc.27 (2018-10-31)



# 1.0.0-rc.26 (2018-10-31)



# 1.0.0-rc.24 (2018-10-22)



# 1.0.0-rc.22 (2018-10-19)



# 1.0.0-rc.21 (2018-10-17)



# 1.0.0-rc.20 (2018-10-16)



# 1.0.0-rc.19 (2018-10-02)



# 1.0.0-rc.18 (2018-10-02)



# 1.0.0-rc.17 (2018-10-02)



# 1.0.0-rc.15 (2018-09-27)



# 1.0.0-rc.14 (2018-09-27)



# 1.0.0-rc.13 (2018-09-26)



# 1.0.0-rc.12 (2018-09-26)



# 1.0.0-rc.11 (2018-09-26)



# 1.0.0-rc.10 (2018-09-24)



# 1.0.0-rc.9 (2018-09-21)



# 1.0.0-rc.8 (2018-09-21)



# 1.0.0-rc.7 (2018-09-20)


### Reverts

* Revert "V1.0.0 prealpha.6 (#170)" ([c678a56](https://github.com/stone-payments/pos-mamba-sdk/commit/c678a567013f4bb1bae5e0dd2538c964976c5647)), closes [#170](https://github.com/stone-payments/pos-mamba-sdk/issues/170)
* Revert "V0.0.2 alpha.7 (#150)" ([5a93aef](https://github.com/stone-payments/pos-mamba-sdk/commit/5a93aefc34ce94f73744e8abd3d50e32ed38e427)), closes [#150](https://github.com/stone-payments/pos-mamba-sdk/issues/150)





## [2.33.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.33.1...v2.33.2) (2020-11-14)


### Bug Fixes

* 🐛 Include padding bottom on input ([8ee2413](https://github.com/stone-payments/pos-mamba-sdk/commit/8ee24134a063e69d51b8dc99d8ad1c357cc54e51))





## [2.33.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.32.4...v2.33.1) (2020-10-27)


### Bug Fixes

* 🐛 Fix input and app component ([8702f55](https://github.com/stone-payments/pos-mamba-sdk/commit/8702f553f21546de0f1178d0a1adedfcf8bd4a20))





## [2.32.4](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.32.3...v2.32.4) (2020-09-23)

**Note:** Version bump only for package @mamba/input





## [2.32.3](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.32.2...v2.32.3) (2020-09-15)

**Note:** Version bump only for package @mamba/input





## [2.32.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.32.1...v2.32.2) (2020-09-14)

**Note:** Version bump only for package @mamba/input





## [2.32.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.32.0...v2.32.1) (2020-08-19)

**Note:** Version bump only for package @mamba/input





# [2.32.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.31.2...v2.32.0) (2020-08-18)

**Note:** Version bump only for package @mamba/input





## [2.31.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.31.0...v2.31.2) (2020-08-03)

**Note:** Version bump only for package @mamba/input





## [2.31.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.31.0...v2.31.1) (2020-08-03)

**Note:** Version bump only for package @mamba/input





# [2.31.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.30.0...v2.31.0) (2020-07-21)

**Note:** Version bump only for package @mamba/input





# [2.30.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.29.6...v2.30.0) (2020-07-06)


### Bug Fixes

* 🐛 Fix merge ([d4d3b55](https://github.com/stone-payments/pos-mamba-sdk/commit/d4d3b550a9313bca041b113c795208eb4c65a32e))


### Features

* 🎸 Create a new method to activate another stonecode ([be87d06](https://github.com/stone-payments/pos-mamba-sdk/commit/be87d06f7d19f28ddfcdc231654822204663c90d))





## [2.29.6](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.29.5...v2.29.6) (2020-06-18)


### Bug Fixes

* 🐛 Remove event when ondestroy is called ([cb01a95](https://github.com/stone-payments/pos-mamba-sdk/commit/cb01a9567848e4dbd59b335a1559f1ceccfdb856))





## [2.29.5](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.29.3...v2.29.5) (2020-06-18)


### Bug Fixes

* 🐛 Fix input bugs ([d935a44](https://github.com/stone-payments/pos-mamba-sdk/commit/d935a4478c53a11dab014f1f72b342314a65764f))
* 🐛 Update code ([9f6ed03](https://github.com/stone-payments/pos-mamba-sdk/commit/9f6ed03fa9f830a83d5447d3e434c232ee3c9940))





## [2.29.4](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.29.3...v2.29.4) (2020-06-16)

**Note:** Version bump only for package @mamba/input





## [2.29.3](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.29.1...v2.29.3) (2020-05-18)

**Note:** Version bump only for package @mamba/input





## [2.29.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.28.0...v2.29.1) (2020-05-18)

**Note:** Version bump only for package @mamba/input





# [2.28.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.27.2...v2.28.0) (2020-05-11)

**Note:** Version bump only for package @mamba/input





## [2.27.3](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.27.2...v2.27.3) (2020-04-17)

**Note:** Version bump only for package @mamba/input





## [2.27.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.27.1...v2.27.2) (2020-04-15)

**Note:** Version bump only for package @mamba/input





## [2.27.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.27.0...v2.27.1) (2020-04-03)

**Note:** Version bump only for package @mamba/input





# [2.27.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.26.3...v2.27.0) (2020-04-01)

**Note:** Version bump only for package @mamba/input





## [2.26.3](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.26.2...v2.26.3) (2020-03-13)


### Bug Fixes

* 🐛 fixed input test ([60c305e](https://github.com/stone-payments/pos-mamba-sdk/commit/60c305e82dd6d5dadb1f90bf2b0daaf22b2a09d8))
* 🐛 Fixed input text color when itś disabled ([6a2ee58](https://github.com/stone-payments/pos-mamba-sdk/commit/6a2ee5839a343f7ccb689c32d7f12162d4d70076))





## [2.26.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.26.1...v2.26.2) (2020-03-12)


### Bug Fixes

* 🐛 Fixed eye button to show password when input is disabled ([8b93eaa](https://github.com/stone-payments/pos-mamba-sdk/commit/8b93eaa1cdc96f83a859d98a43efe07dfd600d34))
* 🐛 iframe embed https ([a5a5ede](https://github.com/stone-payments/pos-mamba-sdk/commit/a5a5ede812cd34b82e4c4a851b984a87c1671095))





## [2.26.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.26.0...v2.26.1) (2020-03-01)

**Note:** Version bump only for package @mamba/input





# [2.26.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.25.0...v2.26.0) (2020-02-28)

**Note:** Version bump only for package @mamba/input





# [2.25.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.23.4...v2.25.0) (2020-02-17)

**Note:** Version bump only for package @mamba/input





# [2.24.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.23.4...v2.24.0) (2020-02-17)

**Note:** Version bump only for package @mamba/input





## [2.23.4](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.23.2...v2.23.4) (2020-01-30)

**Note:** Version bump only for package @mamba/input





## [2.23.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.23.1...v2.23.2) (2020-01-27)

**Note:** Version bump only for package @mamba/input





## [2.23.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.23.0...v2.23.1) (2020-01-07)

**Note:** Version bump only for package @mamba/input





# [2.23.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.22.0...v2.23.0) (2020-01-02)

**Note:** Version bump only for package @mamba/input





## [2.22.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.22.0...v2.22.2) (2020-01-02)

**Note:** Version bump only for package @mamba/input





## [2.22.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.22.0...v2.22.1) (2019-12-19)

**Note:** Version bump only for package @mamba/input





# [2.22.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.18.0...v2.22.0) (2019-12-18)

**Note:** Version bump only for package @mamba/input





# [2.18.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.17.0...v2.18.0) (2019-11-21)

**Note:** Version bump only for package @mamba/input





# [2.17.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.16.0...v2.17.0) (2019-11-18)


### Features

* 🎸 add value to validation callback ([2737e93](https://github.com/stone-payments/pos-mamba-sdk/commit/2737e930b98696961c65752f4f38caa475b06ec1))





# [2.16.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.15.0...v2.16.0) (2019-11-08)


### Bug Fixes

* bug from route not being scrollable after open keyboard ([ef0af6d](https://github.com/stone-payments/pos-mamba-sdk/commit/ef0af6daab34e2696c896e6f7f5fa188145ab5ac))





# [2.14.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.13.0...v2.14.0) (2019-10-15)


* master -> Release/v2.10.0 (#454) ([95f4e1d](https://github.com/stone-payments/pos-mamba-sdk/commit/95f4e1da2f1ca8b59fc11b7573c3cbd4b1add4a7)), closes [#454](https://github.com/stone-payments/pos-mamba-sdk/issues/454) [#444](https://github.com/stone-payments/pos-mamba-sdk/issues/444) [#449](https://github.com/stone-payments/pos-mamba-sdk/issues/449) [#452](https://github.com/stone-payments/pos-mamba-sdk/issues/452)
* Release/v2.9.1 (#448) ([f54e177](https://github.com/stone-payments/pos-mamba-sdk/commit/f54e1779081c2cdcd854023746c5d1a136496010)), closes [#448](https://github.com/stone-payments/pos-mamba-sdk/issues/448) [#444](https://github.com/stone-payments/pos-mamba-sdk/issues/444)


### Features

* 🎸 input feedback also on Capitalize and Backspace keys ([d2e1207](https://github.com/stone-payments/pos-mamba-sdk/commit/d2e120754d9aa7d9a30db222440e5577680c9dbf))
* 🎸 Input now supports maxLength props ([3d0c6c5](https://github.com/stone-payments/pos-mamba-sdk/commit/3d0c6c5ab17a6a75fc585d4569a24506391a05dc))
* 🎸 keyboard now has max length ([a2abe83](https://github.com/stone-payments/pos-mamba-sdk/commit/a2abe83b757656b8962a59551410bea0db10a0e8))
* 🎸 keyboard now has special characters as suggestions ([3da3e40](https://github.com/stone-payments/pos-mamba-sdk/commit/3da3e40a8fc90a188d2a5749185a8760bd17e6c9))
* 🎸 Keyboard with new icons and green submit button ([a243b77](https://github.com/stone-payments/pos-mamba-sdk/commit/a243b77c561b19ea492617aab27b8b5bebd2edc3))
* 🎸 visual feedback & font size changes on length ([04e1d74](https://github.com/stone-payments/pos-mamba-sdk/commit/04e1d7442d224c5f85330979b6865ae3c6b03d11))


### BREAKING CHANGES

* Feature Flags

* Update README.md

Removed wrong text.

* chore(release): :robot: publish

* chore(release): :robot: publish

* chore(release): :robot: publish

* fix: 🐛 changelog duplicate
* Feature Flags

* Update README.md

Removed wrong text.

* chore(release): :robot: publish

* chore(release): :robot: publish

* chore(release): :robot: publish

* fix: 🐛 changelog duplicate





# [2.13.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.9.1...v2.13.0) (2019-09-20)


### Features

* 🎸 Implement readonlyOnEnter attr on money input ([#452](https://github.com/stone-payments/pos-mamba-sdk/issues/452)) ([ff5df7a](https://github.com/stone-payments/pos-mamba-sdk/commit/ff5df7a))


* develop -> Release/v2.10.0 (#453) ([af211c3](https://github.com/stone-payments/pos-mamba-sdk/commit/af211c3)), closes [#453](https://github.com/stone-payments/pos-mamba-sdk/issues/453) [#448](https://github.com/stone-payments/pos-mamba-sdk/issues/448) [#444](https://github.com/stone-payments/pos-mamba-sdk/issues/444)
* master -> Release/v2.10.0 (#454) ([95f4e1d](https://github.com/stone-payments/pos-mamba-sdk/commit/95f4e1d)), closes [#454](https://github.com/stone-payments/pos-mamba-sdk/issues/454) [#444](https://github.com/stone-payments/pos-mamba-sdk/issues/444) [#449](https://github.com/stone-payments/pos-mamba-sdk/issues/449) [#452](https://github.com/stone-payments/pos-mamba-sdk/issues/452)
* Release/v2.9.1 (#448) ([f54e177](https://github.com/stone-payments/pos-mamba-sdk/commit/f54e177)), closes [#448](https://github.com/stone-payments/pos-mamba-sdk/issues/448) [#444](https://github.com/stone-payments/pos-mamba-sdk/issues/444)


### BREAKING CHANGES

* Feature Flags

* Update README.md

Removed wrong text.

* chore(release): :robot: publish

* chore(release): :robot: publish

* chore(release): :robot: publish

* fix: 🐛 changelog duplicate

* test: 💍 remove some appBar test temporally

* chore(release): :robot: publish
* Feature Flags

* Update README.md

Removed wrong text.

* chore(release): :robot: publish

* chore(release): :robot: publish

* chore(release): :robot: publish

* fix: 🐛 changelog duplicate
* Feature Flags

* Update README.md

Removed wrong text.

* chore(release): :robot: publish

* chore(release): :robot: publish

* chore(release): :robot: publish

* fix: 🐛 changelog duplicate







**Note:** Version bump only for package @mamba/input





# [2.10.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.9.1...v2.10.0) (2019-07-25)


### Features

* 🎸 Implement readonlyOnEnter attr on money input ([#452](https://github.com/stone-payments/pos-mamba-sdk/issues/452)) ([ff5df7a](https://github.com/stone-payments/pos-mamba-sdk/commit/ff5df7a))





## [2.9.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.8.3...v2.9.1) (2019-07-19)

**Note:** Version bump only for package @mamba/input





## [2.9.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.8.3...v2.9.1) (2019-07-19)

**Note:** Version bump only for package @mamba/input





## [2.9.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.8.3...v2.9.1) (2019-07-19)

**Note:** Version bump only for package @mamba/input





## [2.8.3](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.8.2...v2.8.3) (2019-06-10)


### Bug Fixes

* 🐛 lerna circular dependency ([ff17a32](https://github.com/stone-payments/pos-mamba-sdk/commit/ff17a32))


### Features

* 🎸 Create operating mode by route ([#439](https://github.com/stone-payments/pos-mamba-sdk/issues/439)) ([67fccfe](https://github.com/stone-payments/pos-mamba-sdk/commit/67fccfe))


### BREAKING CHANGES

* add `changeOn` param at Tabs; add `route` param at TabPane

* docs: ✏️ update docs description and for the new params

* fix: 🐛 Remove useless scripts





## [2.8.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.7.2...v2.8.2) (2019-05-27)

**Note:** Version bump only for package @mamba/input





## [2.8.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.8.0...v2.8.1) (2019-05-15)

**Note:** Version bump only for package @mamba/input





# [2.8.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.7.2...v2.8.0) (2019-05-15)

**Note:** Version bump only for package @mamba/input





## [2.7.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.7.0...v2.7.1) (2019-04-10)

**Note:** Version bump only for package @mamba/input





# [2.7.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.6.4...v2.7.0) (2019-04-10)

**Note:** Version bump only for package @mamba/input





## [2.6.4](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.6.3...v2.6.4) (2019-04-03)

**Note:** Version bump only for package @mamba/input





## [2.6.3](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.6.2...v2.6.3) (2019-04-02)


### Bug Fixes

* 🐛 forcefocus breaking another consecutive input focus ([72999e3](https://github.com/stone-payments/pos-mamba-sdk/commit/72999e3))





## [2.6.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.6.1...v2.6.2) (2019-03-25)


### Bug Fixes

* 🐛 check if the input is rendered before blurring ([2bb0c77](https://github.com/stone-payments/pos-mamba-sdk/commit/2bb0c77))





## [2.6.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.6.0...v2.6.1) (2019-03-25)


### Bug Fixes

* 🐛 <Text/> focus on unexistent input ([1eeafbe](https://github.com/stone-payments/pos-mamba-sdk/commit/1eeafbe))





# [2.6.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.5.3...v2.6.0) (2019-03-21)


### Bug Fixes

* 🐛 input using wrong isValid value ([4163205](https://github.com/stone-payments/pos-mamba-sdk/commit/4163205))
* 🐛 money input validation events and extra beep ([ff54f7b](https://github.com/stone-payments/pos-mamba-sdk/commit/ff54f7b))
* 🐛 remove input border transition ([715a6b9](https://github.com/stone-payments/pos-mamba-sdk/commit/715a6b9))


### Features

* 🎸 add validate() method ([6aaff5f](https://github.com/stone-payments/pos-mamba-sdk/commit/6aaff5f))
* 🎸virtualkeyboard ([#350](https://github.com/stone-payments/pos-mamba-sdk/issues/350)) ([e9440c8](https://github.com/stone-payments/pos-mamba-sdk/commit/e9440c8)), closes [#375](https://github.com/stone-payments/pos-mamba-sdk/issues/375)





## [2.5.3](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.5.2...v2.5.3) (2019-02-22)

**Note:** Version bump only for package @mamba/input





## [2.5.2](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.4.1...v2.5.2) (2019-02-21)


### Features

* 🎸 change row label size to 14px ([e74269c](https://github.com/stone-payments/pos-mamba-sdk/commit/e74269c))





## [2.5.1](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.4.1...v2.5.1) (2019-02-21)


### Features

* 🎸 change row label size to 14px ([e74269c](https://github.com/stone-payments/pos-mamba-sdk/commit/e74269c))





# [2.5.0](https://github.com/stone-payments/pos-mamba-sdk/compare/v2.4.1...v2.5.0) (2019-02-21)


### Features

* 🎸 change row label size to 14px ([e74269c](https://github.com/stone-payments/pos-mamba-sdk/commit/e74269c))





# 2.4.0 (2019-02-12)


### Bug Fixes

* 🐛 Remove invalid "width: block" ([63fe39b](https://github.com/stone-payments/pos-mamba-sdk/commit/63fe39b))
