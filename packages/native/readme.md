# @mamba/native

## @mamba/native/keyboard

```ts
interface Keyboard {
  setKeyboardAsNumeric: () => void,
  setKeyboardAsAlphanumeic: () => void,

  getKeyCode: (keyName: string) => number,
  getKeyName: (keyCode: number) => string,

  isNumericKey: (keyCode: number) => boolean,
  isActionKey: (keyCode: number) => boolean,

  isBackspaceEnabled(): () => boolean,
  disableBackspace: () => void,
  enableBackspace: () => void,
}
```