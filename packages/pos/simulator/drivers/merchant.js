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
  taxationIdentificationType: 'CNPJ',
  taxationIdentificationNumber: '16.501.555/0001-57',
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
  Merchant.getSupportedBrands = () => ['VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'ELO', 'SODEXO'];

  Merchant.checkPassword = (password) =>
    password === Registry.persistent.get().$Merchant.adminPassword;

  Merchant.getInfo = () => {
    const {
      $Merchant: {
        street,
        number,
        complement,
        zipCode,
        city,
        state,
        country,
        stoneCode,
        displayName,
        taxationIdentificationNumber,
      },
    } = Registry.persistent.get();

    return {
      street,
      number,
      complement,
      zipCode,
      city,
      state,
      country,
      displayName,
      taxationIdentificationNumber,
      acquirerIssuedMerchantId: stoneCode,
    };
  };
}
