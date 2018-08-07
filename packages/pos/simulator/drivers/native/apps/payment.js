import { Simulator } from '../../../main.js';

export const NAMESPACE = 'PaymentApp';

export const SIGNALS = [
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
];

export const SETTINGS = {
  amount: 0,
  cvv: undefined,
};

export function setup(PaymentApp) {
  PaymentApp.startCardDetectedFlow = () => {
    setTimeout(() => PaymentApp.insertAmount(), 1500);
  };

  PaymentApp.setAmount = amount => {
    setTimeout(() => {
      console.log('SET AMOUNT:', amount);
      Simulator.set('PaymentApp.amount', amount);
      PaymentApp.insertCvv();
    }, 1500);
  };

  PaymentApp.setCvv = cvv => {
    setTimeout(() => {
      console.log('SET CVV', cvv);
      Simulator.set('PaymentApp.cvv', cvv);
      PaymentApp.finished({ msg: 'yay' });
    }, 1500);
  };

  PaymentApp.selectTransactionType = index => {
    console.log('Transaction type:', index);
  };

  PaymentApp.setInstallmentTypeAndCount = installmentConfig => {
    console.dir(installmentConfig);
  };

  PaymentApp.abort = () => {
    console.log('Abort');
  };

  PaymentApp.readyForComplete = () => {
    console.log('Ready for complete');
  };
}
