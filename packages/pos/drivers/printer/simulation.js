import { State } from '../../simulator/libs/main.js';

export const NAMESPACE = '$Printer';

export const SETTINGS = {
  shouldFail: false,
  isPrinting: false,
  paperWidth: 384,
};

export const SIGNALS = ['printerDone'];

export function setup(Printer) {
  Printer.getPaperWidth = () => State.get('$Printer.paperWidth');
  Printer.isPrinting = () => State.get('$Printer.isPrinting');
  Printer.failedPrinting = () => State.get('$Printer.shouldFail');
  Printer.test = () => State.set('$Printer.shouldFail', true);

  Printer.doPrint = function doPrint(content, options) {
    setTimeout(() => {
      /** Fire the printing signal for the browser mamba simulation */
      if (!Printer.failedPrinting()) {
        State.print(content, options);
      }
      Printer.printerDone();
    }, 1500);
  };
}
