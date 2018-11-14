import Switch from '@mamba/switch';
import Row from './Row.html';

const target = document.body;
let component;
let controller;

const newInstance = (data, slots) => {
  if (component) {
    component.destroy();
  }
  component = new Row({
    target,
    data,
    slots,
  });
  return component;
};

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

const getExtraFragment = () => {
  const extraFragment = document.createDocumentFragment();
  const extra = document.createElement('P');

  extra.innerText = 'extra';

  extraFragment.appendChild(extra);

  return extraFragment;
};

it('should have controller with href', () => {
  newInstance({ showExtra: false, href: '/home' });

  expect(component.get()._hasController).toBe(true);
  expect(component.refs.controller).not.toBeNull();
});

it('should apply controller class with href', () => {
  newInstance({ showExtra: false, href: '/home' });

  expect(target.querySelector('.top.has-controller')).not.toBeNull();
});

it('should have controller with custom controller', () => {
  newInstance({}, { controller: getSwitchFragment() });

  expect(component.get()._hasController).toBe(true);
  expect(component.get()._hasCustomController).toBe(true);
  expect(component.refs.controller).not.toBeNull();
});

it('should apply controller class with custom controller', () => {
  newInstance({}, { controller: getSwitchFragment() });

  expect(target.querySelector('.top.has-controller')).not.toBeNull();
});

it('should not have description field without description text', () => {
  newInstance({ description: undefined });

  expect(target.querySelector('p')).toBeNull();
});

it('should have description text with description', () => {
  newInstance({ description: 'description text' });

  expect(target.querySelector('p')).not.toBeNull();
});

it('should set shortcut attribute data', () => {
  newInstance({ shortcut: 'help' });

  expect(component.refs.main.getAttribute('shortcut')).toBe('help');
});

describe('click behavior', () => {
  it('should only trigger a click event if no href or controller present', () => {
    newInstance();

    return new Promise(res => {
      component.on('click', res);
      component.refs.main.click();
    });
  });

  it('should trigger router when href exists and element is clicked', () => {
    newInstance({ showExtra: false, href: '/home' });

    return new Promise(res => {
      /** Simulate router behavior */
      component.root = {
        router: {
          go: res,
        },
      };

      component.refs.main.click();
    });
  });

  it('should trigger click in custom controller with data-controller-trigger="click"', () => {
    newInstance({}, { controller: getSwitchFragment() });

    return new Promise(res => {
      controller.on('change', res);
      component.refs.main.click();
    });
  });

  it('should not retrigger controller if click was on it', () => {
    newInstance({}, { controller: getSwitchFragment() });

    return new Promise(res => {
      setTimeout(() => {
        if (controller.get().checked) res();
      }, 500);

      component.refs.controller
        .querySelector('[data-controller-trigger="click"]')
        .click();
    });
  });
});

describe('extra slot', () => {
  it('should not show extra slot without extra content', () => {
    newInstance({ showExtra: true });

    expect(target.querySelector('.extra')).toBeNull();

    component.set({ showExtra: false });

    expect(target.querySelector('.extra')).toBeNull();
  });

  it('should show extra', () => {
    newInstance({ showExtra: true }, { extra: getExtraFragment() });

    expect(component.get()._hasExtraContent).toBe(true);
    expect(target.querySelector('.extra')).not.toBeNull();
  });

  it('should hide extra', () => {
    newInstance({ showExtra: false }, { extra: getExtraFragment() });

    expect(target.querySelector('.extra')).toBeNull();
  });
});
