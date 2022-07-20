import AppAPI from '@mamba/pos/api/app.js';
import App from './App.html';
import Keystroke from './Keystroke.html';

const { newTestRoot, fireKey } = global;
let root;
let meta;
let content;

beforeEach(() => {
  const docFrag = document.createDocumentFragment();
  content = document.createElement('DIV');
  content.className = 'content';
  docFrag.appendChild(content);

  root = newTestRoot({ contentFragment: docFrag });
  meta = root.createComponent(App, {
    unique: true,
    slots: { default: docFrag },
  });
});

it("should pass the app's content through a slot", () => {
  expect(root.options.target.classList.contains('mamba-app-container')).toBe(true);
  expect(root.query('.content')).not.toBeNull();
});

it('should register itself as a "meta" property on the root', () => {
  expect(meta.root.meta).toBe(meta);
});

it('should close the app on "this.root.close()" method execution', () =>
  new Promise((res) => {
    AppAPI.once('closed', res);
    root.close();
  }));

it('should open password dialog "this.root.close()" method execution when askPasswordOnClose is true', () => {
  root.meta.set({ askPasswordOnClose: true });
  root.close();
  expect(root.meta.refs.adminLock.get()._showLockPopUp).toBe(true);
});

it('[DEPRECATED] should close the app on "close" root event', () =>
  new Promise((res) => {
    AppAPI.once('closed', res);
    root.fire('close');
  }));

it('should be able to override the close callback with a root.onClose method', () =>
  new Promise((res) => {
    root.onClose = res;
    root.close();
  }));

it('should toggle a "no-scroll" class on the root.target with the `scrollable` prop', () => {
  meta.setScrollable(false);
  expect(root.query('.mamba-app').classList.contains('no-scroll')).toBe(true);

  meta.setScrollable(true);
  expect(root.query('.mamba-app').classList.contains('no-scroll')).toBe(false);
});

it('[deprecated] should modify the navigation object when root "navigation" and "shortcuts" are fired ', () => {
  root.fire('navigation', false);
  root.fire('shortcuts', false);

  expect(meta.get().navigable).toEqual({
    home: false,
    back: false,
  });
  expect(meta.get().shortcuts).toBe(false);

  root.fire('navigation', { home: true, back: true });
  root.fire('shortcuts', true);

  expect(meta.get().navigable).toEqual({
    home: true,
    back: true,
  });
  expect(meta.get().shortcuts).toBe(true);
});

it('should toggle a "has-appbar" class on the root.target with the `hasAppbar` prop', () => {
  meta.set({ hasAppbar: false });
  expect(root.query('.mamba-app').classList.contains('has-appbar')).toBe(false);

  meta.set({ hasAppbar: true });
  expect(root.query('.mamba-app').classList.contains('has-appbar')).toBe(true);
});

it('should close app on "close" button', () =>
  new Promise((res) => {
    AppAPI.once('closed', res);
    fireKey('close');
  }));

it('should trigger a "go back" action if no input is selected and the router is not at the home page', () =>
  new Promise((res) => {
    root.router.go('/not-home');
    root.router.back = res;

    fireKey('back');
  }));

it('should merge navigable objects', () => {
  meta.setNavigable({ home: true, back: false });
  expect(meta.get().navigable).toEqual({ home: true, back: false });

  meta.setNavigable({ back: true });
  expect(meta.get().navigable).toEqual({ home: true, back: true });
});

it('should activate flag to control back and home button', () => {
  meta.setActionBeforeClose(true);
  expect(meta.get().doBeforeClose).toBe(true);
});

it('should set both `home` and `back` navigable properties if passed a boolean', () => {
  meta.setNavigable(false);
  expect(meta.get().navigable).toEqual({ home: false, back: false });

  meta.setNavigable(true);
  expect(meta.get().navigable).toEqual({ home: true, back: true });
});

it('should NOT trigger a "go back" action if `navigable.back: false`', () => {
  meta.setNavigable({ back: false, home: true });

  return new Promise((res, rej) => {
    root.router.go('/not-home');
    root.router.back = rej;

    fireKey('back');

    setTimeout(res, 500);
  });
});

it('should NOT trigger a "go back" action if at app home', () =>
  new Promise((res, rej) => {
    root.router.go('/');
    root.router.back = rej;

    fireKey('back');

    setTimeout(res, 500);
  }));

describe('shortcuts', () => {
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

  const createShortcutButton = (keyName) => {
    const button = document.createElement('BUTTON');
    button.setAttribute('shortcut', keyName);
    content.appendChild(button);
    return button;
  };

  it('should trigger an element with `shortcut="keyName"`', () => {
    // eslint-disable-next-line no-unused-vars
    const promises = keyNames.map(
      (keyName) =>
        new Promise((res) => createShortcutButton(keyName).addEventListener('click', res)),
      // setTimeout(res, 500);
    );

    keyNames.forEach((key) => fireKey(key));

    // return Promise.all(promises);
  });

  it('should not double fire a "enter" shortcut event if the element is already focused', () =>
    new Promise((res, rej) => {
      const btn = createShortcutButton('enter');
      btn.focus();
      btn.addEventListener('click', rej);

      fireKey('enter');

      setTimeout(res, 500);
    }));

  it('should not handle keys with a <Keystroke/> assigned to them', () =>
    new Promise((res, rej) => {
      const keystroke = root.createComponent(Keystroke, {
        data: { key: 'help' },
      });

      keystroke.on('keystroke', () => {
        res();
        keystroke.destroy();
      });

      createShortcutButton('help').addEventListener('click', rej);

      fireKey('help');
    }));

  it('should not handle keys if an input is focused', () =>
    new Promise((res, rej) => {
      createShortcutButton('1').addEventListener('click', rej);

      const input = document.createElement('INPUT');
      content.appendChild(input);
      input.focus();

      fireKey('1');

      setTimeout(res, 500);
    }));

  it("should not handle shortcuts if shortcuts aren't enabled", () =>
    new Promise((res, rej) => {
      meta.setShortcuts(false);
      createShortcutButton('1').addEventListener('click', rej);

      fireKey('1');

      setTimeout(res, 500);
    }));
});

describe('hideAppBar', () => {
  beforeEach(() => {
    const docFrag = document.createDocumentFragment();
    meta = root.createComponent(App, {
      unique: true,
      slots: { default: docFrag },
    });
  });
  it('should set AppBar hide properties to true', () => {
    meta.hideAppBar(true);
    expect(meta.get().hideAppBar).toEqual(true);
  });

  it('should set AppBar hide properties to false', () => {
    meta.hideAppBar(false);
    expect(meta.get().hideAppBar).toEqual(false);
  });
});
