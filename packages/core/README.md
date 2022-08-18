# Core

Core mamba packages with some essential and shared code.

## Extend

Extend a driver with the base driver.

```js
import extendDriver from '@mamba/core/index.js';

/* Optional Driver wrapper path */
import wrappers from './wrappers.js';

export default extendDriver(driverTarget, wrappers);
```

## Keymap

Provides the specific key-maps and key-names of POS.

### KEY_NAMES

```js
import { KEYBOARD } from '@mamba/core';

const { KEY_NAMES, KEY_NAMES_LIST } = KEYBOARD;

KEY_NAMES.ENTER; // 'Enter'
KEY_NAMES_LIST; // ['CLOSE', 'BACK', 'ENTER', 'HELP', 'SHORTCUTS', 'SPACE', 'KEYUP', 'ARROW_UP', 'KEYDOWN', 'ARROW_DOWN', 'F24', 'F23', 'KEY_0', 'KEY_1', 'KEY_2', 'KEY_3', 'KEY_4', 'KEY_5', 'KEY_6', 'KEY_7', 'KEY_8', 'KEY_9']
```

Values:

```ts
{
  CLOSE: 'Close',
  BACK: 'Back',
  ENTER: 'Enter',
  HELP: 'Help',
  SHORTCUTS: 'Shortcuts',
  SPACE: 'Space',
  F24: 'F24',
  F23: 'F23',
  KEY_0: '0',
  KEY_1: '1',
  KEY_2: '2',
  KEY_3: '3',
  KEY_4: '4',
  KEY_5: '5',
  KEY_6: '6',
  KEY_7: '7',
  KEY_8: '8',
  KEY_9: '9',

  /**
   * @deprecated Use `ARROW_UP`
   */
  KEYUP: 'KeyUp',
  ARROW_UP: 'ArrowUp',
  /**
   * @deprecated Use `ARROW_DOWN`
   */
  KEYDOWN: 'KeyDown',
  ARROW_DOWN: 'ArrowDown',
}
```

### KEY_CODES

```js
import { KEYBOARD } from '@mamba/core';

const { KEY_CODES, KEY_CODES_LIST } = KEYBOARD;

KEY_CODES.ENTER; // 13
KEY_CODES_LIST; // [13, 8, 8, 27, 17, 16, 134, 135, 32, 38, 38, 40, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]
```

Values:

```ts
{
  BACK: 8,
  ENTER: 13,
  SHORTCUTS: 16,
  HELP: 17,
  CLOSE: 27,
  SPACE: 32,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  KEY_0: 48,
  KEY_1: 49,
  KEY_2: 50,
  KEY_3: 51,
  KEY_4: 52,
  KEY_5: 53,
  KEY_6: 54,
  KEY_7: 55,
  KEY_8: 56,
  KEY_9: 57,
  F23: 134,
  F24: 135,

  /**
   * @deprecated Use `ARROW_UP`
   */
  KEYUP: 38,
  /**
   * @deprecated Use `ARROW_DOWN`
   */
  KEYDOWN: 40,
}
```

### KEYMAP

Maped key codes to key names

[keyboard.getkeyname(keycode)]: #getkeynamekeycode

```js
import { KEYBOARD } from '@mamba/core';

const { KEY_MAP, KEY_NAMES, KEY_1 } = KEYBOARD;

KEY_MAP.13; // 'Enter'

KEY_MAP[KEY_NAMES.ENTER]; // 'Enter'
KEY_MAP[KEY_1]; // '1'
```

Values:

```ts
{
  "8": "Backspace",
  "13": "Enter",
  "16": "Shortcuts",
  "17": "Help",
  "27": "Close",
  "32": "Space",
  "38": "KeyUp",
  "40": "KeyDown",
  "48": "0",
  "49": "1",
  "50": "2",
  "51": "3",
  "52": "4",
  "53": "5",
  "54": "6",
  "55": "7",
  "56": "8",
  "57": "9",
  "134": "F23",
  "135": "F24"
}
```

## Usage example

Let's say you want to do some action on your screen based on some POS key.

```html
<svelte:window on:keyup="onKeyup(event)" />

<script>
  import Keyboard from '@mamba/keyboard/api/index.js';
  import { KEYBOARD } from '@mamba/core';

  export default {
    methods: {
      /**
       * @description handle physical keyboard events
       * @param {KeyboardEvent} event
       */
      onKeyup(event) {
        const { keyCode } = event;
        const { KEY_NAMES, KEY_CODES } = KEYBOARD;

        const keyName = Keyboard.getKeyName(keyCode);

        if (keyName === KEY_NAMES.BACK) {
          // Do something with back key name
        } else if (keyName === KEY_NAMES.ENTER) {
          // Do something with enter key name
        }

        // Using key code directly
        if (keyCode === KEY_CODES.SHORTCUTS) {
          // Do something with shortcut key code
        }
      },
    },
  };
</script>
```
