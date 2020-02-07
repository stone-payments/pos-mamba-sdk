export default function(driver) {
  driver.setItem = (key, value) => {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    driver.set(key, value);
    return true;
  };

  driver.getItem = (key, idAppStorage = -1) => {
    const value = driver.get(key, idAppStorage) || null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  };
}
