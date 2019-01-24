import { Registry } from '@mamba/pos/simulator/index.js';
import Printable from './Printable.html';

const { newTestRoot } = global;

let root;

const newPrintable = data => {
  root = newTestRoot();
  return root.createComponent(Printable, { unique: true, data });
};

let printable;

it('should be able to print its content', () => {
  printable = newPrintable();
  expect(typeof printable.print).toBe('function');
});

it('print() promise should resolve at the same time as the "finish" event', () => {
  printable = newPrintable();
  const printingPromise = printable.print();

  expect(typeof printingPromise.then).toBe('function');

  return Promise.all([
    new Promise(res => printable.on('finish', res)),
    printingPromise,
  ]);
});

it('should display a printing dialog', () => {
  printable = newPrintable();
  printable.print();

  return Promise.all([
    new Promise(res => {
      if (printable.refs.printingDialog) {
        res();
      }
    }),
    new Promise(res => printable.on('finish', res)),
  ]);
});

it('should return a resolved promise when `print({ print_to_paper: false })` and fire "finish"', () => {
  printable = newPrintable();
  return Promise.all([
    new Promise(res => printable.on('finish', res)),
    printable.print({ print_to_paper: false }),
  ]);
});

it('should display a retry dialog in case of a printing error', () => {
  Registry.set(draft => {
    draft.$Printer.panel.shouldFail = true;
  });

  printable = newPrintable();
  printable.print();

  return new Promise(res => {
    printable.on('error', () => {
      if (printable.refs.failureDialog) {
        res();
      }
    });
  });
});

it('should dispatch a "finish" event in case of not wanting to retry printing', () => {
  Registry.set(draft => {
    draft.$Printer.panel.shouldFail = true;
  });

  printable = newPrintable();
  printable.print();

  return new Promise(res => {
    printable.on('finish', res);
    printable.on('error', () => {
      root.query('[shortcut="close"]').click();
    });
  });
});
