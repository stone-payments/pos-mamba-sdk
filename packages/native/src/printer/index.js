/**
 * @namespace Printer
 */
let Printer

if (process.env.NODE_ENV === 'production') {
  if (!window.Printer) {
    throw new Error("[@mamba/native] 'Printer' module not found")
  }
  Printer = require('./native.js').default
} else {
  Printer = require('./mock.js').default
}

window.Printer = Printer
export { Printer as default, Printer }
