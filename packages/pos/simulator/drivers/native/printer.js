import Signal from '../../signal.js';
import Simulator from '../../api.js';

const DEFAULT_SETTINGS = {
  shouldFail: false,
  isPrinting: false,
  paperWidth: 384,
};

const SIGNALS = ['printerDone'];

export default function setup(Printer) {
  Simulator.set('printer', DEFAULT_SETTINGS);
  Signal.register(Printer, SIGNALS);

  Printer.getPaperWidth = () => Simulator.get('printer.paperWidth');
  Printer.isPrinting = () => Simulator.get('printer.isPrinting');
  Printer.failedPrinting = () => Simulator.get('printer.shouldFail');
  Printer.test = () => Simulator.set('printer.shouldFail', true);

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
