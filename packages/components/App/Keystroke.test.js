import Keystroke from './Keystroke.html';
import { hasActiveHandlerFor } from './includes/KeystrokeRegister.js';

const { newTestRoot, fireKey } = global;
const root = newTestRoot({ key: 'close' });
let keystroke;

const newKeystroke = (data) => root.createComponent(Keystroke, { data });

it('should have a list of active handlers for a key', () => {
  keystroke = newKeystroke({ key: 'close' });
  expect(hasActiveHandlerFor('close')).toBe(true);
});

it('should NOT have active handlers for a key when `active: false`', () => {
  keystroke.set({ active: false });
  expect(hasActiveHandlerFor('close')).toBe(false);
});

it('should have a list of active handlers for a key when `active: true`', () => {
  keystroke.set({ active: true });
  expect(hasActiveHandlerFor('close')).toBe(true);
});

it('should NOT have active handlers for a key when destroyed', () => {
  keystroke.destroy();
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
  new Promise((res) => {
    keystroke = newKeystroke({ key: 'close' });
    keystroke.on('keystroke', res);
    fireKey('close');
  }));

it('should execute multiple handlers for the a key', () => {
  const otherKeystroke = newKeystroke({ key: 'close' });

  const promise = Promise.all([
    new Promise((res) => keystroke.on('keystroke', res)),
    new Promise((res) => otherKeystroke.on('keystroke', res)),
  ]);

  fireKey('close');

  return promise;
});
