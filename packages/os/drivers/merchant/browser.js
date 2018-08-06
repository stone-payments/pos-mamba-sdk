export default function setup(Merchant) {
  const config = {
    acquirerIssuedMerchantId: '123', // Stone code
  };

  /**
   * Get the stone code
   * @memberof Merchant
   * @return {string} The stone code
   */
  Merchant.getStoneCode = () => config.acquirerIssuedMerchantId;
}
