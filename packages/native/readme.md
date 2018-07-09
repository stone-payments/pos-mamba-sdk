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
