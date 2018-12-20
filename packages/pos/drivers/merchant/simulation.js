import { Registry } from '../../simulator/index.js';

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
    Registry.get().$Merchant.acquirerIssuedMerchantId;

  /**
   * Get the supported brands of this Merchant
   * @memberof Merchant
   * @return {array} Array of supported brands
   */
  Merchant.getSupportedBrands = () => [
    'VISA',
    'MASTERCARD',
    'AMERICAN EXPRESS',
    'ELO',
    'SODEXO',
  ];
}
