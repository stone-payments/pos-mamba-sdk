import validateDates from '../utils/validateDate.js'
import consolidatedListReportData from './consolidatedReportList.json'
import detailedReportListData from './detailedReportList.json'

const config = {
  supportedBrands: ['VISA', 'MASTERCARD', 'ELO'],
  maxDetailedReportEntries: 30,
  retrieveTime: 1000,
}

let progress = {
  detailed: false,
  resume: false,
  consolidated: false,
}

function getSupportedBrands () {
  return config.supportedBrands
}

function getMaximumDetailedReportEntries () {
  return config.maxDetailedReportEntries
}

export default function (Transaction) {
  function getReportResume (from, to, callback) {
    if (validateDates(from, to, callback)) {
      if (typeof callback === 'function') {
        if (!progress.resume) {
          progress.resume = true

          setTimeout(function () {
            progress.resume = false

            callback.call(this, {
              totalApproved: 10,
              approvedValue: 10,
              approvedTransactionsNumber: 10,
              cancelledValue: undefined,
              cancelledTransactionsNumber: undefined,
              totalDebit: 100,
              totalCredit: 200,
              totalVoucher: 4000,
            })
          }, config.retrieveTime)
        } else {
          callback.call(this, undefined, new Error('Job already in progress'))
        }
      }
    }
  }

  function getDetailedReportList (from, to, callback) {
    if (validateDates(from, to, callback)) {
      if (typeof callback === 'function') {
        if (!progress.detailed) {
          progress.detailed = true

          setTimeout(_ => {
            progress.detailed = false

            callback.call(this, detailedReportListData)
          }, config.retrieveTime)
        } else {
          callback.call(this, undefined, new Error('Job already in progress'))
        }
      }
    }
  }

  function getConsolidatedReportList (from, to, callback) {
    if (validateDates(from, to, callback)) {
      if (typeof callback === 'function') {
        if (!progress.consolidated) {
          progress.consolidated = true

          setTimeout(_ => {
            progress.consolidated = false

            callback.call(this, consolidatedListReportData)
          }, config.retrieveTime)
        } else {
          callback.call(this, undefined, new Error('Job already in progress'))
        }
      }
    }
  }

  Object.assign(Transaction, {
    getSupportedBrands,
    getMaximumDetailedReportEntries,
    getReportResume,
    getDetailedReportList,
    getConsolidatedReportList,
  })
}
