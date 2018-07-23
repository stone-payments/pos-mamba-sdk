import Transaction from '../src/transaction'

describe('@mamba/native/Transaction', () => {
  it('global Transaction module should exist', () => {
    expect(window.MbTransaction).toBeTruthy()
  })

  it('should have .getSupportedBrands() method', () => {
    expect(Transaction.getSupportedBrands).toEqual(expect.any(Function))
  })

  it('should have .getMaximumDetailedReportEntries() method', () => {
    expect(Transaction.getMaximumDetailedReportEntries).toEqual(
      expect.any(Function),
    )
  })

  it('should have .getReportResume() method', () => {
    expect(Transaction.getReportResume).toEqual(expect.any(Function))
  })

  it('should have .getDetailedReportList() method', () => {
    expect(Transaction.getDetailedReportList).toEqual(expect.any(Function))
  })

  it('should have .getConsolidatedReportList() method', () => {
    expect(Transaction.getConsolidatedReportList).toEqual(expect.any(Function))
  })
})
