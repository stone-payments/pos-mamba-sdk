import { format, parse } from '../date.js';

describe('date', () => {
  it('should throw if a date is not passed', () => {
    expect(() => format('2019-01-01')).toThrow();
  });

  it('should throw if a mask is not passed', () => {
    expect(() => format(new Date())).toThrow();
  });

  it('should throw if an empty mask is not passed', () => {
    expect(() => format(new Date())).toThrow();
  });

  it('should not format invalid tokens', () => {
    expect(format(new Date(2019, 1, 20), 'GG/TTTT/AAAA')).toBe('GG/TTTT/AAAA');
  });

  it('should format a date as dd/mm/yyyy', () => {
    expect(format(new Date(2019, 1, 20), 'dd/mm/yyyy')).toBe('20/02/2019');
  });

  it('should format a time as HH:MM:ss', () => {
    expect(format(new Date(2019, 1, 20, 20, 30, 55), 'HH:MM:ss')).toBe(
      '20:30:55',
    );
  });

  it('should format all available flags', () => {
    expect(
      format(
        new Date(2019, 1, 5, 6, 5, 7),
        'd dd m mm yy yyyy h hh H HH M MM s ss',
      ),
    ).toBe('5 05 2 02 19 2019 6 06 6 06 5 05 7 07');
  });
});

describe('date parse', () => {
  it('NaN Date Object', () => {
    const parsed = parse(null);
    expect(parsed).toBeInstanceOf(Object);
    expect(parsed.getTime()).toBe(NaN);
  });

  it('Undefined returns Today date object', () => {
    const today = new Date();
    expect(parse(undefined)).toBeInstanceOf(Object);
    expect(parse(undefined).getDate()).toEqual(today.getDate());
  });

  it('MM/dd/yyyy <-> 05/29/2015', () => {
    const parsed = parse('05/29/2015');
    expect(parsed).toBeInstanceOf(Object);
    expect(parsed.getTime()).not.toBe(NaN);
    expect(parsed.getDate()).toBe(29);
    expect(parsed.getMonth()).toBe(4);
    expect(parsed.getFullYear()).toBe(2015);
  });
});
