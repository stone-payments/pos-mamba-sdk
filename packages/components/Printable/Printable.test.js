import Simulator from '@mamba/pos/simulator/index.js';
import Printable from './Printable.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newPrintable = data =>
  root.createComponent(Printable, { unique: true, data });

let printable;

it('should be able to print its content', () => {
  printable = newPrintable();
  expect(typeof printable.print).toBe('function');
});

it('print() promise should resolve at the same time as the "finish" event', () => {
  const printingPromise = printable.print();

  expect(typeof printingPromise.then).toBe('function');

  return Promise.all([
    new Promise(res => printable.on('finish', res)),
    printingPromise,
  ]);
});

it('should display a printing dialog', () => {
  printable.print();

  return new Promise(res => {
    setTimeout(() => {
      if (printable.refs.printingDialog) {
        res();
      }
    });
  });
});

it('should not display the printing dialog when `showPrintingDialog: false`', () => {
  printable = newPrintable({ showPrintingDialog: false });
  printable.print();

  return new Promise(res => {
    setTimeout(() => {
      if (!printable.refs.printingDialog) {
        res();
      }
    });
  });
});

it('should return a resolved promise when `print({ print_to_paper: false })` and fire "finish"', () =>
  Promise.all([
    new Promise(res => printable.on('finish', res)),
    printable.print({ print_to_paper: false }),
  ]));

it('should display a retry dialog in case of a printing error', () => {
  Simulator.Registry.set('$Printer.panel.shouldFail', true);
  printable.print();

  return new Promise(res => {
    setTimeout(() => {
      if (printable.refs.failureDialog) {
        res();
      }
    });
  });
});

it('should dispatch a "finish" event in case of not wanting to retry printing', () => {
  printable.print();

  return new Promise(res => {
    printable.on('finish', res);
    setTimeout(() => {
      root.query('[shortcut="close"]').click();
    });
  });
});
