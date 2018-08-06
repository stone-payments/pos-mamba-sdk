import Signal from '../../signal/signal.js';

export default function setup(Printer) {
  Signal.register(Printer, ['printerDone', 'browser:printing']);
  const config = {
    shouldFail: false,
    isPrinting: false,
    paperWidth: 384,
  };

  Printer.getPaperWidth = () => config.paperWidth;
  Printer.isPrinting = () => config.isPrinting;
  Printer.failedPrinting = () => config.shouldFail;
  Printer.doPrint = function doPrint(content, options) {
    setTimeout(() => {
      /** Fire the printing signal for the browser mamba simulation */
      Printer['browser:printing'](content, options);
      Printer.printerDone();
    }, 1500);
  };
}
