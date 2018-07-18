import SignalHandler from '../signal/handler.js';

export default function (Printer) {
  const PrinterSignals = SignalHandler(Printer);

  Printer.print = (element, options = {}) => new Promise((resolve, reject) => {
    PrinterSignals.once(
      'printerDone',
      () => (Printer.failedPrinting() ? reject(new Error('NO_PAPER')) : resolve()),
    );

    Printer.doPrint(element, options);
  });
}
