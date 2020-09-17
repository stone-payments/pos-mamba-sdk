import Checkbox from './Checkbox.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newCheckbox = data =>
  root.createComponent(Checkbox, { unique: true, data });

let radioComp;

const getCheckboxNode = () => root.query('input[type=radio]');

it('should be not start checked', () => {
  radioComp = newCheckbox({ checked: false });
  expect(radioComp.get().checked).toBe(false);
});

it('should fire a change event when value is modified', () => {
  radioComp = newCheckbox();
  return new Promise(res => {
    radioComp.on('change', res);
    getCheckboxNode().click();
  });
});

it('should toggle its checked value', () => {
  radioComp = newCheckbox();

  radioComp.toggle();

  radioComp.toggle(true);
  expect(radioComp.get().checked).toBe(true);

  radioComp.toggle(false);
  expect(radioComp.get().checked).toBe(false);

  radioComp.toggle(null);
  expect(radioComp.get().checked).toBe(false);
});
