import { State } from '../../simulator/libs/main.js';

export const NAMESPACE = '$Printer';

export const SETTINGS = {
  panel: {
    shouldFail: false,
  },
  isPrinting: false,
  paperWidth: 384,
};

export const SIGNALS = ['printerDone'];

export function setup(Printer) {
  Printer.getPaperWidth = () => State.get('$Printer.paperWidth');
  Printer.isPrinting = () => State.get('$Printer.isPrinting');
  Printer.failedPrinting = () => State.get('$Printer.panel.shouldFail');

  Printer.doPrint = function doPrint(content, options) {
    State.set('$Printer.isPrinting', true);

    setTimeout(() => {
      /** Fire the printing signal for the browser mamba simulation */
      if (!Printer.failedPrinting()) {
        State.print(content, options);
      }
      State.set('$Printer.isPrinting', false);
      Printer.printerDone();
    }, 1500);
  };
}
