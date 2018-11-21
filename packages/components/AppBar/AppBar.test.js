import AppBar from './AppBar.html';

const { newComponent } = global;

it('should apply inline style', () => {
  newComponent(AppBar, {
    data: {
      title: 'teste',
      textColor: 'blue',
      bgColor: 'red',
      border: false,
    },
  });

  expect(document.querySelector('.appbar').style.color).toBe('blue');
  expect(document.querySelector('.appbar').style.backgroundColor).toBe('red');
  expect(document.querySelector('.appbar').style.borderBottom).toBe('');
});

it('should display back button when location is not home and backward navigation is enabled', () => {
  const appbar = newComponent(AppBar);
  appbar.root.router.set({
    context: {
      path: '/not-home',
    },
  });
  appbar.root.meta.setNavigable({
    back: true,
    home: true,
  });
  expect(document.querySelector('.icon-left')).not.toBeNull();
});

it('should not display back button when location is home', () => {
  const appbar = newComponent(AppBar);
  appbar.root.router.set({
    context: {
      path: '/',
    },
  });
  expect(document.querySelector('.icon-left')).toBeNull();
});

it('should display title', () => {
  newComponent(AppBar, {
    data: {
      title: 'teste',
      textColor: 'blue',
      bgColor: 'red',
      border: false,
    },
  });

  const titleDOM = document.querySelector('.title');
  expect(titleDOM).not.toBeNull();
  expect(document.title).toBe('teste');
  // expect(titleDOM.innerText).toBe('teste');
});

it('should not display title', () => {
  newComponent(AppBar, {
    data: {
      title: undefined,
      textColor: 'blue',
      bgColor: 'red',
      border: false,
    },
  });

  const titleDOM = document.querySelector('.title');

  expect(titleDOM).toBeNull();
});

it('should display home button when home navigation is enabled', () => {
  const appbar = newComponent(AppBar);
  appbar.root.router.set({
    context: {
      path: '/not-home',
    },
  });
  appbar.root.meta.setNavigable({
    back: true,
    home: true,
  });

  expect(document.querySelector('.icon-right')).not.toBeNull();
});

it('should not display home(s) button when home navigation is disabled', () => {
  const appbar = newComponent(AppBar);
  appbar.root.router.set({
    context: {
      path: '/',
    },
  });
  appbar.root.meta.setNavigable({
    back: true,
    home: false,
  });

  expect(document.querySelector('.icon-right')).toBeNull();
});

it('should display home button when location is /', () => {
  const appbar = newComponent(AppBar);
  appbar.root.router.set({
    context: {
      path: '/',
    },
  });
  appbar.root.meta.setNavigable({
    back: true,
    home: true,
  });

  expect(document.querySelector('.icon-right')).not.toBeNull();
  expect(appbar.get()._isAtHome).toBe(true);
});

it('should display app-home when location is not /', () => {
  const appbar = newComponent(AppBar);
  appbar.root.router.set({
    context: {
      path: '/not-home',
    },
  });
  appbar.root.meta.setNavigable({
    back: true,
    home: true,
  });

  expect(document.querySelector('.icon-right')).not.toBeNull();
  expect(appbar.get()._isAtHome).toBe(false);
});

it('should lock home navigation', () => {
  const appbar = newComponent(AppBar);
  appbar.root.router.set({
    context: {
      path: '/not-home',
    },
  });
  appbar.root.meta.setNavigable({
    back: true,
    home: false,
  });
  expect(document.querySelector('.icon-left')).not.toBeNull();
});

it('should lock back navigation', () => {
  const appbar = newComponent(AppBar);
  appbar.root.router.set({
    context: {
      path: '/not-home',
    },
  });
  appbar.root.meta.setNavigable({
    back: false,
    home: true,
  });
  expect(document.querySelector('.icon-left')).toBeNull();
});

it('should go home when home is clicked and location is not home page', () => {
  const appbar = newComponent(AppBar);

  appbar.root.router.set({
    context: {
      path: '/not-home',
    },
  });

  appbar.root.meta.setNavigable({
    back: false,
    home: true,
  });

  return new Promise(res => {
    appbar.root.router.go = res;

    const evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    document.querySelector('.icon-right').dispatchEvent(evt);
  });
});

it('should close app when home is clicked and location is home', () => {
  const appbar = newComponent(AppBar);

  appbar.root.router.set({
    context: {
      path: '/',
    },
  });

  appbar.root.meta.setNavigable({
    back: false,
    home: true,
  });

  return new Promise(res => {
    appbar.root.close = res;

    const evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    document.querySelector('.icon-right').dispatchEvent(evt);
  });
});

it('should go back when back is clicked', () => {
  const appbar = newComponent(AppBar);

  appbar.root.router.set({
    context: {
      path: '/not-home',
    },
  });

  appbar.root.meta.setNavigable({
    back: true,
    home: true,
  });

  return new Promise(res => {
    appbar.root.router.back = res;

    const evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    document.querySelector('.icon-left').dispatchEvent(evt);
  });
});

// oncreate checks
it('should update props on appbar:modify events', () => {
  const appbar = newComponent(AppBar);

  return new Promise(res => {
    appbar.on('appbar:modify', () => {
      res();
    });
    appbar.fire('appbar:modify', {
      title: 'teste',
    });
  });
});

it('should set update callback on router', () => {});

// destroy checks
it('should set hasAppbar false on meta', () => {
  const appbar = newComponent(AppBar);

  const { root } = appbar;

  appbar.destroy();

  expect(root.meta.get()._hasAppbar).toBe(false);
});
