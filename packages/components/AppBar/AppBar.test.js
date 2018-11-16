import AppBar from './AppBar.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }
  component = new AppBar({ target, data });
  return component;
};

// mocks helpers
const mockRouter = () => {
    if(component) {
        component.root.router {
            go(res) {
                res();
            },
            back(res) {
                res();
            },
            on(state, cb) {
                this[state] = cb;
            }
        };
    }
};

const mockMeta = metaObj => {
    if (component) {
      component.root.meta = {
        set(o) {
          metaObj = { ...metaObj, ...o };
        },
        get() {
          return metaObj;
        },
        on(state, cb) {
            this[state] = cb;
        }
      };
    }
  }
};

it('should apply inline style', () => {
    newInstance({
        title: undefined,
        textColor: 'blue',
        bgColor: 'red',
        border: false
    });
    expect(document.querySelector('.appbar').style.textColor).toBe('blue');
    expect(document.querySelector('.appbar').style.backgroundColor).toBe('red');
    expect(document.querySelector('.appbar').style.borderBottom).toBeNull();
});

it('should display back button', () => {

});

it('should not display back button', () => {

});

it('should display title', () => {

});

it('should not display title', () => {

});

it('should display home button', () => {

});

it('should not display home button', () => {

});

it('should display home button when location is /', () => {

});

it('should display app-home when location is not /', () => {

});

it('should lock home navigation', () => {

});

it('should lock back navigation', () => {

});

it('should go home when home is clicked', () => {

});

it('should go back when back is clicked', () => {

});

// oncreate checks
it('should update props on appbar:modify events', () => {

});

it('should set update callback on router', () => {

});

// destroy checks
it('should set hasAppbar false on meta', () => {

});

// onstate checks
it('should change document title to appbar title', () => {

});

