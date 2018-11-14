import Switch from '@mamba/switch';
import Row from './Row.html';

const target = document.body;
const extra = document.createElement('P');
extra.innerText = 'extra';
const extraFragment = document.createDocumentFragment();
const controllerFragment = document.createDocumentFragment();
let component;

const controller = new Switch({
  target: controllerFragment,
  data: {
    disabled: false,
    checked: false,
  },
});

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

it('should show extra', () => {
  newInstance(
    {
      showExtra: true,
    },
    {
      extra: extraFragment,
    },
  );
  expect(component.get()._hasExtraContent).toBe(true);
  expect(document.querySelector('.extra')).not.toBeNull();
});

it('should not show extra without extra content', () => {
  newInstance({
    showExtra: true,
  });
  expect(document.querySelector('.extra')).toBeNull();
});

it('should hide extra', () => {
  newInstance(
    {
      showExtra: false,
    },
    {
      extra,
    },
  );
  expect(document.querySelector('.extra')).toBeNull();
});

it('should have controller with href', () => {
  newInstance({
    showExtra: false,
    href: '/home',
  });
  expect(component.refs.controller).not.toBeNull();
});

it('should apply controller style with href', () => {
  newInstance({
    showExtra: false,
    href: '/home',
  });
  expect(document.querySelector('.top.has-controller')).not.toBeNull();
});

it('should have controller with custom controller', () => {
  newInstance(
    {},
    {
      controller: controllerFragment,
    },
  );
  expect(component.get()._hasCustomController).toBe(true);
  expect(component.refs.controller).not.toBeNull();
});

it('should apply controller style with custom controller', () => {
  newInstance(
    {},
    {
      controller: controllerFragment,
    },
  );
  expect(document.querySelector('.top.has-controller')).not.toBeNull();
});

it('should not have description field without description text', () => {
  newInstance({
    description: 'description text',
  });
  expect(document.querySelector('p')).not.toBeNull();
});

it('should have description text with description', () => {
  newInstance({
    description: undefined,
  });
  expect(document.querySelector('p')).toBeNull();
});

it('should trigger router when href exists and element is clicked', () => {
  newInstance({
    showExtra: false,
    href: '/home',
  });

  return new Promise(res => {
    function click(elem) {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      elem.dispatchEvent(event);
    }

    // simulate router behavior
    component.root = {
      router: {
        go() {
          res();
        },
      },
    };
    click(component.refs.main);
  });
});

it('should trigger click in custom controller', () => {
  newInstance(
    {},
    {
      controller: controllerFragment,
    },
  );

  return new Promise(res => {
    controller.on('change', res);
    component.refs.main.click();
  });
});

it('should trigger click event', () => {
  newInstance({});
});

it('should set shortcut attribute data', () => {
  newInstance({
    shortcut: 'help',
  });
  expect(component.refs.main.getAttribute('shortcut')).toBe('help');
});
