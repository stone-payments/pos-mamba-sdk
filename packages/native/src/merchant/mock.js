export default function(Merchant) {
  const SimulatedInfo = {
    acquirerIssuedMerchantId: '123', // stone code
  }

  /* Get the stone code
 * @memberof Merchant
 * @return {string} The stone code
 */
  function getStoneCode() {
    return SimulatedInfo.acquirerIssuedMerchantId
  }

  Object.assign(Merchant, {
    getStoneCode,
  })
}
