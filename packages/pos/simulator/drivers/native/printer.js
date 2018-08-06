import Signal from '../../signal.js';
import Simulator from '../../api.js';

const DEFAULT_SETTINGS = {
  shouldFail: false,
  isPrinting: false,
  paperWidth: 384,
};

export default function setup(Printer) {
  Simulator.set('printer', DEFAULT_SETTINGS);
  Signal.register(Printer, ['printerDone']);

  Printer.getPaperWidth = () => Simulator.get('printer.paperWidth');
  Printer.isPrinting = () => Simulator.get('printer.isPrinting');
  Printer.failedPrinting = () => Simulator.get('printer.shouldFail');

  Printer.doPrint = function doPrint(content, options) {
    setTimeout(() => {
      /** Fire the printing signal for the browser mamba simulation */
      Simulator.print(content, options);
      Printer.printerDone();
    }, 1500);
  };
}
