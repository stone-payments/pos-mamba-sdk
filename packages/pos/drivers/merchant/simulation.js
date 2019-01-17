import { Registry } from '../../simulator/index.js';

export const NAMESPACE = '$Merchant';

export const PERSISTENT_SETTINGS = {
  stoneCode: '123123123',
};

export function setup(Merchant) {
  /**
   * Get the stone code
   * @memberof Merchant
   * @return {string} The stone code
   */
  Merchant.getStoneCode = () => Registry.persistent.get().$Merchant.stoneCode;

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
