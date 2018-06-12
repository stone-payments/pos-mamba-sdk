// Merchant Receipt
const isMerchantReceiptEnabled = () => true
const disableMerchantReceipt = () => {
  console.log('Merchant Receipt Disabled')
}
const enableMerchantReceipt = () => {
  console.log('Merchant Receipt Enabled')
}

// Hide Merchant Address
const isHideMerchantAddressEnabled = () => true
const disableHideMerchantAddress = () => {
  console.log('Hide Merchant Address Disabled')
}

const enableHideMerchantAddress = () => {
  console.log('Hide Merchant Address Enabled')
}

// Receipt Phrase
let receiptPhrase = ''
const isReceiptPhraseEnabled = () => false
const disableReceiptPhrase = () => {
  console.log('Receipt Phrase Disabled')
}
const enableReceiptPhrase = () => {
  console.log('Receipt Phrase Enabled')
}
const setReceiptPhrase = phrase => {
  console.log('Setting receipt phrase to: ' + phrase)
  receiptPhrase = phrase
}
const getReceiptPhrase = () => {
  console.log('Get Receipt Phrase')
  return receiptPhrase
}

/** Economic Receipt */
let economicReceipt = true
const isReceiptEconomic = () => economicReceipt
const setReceiptEconomic = value => {
  console.log('Economic receipt set to: ', value)
  economicReceipt = value
}

export default function(Receipts) {
  Object.assign(Receipts, {
    isMerchantReceiptEnabled,
    disableMerchantReceipt,
    enableMerchantReceipt,

    isHideMerchantAddressEnabled,
    disableHideMerchantAddress,
    enableHideMerchantAddress,

    isReceiptPhraseEnabled,
    disableReceiptPhrase,
    enableReceiptPhrase,
    setReceiptPhrase,
    getReceiptPhrase,

    isReceiptEconomic,
    setReceiptEconomic,
  })
}
