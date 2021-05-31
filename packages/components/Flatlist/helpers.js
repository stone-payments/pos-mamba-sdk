import * as Colors from '@mamba/styles/colors.js';
import { KEY_ACTION } from './const.js';

let lastActive;

export const ALIGN_CLASS = {
  start: 'mb-align-start',
  center: 'mb-align-center',
  end: 'mb-align-end',
};

export const getAlignClass = verticalAlign => {
  if (!verticalAlign) return '';
  const value = ALIGN_CLASS[verticalAlign];
  return (value && ` ${value}`) || '';
};

const unActiveLeast = items => {
  let hasActive;

  if (typeof lastActive === 'object' && lastActive.get) {
    hasActive = lastActive;
  }

  if (!hasActive) {
    lastActive = undefined;
    hasActive = items.find(el => el.element.get().isActive);
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
  const { element } = item.element.refs;
  const { offsetHeight = 0 } = document.querySelector('.status-bar');
  if (!element) {
    if (__DEV__) {
      console.warn('Refresh the page to reset <FlatList /> references');
    }
    return;
  }

  const { top } = element.getBoundingClientRect();
  if (top + yaxis >= window.innerHeight) {
    window.scrollTo(0, top + yaxis + offsetHeight);
  } else {
    window.scrollTo(0, 0);
  }
};

const getPosition = (index, keyAction) => {
  if (keyAction === KEY_ACTION.UP) {
    return index !== null && index > 0 ? index - 1 : index;
  }
  return index !== null ? index + 1 : 0;
};

export const selectRowItem = (
  nodeList,
  index,
  yaxis,
  keyAction = KEY_ACTION.DOWN,
) => {
  const selectIndex = getPosition(index, keyAction);

  if (nodeList[selectIndex]) {
    scrollTo(yaxis, nodeList[selectIndex]);
    toggleActive(nodeList, selectIndex);
    return selectIndex;
  }

  return index;
};

export function setComponentEvents(component, eventsObjs) {
  if (eventsObjs && component) {
    const events = Object.getOwnPropertyNames(eventsObjs);
    events.forEach(evt => {
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
const isFunc = f => typeof f === 'function';
const repChar = char => `-${char.toLowerCase()}`;

const repColor = value => {
  if (value.indexOf('$') !== -1) {
    return value.replace(/\$.+/g, char => Colors[char.slice(1)]);
  }
  return value;
};

export const shouldReturnComponent = obj => {
  if (!obj) return undefined;

  const { value: objValue, props = {}, on = {} } = obj || {};

  if (isFunc(objValue)) {
    const value = objValue();

    if (isFunc(value)) {
      return { hasComponent: true, value, props, on };
    }

    return { hasComponent: false, value };
  }
  if (typeof objValue === 'object') return JSON.stringify(objValue);
  return obj;
};

export const getStyles = (obj, blackList = []) => {
  if (!obj) return '';
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.join('; ');
    }

    return Object.getOwnPropertyNames(obj)
      .map(str => {
        const rule = str.replace(/[A-Z]/g, repChar);
        if (blackList.indexOf(rule) !== -1) return '';
        const value = repColor(obj[str]);
        return `${rule}: ${value};`;
      })
      .join('');
  }

  if (typeof obj === 'string') return obj;

  return '';
};
