import { Registry } from '@mamba/pos/simulator/index.js';
import System from '@mamba/pos/api/system.js';
import Input from './Input.html';

const { newTestRoot, clickOn, typeOn, fireKey } = global;

const root = newTestRoot();

const newInput = data => root.createComponent(Input, { unique: true, data });

let input;

const getInputStyle = () => getComputedStyle(input.refs.input);
const type = what => typeOn(input.refs.input, what);

Node.prototype.scrollIntoView = jest.fn();

it('should create default input', () => {
  input = newInput();
  expect(input.refs.input.getAttribute('maxlength')).toBeNull();
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

  it('should manually mask an input', () => {
    input = newInput();
    input.set({ mask: '###', value: 'A111' });
    expect(input.get().value).toBe('A111');
    expect(input.refs.input.value).toBe('A111');

    input.mask();
    expect(input.get().value).toBe('111');
    expect(input.refs.input.value).toBe('111');

    input.set({ mask: undefined, value: 'A111' });
    input.mask();
    expect(input.get().value).toBe('A111');
  });

  it('should validate an input', () => {
    input = newInput({
      value: '1',
      validation: val => ({ isValid: val === '2' }),
    });

    input.validate();

    expect(input.get()).toMatchObject({
      isValid: false,
      _errorMsg: undefined,
    });

    input.set({ value: '2' });
    input.validate();

    expect(input.get()).toMatchObject({
      isValid: true,
    });
  });

  it('should invalidate an input and add the error class', () => {
    input = newInput({ value: 'teste' });
    input.invalidate('Error message');

    expect(input.get()).toMatchObject({
      isValid: false,
      _errorMsg: 'Error message',
    });

    expect(root.query('label').classList.contains('is-invalid')).toBe(true);
  });
});

describe('behaviour', () => {
  it('should accept a maxlength prop', () => {
    input = newInput({ maxlength: 10 });
    expect(input.refs.input.getAttribute('maxlength')).toBe('10');
  });

  it('should disable the input width "disabled:true"', () => {
    input = newInput({ disabled: true });
    const el = root.query('.input');

    expect(el.classList.contains('is-disabled')).toBe(true);

    input.set({ disabled: false });
    expect(el.classList.contains('is-disabled')).toBe(false);
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

  it('should dispatch a submit event on "enter"', () => {
    input = newInput();
    return new Promise(res => {
      input.on('submit', res);
      fireKey(input.refs.input, 'enter');
    });
  });

  describe('focus/blur', () => {
    it('should fire a "focus" event when focusing', () => {
      input = newInput();
      return new Promise(res => {
        input.on('focus', res);
        input.focus();
      });
    });

    it('should fire a "blur" event when blurring', () => {
      input = newInput();
      input.focus();
      return new Promise(res => {
        input.on('blur', res);
        input.blur();
      });
    });

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

    it('should focus constantly a "forcefocus:true" with "autofocus:true" after an "onupdate"', () => {
      input = newInput({ autofocus: true, forcefocus: false });
      expect(input.get().isFocused).toBe(true);

      input.blur();
      expect(input.get().isFocused).toBe(false);

      input.set({ forcefocus: true });
      expect(input.get().isFocused).toBe(true);
    });

    describe('input digits', () => {
      it('should allow only numeric input', () => {
        input = newInput();

        input.focus();

        expect(Registry.get().$Keyboard.isAlphanumericEnabled).toBe(false);
      });

      it('should allow alphanumeric input after focusing the input if "alphanumeric:true"', () => {
        input = newInput({ alphanumeric: true });

        input.focus();

        expect(Registry.get().$Keyboard.isAlphanumericEnabled).toBe(true);
      });

      it('should revert to numeric only when input is blurred', () => {
        input.blur();

        expect(Registry.get().$Keyboard.isAlphanumericEnabled).toBe(false);
      });
    });
  });

  describe('password', () => {
    beforeAll(() => {
      input = newInput({ type: 'password' });
    });

    it('should create a password input', () => {
      expect(input.refs.input.getAttribute('type')).toBe('password');
    });

    it('should render a not visible password', () => {
      expect(input.get()._visible).toBe(false);
    });

    // it('should make a "readable:true" password visible on "click"', () => {
    //   input.set({ readable: true });
    //   input.focus();

    //   clickOn(root.query('.type-toggle'));

    //   expect(input.get()._visible).toBe(true);
    //   expect(input.refs.input.getAttribute('type')).toBe('text');
    //   expect(root.query('.type-toggle').classList.contains('is-readable')).toBe(true);
    // });
  });

  describe('mask', () => {
    it('should accept a single mask', () => {
      input = newInput({ mask: '###.###.###-##', value: '12312312312' });
      expect(input.get().value).toBe('123.123.123-12');
    });

    it('should accept multiple masks', () => {
      input = newInput({
        mask: ['###.###.###-##', '##.###.###/####-##'],
        value: '12312312123123',
      });
      expect(input.get().value).toBe('12.312.312/1231-23');

      input.set({ value: '12312312312' });
      input.mask();
      expect(input.get().value).toBe('123.123.123-12');
    });

    it('should mask while typing', () => {
      input = newInput({ mask: '###.###.###-##' });

      type('1231');
      expect(input.get().value).toBe('123.1');
    });

    it('should accept custom masks tokens', () => {
      input = newInput({
        mask: 'Z Z Z',
        tokens: {
          Z: { pattern: /\d/ },
        },
      });

      type('1231');
      expect(input.get().value).toBe('1 2 3');
    });

    it('should accept a transformer method for custom tokens', () => {
      input = newInput({
        mask: 'M M M M M',
        tokens: {
          M: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
        },
      });

      type('abcde');
      expect(input.get().value).toBe('A B C D E');
    });
  });

  describe('validation', () => {
    describe('on submit', () => {
      beforeAll(() => {
        input = newInput({
          validation: val => ({ isValid: val === '2' }),
        });
      });

      it('should fire "submitValid" if input is valid according to "validation" method prop', () => {
        type('2');

        const submits = Promise.all([
          new Promise(res => input.on('submitValid', res)),
          new Promise(res => input.on('submit', res)),
        ]);

        fireKey(input.refs.input, 'enter');

        return submits;
      });

      it('should blur a valid and submitted input', () => {
        input.set({ value: '' });

        type('2');
        expect(document.activeElement).toBe(input.refs.input);

        fireKey(input.refs.input, 'enter');

        return new Promise(res =>
          setTimeout(() => {
            if (document.activeElement !== input.refs.input) {
              res();
            }
          }),
        );
      });

      it('should fire "submitInvalid" if input is invalid according to "validation" method prop and BEEP', () => {
        input = newInput({
          validation: val => ({ isValid: val === '2' }),
        });
        type('123');

        const submits = Promise.all([
          new Promise(res => {
            System.beep = res;
          }),
          new Promise(res => input.on('submitInvalid', res)),
          new Promise(res => input.on('submit', res)),
        ]);

        fireKey(input.refs.input, 'enter');

        return submits;
      });
    });

    describe('on input', () => {
      beforeAll(() => {
        input = newInput({
          validation: value => ({
            isValid: parseInt(value, 10) > 100,
            msg: 'Error',
          }),
          validateOn: 'input',
        });
      });

      it('should invalidate the input while typing a invalid value and add "has-error" class', () => {
        type('23');

        expect(input.get()).toMatchObject({
          isValid: false,
          _errorMsg: 'Error',
        });
        expect(root.query('label').classList.contains('is-invalid')).toBe(true);
      });

      it('should not toggle is-invalid class if not valid and has no error msg', () => {
        input.set({
          value: '',
          validation: value => ({
            isValid: parseInt(value, 10) > 100,
          }),
        });

        fireKey(input.refs.input, 'back');

        expect(input.get()).toMatchObject({
          isValid: false,
          _errorMsg: undefined,
        });

        expect(root.query('label').classList.contains('is-invalid')).toBe(
          false,
        );
      });

      it('should validate the input while typing a valid value and remove "is-invalid" class', () => {
        input.set({ value: '' });

        type('232');

        expect(input.get().isValid).toBe(true);
        expect(root.query('label').classList.contains('is-invalid')).toBe(
          false,
        );
      });

      it('should be able to return a boolean from the validation method', () => {
        input.set({
          value: '',
          validation: value => parseInt(value, 10) > 100,
        });

        type('12');
        expect(input.get()).toMatchObject({
          isValid: false,
          _errorMsg: undefined,
        });

        type('3');
        expect(input.get()).toMatchObject({
          isValid: true,
          _errorMsg: undefined,
        });
      });
    });
  });
});

describe('appearance', () => {
  it('should have a label if defined', () => {
    input = newInput({ label: 'Name' });
    expect(root.query('span').textContent).toBe('Name');
  });

  it('should be able to align the input text', () => {
    input = newInput();
    expect(getInputStyle()).toMatchObject({ 'text-align': 'right' });

    input.set({ align: 'left' });
    expect(getInputStyle()).toMatchObject({ 'text-align': 'left' });

    input.set({ align: 'center' });
    expect(getInputStyle()).toMatchObject({ 'text-align': 'center' });

    input.set({ align: 'right' });
    expect(getInputStyle()).toMatchObject({ 'text-align': 'right' });
  });
});
