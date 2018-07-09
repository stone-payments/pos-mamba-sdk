# @mamba/native

## @mamba/native/cookie

```ts
    class Cookie {
        set(key: string, value: string): true
        get(key: string): string
        clear(): true
    }
```

## @mamba/native/keyboard

```ts
interface Keyboard {
  setKeyboardAsNumeric: () => void
  setKeyboardAsAlphanumeric: () => void

  getKeyCode: (keyName: string) => number
  getKeyName: (keyCode: number) => string

  isNumericKey: (keyCode: number) => boolean
  isActionKey: (keyCode: number) => boolean

  isBackspaceEnabled(): () => boolean
  disableBackspace: () => void
  enableBackspace: () => void
}
```