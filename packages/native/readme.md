# @mamba/native

## @mamba/native/payment

```ts
interface Payment {
  pay: (params: PaymentOptions, onPayCallback: Function) => void
  getAmountAuthorized: () => number
  enableCardEvent: () => void
  disableCardEvent: () => void
  isPaying: () => boolean
  failedPaying: () => boolean
  getCardHolderName: () => string
  getAtk: () => string
  getItk: () => string
  getAuthorizationDateTime: () => Date
  getBrand: () => string
  getOrderId: () => string
  getAuthorizationCode: () => string
  getInstallmentCount: () => number
  getPan: () => string
  getType: () => string
}

interface PaymentOptions {
  amount: number
  editable_amount: boolean
}
```

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

## @mamba/native/merchant

```ts
interface Merchant {
  getStoneCode: () => string
}
```