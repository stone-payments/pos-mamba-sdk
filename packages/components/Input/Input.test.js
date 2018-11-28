import Simulator from '@mamba/pos/simulator/index.js';
import Input from './Input.html';

const { newTestRoot, clickOn } = global;

const root = newTestRoot();

const newInput = data => root.createComponent(Input, { unique: true, data });

let input;

Node.prototype.scrollIntoView = jest.fn();

it('default input', () => {
  input = newInput();
  expect(input.refs.input.getAttribute('maxlength')).toBeNull();
  expect(input.get()).toMatchObject({ rawValue: '', value: '' });
  expect(document.activeElement).not.toBe(input.refs.input);
});

describe('methods', () => {
  it('should prepend a string to the input value', () => {
    input = newInput({ value: 'Ya' });
    input.prepend('Hey ');
    expect(input.refs.input.value).toBe('Hey Ya');
    expect(input.get()).toMatchObject({ value: 'Hey Ya', rawValue: 'Hey Ya' });
  });

  it('should append a string to the input value', () => {
    input = newInput({ value: 'Hey' });
    input.append(' Ya');
    expect(input.refs.input.value).toBe('Hey Ya');
    expect(input.get()).toMatchObject({ value: 'Hey Ya', rawValue: 'Hey Ya' });
  });

  it('should focus the input', () => {
    input = newInput();
    expect(document.activeElement).not.toBe(input.refs.input);
    expect(input.get().isFocused).toBe(false);

    input.focus();
    expect(document.activeElement).toBe(input.refs.input);
    expect(input.get().isFocused).toBe(true);
  });

  it('should blur the input', () => {
    input = newInput();
    input.focus();
    expect(document.activeElement).toBe(input.refs.input);
    expect(input.get().isFocused).toBe(true);

    input.blur();
    expect(document.activeElement).not.toBe(input.refs.input);
    expect(input.get().isFocused).toBe(false);
  });
});

describe('behaviour', () => {
  it('should accept a maxlength prop', () => {
    input = newInput({ maxlength: 10 });
    expect(input.refs.input.getAttribute('maxlength')).toBe('10');
  });

  it('should have a "rawValue" equal to passed "value" on input creation', () => {
    input = newInput({ value: 'Hey' });
    const { value, rawValue } = input.get();
    expect(value).toBe(rawValue);
  });

  it('should have a placeholder', () => {
    input = newInput({ placeholder: 'Ya' });
    expect(input.refs.input.placeholder).toBe('Ya');
  });

  describe('focus/blur', () => {
    it('should focus an input with autofocus prop and scroll to it', () => {
      input = newInput({ autofocus: true });

      expect(document.activeElement).toBe(input.refs.input);
      expect(Node.prototype.scrollIntoView.mock.calls.length).toBe(1);
    });

    it('shouldn\'t allow to blur when "forcefocus:true"', () => {
      input.set({ forcefocus: true });
      input.blur();

      return new Promise(res => {
        setTimeout(() => {
          if (document.activeElement === input.refs.input) {
            res();
          }
        });
      });
    });

    it('should allow to blur when "forcefocus:false"', () => {
      input.set({ forcefocus: false });
      input.blur();

      return new Promise(res => {
        setTimeout(() => {
          if (document.activeElement !== input.refs.input) {
            res();
          }
        });
      });
    });

    describe('input digits', () => {
      it('should allow only numeric input', () => {
        input = newInput();

        input.focus();

        expect(Simulator.Registry.get('$Keyboard.isAlphanumericEnabled')).toBe(
          false,
        );
      });

      it('should allow alphanumeric input after focusing the input if "alphanumeric:true"', () => {
        input = newInput({ alphanumeric: true });

        input.focus();

        expect(Simulator.Registry.get('$Keyboard.isAlphanumericEnabled')).toBe(
          true,
        );
      });

      it('should revert to numeric only when input is blurred', () => {
        input.blur();

        expect(Simulator.Registry.get('$Keyboard.isAlphanumericEnabled')).toBe(
          false,
        );
      });
    });
  });

  describe('password', () => {
    beforeAll(() => {
      input = newInput({ type: 'password' });
    });

    it('should render a not visible password', () => {
      expect(input.get()._visible).toBe(false);
    });

    it('should make a "readable:true" password visible on "click"', () => {
      input.set({ readable: true });
      input.focus();

      clickOn(root.query('.input'));

      expect(input.get()._visible).toBe(true);
      expect(input.refs.input.getAttribute('type')).toBe('text');
    });
  });

  describe('mask', () => {
    it('should accept a single mask', () => {
      input = newInput({ mask: '###.###' });
      input.set({ value: '123123' });
      expect(input.get().value).toBe('123.123');
    });
  });
});

describe('appearance', () => {
  it('should have a label if defined', () => {
    input = newInput({ label: 'Name' });
    expect(root.query('span').textContent).toBe('Name');
  });
});
