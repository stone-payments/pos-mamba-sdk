export default function (Merchant) {
  const SimulatedInfo = {
    street: 'Potato street',
    number: '42',
    complement: 'Ketchup',
    neighborhood: 'Happy potato neighborhood',
    zipCode: '123456',
    city: 'Fried city',
    state: 'Junk food state',
    country: 'The coolest country',
    acquirerIssuedMerchantId: '123', // stone code
    displayName: 'French potato',
    taxationIdentificationType: 'CPF', // CNPF or CNPJ
    taxationIdentificationNumber: '098.765.432-10',
    saleAffiliationKey: '123456789',
  }

  const adminPassword = '0000'

  /**
   * Get the merchant info
   * @memberof Merchant
   * @return {object} An object containing the merchant info
   */
  function getInfo () {
    return SimulatedInfo
  }

  /**
   * Check if the password matches the admin password
   * @param {string} password The password to match
   * @returns True if the password matches the admin password, false otherwise
   */
  function checkPassword (password) {
    return password === adminPassword
  }

  /* Get the stone code
 * @memberof Merchant
 * @return {string} The stone code
 */
  function getStoneCode () {
    return SimulatedInfo.acquirerIssuedMerchantId
  }

  Object.assign(Merchant, {
    getInfo,
    checkPassword,
    getStoneCode,
  })
}
