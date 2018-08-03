import Signal from '@mambasdk/signal/signal.js';

export default function(Printer) {
  const CONFIG = {
    shouldFail: true,
    isPrinting: false,
  };
  Printer.browserConfig = CONFIG;

  const getPaperWidth = () => 384;
  const isPrinting = () => CONFIG.isPrinting;
  const failedPrinting = () => CONFIG.shouldFail;

  Signal.register(Printer, ['printerDone']);

  Printer.doPrint = () => {
    CONFIG.isPrinting = true;
    setTimeout(() => {
      CONFIG.isPrinting = false;
      Printer.printerDone();
    }, 1500);
  };

  Object.assign(Printer, {
    getPaperWidth,
    isPrinting,
    failedPrinting,
  });
}
