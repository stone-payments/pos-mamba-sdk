import mock from './mock.js'
import extendNative from './native.js'

let Printer = window.Printer

if (process.env.NODE_ENV !== 'production') {
  Printer = window.Printer = {}
  mock(Printer)
}

if (process.env.NODE_ENV === 'production') {
  if (!Printer) {
    throw new Error("[@mamba/native] 'Printer' module not found")
  }
  extendNative(Printer)
}

export default Printer
