import StatusBar from '../statusbar'

describe('@mamba/native/StatusBar', () => {
  it('global StatusBar module should exist', () => {
    expect(window.StatusBar).toBeTruthy()
  })

  it('should have .hideStatusBarDevelopmentOnly() method', () => {
    expect(StatusBar.hideStatusBarDevelopmentOnly).toEqual(expect.any(Function))
  })

  it('should have .setBackgroundColor() method', () => {
    expect(StatusBar.setBackgroundColor).toEqual(expect.any(Function))
  })

  it('should have .getBackgroundColor() method', () => {
    expect(StatusBar.getBackgroundColor).toEqual(expect.any(Function))
  })
})
