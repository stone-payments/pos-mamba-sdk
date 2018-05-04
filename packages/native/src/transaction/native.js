import validateDates from '../utils/validateDate.js'

import { link } from '../utils/bridge'

export default function(Transaction) {
  link({
    name: 'getReportResume',
    signal: Transaction.reportResumeDone,
    realFunction: Transaction.doGetReportResume,
    validateFunction: validateDates,
    failedProcessingFunction: Transaction.getFailedReportResume,
    getDataFunction: Transaction.getLastReportResume,
    errorMessage: 'Failed to retrieve transactions',
    progressErrorMessage:
      'An error has occurred. Wait a few seconds and try again',
    injectedObject: Transaction,
  })
  link({
    name: 'getConsolidatedReportList',
    signal: Transaction.consolidatedReportDone,
    realFunction: Transaction.doGetConsolidatedReportList,
    validateFunction: validateDates,
    failedProcessingFunction: Transaction.getFailedConsolidatedReport,
    getDataFunction: Transaction.getLastConsolidatedReportList,
    errorMessage: 'Failed to retrieve transactions',
    progressErrorMessage:
      'An error has occurred. Wait a few seconds and try again',
    injectedObject: Transaction,
  })
  link({
    name: 'getDetailedReportList',
    signal: Transaction.detailedReportDone,
    realFunction: Transaction.doGetDetailedReportList,
    validateFunction: validateDates,
    failedProcessingFunction: Transaction.getFailedDetailedReport,
    getDataFunction: Transaction.getLastDetailedReportList,
    errorMessage: 'Failed to retrieve transactions',
    progressErrorMessage:
      'An error has occurred. Wait a few seconds and try again',
    injectedObject: Transaction,
  })
}
