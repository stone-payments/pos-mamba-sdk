import {
  format,
  // parsePOSLocalDatetime,
  // parseDateISO,
  parseDate,
} from '../date.js';

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

  // it('should not format invalid tokens', () => {
  //   expect(format(new Date(2019, 1, 20), 'GG/TTTT/AAAA')).toBe(
  //     'RangeError: Format string contains an unescaped latin alphabet character `A`',
  //   );
  // });

  it('should format a date as dd/MM/yyyy', () => {
    expect(format(new Date(2019, 1, 20), 'dd/MM/yyyy')).toBe('20/02/2019');
  });

  it('should format a time as HH:mm:ss', () => {
    expect(format(new Date(2019, 1, 20, 20, 30, 55), 'HH:mm:ss')).toBe(
      '20:30:55',
    );
  });

  it('should format all available flags', () => {
    expect(
      format(
        new Date(2019, 1, 5, 6, 5, 7),
        'd dd M MM yy yyyy H HH H HH m mm s ss',
      ),
    ).toBe('5 05 2 02 19 2019 6 06 6 06 5 05 7 07');
  });
});

describe('date parse', () => {
  it('Invalid date', () => {
    const parsed = parseDate(null);
    expect(parsed).toBe('Invalid Date');
  });

  it('MM/dd/yyyy <-> 05/29/2015', () => {
    const parsed = parseDate('05/29/2015', 'MM/dd/yyyy', new Date());
    expect(parsed.getTime()).not.toBe(NaN);
    expect(parsed.getDate()).toBe(29);
    expect(parsed.getMonth()).toBe(4);
    expect(parsed.getFullYear()).toBe(2015);
  });

  it('dddd, dd MMMM yyyy <-> Friday, 30 Jan 2016', () => {
    const parsed = parseDate(
      'Friday, 30 Jan 2016',
      'EEEE, dd MMM yyyy',
      new Date(),
    );
    expect(parsed.getTime()).not.toBe(NaN);
    expect(parsed.getDate()).toBe(30);
    expect(parsed.getMonth()).toBe(0);
    expect(parsed.getFullYear()).toBe(2016);
  });

  it('dddd, dd MMMM yyyy <-> Friday, 29 May 2015 05:50', () => {
    const parsed = parseDate(
      'Friday, 29 May 2015 05:50',
      'EEEE, dd MMM yyyy HH:mm',
      new Date(),
    );
    expect(parsed.getTime()).not.toBe(NaN);
  });

  it('dddd, dd MMMM yyyy <-> Friday, 29 May 2015 5:50', () => {
    const parsed = parseDate(
      'Friday, 29 May 2015 5:50',
      'EEEE, dd MMM yyyy K:mm',
      new Date(),
    );
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
    const parsed = parseDate(
      '05/29/2015 05:50',
      'MM/dd/yyyy HH:mm',
      new Date(),
    );
    expect(parsed.getTime()).not.toBe(NaN);
  });

  // it('MM/dd/yyyy hh:mm tt <-> 05/29/2015 05:50 AM', () => {
  //   const parsed = parse({ date: '05/29/2015 05:50 AM' });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('MM/dd/yyyy H:mm <-> 05/29/2015 5:50', () => {
  //   const parsed = parse({ date: '5/29/2015 5:50' });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('MM/dd/yyyy h:mm tt <-> 05/29/2015 5:50 AM', () => {
  //   const parsed = parse({ date: '05/29/2015 5:50 AM' });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('MM/dd/yyyy HH:mm:ss <-> 05/29/2015 05:50:06', () => {
  //   const parsed = parse({ date: '05/29/2015 05:50:06' });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('MMMM dd <-> May 29', () => {
  //   const parsed = parse({ date: 'May 29' });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // // Critical format for POS
  // it('yyyy’-‘MM’-‘dd’T’HH’:’mm’:’ss.fffffffK <-> 2015-05-16T05:50:06.7199222-04:00', () => {
  //   const parsed = parse({ date: '2015-05-16T05:50:06.7199222-04:00' });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('ddd, dd MMM yyy HH’:’mm’:’ss ‘GMT’ <-> Fri, 16 May 2015 05:50:06 GMT', () => {
  //   const parsed = parse({ date: 'Fri, 16 May 2015 05:50:06 GMT' });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('yyyy’-‘MM’-‘dd’T’HH’:’mm’:’ss <-> 2015-05-16T05:50:06', () => {
  //   const parsed = parse({ date: '2015-05-16T05:50:06' });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('HH:mm <-> 05:50', () => {
  //   const parsed = parse('05:50');
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('hh:mm tt <-> 05:50 AM', () => {
  //   const parsed = parse('05:50 AM');
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('H:mm <-> 5:50', () => {
  //   const parsed = parse('5:50');
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('h:mm tt <-> 5:50 AM', () => {
  //   const parsed = parse('5:50 AM');
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('HH:mm:ss <-> 05:50:06', () => {
  //   const parsed = parse('05:50:06');
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('yyyy MMMM <-> 2015 May', () => {
  //   const parsed = parse({ date: '2015 May' });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('2019-10-15T00:00:00', () => {
  //   const parsed = parse({ date: '2019-10-15T00:00:00' });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('UTC 2019-10-15T15:20:20Z', () => {
  //   const parsed = parse({ date: '2019-10-15T15:20:20Z', utc: true });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('UTC 2019-10-15T15:20:20-0300', () => {
  //   const parsed = parse({ date: '2019-10-15T15:20:20-0300', utc: true });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('UTC 2019-10-15T15:20:20+06:00', () => {
  //   const parsed = parse({ date: '2019-10-15T15:20:20+06:00', utc: true });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('UTC 2019-10-15T15:20:20.180Z', () => {
  //   const parsed = parse({ date: '2019-10-15T15:20:20.180Z', utc: true });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('UTC 2019-10-15T15:20:20.56', () => {
  //   const parsed = parse({ date: '2019-10-15T15:20:20.56', utc: true });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  // });

  // it('UTC 2019-10-15T16:51:20Z', () => {
  //   const parsed = parse({
  //     date: '2019-10-15T16:51:20Z',
  //     utc: true,
  //     timezone: -3,
  //   });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  //   expect(parsed.getHours()).toBe(16 - 3);
  // });

  // it('UTC 2019-10-15T16:51:20Z', () => {
  //   const parsed = parse({
  //     date: '2019-10-15T01:30:00Z',
  //     utc: true,
  //     timezone: -3,
  //   });
  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  //   expect(parsed.getDate()).toBe(14);
  //   expect(parsed.getHours()).toBe(22);
  // });

  // it('UTC 2019-10-02T11:53:40.325+00:00', () => {
  //   const parsed = parse({
  //     date: '2019-10-02T11:53:40.325+00:00',
  //     utc: true,
  //     timezone: -3,
  //   });

  //   expect(parsed).toBeInstanceOf(Object);
  //   expect(parsed.getTime()).not.toBe(NaN);
  //   expect(parsed.getHours()).toBe(8);
  // });
});

// describe('Parse date timezone using date-fns lib', () => {
//   it('Invalid Date', () => {
//     const date = parsePOSLocalDatetime(null);
//     expect(date).not.toBe(new Date());
//   });

//   it('Convert 2019-10-18T17:46:12Z to Brazil timezone', () => {
//     const date = parsePOSLocalDatetime('2019-10-18T17:46:12Z');
//     expect(date.toString()).toBe(
//       'Thu Oct 17 2019 11:46:12 GMT-0300 (Brasilia Standard Time)',
//     );
//     expect(date.getHours()).toBe(11);
//     expect(date.getMinutes()).toBe(46);
//   });

//   it('Convert 2019-10-18T17:46:12Z to Tokyo timezone', () => {
//     const date = parsePOSLocalDatetime('2019-10-22T14:53:46Z');
//     expect(date.toString()).toBe(
//       'Thu Oct 17 2019 11:46:12 GMT-0300 (Brasilia Standard Time)',
//     );
//   });
// });
