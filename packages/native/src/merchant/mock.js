const MockConfig = {
  acquirerIssuedMerchantId: '123', // stone code
}

export default function(Merchant) {
  /**
   * Get the stone code
   * @memberof Merchant
   * @return {string} The stone code
   */

  function getStoneCode() {
    return MockConfig.acquirerIssuedMerchantId
  }

  Object.assign(Merchant, {
    getStoneCode,
  })
}
