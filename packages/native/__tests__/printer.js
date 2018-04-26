import Printer from '../printer'

const sampleEl = document.createElement('DIV')
sampleEl.innerHTML = '<h1>Sample Title</h1><p>Sample text</p>'

describe('@mamba/native/Printer', () => {
  it('global Printer module should exist', () => {
    expect(window.Printer).toBeTruthy()
  })

  it('should have .print() method', () => {
    expect(Printer.print).toEqual(expect.any(Function))
  })

  it('should have .getPaperWidth() getter method ', () => {
    expect(Printer.getPaperWidth).toEqual(expect.any(Function))
  })

  it('should have .isPrinting() method ', () => {
    expect(Printer.isPrinting).toEqual(expect.any(Function))
  })

  it('.isPrinting() should be false as default ', () => {
    const isPrinting = Printer.isPrinting()
    expect(isPrinting).toBe(false)
  })

  it('.isPrinting() should return "true" after a .print() and "false" after it\'s done', done => {
    Printer.print(sampleEl)

    expect(Printer.isPrinting()).toBe(true)

    setTimeout(() => {
      expect(Printer.isPrinting()).toBe(false)
      done()
    }, Printer.SimulatedConfig.printing_time * 2)
  })
})
