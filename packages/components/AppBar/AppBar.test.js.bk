import AppBar from './AppBar.html';

const { App, newComponent } = global;

it('should apply inline style', () => {
  newComponent(AppBar, {
    title: 'teste',
    textColor: 'blue',
    bgColor: 'red',
    border: false,
  });
  expect(document.querySelector('.appbar').style.color).toBe('blue');
  expect(document.querySelector('.appbar').style.backgroundColor).toBe('red');
  expect(document.querySelector('.appbar').style.borderBottom).toBe('');
});

it('should display back button when location is not home and backward navigation is enabled', () => {
  App.router.set({
    context: {
      path: '/not-home',
    },
  });

  App.meta.set({
    navigable: {
      home: true,
      back: true,
    },
  });

  newComponent(AppBar);
  console.log(App.refs.component.get());
  expect(document.querySelector('.icon-left')).not.toBeNull();
});

it('should not display back button', () => {});

it('should display title', () => {});

it('should not display title', () => {});

it('should display home button', () => {});

it('should not display home button', () => {});

it('should display home button when location is /', () => {});

it('should display app-home when location is not /', () => {});

it('should lock home navigation', () => {});

it('should lock back navigation', () => {});

it('should go home when home is clicked', () => {});

it('should go back when back is clicked', () => {});

// oncreate checks
it('should update props on appbar:modify events', () => {});

it('should set update callback on router', () => {});

// destroy checks
it('should set hasAppbar false on meta', () => {});

// onstate checks
it('should change document title to appbar title', () => {});
