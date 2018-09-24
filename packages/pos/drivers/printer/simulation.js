import { Core } from '../../simulator/libs/main.js';

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
  Printer.getPaperWidth = () => Core.get('$Printer.paperWidth');
  Printer.isPrinting = () => Core.get('$Printer.isPrinting');
  Printer.failedPrinting = () => Core.get('$Printer.panel.shouldFail');

  Printer.doPrint = function doPrint(content, options) {
    Core.set('$Printer.isPrinting', true);

    setTimeout(() => {
      /** Fire the printing signal for the browser mamba simulation */
      if (!Printer.failedPrinting()) {
        Core.print(content, options);
      }
      Core.set('$Printer.isPrinting', false);
      Printer.printerDone();
    }, 1500);
  };
}
