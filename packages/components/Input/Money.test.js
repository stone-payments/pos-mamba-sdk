import MoneyInput from './Money.html';
import formatMoney from './libs/formatMoney.js';
import System from '../../pos/api/system.js';

const { newTestRoot, fireKey, typeOn } = global;

const root = newTestRoot();
let moneyInput;

const newMoneyInput = data => root.createComponent(MoneyInput, { data });

beforeAll(() => {
  moneyInput = newMoneyInput({});
});

describe('Component Standards', () => {
  it('should have maximum value of 99999999.99', () => {
    const { limit } = moneyInput.get();
    expect(limit).toBe(99999999.99);
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
    const { rawValue } = moneyInput.get();
    expect(rawValue).toBe('0');
  });
});

describe('Behavior', () => {
  it('should add prefix in displayed value', () => {
    expect(root.query('input').value.split(0, 2)).toContain('R$ ');
  });

  it('should add suffix to value', () => {
    moneyInput.set({ suffix: 'a' });
    expect(root.query('input').value.endsWith('a')).toBe(true);
  });

  describe('Format Money', () => {
    it('should return a string', () => {
      expect(typeof formatMoney(100)).toBe('string');
    });
    it('should separate cents using comma', () => {
      expect(formatMoney(100).split(',').length).toBe(2);
    });
    it('should add . every 3 digits', () => {
      expect(formatMoney(100)).not.toContain('.');
      expect(formatMoney(10000)).toContain('.');
    });
  });

  describe('Keypressed Actions', () => {
    it('should update raw value on first input', () => {
      moneyInput.set({ rawValue: '0' });
      fireKey(moneyInput.refs.amountInput.refs.input, '1');
      expect(moneyInput.get().rawValue).toBe('1');
    });
    it('should update raw value on new input', () => {
      fireKey(moneyInput.refs.amountInput.refs.input, '1');
      expect(moneyInput.get().rawValue).toBe('11');
    });
    it('should remove last character when backspace is pressed', () => {
      fireKey(moneyInput.refs.amountInput.refs.input, 'back');
      expect(moneyInput.get().rawValue).toBe('1');
    });
    it('should set rawValue to 0 if last character is removed', () => {
      fireKey(moneyInput.refs.amountInput.refs.input, 'back');
      expect(moneyInput.get().rawValue).toBe('0');
    });
    it('should not accept non numeric inputs', () => {
      fireKey(moneyInput.refs.amountInput.refs.input, 'a');
      expect(moneyInput.get().rawValue).toBe('0');
    });
    it('should block inputs if input is readonly', () => {
      moneyInput.set({ readonly: true });
      fireKey(moneyInput.refs.amountInput.refs.input, '1');
      expect(moneyInput.get().rawValue).toBe('0');
    });
    it('should not accept values bigger than limit', () => {
      moneyInput.set({ readonly: false });
      typeOn(moneyInput.refs.amountInput.refs.input, '9999999999999');
      expect(moneyInput.get().rawValue).toBe('9999999999');
    });
  });

  describe('Submit', () => {
    it('should fire submit if value is bigger than 0', () =>
      new Promise(res => {
        moneyInput.on('submit', res);
        moneyInput.set({ rawValue: '1' });
        fireKey(moneyInput.refs.amountInput.refs.input, 'enter');
      }));
    it('should beep if value is lower or equal to 0', () =>
      new Promise(res => {
        System.beep = res;
        moneyInput.set({ rawValue: '0' });
        fireKey(moneyInput.refs.amountInput.refs.input, 'enter');
      }));
  });
});
