import Gif from '../src/gif'

describe('@mamba/native/Gif', () => {
  it('global Gif module should exist', () => {
    expect(window.Gif).toBeTruthy()
  })

  it('should have .show() method', () => {
    expect(Gif.show).toEqual(expect.any(Function))
  })

  it('should have .setPosition () method', () => {
    expect(Gif.setPosition).toEqual(expect.any(Function))
  })

  it('should have .hide() method', () => {
    expect(Gif.hide).toEqual(expect.any(Function))
  })

  it('should have .cache() method', () => {
    expect(Gif.cache).toEqual(expect.any(Function))
  })

  it('should have .get() method', () => {
    expect(Gif.get).toEqual(expect.any(Function))
  })
})
