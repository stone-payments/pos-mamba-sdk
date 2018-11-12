import Icon from './Icon.html';

const target = document.body;
let icon;

const newInstance = data => {
  icon = new Icon({
    target,
    data,
  });
  return icon;
};

describe('style', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should accept custom inline styles', () => {
    newInstance({
      color: 'black',
      width: '10px',
      height: '10px',
    });

    expect(icon.refs.icon.style.width).toBe('10px');
    expect(icon.refs.icon.style.height).toBe('10px');
    expect(icon.refs.icon.style.backgroundColor).toBe('black');
  });
});
