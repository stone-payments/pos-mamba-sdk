import Icon from './Icon.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }
  component = new Icon({ target, data });
  return component;
};

describe('style', () => {
  it('should accept custom inline styles', () => {
    newInstance({
      color: 'black',
      width: '10px',
      height: '10px',
    });

    expect(component.refs.icon.style.width).toBe('10px');
    expect(component.refs.icon.style.height).toBe('10px');
    expect(component.refs.icon.style.backgroundColor).toBe('black');
  });
});
