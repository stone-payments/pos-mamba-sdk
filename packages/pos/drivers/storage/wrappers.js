export default function(driver) {
  driver.setItem = (key, value) => {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }

    try {
      return driver.set(key, value);
    } catch (error) {
      if (__DEV__ || __DEBUG_LVL__ >= 3) {
        console.log(error);
      }

      return false;
    }
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
