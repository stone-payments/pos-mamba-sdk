export default function(driver) {
  driver.setItem = (key, value, idAppStorage = -1) => {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    driver.set(key, value, idAppStorage);
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
