import { format, parsePOSLocalDatetime, parseDateISO, parseDate } from '../date.js';

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

  it('should format a date as dd/MM/yyyy', () => {
    expect(format(new Date(2019, 1, 20), 'dd/MM/yyyy')).toBe('20/02/2019');
  });

  it('should format a time as HH:mm:ss', () => {
    expect(format(new Date(2019, 1, 20, 20, 30, 55), 'HH:mm:ss')).toBe('20:30:55');
  });

  it('should format all available flags', () => {
    expect(format(new Date(2019, 1, 5, 6, 5, 7), 'd dd M MM yy yyyy H HH H HH m mm s ss')).toBe(
      '5 05 2 02 19 2019 6 06 6 06 5 05 7 07',
    );
  });
});

describe('date parse', () => {
  // it('Invalid date', () => {
  //   const parsed = parseDate(null);
  //   expect(parsed).toBe(Date { NaN });
  // });

  it('MM/dd/yyyy <-> 05/29/2015', () => {
    const parsed = parseDate('05/29/2015', 'MM/dd/yyyy', new Date());
    expect(parsed.getTime()).not.toBe(NaN);
    expect(parsed.getDate()).toBe(29);
    expect(parsed.getMonth()).toBe(4);
    expect(parsed.getFullYear()).toBe(2015);
  });

  it('dddd, dd MMMM yyyy <-> Friday, 30 Jan 2016', () => {
    const parsed = parseDate('Friday, 30 Jan 2016', 'EEEE, dd MMM yyyy', new Date());
    expect(parsed.getTime()).not.toBe(NaN);
    expect(parsed.getDate()).toBe(30);
    expect(parsed.getMonth()).toBe(0);
    expect(parsed.getFullYear()).toBe(2016);
  });

  it('dddd, dd MMMM yyyy <-> Friday, 29 May 2015 05:50', () => {
    const parsed = parseDate('Friday, 29 May 2015 05:50', 'EEEE, dd MMM yyyy HH:mm', new Date());
    expect(parsed.getTime()).not.toBe(NaN);
  });

  it('dddd, dd MMMM yyyy <-> Friday, 29 May 2015 5:50', () => {
    const parsed = parseDate('Friday, 29 May 2015 5:50', 'EEEE, dd MMM yyyy K:mm', new Date());
    expect(parsed.getTime()).not.toBe(NaN);
  });

  it('dddd, dd MMMM yyyy HH:mm:ss <-> Friday, 29 May 2015 05:50:06', () => {
    const parsed = parseDate(
      'Friday, 29 May 2015 05:50:06',
      'EEEE, dd MMM yyyy HH:mm:ss',
      new Date(),
    );
    expect(parsed.getTime()).not.toBe(NaN);
  });

  it('MM/dd/yyyy HH:mm <-> 05/29/2015 05:50', () => {
    const parsed = parseDate('05/29/2015 05:50', 'MM/dd/yyyy HH:mm', new Date());
    expect(parsed.getTime()).not.toBe(NaN);
  });

  it('MM/dd/yyyy H:mm <-> 05/29/2015 5:50', () => {
    const parsed = parseDate('05/29/2015 5:50', 'MM/dd/yyyy K:mm', new Date());
    expect(parsed.getTime()).not.toBe(NaN);
  });

  it('MM/dd/yyyy HH:mm:ss <-> 05/29/2015 05:50:06', () => {
    const parsed = parseDate('05/29/2015 05:50:06', 'MM/dd/yyyy HH:mm:ss', new Date());
    expect(parsed.getTime()).not.toBe(NaN);
  });

  it('MMMM dd <-> May 29', () => {
    const parsed = parseDate('May 29', 'MMM dd', new Date());
    expect(parsed.getTime()).not.toBe(NaN);
  });

  it('HH:mm <-> 05:50', () => {
    const parsed = parseDate('05:50', 'HH:mm', new Date());
    expect(parsed.getTime()).not.toBe(NaN);
  });

  it('H:mm <-> 5:50', () => {
    const parsed = parseDate('5:50', 'K:mm', new Date());
    expect(parsed.getTime()).not.toBe(NaN);
  });

  it('HH:mm:ss <-> 05:50:06', () => {
    const parsed = parseDate('05:50:06', 'HH:mm:ss', new Date());
    expect(parsed.getTime()).not.toBe(NaN);
  });

  it('yyyy MMMM <-> 2015 May', () => {
    const parsed = parseDate('2015 May', 'yyyy MMM', new Date());
    expect(parsed.getTime()).not.toBe(NaN);
  });

  it('Parse ISO 2015-05-16T05:50:06.7199222-04:00 <-> Sat May 16 2015 06:50:06', () => {
    const parsed = parseDateISO('2015-05-16T05:50:06.7199222-04:00');
    expect(parsed.getTime()).not.toBe(NaN);
  });

  it('Parse ISO 2015-05-16T05:50:06 <-> Sat May 16 2015 05:50:06', () => {
    const parsed = parseDateISO('2015-05-16T05:50:06');
    expect(parsed.getTime()).not.toBe(NaN);
  });
});

describe('Parse date timezone using date-fns lib', () => {
  it('2019-10-18T17:46:12Z <-> Fri Oct 18 2019 14:46:12', () => {
    const date = parsePOSLocalDatetime('2019-10-18T17:46:12Z');
    expect(date.getTime()).not.toBe(NaN);
    expect(date.getDate()).toBe(18);
    expect(date.getHours()).toBe(14);
    expect(date.getMinutes()).toBe(46);
  });

  it('2015-05-16T05:50:06.7199222 is valid date', () => {
    const date = parsePOSLocalDatetime('2015-05-16T05:50:06.7199222');
    expect(date.getTime()).not.toBe(NaN);
  });

  it('Hour is equal 10 <-> 2015-05-16T10:50:06', () => {
    const date = parsePOSLocalDatetime('2015-05-16T10:50:06');
    expect(date.getTime()).not.toBe(NaN);
    expect(date.getHours()).toBe(10);
  });

  it('1997-07-16T19:20+01:00 is valid date', () => {
    const date = parsePOSLocalDatetime('1997-07-16T19:20+01:00');
    expect(date.getTime()).not.toBe(NaN);
  });
});
