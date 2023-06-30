# Keyboard

Real-life examples for teammates

## Installing

- USE YARN!!!
- Keyboard and Input UP TO DATE, to prevent bugs
- Core for handling key inputs ([Core examples](https://github.com/stone-payments/pos-mamba-sdk/blob/master/packages/core/README.md))

```bash
yarn add @mamba/input@next @mamba/keyboard@next @mamba/core
```

## Basic Usage

### Global keyboard for app

```js
import { KeyboardType } from '@mamba/keyboard/lib/index.js';
```

<!-- prettier-ignore -->
```html
<Keyboard keyboardType="{KeyboardType.Numeric}" renderCondition="{$POS.IS_D199}" />
<!-- renderCondition="{$POS.IS_D199}" : usually just needed for D199 but changeable  -->
```

### Calling inside inputs

- easier to implement and connected to inside component methods
- this use OVERWRITES setOptions via JS

<!-- prettier-ignore -->
```html
<MoneyInput
  {...}
  keyboardOptions={{
    keyboardType: KeyboardType.Numeric,
    keepVisible: true,
    renderCondition: $POS.IS_D199,
    maxLength: String(CURRENCY.LIMIT).length - 1,
    lastValue: 'R$ 0,00',
    filtersNumbersOnly: true,
  }}
/>
```

### Calling from JS

- in case you need, here is the way to do it
- ⚠️ **Attention:** this implementation changes global settings, maybe needing to change after the route
- ⚠️ **Attention:** call setOptions() INSIDE SETTIMEOUT WITH NO DELAY PARAMETER, forcing it to wait the block to trigger

```js
setTimeout(() => {
  Keyboard.setOptions({
    keyboardType: KeyboardType.Math,
    updateMode: KeyboardUpdateMode.Manual,
    keepVisible: true,
    readonly: true,
    maxLength: String(CURRENCY.LIMIT).length - 1,
    onKeyPress: (button) => {
      if (button !== 'check') {
        this.addInput(button);
      } else {
        this.pay();
      }
    },
  });
});
```
