import mock from './mock.js'

let Transactions = window.Transactions

// TODO: Find where to put this since it's just for a specific app
if (process.env.NODE_ENV !== 'production') {
  Transactions = window.Transactions = {}
  mock(Transactions)
}

if (process.env.NODE_ENV === 'production') {
  Transactions = window.Transactions
  if (!Transactions) {
    throw new Error("[@mamba/native] 'Transactions' module not found")
  }
}

export default Transactions
