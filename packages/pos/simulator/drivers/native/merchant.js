import { Simulator } from '../../libs/main.js';

export const NAMESPACE = 'MbMerchant';

export const SETTINGS = {
  acquirerIssuedMerchantId: '123', // Stone code
};

export function setup(Merchant) {
  /**
   * Get the stone code
   * @memberof Merchant
   * @return {string} The stone code
   */
  Merchant.getStoneCode = () =>
    Simulator.get('MbMerchant.acquirerIssuedMerchantId');
}
