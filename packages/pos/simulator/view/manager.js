import POSConstructor from './pos/POS.html';
import EventTarget from '../libs/EventTarget.js';
import extend from '../../extend.js';

import PrinterPanel from '../../drivers/printer/panel.html';
import HttpPanel from '../../drivers/http/panel.html';
import * as $Http from '../../drivers/http/simulation.js';
import * as $Printer from '../../drivers/printer/simulation.js';

const View = extend({}, EventTarget());

let POS;
let panels = {};

View.addPanel = (driver, panel) => {
  const namespace = driver.NAMESPACE;

  panels = {
    ...panels,
    [namespace]: { namespace, panel },
  };

  if (POS) {
    POS.refs.controlPanel.set({ panels });
  }
};
View.addPanel($Printer, PrinterPanel);
View.addPanel($Http, HttpPanel);

View.showPOS = () => {
  if (!POS) {
    POS = new POSConstructor({ target: document.body });
    POS.refs.controlPanel.set({ panels });
  }
  return POS;
};

export default View;
