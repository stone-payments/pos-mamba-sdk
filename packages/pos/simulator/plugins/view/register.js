import Core from '../../core.js';
import POS from './POS.html';

/** Mamba Web simulator pos/hardware instance */
Core.getVirtualPOS = () => {
  if (!Core.POS) {
    Core.POS = new POS({ target: document.body });
  }
  return Core.POS;
};
