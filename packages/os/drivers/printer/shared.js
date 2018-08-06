import SignalHandler from '../../signal/listener.js';

export default function addSharedWrapper(Printer) {
  const PrinterSignals = SignalHandler(Printer);

  Printer.print = (content, options = {}) =>
    new Promise((resolve, reject) => {
      PrinterSignals.once('printerDone', () => {
        if (Printer.failedPrinting()) {
          reject(new Error('NO_PAPER'));
        } else {
          resolve();
        }
      });

      Printer.doPrint(content, options);
    });
}
