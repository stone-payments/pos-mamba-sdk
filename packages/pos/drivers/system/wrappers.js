export default function(driver) {
  driver.changeAdapter = desiredAdapter => {
    desiredAdapter = desiredAdapter.toLowerCase();
    if (desiredAdapter === '3g') {
      desiredAdapter = 'mbb';
    }

    return driver.changeAdapterTo(desiredAdapter);
  };
}
