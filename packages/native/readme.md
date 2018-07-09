# @mamba/native

## @mamba/native/system

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
