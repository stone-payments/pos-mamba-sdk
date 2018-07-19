import Payment from '../payment.js';

describe('@mamba/native/Payment', () => {
  it('global Payment module should exist', () => {
    expect(window.Payment).toBeTruthy();
  });

  it('should have .pay() method', () => {
    expect(Payment.pay).toEqual(expect.any(Function));
  });

  it('should have .isPaying() method', () => {
    expect(Payment.isPaying).toEqual(expect.any(Function));
  });

  it('should have .failedPaying() method', () => {
    expect(Payment.failedPaying).toEqual(expect.any(Function));
  });

  it('should have .enableCardEvent() method', () => {
    expect(Payment.enableCardEvent).toEqual(expect.any(Function));
  });

  it('should have .disableCardEvent() method', () => {
    expect(Payment.disableCardEvent).toEqual(expect.any(Function));
  });

  it('should have .getCardHolderName() method', () => {
    expect(Payment.getCardHolderName).toEqual(expect.any(Function));
  });

  it('should have .getAtk() method', () => {
    expect(Payment.getAtk).toEqual(expect.any(Function));
  });

  it('should have .getAuthorizationDateTime() method', () => {
    expect(Payment.getAuthorizationDateTime).toEqual(expect.any(Function));
  });

  it('should have .getBrand() method', () => {
    expect(Payment.getBrand).toEqual(expect.any(Function));
  });

  it('should have .getOrderId() method', () => {
    expect(Payment.getOrderId).toEqual(expect.any(Function));
  });

  it('should have .getAuthorizationCode() method', () => {
    expect(Payment.getAuthorizationCode).toEqual(expect.any(Function));
  });

  it('should have .getInstallmentCount() method', () => {
    expect(Payment.getInstallmentCount).toEqual(expect.any(Function));
  });
});
