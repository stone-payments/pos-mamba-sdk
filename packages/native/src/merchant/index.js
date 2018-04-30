import mock from './mock.js'
import extendNative from './native.js'

let Merchant = window.MbMerchant

if (process.env.NODE_ENV !== 'production') {
  Merchant = window.MbMerchant = {}
  mock(Merchant)
} else {
  if (!Merchant) {
    throw new Error("[@mamba/native] 'Merchant' module not found")
  }
  extendNative(Merchant)
}

export default Merchant
