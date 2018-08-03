import Signal from '@mambasdk/signal/signal.js';

const MockConfig = {
  shouldFail: false,
  isPrinting: false,
};

const getPaperWidth = () => 384;
const isPrinting = () => MockConfig.isPrinting;

/** 20% chance of failing */
const failedPrinting = () => Math.random() <= 0;

export default function (Printer) {
  Signal.register(Printer, ['printerDone']);

  Printer.doPrint = () => {
    setTimeout(() => {
      Printer.printerDone();
    }, 1500);
  };

  Object.assign(Printer, {
    getPaperWidth,
    isPrinting,
    failedPrinting,
  });
}
