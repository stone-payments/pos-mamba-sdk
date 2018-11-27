import Input from './Input.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newInput = data => root.createComponent(Input, { unique: true, data });

let input;

Node.prototype.scrollIntoView = jest.fn();

describe('creation', () => {
  it('default input', () => {
    input = newInput();
    expect(input.refs.input.getAttribute('maxlength')).toBeNull();
    expect(input.get()).toMatchObject({ rawValue: '', value: '' });
  });

  it('should accept a maxlength prop', () => {
    input = newInput({ maxlength: 10 });
    expect(input.refs.input.getAttribute('maxlength')).toBe('10');
  });

  it('should have a "rawValue" equal to passed "value" on input creation', () => {
    input = newInput({ value: 'Hey' });
    const { value, rawValue } = input.get();
    expect(value).toBe(rawValue);
  });

  it('should render a not visible password', () => {
    input = newInput({ type: 'password' });
    expect(input.get()._visible).toBe(false);
  });

  it('should focus an input with autofocus prop and scroll to it', () => {
    input = newInput({ autofocus: true });
    expect(document.activeElement).toBe(input.refs.input);
    expect(Node.prototype.scrollIntoView.mock.calls.length).toBe(1);
  });
});

describe('props', () => {
  it('should have a placeholder', () => {
    input = newInput({ placeholder: 'Ya' });
    expect(input.refs.input.placeholder).toBe('Ya');
  });
});

describe('methods', () => {});
