import { format } from '../date.js';

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
