export default function(driver) {
  driver.changeAdapter = desiredAdapter => {
    if (desiredAdapter.toUpperCase() === '3G') desiredAdapter = 'mbb';
    return driver.changeAdapterTo(desiredAdapter);
  };
}
