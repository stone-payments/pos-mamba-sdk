import App from '../app'

describe('@mamba/native/App', () => {
  it('global App module should exist', () => {
    expect(window.App).toBeTruthy()
  })

  it('should have .close() method', () => {
    expect(App.close).toEqual(expect.any(Function))
  })

  it('should have .getAppKey() method', () => {
    expect(App.getAppKey).toEqual(expect.any(Function))
  })

  it('should have .getProxyURL() method', () => {
    expect(App.getProxyURL).toEqual(expect.any(Function))
  })

  it('should have .isRunningOnDevice() method', () => {
    expect(App.isRunningOnDevice).toEqual(expect.any(Function))
  })

  it('should have .isProxyEnabled() method', () => {
    expect(App.isProxyEnabled).toEqual(expect.any(Function))
  })
})
