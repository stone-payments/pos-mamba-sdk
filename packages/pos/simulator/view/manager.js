import ViewWrapper from './pos/Wrapper.html';
import EventTarget from '../libs/EventTarget.js';
import extend from '../../extend.js';
import { Registry } from '../index.js';
const { device } = Registry.persistent.get().$Device;

const View = extend({}, EventTarget());

let instance;
let panelsToAdd = [];

const updatePanels = () => {
  const { panels } = instance.refs.controlPanel.get();

  instance.refs.controlPanel.set({
    panels: [...panels, ...panelsToAdd],
  });

  panelsToAdd = [];
};

View.addPanel = panel => {
  panelsToAdd.push(panel);
  if (instance) {
    updatePanels();
  }
};

View.show = () => {
  if (!instance) {
    instance = new ViewWrapper({ target: document.body });

    if (panelsToAdd.length) {
      updatePanels();
    }
  }
  return instance;
};

View.getInstance = () => instance;

export default View;
