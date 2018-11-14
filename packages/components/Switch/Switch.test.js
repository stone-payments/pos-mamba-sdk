import Switch from './Switch.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }
  component = new Switch({ target, data });
  return component;
};

const getCheckboxNode = () => target.querySelector('input[type=checkbox]');

it('should be able to start checked', () => {
  newInstance({ checked: true });
  expect(getCheckboxNode().checked).toBe(true);
});

it('should be able to disable the checkbox', () => {
  newInstance({ disabled: true });
  expect(getCheckboxNode().disabled).toBe(true);
});

it('should fire a change event when value is modified', () => {
  newInstance();
  return new Promise(res => {
    component.on('change', res);
    getCheckboxNode().click();
  });
});

it('should toggle its checked value', () => {
  newInstance();

  component.toggle();
  expect(getCheckboxNode().checked).toBe(true);

  component.toggle(true);
  expect(getCheckboxNode().checked).toBe(true);

  component.toggle(false);
  expect(getCheckboxNode().checked).toBe(false);

  component.toggle(null);
  expect(getCheckboxNode().checked).toBe(false);
});
