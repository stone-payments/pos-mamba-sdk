import Radio from './Radio.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newRadio = data => root.createComponent(Radio, { unique: true, data });

let switchComp;

const getCheckboxNode = () => root.query('input[type=radio]');

it('should be not start checked', () => {
  switchComp = newRadio({ checked: false });
  expect(getCheckboxNode().checked).toBe(false);
});

it('should fire a change event when value is modified', () => {
  switchComp = newRadio();
  return new Promise(res => {
    switchComp.on('change', res);
    getCheckboxNode().click();
  });
});

it('should toggle its checked value', () => {
  switchComp = newRadio();

  switchComp.toggle();

  switchComp.toggle(true);
  expect(getCheckboxNode().checked).toBe(true);

  switchComp.toggle(false);
  expect(getCheckboxNode().checked).toBe(false);

  switchComp.toggle(null);
  expect(getCheckboxNode().checked).toBe(false);
});
