import SignalHandler from '../SignalHandler'

export default function(Printer) {
  const PrinterSignals = SignalHandler(Printer)

  Printer.print = function(element, options = {}) {
    return new Promise((resolve, reject) => {
      PrinterSignals.once('printerDone', () => {
        return Printer.failedPrinting() ? reject(new Error()) : resolve()
      })

      Printer.doPrint(element, options)
    })
  }
}
