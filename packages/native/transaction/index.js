import mock from './mock.js'
import addSharedTo from './shared.js'

let Transaction = window.MbTransaction

if (process.env.NODE_ENV !== 'production') {
  Transaction = window.MbTransaction = {}
  addSharedTo(Transaction)
  mock(Transaction)
} else {
  if (!Transaction) {
    throw new Error("[@mamba/native] 'Transaction' module not found")
  }
  addSharedTo(Transaction)
}

export default Transaction
