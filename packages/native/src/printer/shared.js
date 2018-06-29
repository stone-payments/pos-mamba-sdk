import SignalHandler from '../SignalHandler'

export default function(Printer) {
  const PrinterSignals = SignalHandler(Printer)

  Printer.print = function(element, options = {}) {
    return new Promise((resolve, reject) => {
      PrinterSignals.once('printerDone', () => {
        Printer.failedPrinting() ? reject(new Error('NO_PAPER')) : resolve()
      })

      Printer.doPrint(element, options)
    })
  }
}
