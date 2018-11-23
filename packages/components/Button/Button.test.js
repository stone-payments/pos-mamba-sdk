import Button from './Button.html';

const { newTestRoot } = global;

const root = newTestRoot();
let button;

const newButton = data => root.createComponent(Button, { data });

describe('behavior', () => {
  it('should have a click method', () => {
    button = newButton();
    expect(typeof button.click).toBe('function');
  });

  it('should fire a click event when click fired', () =>
    new Promise(res => {
      button.on('click', res);
      button.click();
    }));

  it('should have a focus method', () => {
    expect(typeof button.focus).toBe('function');
  });

  it('should focus the button', () => {
    button.focus();
    expect(document.activeElement.tagName).toBe('BUTTON');
  });

  it('should accept a shortcut key', () => {
    button = newButton({ shortcut: 'enter' });

    expect(button.refs.button.getAttribute('shortcut')).toBe('enter');
  });

  it('should be able to disable the button', () => {
    button = newButton({ disabled: true });

    expect(button.refs.button.hasAttribute('disabled')).toBe(true);
  });
});

describe('style', () => {
  it("should have 'is-fixed' class when 'bottom' is set", () => {
    button = newButton({ bottom: true });

    expect(button.refs.button.classList.contains('is-fixed')).toBe(true);
  });

  it('should accept custom inline styles', () => {
    button = newButton({
      borderColor: 'red',
      textColor: 'green',
      bgColor: 'black',
      width: '85%',
    });

    expect(button.refs.button.style.borderColor).toBe('red');
    expect(button.refs.button.style.width).toBe('85%');
    expect(button.refs.button.style.color).toBe('green');
    expect(button.refs.button.style.backgroundColor).toBe('black');
  });
});
