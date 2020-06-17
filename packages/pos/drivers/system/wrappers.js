export default function(driver) {
  driver.changeAdapter = desiredAdapter => {
    desiredAdapter = desiredAdapter.toLowerCase();
    if (desiredAdapter === '3g') {
      desiredAdapter = 'mbb';
    }

    return driver.changeAdapterTo(desiredAdapter);
  };

  driver.activateStonecode = stonecode => {
    return new Promise((resolve, reject) => {
      if (typeof driver.activateStoneCode === 'function') {
        driver.race([
          [
            'success',
            () => {
              resolve(true);
            },
          ],
          [
            'failure',
            error => {
              reject(new Error(error));
            },
          ],
        ]);
        driver.activateStoneCode(stonecode);
      } else {
        reject(new Error('Método não suportado para esta versão do kernel.'));
      }
    });
  };
}
