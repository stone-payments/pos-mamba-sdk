import { name } from './package.json';
import Tabs from './Tabs.html';
import TabPane from './TabPane.html';

const { newTestRoot } = global;

const root = newTestRoot();
let tabs;

const newTabs = (data, slots) => root.createComponent(Tabs, { data, slots });
const newTabPane = data => root.createComponent(TabPane, { data });

const slotFragment = document.createDocumentFragment();

['Tab 1', 'Tab 2', 'Tab 3', 'undefined'].forEach(item =>
  newTabPane({ label: item })._mount(slotFragment),
);

describe(`${name}/Tab.html`, () => {
  describe('navigation', () => {
    tabs = newTabs({}, { default: slotFragment });

    it('should render tabs navigation', () => {
      expect(tabs.refs.navigation).not.toBeNull();
    });

    it('should render a single tabs container wrapper', () => {
      expect(
        root
          .query('.tabs')
          .lastElementChild.classList.contains('tabs-paine-container'),
      ).toBeTruthy();
      expect(
        root.query('.tabs').querySelectorAll('div.tabs-paine-container'),
      ).toHaveLength(1);
    });

    it('should not render tab with undefined label', () => {
      // TabPane title is undefined when not set
      const result = Array.from(root.queryAll('td')).filter(
        elm => elm.textContent.trim() === 'undefined',
      );

      expect(result).toHaveLength(0);
    });

    describe('rendering', () => {
      it('should be able to create a Svelte component', () => {
        expect(tabs).not.toBe(undefined);
        expect(tabs.constructor.name).toBe('SvelteComponent');
      });
    });
  });

  describe('props', () => {
    it('should have index prop defined to 0(start)', () => {
      expect(tabs.get().index).toBe(0);
    });

    it('should have _lastIndex prop defined to 0(start)', () => {
      expect(tabs.get()._lastIndex).toBe(0);
    });

    it('should have _tabs prop', () => {
      expect(tabs.get()._tabs).not.toBe(undefined);
    });

    it('should accept initial index', () => {
      tabs.set({ index: 2 });
      expect(tabs.get().index).toBe(2);
    });

    it('should able to hidden last visible tab', () => {
      tabs.set({ index: 1, _lastIndex: 2 });
      expect(tabs.get()._tabs[1].hidden).toBe(false);
    });

    it('on:change prop is fired with the selected tab index and last index', () => {
      const spy = jest.fn();
      tabs.on('change', spy);
      tabs.set({ index: 0 });
      expect(spy).toHaveBeenCalledWith({ _lastIndex: 1, index: 0 });
    });

    it('should not able to set index greater than tabs quantity', () => {
      tabs.set({ index: 10 });
      expect(tabs.get().index).toBe(tabs.get()._tabs.length - 1);
    });

    it('should not able to set index less than zero', () => {
      tabs.set({ index: -10 });
      expect(tabs.get().index).toBe(0);
    });

    it('should not able to change index if no tabs', () => {
      tabs = newTabs({ index: 9 });
      expect(tabs.get().index).toBe(9);
    });

    it('should not able to render tab navigation if no tabs panes', () => {
      root.target.innerHTML = '';
      tabs = newTabs();
      expect(root.query('.tabs .tab-navigation')).toBeNull();
    });
  });
});
