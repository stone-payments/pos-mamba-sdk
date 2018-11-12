import Switch from './Switch.html';

const target = document.body;
let switchComponent;

const newSwitch = data => {
  switchComponent = new Switch({ target, data });
  return switchComponent;
};

const getCheckboxNode = () =>
  switchComponent.options.target.querySelector('input[type=checkbox]');

describe('behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should be able to start checked', () => {
    newSwitch({ checked: true });
    expect(getCheckboxNode().checked).toBe(true);
  });

  it('should be able to disable the checkbox', () => {
    newSwitch({ disabled: true });
    expect(getCheckboxNode().disabled).toBe(true);
  });

  it('should fire a change event when value is modified', () => {
    newSwitch();
    return new Promise(res => {
      switchComponent.on('change', res);
      getCheckboxNode().click();
    });
  });
});
