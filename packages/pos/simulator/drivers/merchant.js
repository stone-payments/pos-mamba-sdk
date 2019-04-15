import { Registry } from '../index.js';

export const NAMESPACE = '$Merchant';

export const PERSISTENT_SETTINGS = {
  stoneCode: '123123123',
  adminPassword: '1234',
  zipCode: '20040901',
  country: 'Brasil',
  city: 'Rio de Janeiro',
  state: 'Rio de Janeiro',
  neighborhood: 'Centro',
  complement: 'Edifício Central',
  street: 'Avenida Rio Branco',
  number: '131',
  displayName: 'Stoninho',
  taxationIdentificationNumber: '8651',
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

  Merchant.checkPassword = password =>
    password === Registry.persistent.get().$Merchant.adminPassword;

  Merchant.getInfo = () => {
    return {
      street: Registry.persistent.get().$Merchant.street,
      number: Registry.persistent.get().$Merchant.number,
      complement: Registry.persistent.get().$Merchant.complement,
      zipCode: Registry.persistent.get().$Merchant.zipCode,
      city: Registry.persistent.get().$Merchant.city,
      state: Registry.persistent.get().$Merchant.state,
      country: Registry.persistent.get().$Merchant.country,
      acquirerIssuedMerchantId: Registry.persistent.get().$Merchant.stoneCode,
      displayName: Registry.persistent.get().$Merchant.displayName,
      taxationIdentificationNumber: Registry.persistent.get().$Merchant
        .taxationIdentificationNumber,
    };
  };
}
