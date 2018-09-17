import { State } from '../../simulator/libs/main.js';

export const NAMESPACE = '$Merchant';

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
    State.get('$MbMerchant.acquirerIssuedMerchantId');
}
