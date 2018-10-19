import Core from '../../simulator/core.js';

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
  Printer.getPaperWidth = () => Core.Registry.get('$Printer.paperWidth');
  Printer.isPrinting = () => Core.Registry.get('$Printer.isPrinting');
  Printer.failedPrinting = () => Core.Registry.get('$Printer.panel.shouldFail');

  Printer.doPrint = function doPrint(content, options) {
    if (options.print_to_paper === false) {
      return Printer.printerDone();
    }

    Core.Registry.set('$Printer.isPrinting', true);

    /** Fire the printing signal for the browser mamba simulation */
    if (!Printer.failedPrinting()) {
      /**
       * Take a snapshot of the element / clone the node for the virtual printer.
       * If we don't clone it, if the <Printable/> is destroyed before the
       * paper is printed, it will print nothing because the content element was
       * destroyed.
       * */
      Core.HardwareManager.startPrinting(content.cloneNode(true), options);
      Core.HardwareManager.once('endPrinting', () => {
        Core.Registry.set('$Printer.isPrinting', false);
        Printer.printerDone();
      });
      return;
    }

    Core.Registry.set('$Printer.isPrinting', false);
    Printer.printerDone();
  };
}
