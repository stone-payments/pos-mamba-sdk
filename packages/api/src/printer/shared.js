import SignalHandler from '@mambasdk/signal/src/handler.js';

export default function (Printer) {
  const PrinterSignals = SignalHandler(Printer);

  Printer.print = (element, options = {}) =>
    new Promise((resolve, reject) => {
      PrinterSignals.once('printerDone', () => {
        if (Printer.failedPrinting()) {
          reject(new Error('NO_PAPER'));
        } else {
          resolve();
        }
      });

      Printer.doPrint(element, options);
    });
}
