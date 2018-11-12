import Simulator from '@mamba/pos/simulator/index.js';
import Printable from './Printable.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }
  component = new Printable({ target, data });
  return component;
};

newInstance();

it('should be able to print its content', () => {
  expect(typeof component.print).toBe('function');
});

it('print() promise should resolve at the same time as the "finish" event', () => {
  const printingPromise = component.print();

  expect(typeof printingPromise.then).toBe('function');

  return Promise.all([
    new Promise(res => component.on('finish', res)),
    printingPromise,
  ]);
});

it('should display a printing dialog', () => {
  component.print();

  return new Promise(res => {
    setTimeout(() => {
      if (component.refs.printingDialog) {
        res();
      }
    });
  });
});

it('should not display the printing dialog when `showPrintingDialog: false`', () => {
  newInstance({ showPrintingDialog: false });
  component.print();

  return new Promise(res => {
    setTimeout(() => {
      if (!component.refs.printingDialog) {
        res();
      }
    });
  });
});

it('should return a resolved promise when `print({ print_to_paper: false })` and fire "finish"', () =>
  Promise.all([
    new Promise(res => component.on('finish', res)),
    component.print({ print_to_paper: false }),
  ]));

it('should display a retry dialog in case of a printing error', () => {
  Simulator.Registry.set('$Printer.panel.shouldFail', true);
  component.print();

  return new Promise(res => {
    setTimeout(() => {
      if (component.refs.failureDialog) {
        res();
      }
    });
  });
});

it('should dispatch a "finish" event in case of not wanting to retry printing', () => {
  component.print();

  return new Promise(res => {
    component.on('finish', res);
    setTimeout(() => {
      target.querySelector('[shortcut="close"]').click();
    });
  });
});
