export default function(Printer) {
  Printer.currentPrinterDoneCallback = undefined
  Printer.printerDoneCallback = function() {
    // Disconnect the callback from the printerDone signal
    try {
      Printer.printerDone.disconnect(this, Printer.printerDoneCallback)
    } catch (err) {
      console.err(err)
    }

    let error

    if (Printer.failedPrinting()) {
      error = new Error('Failed to print')
    }

    if (typeof Printer.currentPrinterDoneCallback === 'function') {
      Printer.currentPrinterDoneCallback(error)
    }

    // Clear the callback
    Printer.currentPrinterDoneCallback = undefined
  }

  Printer.print = function(element, config, callback) {
    if (config === undefined) config = {}

    Printer.currentPrinterDoneCallback = callback
    Printer.printerDone.connect(
      this,
      Printer.printerDoneCallback,
    )
    Printer.doPrint(element, config)
  }
}
