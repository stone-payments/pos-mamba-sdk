import Simulator from '../../api.js';

const DEFAULT_SETTINGS = {
  acquirerIssuedMerchantId: '123', // Stone code
};

export default function setup(Merchant) {
  Simulator.set('merchant', DEFAULT_SETTINGS);

  /**
   * Get the stone code
   * @memberof Merchant
   * @return {string} The stone code
   */
  Merchant.getStoneCode = () =>
    Simulator.get('merchant.acquirerIssuedMerchantId');
}
