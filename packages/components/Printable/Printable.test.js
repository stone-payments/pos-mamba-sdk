import Simulator from '@mamba/pos/simulator/index.js';
import Printable from './Printable.html';

const target = document.body;
let component;

const newInstance = data => {
  component = new Printable({ target, data });
  return component;
};

afterEach(() => {
  if (component) component.destroy();
});

it('should be able to print its content', () => {
  newInstance();

  expect(typeof component.print).toBe('function');
});

it('print() should return a promise', () => {
  newInstance();

  expect(typeof component.print().then).toBe('function');
});

it('print() promise should resolve at the same time as the "finish" event', () => {
  newInstance();

  return Promise.all([
    new Promise(res => component.on('finish', res)),
    component.print(),
  ]);
});

it('should display a printing dialog', () => {
  newInstance();
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

it('should return a resolved promise when `print({ print_to_paper: false })` and fire "finish"', () => {
  newInstance();

  return Promise.all([
    new Promise(res => component.on('finish', res)),
    component.print({ print_to_paper: false }),
  ]);
});

it('should display a retry dialog in case of a printing error', () => {
  Simulator.Registry.set('$Printer.panel.shouldFail', true);
  newInstance();
  component.print();

  return new Promise(res => {
    setTimeout(() => {
      if (component.refs.failureDialog) {
        res();
      }
    }, 1000);
  });
});

it('should dispatch a "finish" event in case of not wanting to retry printing', () => {
  Simulator.Registry.set('$Printer.panel.shouldFail', true);
  newInstance();
  component.print();

  return new Promise(res => {
    component.on('finish', res);
    setTimeout(() => {
      document.body.querySelector('[shortcut="close"]').click();
    }, 1000);
  });
});
