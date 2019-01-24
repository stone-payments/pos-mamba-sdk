import { Registry, HardwareManager, View } from '../../simulator/index.js';

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
  Printer.getPaperWidth = () => Registry.get().$Printer.paperWidth;
  Printer.isPrinting = () => Registry.get().$Printer.isPrinting;
  Printer.failedPrinting = () => Registry.get().$Printer.panel.shouldFail;

  Printer.doPrint = function doPrint(content, options) {
    if (options.print_to_paper === false) {
      return Printer.printerDone();
    }

    Registry.set(draft => {
      draft.$Printer.isPrinting = true;
    });

    /** Fire the printing signal for the browser mamba simulation */
    if (!Printer.failedPrinting()) {
      /**
       * Take a snapshot of the element / clone the node for the virtual printer.
       * If we don't clone it, if the <Printable/> is destroyed before the
       * paper is printed, it will print nothing because the content element was
       * destroyed.
       * */
      HardwareManager.fire('startPrinting', content.cloneNode(true), options);
      HardwareManager.once('endPrinting', () => {
        Registry.set(draft => {
          draft.$Printer.isPrinting = false;
        });
        Printer.printerDone();
      });

      /** Fire endPrinting if no Virtual POS found */
      if (!View.getInstance() || window.innerWidth <= 480) {
        setTimeout(() => HardwareManager.fire('endPrinting'), 1000);
      }
      return;
    }

    Registry.set(draft => {
      draft.$Printer.isPrinting = false;
    });
    Printer.printerDone();
  };
}
