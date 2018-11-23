import Round from './Round.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newRoundIcon = data => root.createComponent(Round, { data });

describe('style', () => {
  it('should accept custom inline styles', () => {
    newRoundIcon({
      bgColor: 'black',
      borderRadius: '50%',
    });

    const roundIcon = document.querySelector('.round-icon');

    expect(roundIcon.style.backgroundColor).toBe('black');
    expect(roundIcon.style.borderRadius).toBe('50%');
  });
});
