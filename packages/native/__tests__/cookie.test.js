import Cookie from '../cookie.js';

describe('@mambasdk/native/Cookie', () => {
  it('global Cookie module should exist', () => {
    expect(window.MbCookie).toBeTruthy();
  });

  it('should have .get() method', () => {
    expect(Cookie.get).toEqual(expect.any(Function));
  });

  it('should have .set() method', () => {
    expect(Cookie.set).toEqual(expect.any(Function));
  });

  it('should have .clear() method', () => {
    expect(Cookie.clear).toEqual(expect.any(Function));
  });
});
