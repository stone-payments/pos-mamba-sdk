import ViewWrapper from './pos/Wrapper.html';
import EventTarget from '../libs/EventTarget.js';
import extend from '../../extend.js';

import PrinterPanel from '../../drivers/printer/panel.html';
import HttpPanel from '../../drivers/http/panel.html';
import * as $Http from '../../drivers/http/simulation.js';
import * as $Printer from '../../drivers/printer/simulation.js';

const View = extend({}, EventTarget());

let instance;
let panels = {};

View.addPanel = (driver, panel) => {
  const namespace = driver.NAMESPACE;

  panels = {
    ...panels,
    [namespace]: { namespace, panel },
  };

  if (instance) {
    instance.refs.controlPanel.set({ panels });
  }
};

View.addPanel($Printer, PrinterPanel);
View.addPanel($Http, HttpPanel);

View.show = () => {
  if (!instance) {
    instance = new ViewWrapper({ target: document.body });
    instance.refs.controlPanel.set({ panels });
  }
  return instance;
};

View.getInstance = () => instance;

export default View;
