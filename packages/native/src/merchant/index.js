import mock from './mock.js'

let Merchant = window.MbMerchant

if (process.env.NODE_ENV !== 'production') {
  Merchant = window.MbMerchant = {}
  mock(Merchant)
}

if (process.env.NODE_ENV === 'production') {
  if (!Merchant) {
    throw new Error("[@mamba/native] 'Merchant' module not found")
  }
}

export default Merchant
