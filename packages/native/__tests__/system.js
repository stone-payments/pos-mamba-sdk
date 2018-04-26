import System from '../system'

describe('@mamba/native/System', () => {
  it('global System module should exist', () => {
    expect(window.System).toBeTruthy()
  })

  it('should export a .beep() method', () => {
    expect(System.beep).toEqual(expect.any(Function))
  })

  it('should export a .hasEthernet() method', () => {
    expect(System.hasEthernet).toEqual(expect.any(Function))
  })

  it('should export a .hasWifi() method', () => {
    expect(System.hasWifi).toEqual(expect.any(Function))
  })

  it('should export a .hasGprs() method', () => {
    expect(System.hasGprs).toEqual(expect.any(Function))
  })

  it('should export a .isBatteryPresent() method', () => {
    expect(System.isBatteryPresent).toEqual(expect.any(Function))
  })

  it('should export a .getPowerSupply() method', () => {
    expect(System.getPowerSupply).toEqual(expect.any(Function))
  })

  it('should export a .getTimeFromBoot() method', () => {
    expect(System.getTimeFromBoot).toEqual(expect.any(Function))
  })

  it('should export a .getSerialNumber() method', () => {
    expect(System.getSerialNumber).toEqual(expect.any(Function))
  })

  it('should export a .getBatteryStatus() method', () => {
    expect(System.getBatteryStatus).toEqual(expect.any(Function))
  })

  it('should export a .getBatteryLevel() method', () => {
    expect(System.getBatteryLevel).toEqual(expect.any(Function))
  })
})
