export default function(driver) {
  driver.setItem = (key, value) => {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    driver.set(key, value);
    return true;
  };

  driver.getItem = key => {
    const value = driver.get(key) || null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  };
}
