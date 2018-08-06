import Signal from '../../../signal.js';

export default function(Payment) {
  Signal.register(Payment, [
    'detectEntryMode',
    'selectTransactionType', // Receives a (QVariantList transactionTypes);
    'insertAmount',
    'insertInstallmentTypeAndCount',
    'prepareForPassword',
    'askConfirmation',
    'success',
    'insertCvv',
    'coreException', // Receives a (int error);
    'onlineException', // Receives a (OnlineProcessor::Error error);
    'authorizationError',
    'finished',
  ]);

  const config = {
    amount: 0,
    cvv: undefined,
  };

  Payment.startCardDetectedFlow = () => {
    setTimeout(() => Payment.insertAmount(), 1500);
  };

  Payment.setAmount = amount => {
    setTimeout(() => {
      console.log('SET AMOUNT:', amount);
      config.amount = amount;
      Payment.insertCvv();
    }, 1500);
  };

  Payment.setCvv = cvv => {
    setTimeout(() => {
      console.log('SET CVV', cvv);
      config.cvv = cvv;
      Payment.finished({ msg: 'yay' });
    }, 1500);
  };

  Payment.selectTransactionType = index => {
    console.log('Transaction type:', index);
  };

  Payment.setInstallmentTypeAndCount = installmentConfig => {
    console.dir(installmentConfig);
  };

  Payment.abort = () => {
    console.log('Abort');
  };

  Payment.readyForComplete = () => {
    console.log('Ready for complete');
  };
}
