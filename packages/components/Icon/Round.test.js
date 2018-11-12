import Round from './Round.html';

const target = document.body;
let component;

const newInstance = data => {
  component = new Round({
    target,
    data,
  });
  return component;
};

describe('style', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should accept custom inline styles', () => {
    newInstance({
      bgColor: 'black',
      borderRadius: '50%',
    });

    const roundIcon = document.querySelector('.round-icon');

    expect(roundIcon.style.backgroundColor).toBe('black');
    expect(roundIcon.style.borderRadius).toBe('50%');
  });
});
