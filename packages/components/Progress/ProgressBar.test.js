import ProgressBar from './ProgressBar.html';

const wrapper = document.body;
let testable;

const newTestable = data => {
  testable = new ProgressBar({
    target: wrapper,
    data,
  });
  return testable;
};

const getComputedStyle = component => window.getComputedStyle(component);

describe('ProgressBar', () => {
  afterEach(() => {
    wrapper.innerHTML = '';
  });

  it('should create the default component', () => {
    newTestable();
    // This ensures the HTML, `progress-bar` and `svelte-[uniqueid]` classes to match this snapshot
    // Any change in ProgressBar style need regenerate snapshot
    expect(wrapper.children[0]).toMatchSnapshot();
    expect(wrapper.children[0].classList.contains('progress-bar')).toBeTruthy();
    expect(wrapper.querySelector('.progress-bar.is-infinite')).not.toBeNull();
  });

  it('should render bar with color', () => {
    newTestable({ color: 'red' });
    expect(wrapper.children[0]).not.toBeUndefined();
    expect(wrapper.children[0].style.backgroundColor).toStrictEqual('red');
  });

  it('should render bar with height', () => {
    newTestable({ height: '12px' });
    expect(wrapper.children[0].style.height).toStrictEqual('12px');
  });

  it('should set bar progress', () => {
    newTestable({ progress: '85' });
    expect(
      wrapper.querySelector('.progress-bar').children[0].style.width,
    ).toStrictEqual('85%');
  });

  it('should match all params', () => {
    newTestable({ progress: '30', height: '2px', color: 'blue' });
    expect(wrapper.children[0]).not.toBeUndefined();
    const component = wrapper.querySelector('.progress-bar');
    expect(component).not.toBeUndefined();
    expect(component.children[0].style.width).toStrictEqual('30%');
    expect(component.style.height).toStrictEqual('2px');
    expect(component.style.backgroundColor).toStrictEqual('blue');
  });

  it('infinite progress bar animation should end at 100%', () => {
    newTestable();
    const component = wrapper.querySelector('.progress-bar.is-infinite');
    component.dispatchEvent(new Event('animationend'));
    expect(component).not.toBeUndefined();
    expect(getComputedStyle(component.children[0]).transform).toStrictEqual(
      'translateX(-100%)',
    );
  });

  it('infinite progress bar animation should start at -100%', () => {
    newTestable();
    const component = wrapper.querySelector('.progress-bar.is-infinite');
    component.dispatchEvent(new Event('animationstart'));
    expect(component).not.toBeUndefined();
    expect(getComputedStyle(component.children[0]).transform).toStrictEqual(
      'translateX(-100%)',
    );
  });

  it('infinite progress bar width should have less than 100%', () => {
    newTestable();
    const component = wrapper.querySelector('.progress-bar.is-infinite');
    expect(component).not.toBeUndefined();
    expect(getComputedStyle(component.children[0]).width).not.toEqual('100%');
  });
});
