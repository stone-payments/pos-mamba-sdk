import Keyboard from '@mamba/pos/api/keyboard.js';
import Keystroke from './Keystroke.html';
import { hasActiveHandlerFor } from './includes/KeystrokeRegister.js';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }
  component = new Keystroke({ target, data });

  return component;
};

it('should have a list of active handlers for a key', () => {
  newInstance({ key: 'close' });
  expect(hasActiveHandlerFor('close')).toBe(true);
});

it('should NOT have active handlers for a key when `active: false`', () => {
  component.set({ active: false });
  expect(hasActiveHandlerFor('close')).toBe(false);
});

it('should have a list of active handlers for a key when `active: true`', () => {
  component.set({ active: true });
  expect(hasActiveHandlerFor('close')).toBe(true);
});

it('should NOT have active handlers for a key when destroyed', () => {
  component.destroy();
  expect(hasActiveHandlerFor('close')).toBe(false);
});

it('should NOT have a list of active handlers for a key not specified', () => {
  expect(hasActiveHandlerFor('1')).toBe(false);
  expect(hasActiveHandlerFor('2')).toBe(false);
  expect(hasActiveHandlerFor('3')).toBe(false);
  expect(hasActiveHandlerFor('enter')).toBe(false);
  expect(hasActiveHandlerFor('help')).toBe(false);
  expect(hasActiveHandlerFor('shortcuts')).toBe(false);
  expect(hasActiveHandlerFor('back')).toBe(false);
});

it('should bind an event listener to a specified POS key and fire a "keystroke" event', () =>
  new Promise(res => {
    newInstance({ key: 'close' });
    component.on('keystroke', res);
    window.dispatchEvent(
      new KeyboardEvent('keyup', { keyCode: Keyboard.getKeyCode('close') }),
    );
  }));

it('should execute multiple handlers for the a key', () => {
  newInstance({ key: 'close' });
  const component2 = new Keystroke({ target, data: { key: 'close' } });

  const promise = Promise.all([
    new Promise(res => component.on('keystroke', res)),
    new Promise(res => component2.on('keystroke', res)),
  ]);

  window.dispatchEvent(
    new KeyboardEvent('keyup', { keyCode: Keyboard.getKeyCode('close') }),
  );

  return promise;
});
