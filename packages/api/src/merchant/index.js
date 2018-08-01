import mock from './mock.js';

let { MbMerchant: Merchant } = window;

if (process.env.NODE_ENV !== 'production') {
  Merchant = window.MbMerchant = {};
  mock(Merchant);
}

/** Non-existent for n */
// if (process.env.NODE_ENV === 'production') {
// }

export default Merchant;
