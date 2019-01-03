import Switch from '@mamba/switch';
import Row from './Row.html';

const { newTestRoot } = global;

const root = newTestRoot();
let row;
let controller;

const newRow = (data, slots) =>
  root.createComponent(Row, { unique: true, data, slots });

it('should have controller with href', () => {
  row = newRow({ showExtra: false, href: '/home' });

  expect(row.get()._hasController).toBe(true);
  expect(row.refs.controller).not.toBeNull();
});

it('should apply controller class with href', () => {
  expect(root.query('.top.has-controller')).not.toBeNull();
});

it('should apply controller class with custom controller', () => {
  expect(root.query('.top.has-controller')).not.toBeNull();
});

it('should not have description field without description text', () => {
  row.set({ description: undefined });

  expect(root.query('.description')).toBeNull();
});

it('should have description text with description', () => {
  row.set({ description: 'description text' });

  expect(root.query('.description')).not.toBeNull();
  expect(root.query('.description').textContent).toBe('description text');
});

it('should have description text with description passed by a SLOT', () => {
  const frag = document.createDocumentFragment();
  const p = document.createElement('P');
  p.textContent = 'description text';
  frag.appendChild(p);

  row = newRow({}, { description: frag });

  expect(root.query('p')).not.toBeNull();
  expect(root.query('p').textContent).toBe('description text');
  expect(root.query('p')).toBe(p);
});

it('should set shortcut attribute data', () => {
  row = newRow({ shortcut: 'help' });

  expect(row.refs.main.getAttribute('shortcut')).toBe('help');
});

describe('click behavior', () => {
  beforeAll(() => {
    row = newRow();
  });

  it('should only trigger a click event if no href or controller present', () =>
    new Promise(res => {
      row.on('click', res);
      row.refs.main.click();
    }));

  it('should trigger router when href exists and element is clicked', () => {
    row = newRow({ href: '/home' });

    return new Promise(res => {
      row.root.router = { go: res };
      row.refs.main.click();
    });
  });
});

describe('controller', () => {
  const getSwitchFragment = () => {
    const controllerFragment = document.createDocumentFragment();
    controller = new Switch({
      target: controllerFragment,
      data: {
        disabled: false,
        checked: false,
      },
    });

    return controllerFragment;
  };
  it('should have controller with custom controller', () => {
    row = newRow({}, { controller: getSwitchFragment() });

    expect(row.get()._hasController).toBe(true);
    expect(row.get()._hasCustomController).toBe(true);
    expect(row.refs.controller).not.toBeNull();
  });

  it('should trigger click in custom controller with data-controller-trigger="click"', () => {
    row = newRow({}, { controller: getSwitchFragment() });

    return new Promise(res => {
      controller.on('change', res);
      row.refs.main.click();
    });
  });

  it('should not retrigger controller if click was on it', () => {
    row = newRow({}, { controller: getSwitchFragment() });

    return new Promise(res => {
      setTimeout(() => {
        if (controller.get().checked) res();
      }, 500);

      row.refs.controller
        .querySelector('[data-controller-trigger="click"]')
        .click();
    });
  });
});

describe('extra slot', () => {
  const getExtraFragment = () => {
    const extraFragment = document.createDocumentFragment();
    const extra = document.createElement('P');

    extra.innerText = 'extra';

    extraFragment.appendChild(extra);

    return extraFragment;
  };

  it('should not show extra slot without extra content', () => {
    row = newRow({ showExtra: true });

    expect(root.query('.extra')).toBeNull();

    row.set({ showExtra: false });

    expect(root.query('.extra')).toBeNull();
  });

  it('should show extra', () => {
    row = newRow({ showExtra: true }, { extra: getExtraFragment() });

    expect(row.get()._hasExtraContent).toBe(true);
    expect(root.query('.extra')).not.toBeNull();
  });

  it('should hide extra', () => {
    row.set({ showExtra: false });

    expect(root.query('.extra')).toBeNull();
  });
});
