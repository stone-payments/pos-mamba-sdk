import { format, padZero, floor, round, ceil, toFixedDown } from '../money.js';

describe('formatting', () => {
  it('should format a number as currency', () => {
    expect(format(0.025687)).toBe('0,02');
    expect(format(300.98451)).toBe('300,98');
    expect(format(1000)).toBe('1.000,00');
    expect(format(1000.1)).toBe('1.000,10');
    expect(format(100000)).toBe('100.000,00');
    expect(format(1000000)).toBe('1.000.000,00');
  });
  it('should throw if passed anything other than a number', () => {
    expect(() => format('1000')).toThrow();
  });
});

describe('padding', () => {
  it('should add a zero to a n < 10 number', () => {
    for (let i = 0; i < 10; i++) {
      expect(padZero(i)).toBe(`0${i}`);
    }
  });

  it('should NOT add a zero to a n < 10 number', () => {
    expect(padZero(10)).toBe(`10`);
    expect(padZero(1000)).toBe(`1000`);
  });

  it('should add a zero to a string with length === 1', () => {
    expect(padZero('0')).toBe(`00`);
    expect(padZero('9')).toBe(`09`);
  });

  it('should throw an error if trying to pad a string with length > 1', () => {
    expect(() => padZero('99')).toThrow();
  });
});

describe('approximations', () => {
  it('should ROUND a money value considering its cents value', () => {
    expect(Number((1.005).toFixed(2))).toBe(1);
    expect(Math.round(1.005 * 100) / 100).toBe(1);
    expect(Math.round(1.005)).toBe(1);

    expect(round(1.005)).toBe(1.01);
  });

  it('should FLOOR a money value considering its cents value', () => {
    expect(floor(127)).toBe(127);
    expect(floor(127.77)).toBe(127.77);

    expect(Math.floor(127.77 / 10)).toBe(12);
    expect(floor(127.77 / 10)).toBe(12.77);
  });

  it('should CEIL a money value considering its cents value', () => {
    expect(ceil(127)).toBe(127);
    expect(ceil(127.77)).toBe(127.77);

    expect(Math.ceil(127.77 / 10)).toBe(13);
    expect(ceil(127.77 / 10)).toBe(12.78);
  });
});

describe('Low Float numbers when there are installments in payment', () => {
  it('should installment value with more than 2 decimal places cannot round', () => {
    expect(toFixedDown(0.025, 2)).toBe('0.02');
    expect(toFixedDown(0.03594, 2)).toBe('0.03');
    expect(toFixedDown(1.1596, 2)).toBe('1.15');
    expect(toFixedDown(20.45864151, 2)).toBe('20.45');
    expect(toFixedDown(300.942365, 2)).toBe('300.94');
  });
});
