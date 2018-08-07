import Simulator from '../../api.js';

export const NAMESPACE = 'Printer';

export const SETTINGS = {
  shouldFail: false,
  isPrinting: false,
  paperWidth: 384,
};

export const SIGNALS = ['printerDone'];

export function setup(Printer) {
  Printer.getPaperWidth = () => Simulator.get('Printer.paperWidth');
  Printer.isPrinting = () => Simulator.get('Printer.isPrinting');
  Printer.failedPrinting = () => Simulator.get('Printer.shouldFail');
  Printer.test = () => Simulator.set('Printer.shouldFail', true);

  Printer.doPrint = function doPrint(content, options) {
    setTimeout(() => {
      /** Fire the printing signal for the browser mamba simulation */
      if (!Printer.failedPrinting()) {
        Simulator.print(content, options);
      }
      Printer.printerDone();
    }, 1500);
  };
}
