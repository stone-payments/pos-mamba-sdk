export default function(Printer) {
  Printer.print = (content, options = {}) =>
    new Promise((resolve, reject) => {
      Printer.once('printerDone', () => {
        if (Printer.failedPrinting()) {
          reject(new Error('NO_PAPER'));
        } else {
          resolve();
        }
      });

      Printer.doPrint(content, options);
    });
}
