import { parseISO, parse } from 'date-fns';
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
  if (/^24:([0-5][0-9](:[0-5][0-9]))?$/g.test(time)) {
    // check if hour has 24
    return false;
  } else {
    return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(time);
  }
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

/**
 *
 * @param {string} dateString - Date that it will parse
 *
 * @example
 *
 *  parseISO('2019-10-18T17:46:12Z')
 */
export function parseDateISO(dateString) {
  return parseISO(dateString);
}

/**
 *
 * @param {string} dateString - Date that it will parse
 * @param {string} formatDateString - Date format tha will show
 * @param {Date | Number} backupDate - Backup date when dateString is missed
 *
 * @example
 *
 *  parseDate('18/06/1996', 'dd/MM/yyyy', new Date('2019-5-23'))
 */
export function parseDate(dateString, formatDateString, backupDate) {
  return parse(dateString, formatDateString, backupDate);
}

/**
 *
 * @param {string} dateString - Date that it will parse
 * @param {string} timezone - Specific timezone
 * @param {string} dateFormat - Mask to convert date
 *
 * @example
 *
 *  parsePOSLocalDatetime('2019-10-18T17:46:12Z')
 *  parsePOSLocalDatetime('2019-10-18T17:46:12Z', 'dd/MM/yyyy')
 */
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

  if (dateFormat) return format(parseDateISO(dateString), dateFormat);
  return parseDateISO(dateString);
}
