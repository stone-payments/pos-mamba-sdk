import POSConstructor from './view/POS.html';

let POS;

export const getView = () => {
  if (!POS) {
    POS = new POSConstructor({ target: document.body });
    window.MambaWeb.View = POS;
  }
  return POS;
};
