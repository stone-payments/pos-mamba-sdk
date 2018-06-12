import mock from './mock.js'

let Receipts = window.Receipts

// TODO: Find where to put this since it's just for a specific app
if (process.env.NODE_ENV !== 'production') {
  Receipts = window.Receipts = {}
  mock(Receipts)
}

if (process.env.NODE_ENV === 'production') {
  Receipts = window.Receipts
  if (!Receipts) {
    throw new Error("[@mamba/native] 'Receipts' module not found")
  }
}

export default Receipts
