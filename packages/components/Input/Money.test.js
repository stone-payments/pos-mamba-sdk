import MoneyInput from './Money.html';

const { newTestRoot, fireKey, typeOn } = global;

const root = newTestRoot();

const newMoneyInput = data =>
  root.createComponent(MoneyInput, { unique: true, data });

let moneyInput;

const getInputEl = () => moneyInput.refs.amountInput.refs.input;

const type = what => typeOn(getInputEl(), what);

describe('Component Standards', () => {
  beforeAll(() => {
    moneyInput = newMoneyInput();
  });

  it('should have maximum value of 999999.99', () => {
    const { limit } = moneyInput.get();
    expect(limit).toBe(999999.99);
  });

  it('should have by default prefix in BRL', () => {
    const { prefix } = moneyInput.get();
    expect(prefix).toBe('R$ ');
  });

  it('should have by default suffix empty suffix', () => {
    const { suffix } = moneyInput.get();
    expect(suffix).toBe('');
  });

  it('should have raw value of 0 by default', () => {
    const { cents } = moneyInput.get();
    expect(cents).toBe(0);
  });
});

describe('Behavior', () => {
  it('should add prefix in displayed value', () => {
    expect(getInputEl().value.split(0, 2)).toContain('R$ ');
  });

  it('should add suffix to value', () => {
    moneyInput.set({ suffix: 'a' });
    expect(getInputEl().value.endsWith('a')).toBe(true);
  });

  describe('Keypressed Actions', () => {
    beforeAll(() => {
      moneyInput = newMoneyInput();
    });

    it('should update raw value on first input', () => {
      type('1');
      expect(moneyInput.get().cents).toBe(1);
    });

    it('should update raw value on new input', () => {
      type('1');
      expect(moneyInput.get().cents).toBe(11);
    });

    it('should remove last character when backspace is pressed', () => {
      fireKey(getInputEl(), 'back');
      expect(moneyInput.get().cents).toBe(1);
    });

    it('should set cents to 0 if last character is removed', () => {
      fireKey(getInputEl(), 'back');
      expect(moneyInput.get().cents).toBe(0);
    });

    it('should not accept non numeric inputs', () => {
      type('a');
      expect(moneyInput.get().cents).toBe(0);
    });

    it('should block inputs if input is readonly', () => {
      moneyInput.set({ readonly: true });
      type('1');
      expect(moneyInput.get().cents).toBe(0);
    });

    it('should not accept values bigger than limit', () => {
      moneyInput.set({ readonly: false });
      type('99999999');
      expect(moneyInput.get().cents).toBe(99999999);
    });

    it('should move the caret to the right side of the input on every focus', () => {
      moneyInput = newMoneyInput();
      type('11');
      getInputEl().setSelectionRange(0, 0);
      moneyInput.blur();

      return new Promise(res => {
        setTimeout(() => {
          const { value } = moneyInput.get();
          expect(getInputEl().selectionEnd).toBe(value.length);
          res();
        });
      });
    });
  });

  describe('validation', () => {
    beforeAll(() => {
      moneyInput = newMoneyInput({
        validation: cents => cents > 100 && cents < 200,
      });
    });

    it('should validate on submit (enter) with the cents value', () => {
      type('11');

      return Promise.all([
        new Promise(
          res => moneyInput.on('submit', res),
          new Promise(res => {
            setTimeout(() => {
              moneyInput.on('submitInvalid', e => {
                expect(e.cents).toBe(11);
                expect(e.value).toBe(11);
                expect(e.formatted).toBe('R$ 0,11');
                expect(e.isValid).toBe(false);
                res();
              });
              fireKey(getInputEl(), 'enter');
            });
          }),
        ),
      ]).then(() => {
        moneyInput.set({ cents: 0 });
        type('112');
        return new Promise(res => {
          moneyInput.on('submitValid', e => {
            expect(e.cents).toBe(112);
            expect(e.value).toBe(112);
            expect(e.formatted).toBe('R$ 1,12');
            expect(e.isValid).toBe(true);
            res();
          });
          fireKey(getInputEl(), 'enter');
        });
      });
    });
  });
});
