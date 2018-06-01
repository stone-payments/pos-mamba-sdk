import mock from './mock.js'
import extendNative from './native.js'

let Payment = window.Payment

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  Payment = window.Payment = {}
  mock(Payment)
}

if (process.env.NODE_ENV === 'production') {
  if (!Payment) {
    throw new Error("[@mamba/native] 'Payment' module not found")
  }
  extendNative(Payment)
}

export default Payment
