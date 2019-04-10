import { name } from './package.json';
import TabPane from './TabPane.html';

const { newTestRoot } = global;

const root = newTestRoot();
let tabPane;

const newTabPane = (data, slots) =>
  root.createComponent(TabPane, { unique: true, data, slots });

describe(`${name}/TabPane.html`, () => {
  describe('rendering', () => {
    tabPane = newTabPane({});

    it('should be able to create a Svelte component', () => {
      expect(tabPane).not.toBe(undefined);
      expect(tabPane.constructor.name).toBe('SvelteComponent');
    });

    it('should render a proper tab pane', () => {
      expect(root.query('.tab-pane')).not.toBeNull();
    });

    it('should render the default slot', () => {
      const slotFragment = document.createDocumentFragment();
      const p = document.createElement('P');
      p.textContent = 'TabPane content';
      slotFragment.appendChild(p);

      tabPane = newTabPane({}, { default: slotFragment });

      expect(root.query('.tab-pane')).not.toBeNull();
      expect(root.query('.tab-pane').textContent).toBe('TabPane content');
      expect(root.query('.tab-pane').children.length).toBeGreaterThan(0);
      expect(root.query('.tab-pane').children[0]).toBe(p);
    });
  });

  describe('props', () => {
    tabPane = newTabPane({ title: 'title text' });

    it('should be hidden by default', () => {
      expect(root.query('.tab-pane').hidden).toBeTruthy();
    });

    it('should set the `title` prop', () => {
      tabPane = newTabPane({ title: 'title text' });
      expect(tabPane.get().title).toBe('title text');
    });
  });
});
