import AppBar from './AppBar.html';

const { newTestApp, clickOn } = global;
let test;
let appBar;

const newAppbarTest = () => {
  const testApp = newTestApp();

  const router = testApp.createDummy({ data: { context: { path: '/' } } });

  const meta = testApp.createDummy({
    methods: {
      setNavigable(o) {
        this.set({ navigable: o });
      },
    },
  });

  testApp.router = router;
  testApp.meta = meta;

  return testApp;
};

const changeRouterPath = path => {
  appBar.root.router.set({ context: { path } });
};

it('should apply inline style', () => {
  test = newAppbarTest();

  test.createComponent(AppBar, {
    data: {
      title: 'teste',
      textColor: 'blue',
      bgColor: 'red',
      border: false,
    },
  });

  expect(test.query('.appbar').style.color).toBe('blue');
  expect(test.query('.appbar').style.backgroundColor).toBe('red');
  expect(test.query('.appbar').style.borderBottom).toBe('');
});

describe('icons', () => {
  beforeAll(() => {
    test = newAppbarTest();
    appBar = test.createComponent(AppBar);
  });

  it('should display back button when location is not home and backward navigation is enabled', () => {
    changeRouterPath('/not-home');

    appBar.root.meta.setNavigable({ back: true, home: true });

    expect(test.query('.icon-left')).not.toBeNull();
  });

  it('should not display back button when location is home', () => {
    changeRouterPath('/');

    expect(test.query('.icon-left')).toBeNull();
  });
});

describe('title', () => {
  beforeAll(() => {
    test = newAppbarTest();
    appBar = test.createComponent(AppBar, {
      data: {
        title: 'teste',
      },
    });
  });

  it('should display title', () => {
    const titleDOM = test.query('.title');
    expect(titleDOM).not.toBeNull();
    expect(document.title).toBe('teste');
    expect(titleDOM.textContent).toBe('teste');
  });

  it('should not display title', () => {
    appBar.set({ title: undefined });
    const titleDOM = test.query('.title');
    expect(titleDOM).toBeNull();
  });
});

describe('navigation', () => {
  beforeAll(() => {
    test = newAppbarTest();
    appBar = test.createComponent(AppBar);
  });

  it('should display home button when home navigation is enabled', () => {
    changeRouterPath('/not-home');

    appBar.root.meta.setNavigable({ back: true, home: true });

    expect(test.query('.icon-right')).not.toBeNull();
  });

  it('should not display home(s) button when home navigation is disabled', () => {
    changeRouterPath('/');

    appBar.root.meta.setNavigable({ back: true, home: false });

    expect(test.query('.icon-right')).toBeNull();
  });

  it('should display home button when location is /', () => {
    appBar.root.meta.setNavigable({ back: true, home: true });

    expect(test.query('.icon-right')).not.toBeNull();
    expect(appBar.get()._isAtHome).toBe(true);
  });

  it('should display app-home when location is not /', () => {
    changeRouterPath('/not-home');

    expect(test.query('.icon-right')).not.toBeNull();
    expect(appBar.get()._isAtHome).toBe(false);
  });

  it('should lock home navigation', () => {
    changeRouterPath('/not-home');

    appBar.root.meta.setNavigable({ back: true, home: false });

    expect(test.query('.icon-left')).not.toBeNull();
  });

  it('should lock back navigation', () => {
    appBar.root.meta.setNavigable({ back: false, home: true });

    expect(test.query('.icon-left')).toBeNull();
  });

  it('should go home when home is clicked and location is not home page', () =>
    new Promise(res => {
      appBar.root.router.go = res;
      clickOn(test.query('.icon-right'));
    }));

  it('should close app when home is clicked and location is home', () => {
    changeRouterPath('/');

    return new Promise(res => {
      appBar.root.close = res;
      clickOn(test.query('.icon-right'));
    });
  });

  it('should go back when back is clicked', () => {
    changeRouterPath('/not-home');

    appBar.root.meta.setNavigable({ back: true, home: true });

    return new Promise(res => {
      appBar.root.router.back = res;
      clickOn(test.query('.icon-left'));
    });
  });
});

it('should modify the appbar props', () => {
  test.fire('appbar:modify', { title: 'modificado' });
  expect(appBar.get()).toMatchObject({ title: 'modificado' });
});

it('should set hasAppbar false on meta', () => {
  appBar.destroy();

  expect(test.meta.get()._hasAppbar).toBe(false);
});
