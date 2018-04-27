export default function (Transaction) {
  Transaction.TransactionStatusCodes = Object.freeze({
    PENDING_REVERSAL_BY_TECHNICAL_ERROR: -3,
    PENDING_REVERSAL: -2, // if the authorizer approved, but the card did not
    PENDING: -1,
    UNKNOWN: 0,
    APPROVED: 1,
    CANCELLED_BY_THE_USER: 2,
    CANCELLED_IN_REVISION_PROCESS: 3, // for example, if the card did not approved the transaction
    CANCELLED_AUTOMATICALLY: 4, // in case of no connection or timeout
    FALLBACK_APPROVED: 5,
    FALLBACK_CANCELLED_BY_THE_USER: 6,
    FALLBACK_CANCELLED_AUTOMATICALLY: 7,
    FALLBACK_CANCELLED_IN_REVISION_PROCESS: 8,
  })
}
