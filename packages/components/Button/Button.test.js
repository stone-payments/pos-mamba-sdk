import Button from './Button.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }
  component = new Button({ target, data });
  return component;
};

newInstance();

describe('behavior', () => {
  it('should have a click method', () => {
    expect(typeof component.click).toBe('function');
  });

  it('should fire a click event when click fired', () =>
    new Promise(res => {
      component.on('click', res);
      component.click();
    }));

  it('should have a focus method', () => {
    expect(typeof component.focus).toBe('function');
  });

  it('should focus the button', () => {
    component.focus();
    expect(document.activeElement.tagName).toBe('BUTTON');
  });

  it('should accept a shortcut key', () => {
    newInstance({ shortcut: 'enter' });

    expect(component.refs.button.getAttribute('shortcut')).toBe('enter');
  });

  it('should be able to disable the button', () => {
    component = new Button({ target, data: { disabled: true } });

    expect(component.refs.button.hasAttribute('disabled')).toBe(true);
  });
});

describe('style', () => {
  it("should have 'is-fixed' class when 'bottom' is set", () => {
    newInstance({ bottom: true });

    expect(component.refs.button.classList.contains('is-fixed')).toBe(true);
  });

  it('should accept custom inline styles', () => {
    newInstance({
      borderColor: 'red',
      textColor: 'green',
      bgColor: 'black',
      width: '85%',
    });

    expect(component.refs.button.style.borderColor).toBe('red');
    expect(component.refs.button.style.width).toBe('85%');
    expect(component.refs.button.style.color).toBe('green');
    expect(component.refs.button.style.backgroundColor).toBe('black');
  });
});
