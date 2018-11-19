import Switch from './Switch.html';

const { newComponent } = global;

let component;

const getCheckboxNode = () =>
  component.options.target.querySelector('input[type=checkbox]');

it('should be able to start checked', () => {
  component = newComponent(Switch, { data: { checked: true } });
  expect(getCheckboxNode().checked).toBe(true);
});

it('should be able to disable the checkbox', () => {
  component = newComponent(Switch, { data: { disabled: true } });
  expect(getCheckboxNode().disabled).toBe(true);
});

it('should fire a change event when value is modified', () => {
  component = newComponent(Switch);
  return new Promise(res => {
    component.on('change', res);
    getCheckboxNode().click();
  });
});

it('should toggle its checked value', () => {
  component = newComponent(Switch);

  component.toggle();
  expect(getCheckboxNode().checked).toBe(true);

  component.toggle(true);
  expect(getCheckboxNode().checked).toBe(true);

  component.toggle(false);
  expect(getCheckboxNode().checked).toBe(false);

  component.toggle(null);
  expect(getCheckboxNode().checked).toBe(false);
});
