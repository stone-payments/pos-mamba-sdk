import ViewWrapper from './pos/Wrapper.svelte';
import EventTarget from '../libs/EventTarget.js';
import extend from '../../extend.js';

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

View.removeSimulatorPos = false;

View.forceRemovePos = () => {
  View.removeSimulatorPos = true;
};

View.resetRemovePos = () => {
  View.removeSimulatorPos = false;
};

View.addPanel = (panel) => {
  console.log('View.addPanel', panel);
  panelsToAdd.push(panel);
  if (instance) {
    updatePanels();
  }
};

View.show = () => {
  console.log('View.show');
  if (!instance) {
    instance = new ViewWrapper({
      target: document.body,
      props: { removeSimulatorPos: View.removeSimulatorPos },
    });

    if (panelsToAdd.length) {
      updatePanels();
    }
  }
  return instance;
};

View.getInstance = () => instance;
console.log('View');

export default View;
