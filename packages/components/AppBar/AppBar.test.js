import AppBar from './AppBar.html';

const { newTestRoot, clickOn } = global;
let root;
let appBar;

const newAppBar = data => {
  root = newTestRoot();
  return root.createComponent(AppBar, { data });
};

const changeRouterPath = path => {
  root.router.set({ context: { path } });
  root.router.fire('change', { path });
  root.fire('router:change', { path });
};

it('should apply inline style', () => {
  appBar = newAppBar({
    title: 'teste',
    textColor: 'blue',
    iconColor: 'teal',
    bgColor: 'red',
    border: false,
    borderColor: 'purple',
  });

  expect(root.query('.appbar').style.color).toBe('blue');
  expect(root.query('.appbar').style.backgroundColor).toBe('red');
  expect(root.query('.appbar').style.borderColor).toBe('purple');
  expect(root.query('.appbar [symbol~="home"]').style.color).toBe('teal');
  expect(root.query('.appbar').style.borderBottom).toBe('');
});

describe('icons', () => {
  beforeAll(() => {
    appBar = newAppBar();
  });

  it('should display back button when location is not home and backward navigation is enabled', () => {
    changeRouterPath('/not-home');

    root.meta.setNavigable({ back: true, home: true });

    expect(root.query('.icon-left')).not.toBeNull();
  });

  it('should not display back button when location is home', () => {
    changeRouterPath('/');

    expect(root.query('.icon-left')).toBeNull();
  });
});

describe('title', () => {
  beforeAll(() => {
    appBar = newAppBar({ title: 'teste' });
  });

  it('should display title', () => {
    const titleDOM = root.query('.title');
    expect(titleDOM).not.toBeNull();
    expect(document.title).toBe('teste');
    expect(titleDOM.textContent).toBe('teste');
  });

  it('should not display title', () => {
    appBar.set({ title: undefined });
    const titleDOM = root.query('.title');
    expect(titleDOM).toBeNull();
  });
});

describe('hideAppBar', () => {
  beforeAll(() => {
    appBar = newAppBar();
  });
  it('should display header', () => {
    const headerDOM = root.query('.appbar');
    expect(headerDOM).not.toBeNull();
    expect(appBar.get()._hideAppBar).toBe(false);
  });
  it('should display header', () => {
    const headerDOM = root.query('.appbar');
    appBar.set({ _hideAppBar: false });
    expect(headerDOM).not.toBeNull();
    expect(appBar.get()._hideAppBar).toBe(false);
  });
});

describe('navigation', () => {
  beforeAll(() => {
    appBar = newAppBar();
  });

  it('should display home button when home navigation is enabled', () => {
    changeRouterPath('/not-home');

    root.meta.setNavigable({ back: true, home: true });

    expect(root.query('.icon-right')).not.toBeNull();
  });

  it('should not display home(s) button when home navigation is disabled', () => {
    changeRouterPath('/');

    root.meta.setNavigable({ back: true, home: false });

    expect(root.query('.icon-right')).toBeNull();
  });

  it('should display home button when location is /', () => {
    root.meta.setNavigable({ back: true, home: true });

    expect(root.query('.icon-right')).not.toBeNull();
    expect(appBar.get()._isAtHome).toBe(true);
  });

  it('should display app-home when location is not /', () => {
    changeRouterPath('/not-home');

    expect(root.query('.icon-right')).not.toBeNull();
    expect(appBar.get()._isAtHome).toBe(false);
  });

  it('should lock home navigation', () => {
    changeRouterPath('/not-home');

    root.meta.setNavigable({ back: true, home: false });

    expect(root.query('.icon-left')).not.toBeNull();
  });

  it('should lock back navigation', () => {
    root.meta.setNavigable({ back: false, home: true });

    expect(root.query('.icon-left')).toBeNull();
  });

  it('should go home when home is clicked and location is not home page', () =>
    Promise.all([
      new Promise(res => {
        root.on('appbar:goHome', res);
      }),
      new Promise(res => {
        root.router.go = res;
        clickOn(root.query('.icon-right'));
      }),
    ]));

  it('should close app when home is clicked and location is home', () => {
    changeRouterPath('/');

    return Promise.all([
      new Promise(res => {
        root.on('appbar:closeApp', res);
      }),
      new Promise(res => {
        root.close = res;
        clickOn(root.query('.icon-right'));
      }),
    ]);
  });

  it('should update back button route', () => {
    root.meta.setNavigable({ back: true, home: true });

    root.meta.setNavigableRoute('/');

    expect(root.meta.get().navigableRoute.routeBack).toBe('/');
  });

  // MUST FIX
  // it('should update back button route with params', () => {
  //   root.meta.setNavigable({ back: true, home: true });

  //   root.meta.setNavigableRoute('/', { name: 'Mamba' });

  //   expect(root.meta.get().navigableRoute.paramsBack).toBe({ name: 'Mamba' });
  // });

  it('should show back button when the method setNavigableRoute is called', () => {
    root.meta.setNavigableRoute('/');

    expect(root.query('.icon-left')).not.toBeNull();
  });

  // MUST FIX
  // it('should go back when back is clicked', () => {
  //   changeRouterPath('/not-home');

  //   root.meta.setNavigable({ back: true, home: true });

  //   return Promise.all([
  //     new Promise(res => {
  //       root.on('appbar:goBack', res);
  //     }),
  //     new Promise(res => {
  //       root.router.back = res;
  //       clickOn(root.query('.icon-left'));
  //     }),
  //   ]);
  // });
});

it('should modify the appbar props', () => {
  root.fire('appbar:modify', { title: 'modificado' });
  expect(appBar.get()).toMatchObject({ title: 'modificado' });
});

it('should set hasAppbar false on meta', () => {
  appBar.destroy();

  expect(root.meta.get().hasAppbar).toBe(false);
});
