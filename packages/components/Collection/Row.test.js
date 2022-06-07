import Switch from '@mamba/switch';
import Row from './Row.html';

const { newTestRoot } = global;

const root = newTestRoot();
let row;
let rightSign;

const newRow = (data, slots) => root.createComponent(Row, { unique: true, data, slots });

it('should have a right sign with href', () => {
  row = newRow({ showExtra: false, href: '/home' });

  expect(row.get()._hasRightSign).toBe(true);
  expect(row.refs.rightSign).not.toBeNull();
});

it('should apply has-right-sign class with href', () => {
  expect(root.query('.top.has-right-sign')).not.toBeNull();
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

  it('should only trigger a click event if no href or right sign present', () =>
    new Promise((res) => {
      row.on('click', res);
      row.refs.main.click();
    }));

  it('should trigger router when href exists and element is clicked', () => {
    row = newRow({ href: '/home' });

    return new Promise((res) => {
      row.root.router = { go: res };
      row.refs.main.click();
    });
  });
});

describe('signs', () => {
  const getSwitchFragment = () => {
    const signFragment = document.createDocumentFragment();
    rightSign = new Switch({
      target: signFragment,
      data: {
        disabled: false,
        checked: false,
      },
    });

    return signFragment;
  };
  it('should have right sign with custom slot', () => {
    row = newRow({}, { 'right-sign': getSwitchFragment() });

    expect(row.get()._hasRightSign).toBe(true);
    expect(row.refs.rightSign).not.toBeNull();

    row = newRow({}, { controller: getSwitchFragment() });

    expect(row.get()._hasRightSign).toBe(true);
    expect(row.refs.rightSign).not.toBeNull();
  });

  it('should trigger click in custom right sign with data-trigger="click"', () => {
    row = newRow({}, { 'right-sign': getSwitchFragment() });

    return new Promise((res) => {
      rightSign.on('change', res);
      row.refs.main.click();
    });
  });

  it('should not retrigger sign trigger if click was on it', () => {
    row = newRow({}, { 'right-sign': getSwitchFragment() });

    return new Promise((res) => {
      setTimeout(() => {
        if (rightSign.get().checked) res();
      }, 500);

      row.refs.rightSign.querySelector('[data-trigger="click"]').click();
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

    expect(root.query('.extra')).not.toBeNull();
  });

  it('should hide extra', () => {
    row.set({ showExtra: false });

    expect(root.query('.extra')).toBeNull();
  });
});
