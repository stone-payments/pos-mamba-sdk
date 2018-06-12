let orderIDEnabled = true
let issuerInstallmentEnabled = true

const isIssuerInstallmentsEnabled = () => issuerInstallmentEnabled
const enableIssuerInstallments = () => {
  console.log('Issuer Installments Enabled')
  issuerInstallmentEnabled = !issuerInstallmentEnabled
}
const disableIssuerInstallments = () => {
  console.log('Issuer Installments Disabled')
  issuerInstallmentEnabled = !issuerInstallmentEnabled
}

const isOrderIdEnabled = () => orderIDEnabled
const disableOrderId = () => {
  console.log('Order ID Disabled')
  orderIDEnabled = !orderIDEnabled
}
const enableOrderId = () => {
  console.log('Order ID Enabled')
  orderIDEnabled = !orderIDEnabled
}

export default function(Transactions) {
  Object.assign(Transactions, {
    enableIssuerInstallments,
    disableIssuerInstallments,
    isIssuerInstallmentsEnabled,
    isOrderIdEnabled,
    disableOrderId,
    enableOrderId,
  })
}
