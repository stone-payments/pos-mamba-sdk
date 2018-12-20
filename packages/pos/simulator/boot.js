import { DriverManager, System } from './plugins/index.js';

(async () => {
  const drivers = await Promise.all([
    import('../drivers/printer/simulation.js'),
    import('../drivers/app/simulation.js'),
    import('../drivers/storage/simulation.js'),
    import('../drivers/keyboard/simulation.js'),
    import('../drivers/merchant/simulation.js'),
    import('../drivers/payment/simulation.js'),
    import('../drivers/system/simulation.js'),
    import('../drivers/cancellation/simulation.js'),
    import('../drivers/http/simulation.js'),
    import('../drivers/card/simulation.js'),
  ]);

  DriverManager.attachDrivers(drivers);

  System.fire('boot');
})();
