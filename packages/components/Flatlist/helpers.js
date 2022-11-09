import * as Colors from '@mamba/styles/colors.js';
import { KEYBOARD } from '@mamba/core';
import isFunction from './utils/isFunction.js';

let lastActive;

export const ALIGN_CLASS = {
  start: 'mb-align-start',
  center: 'mb-align-center',
  end: 'mb-align-end',
};

export const getAlignClass = (verticalAlign) => {
  if (!verticalAlign) return '';
  const value = ALIGN_CLASS[verticalAlign];
  return (value && ` ${value}`) || '';
};

const unActiveLeast = (items) => {
  let hasActive;

  if (typeof lastActive === 'object' && lastActive.get) {
    hasActive = lastActive;
  }

  if (!hasActive) {
    lastActive = undefined;
    hasActive = items.find((el) => el.element.get().isActive);
  }

  if (hasActive) {
    (hasActive.element || hasActive).set({
      isActive: false,
    });
  }
};

export const toggleActive = (items, index) => {
  unActiveLeast(items);

  const item = items[index].element;

  lastActive = item;

  item.set({
    isActive: true,
  });
};

const scrollTo = (yaxis, item) => {
  const {
    focusableItem = {},
    element: { refs },
  } = item;

  const { element } = refs || focusableItem;

  // use a custom getBoundingClientRect of svelte component or dom element
  let { getBoundingClientRect } = element || item.element;

  // try get dom getBoundingClientRect in case element doesn't have it
  if (!getBoundingClientRect && typeof focusableItem.getBoundingClientRect === 'function') {
    const { getBoundingClientRect: getRect } = focusableItem;
    getBoundingClientRect = getRect;
  }

  const { offsetHeight = 0 } = document.querySelector('.status-bar') || {};

  if (!element) {
    if (__DEV__) {
      console.warn('Refresh the page to reset <FlatList /> references');
    }
    return;
  }

  const { top, height } = getBoundingClientRect.call(element.domElement || element);

  const { innerHeight } = window;

  const upperBounds = top + offsetHeight; // top of the element
  const lowerBounds = top + offsetHeight + height; // bottom of the element

  if (upperBounds < 0) {
    const newTop = yaxis + lowerBounds - innerHeight; // bottom of the element will be bottom of new page
    if (newTop < 0) {
      window.scroll(0, 0);
    } else {
      window.scrollTo(0, newTop);
    }
  } else if (lowerBounds > innerHeight) {
    const newTop = top + yaxis + offsetHeight;
    window.scrollTo(0, newTop);
  }
};

const getPosition = (index, keyAction) => {
  if (keyAction === KEYBOARD.ARROW_UP) {
    return index !== null && index > 0 ? index - 1 : index;
  }
  return index !== null ? index + 1 : 0;
};

export const scrollActiveNodeAtIndex = (nodeList, index, yaxis) => {
  scrollTo(yaxis, nodeList[index]);
  toggleActive(nodeList, index);
};

export const selectRowItem = (nodeList, index, yaxis, keyAction) => {
  if (!keyAction) return index;

  const selectIndex = getPosition(index, keyAction);

  if (nodeList[selectIndex]) {
    scrollActiveNodeAtIndex(nodeList, selectIndex, yaxis);
    return selectIndex;
  }

  return index;
};

export function setComponentEvents(component, eventsObjs) {
  if (eventsObjs && component) {
    const events = Object.getOwnPropertyNames(eventsObjs);
    events.forEach((evt) => {
      try {
        if (component.proxyTarget && component.proxyTarget._handlers) {
          if (component.proxyTarget._handlers[evt]) return;
        }
      } finally {
        /**/
      }
      component.on(evt, eventsObjs[evt]);
    });
  }
}

export function persistComponentRef(cb = () => {}) {
  try {
    const { component } = this;
    if (!component) {
      setTimeout(() => {
        persistComponentRef();
      }, 10);
      return;
    }
    cb(component);
  } catch (e) {
    if (__DEV__) {
      (LOG_ERROR || console.log)(e);
    }
  }
}

// Post processing
const repChar = (char) => `-${char.toLowerCase()}`;

const repColor = (value) => {
  if (value && value.indexOf('$') !== -1) {
    return value.replace(/\$.+/g, (char) => Colors[char.slice(1)]);
  }
  return value;
};

export const shouldReturnComponent = (obj) => {
  if (!obj) return undefined;

  const { value: objValue, props = {}, on = {} } = obj || {};

  if (isFunction(objValue)) {
    const value = objValue();

    if (isFunction(value)) {
      return { hasComponent: true, value, props, on };
    }

    return { hasComponent: false, value };
  }
  if (typeof objValue === 'object') return JSON.stringify(objValue);
  return obj;
};

/**
 * @param {obj} obj - object with css values
 * @param {array} blackList
 *
 * @description Convert CSS in JS syntax to CSS syntax
 * */
export const getStyles = (obj, blackList = []) => {
  if (!obj) return '';

  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.join('; ');
    }

    const webkitPrefixRules = ['transform'];

    return Object.keys(obj)
      .map((str) => {
        const rule = str.replace(/[A-Z]/g, repChar);

        if (blackList.indexOf(rule) !== -1) return '';

        const value = repColor(obj[str]);

        if (webkitPrefixRules.indexOf(rule) !== -1) {
          return `-webkit-${rule}: ${value}; ${rule}: ${value};`;
        }

        return `${rule}: ${value};`;
      })
      .join('');
  }

  if (typeof obj === 'string') return obj;

  return '';
};
