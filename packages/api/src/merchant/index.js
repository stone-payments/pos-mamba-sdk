import mock from './mock.js';

const Merchant = window.MbMerchant || {};

if (process.env.APP_ENV !== 'pos') {
  mock(Merchant);
}

/** Nullify the original exposed reference */
window.MbMerchant = null;

export default Merchant;
