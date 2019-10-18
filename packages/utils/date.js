import { utcToZonedTime, format as formatDate } from 'date-fns-tz';

export function format(date, mask) {
  if (typeof date.getFullYear !== 'function') {
    throw new Error('Must pass a Date object to format it');
  }

  if (typeof mask !== 'string' || !mask.length) {
    throw new Error(
      "Invalid mask passed. Must be a string of these characters: 'dd', 'm', 'mm', 'yy', 'yyyy', 'h', 'hh', 'H', 'HH', 'M', 'MM', 's', 'ss'",
    );
  }
  return formatDate(date, mask);
}

export function isValidDate(date) {
  return (
    typeof date === 'object' &&
    typeof date.getTime === 'function' &&
    !Number.isNaN(date.getTime())
  );
}

export function isValidTime(time) {
  return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(time);
}

export function compareTime(timeA, timeB) {
  if (isValidTime(timeA) && isValidTime(timeB)) {
    const datetimeA = new Date();
    datetimeA.setHours(...timeA.split(':'));
    const datetimeB = new Date();
    datetimeB.setHours(...timeB.split(':'));
    const timeDiff = datetimeA - datetimeB;

    if (timeDiff > 0) {
      return 1;
    }
    if (timeDiff < 0) {
      return -1;
    }
    return 0;
  }
  return NaN;
}

export function parsePOSLocalDatetime(dateString, dateFormat = '') {
  if (
    typeof window.Clock === 'object' &&
    typeof window.Clock.getCurrentTimeZone === 'function'
  ) {
    /* getCurrentTimeZone()
      area: "São Paulo"
      id: "404"
      isDst: false
      location: "América"
      offsetHour: "-03"
      offsetMin: "00"
    */

    const { offsetHour, offsetMin } = window.Clock.getCurrentTimeZone();
    if (dateFormat) {
      return format(
        utcToZonedTime(dateString, `${offsetHour}${offsetMin}`),
        dateFormat,
      );
    }
    return utcToZonedTime(dateString, `${offsetHour}${offsetMin}`);
  }

  if (dateFormat)
    return format(utcToZonedTime(dateString, '-3000'), dateFormat);
  return utcToZonedTime(dateString, '-3000');
}
