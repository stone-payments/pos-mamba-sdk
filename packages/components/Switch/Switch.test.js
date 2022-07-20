import Switch from './Switch.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newSwitch = (data) => root.createComponent(Switch, { unique: true, data });

let switchComp;

const getCheckboxNode = () => root.query('input[type=checkbox]');

it('should be able to start checked', () => {
  switchComp = newSwitch({ checked: true });
  expect(getCheckboxNode().checked).toBe(true);
});

it('should be able to disable the checkbox', () => {
  switchComp = newSwitch({ disabled: true });
  expect(getCheckboxNode().disabled).toBe(true);
});

it('should fire a change event when value is modified', () => {
  switchComp = newSwitch();
  return new Promise((res) => {
    switchComp.on('change', res);
    getCheckboxNode().click();
  });
});

it('should toggle its checked value', () => {
  switchComp = newSwitch();

  switchComp.toggle();
  expect(getCheckboxNode().checked).toBe(true);

  switchComp.toggle(true);
  expect(getCheckboxNode().checked).toBe(true);

  switchComp.toggle(false);
  expect(getCheckboxNode().checked).toBe(false);

  switchComp.toggle(null);
  expect(getCheckboxNode().checked).toBe(false);
});
