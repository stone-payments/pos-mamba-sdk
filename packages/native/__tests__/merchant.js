import Merchant from '../merchant'

describe('@mamba/native/Merchant', () => {
  it('global Merchant module should exist', () => {
    expect(window.MbMerchant).toBeTruthy()
  })

  it('should have .getInfo() method', () => {
    expect(Merchant.getInfo).toEqual(expect.any(Function))
  })

  it('should have .checkPassword () method', () => {
    expect(Merchant.checkPassword).toEqual(expect.any(Function))
  })

  it('should have .getStoneCode () method', () => {
    expect(Merchant.getStoneCode).toEqual(expect.any(Function))
  })
})
