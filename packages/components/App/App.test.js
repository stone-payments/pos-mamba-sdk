import AppAPI from '@mamba/pos/api/app.js';
import Keyboard from '@mamba/pos/api/keyboard.js';
import App from './App.html';
import Keystroke from './Keystroke.html';

const target = document.body;
let component;
let contentDiv;

const newInstance = data => {
  const docFrag = document.createDocumentFragment();
  contentDiv = document.createElement('DIV');
  contentDiv.className = 'content';
  docFrag.appendChild(contentDiv);

  if (component) {
    component.destroy();
  }

  component = new App({
    target,
    data,
    slots: {
      default: docFrag,
    },
  });

  return component;
};

const fireKey = keyName => {
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      keyCode: Keyboard.getKeyCode(keyName),
      bubbles: true,
      cancelable: false,
    }),
  );

  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      keyCode: Keyboard.getKeyCode(keyName),
      bubbles: true,
      cancelable: false,
    }),
  );
};

const createShortcutButton = keyName => {
  const button = document.createElement('BUTTON');
  button.setAttribute('shortcut', keyName);
  contentDiv.appendChild(button);
  return button;
};

newInstance();

it("should pass the app's content through a slot", () => {
  expect(target.querySelector('.app')).not.toBeNull();
  expect(target.querySelector('.content')).not.toBeNull();
});

it('should register itself as a "meta" property on the root', () => {
  expect(component.root.meta).toBe(component);
});

it('should modify the navigation object when root "navigation" and "shortcuts" are fired ', () => {
  component.root.fire('navigation', false);
  component.root.fire('shortcuts', false);

  expect(component.root.get().navigation).toEqual({
    home: false,
    back: false,
  });
  expect(component.root.get().shortcuts).toBe(false);
  expect(component.isNavigationEnabled()).toBe(false);

  component.root.fire('navigation', { home: true, back: true });
  component.root.fire('shortcuts', true);

  expect(component.root.get().navigation).toEqual({
    home: true,
    back: true,
  });
  expect(component.root.get().shortcuts).toBe(true);
  expect(component.isNavigationEnabled()).toBe(true);
});

it('should close the app on "close" root event', () =>
  new Promise(res => {
    AppAPI.once('closed', res);
    component.root.fire('close');
  }));

it('should be able to override the close callback with a root.onClose method', () =>
  new Promise(res => {
    component.root.onClose = res;
    component.root.fire('close');
  }));

it('should toggle a "no-scroll" class on the root.target with the `scrollable` prop', () => {
  component.root.set({ scrollable: false });
  expect(target.classList.contains('no-scroll')).toBe(true);

  component.root.set({ scrollable: true });
  expect(target.classList.contains('no-scroll')).toBe(false);
});

it('should toggle a "has-appbar" class on the root.target with the `hasAppbar` prop', () => {
  component.root.set({ hasAppbar: false });
  expect(target.classList.contains('has-appbar')).toBe(false);

  component.root.set({ hasAppbar: true });
  expect(target.classList.contains('has-appbar')).toBe(true);
});

it('should close app on "close" button', () => {
  newInstance();

  return new Promise(res => {
    AppAPI.once('closed', res);
    fireKey('close');
  });
});

it('should trigger an "go back" action if no input is selected and the router is not at the home page', () => {
  newInstance();
  return new Promise(res => {
    component.root.router = {
      get: () => ({ path: '/not-home' }),
      back: res,
    };

    fireKey('back');
  });
});

it('should NOT trigger an "go back" action if `root.navigation.back: false`', () => {
  newInstance();
  component.root.fire('navigation', { back: false });

  return new Promise((res, rej) => {
    component.root.router = {
      get: () => ({ path: '/not-home' }),
      back: rej,
    };

    fireKey('back');

    setTimeout(res, 500);
  });
});

it('should NOT trigger an "go back" action if at app home', () => {
  newInstance();

  return new Promise((res, rej) => {
    component.root.router = {
      get: () => ({ path: '/' }),
      back: rej,
    };

    fireKey('back');

    setTimeout(res, 500);
  });
});

it('should trigger an element with `shortcut="keyName"`', () => {
  newInstance();
  const keyNames = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    'help',
    'shortcuts',
    'close',
    'enter',
    // 'back' is not allowed to be a shortcut key
  ];

  const promises = keyNames.map(
    keyName =>
      new Promise(res =>
        createShortcutButton(keyName).addEventListener('click', res),
      ),
  );

  keyNames.forEach(fireKey);

  return Promise.all(promises);
});

it('should not double fire a "enter" shortcut event if the element is already focused', () => {
  newInstance();

  return new Promise((res, rej) => {
    const btn = createShortcutButton('enter');
    btn.focus();
    btn.addEventListener('click', rej);

    fireKey('enter');

    setTimeout(res, 500);
  });
});

it('should not handle keys with a <Keystroke/> assigned to them', () => {
  newInstance();

  return new Promise((res, rej) => {
    const keystroke = new Keystroke({ target, data: { key: 'help' } });
    keystroke.on('keystroke', () => {
      res();
      keystroke.destroy();
    });

    createShortcutButton('help').addEventListener('click', rej);

    fireKey('help');
  });
});

it('should not handle keys if an input is focused', () => {
  newInstance();

  return new Promise((res, rej) => {
    createShortcutButton('1').addEventListener('click', rej);

    const input = document.createElement('INPUT');
    contentDiv.appendChild(input);
    input.focus();

    fireKey('1');

    setTimeout(res, 500);
  });
});

it("should not handle shortcuts if shortcuts aren't enabled", () => {
  newInstance();

  component.root.fire('shortcuts', false);

  return new Promise((res, rej) => {
    createShortcutButton('1').addEventListener('click', rej);

    fireKey('1');

    setTimeout(res, 500);
  });
});
