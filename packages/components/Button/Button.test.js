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
  it("should have 'at-bottom' class when 'bottom' is set", () => {
    button = newButton({ bottom: true });

    expect(button.refs.button.classList.contains('at-bottom')).toBe(true);
  });

  it('should accept custom width', () => {
    button = newButton({ width: '85%' });

    expect(button.refs.button.style.width).toBe('85%');
  });

  it('should accept custom primary color', () => {
    button = newButton({ primaryColor: 'red' });

    expect(button.refs.button.style.borderColor).toBe('red');
    expect(button.refs.button.style.backgroundColor).toBe('red');
  });

  it('should accept custom text color', () => {
    button = newButton({ textColor: 'red' });

    expect(button.refs.button.style.color).toBe('red');
  });

  it('should accept custom primary color when "secondary" is true', () => {
    button = newButton({ secondary: true, primaryColor: 'red' });

    expect(button.refs.button.style.color).toBe('red');
    expect(button.refs.button.style.borderColor).toBe('red');
    expect(button.refs.button.style.backgroundColor).toBe('');
  });

  it('should accept custom text color when "secondary" is true', () => {
    button = newButton({ secondary: true, textColor: 'red' });

    expect(button.refs.button.style.color).toBe('red');
  });

  it('should accept custom text color when "secondary" is true and "primaryColor" is set', () => {
    button = newButton({
      secondary: true,
      primaryColor: 'red',
      textColor: 'blue',
    });

    expect(button.refs.button.style.color).toBe('blue');
  });
});
