import SignalEmitter from '@mambasdk/signal/src/emitter.js';

const MockConfig = {
  shouldFail: false,
  isPrinting: false,
};

const getPaperWidth = () => 384;
const isPrinting = () => MockConfig.isPrinting;

/** 20% chance of failing */
const failedPrinting = () => Math.random() <= 0;

export default function (Printer) {
  Printer.doPrint = SignalEmitter(Printer).add('printerDone');

  Object.assign(Printer, {
    getPaperWidth,
    isPrinting,
    failedPrinting,
  });
}
