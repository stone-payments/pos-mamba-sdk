import Icon from './Icon.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newIcon = data => root.createComponent(Icon, { data });

let icon;

describe('style', () => {
  it('should accept custom inline styles', () => {
    icon = newIcon({
      color: 'black',
      width: '10px',
      height: '10px',
    });

    expect(icon.refs.icon.style.width).toBe('10px');
    expect(icon.refs.icon.style.height).toBe('10px');
    expect(icon.refs.icon.style.color).toBe('black');
  });
});
