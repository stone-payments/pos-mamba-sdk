import Radio from './Radio.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newRadio = data => root.createComponent(Radio, { unique: true, data });

let radioComp;

const getRadioNode = () => root.query('input[type=radio]');

it('should be not start checked', () => {
  radioComp = newRadio({ checked: false });
  expect(radioComp.get().checked).toBe(false);
});

it('should fire a change event when value is modified', () => {
  radioComp = newRadio();
  return new Promise(res => {
    radioComp.on('change', res);
    getRadioNode().click();
  });
});

it('should toggle its checked value', () => {
  radioComp = newRadio();

  radioComp.toggle();

  radioComp.toggle(true);
  expect(radioComp.get().checked).toBe(true);

  radioComp.toggle(false);
  expect(radioComp.get().checked).toBe(false);

  radioComp.toggle(null);
  expect(radioComp.get().checked).toBe(false);
});
