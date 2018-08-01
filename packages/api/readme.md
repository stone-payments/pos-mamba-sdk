# @mambasdk/api

## @mambasdk/api/system

```ts
interface System {
  beep: (tone: Tones, duration: number) => void
  hasEthernet: () => boolean
  hasWifi: () => boolean
  hasGprs: () => boolean
  isBatteryPresent: () => boolean
  getPowerSupply: () => PowerSupply
  getTimeFromBoot: () => number
  getSerialNumber: () => string
  getBatteryStatus: () => BatteryStatus
  getBatteryLevel: () => number
  Tones: Tones
  PowerSupply: PowerSupply
  BatteryStatus: BatteryStatus
}

enum Tones {
  TONE1,
  TONE2,
  TONE3,
  TONE4,
  TONE5,
  TONE6,
  TONE7,
}

enum PowerSupply {
  ADAPTER,
  BATTERY,
  USB,
}

enum BatteryStatus {
  CHECK_NOT_SUPPORTED,
  IN_CHARGE,
  CHARGE_COMPLETE,
  DISCHARGE,
  ABSENT,
}
```

## @mambasdk/api/payment

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

## @mambasdk/api/cookie

```ts
class Cookie {
  set(key: string, value: string): true
  get(key: string): string
  clear(): true
}
```

## @mambasdk/api/keyboard

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

## @mambasdk/api/merchant

```ts
interface Merchant {
  getStoneCode: () => string
}
```