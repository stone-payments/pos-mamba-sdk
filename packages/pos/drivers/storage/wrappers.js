export default function(driver) {
  const { get, set } = driver;

  /** Override the default set/get to facilitate dealing with data structures */
  driver.set = (key, value) => {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    set(key, value);
    return true;
  };

  driver.get = key => {
    const value = get(key) || '';
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  };
}
