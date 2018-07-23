import mock from './mock.js'
import addSharedTo from './shared.js'

let Payment = window.Payment

/** For development environment */
if (process.env.NODE_ENV !== 'production') {
  Payment = window.Payment = {}
  addSharedTo(Payment)
  mock(Payment)
}

/** For production environment */
if (process.env.NODE_ENV === 'production') {
  addSharedTo(Payment)
}

export default Payment
