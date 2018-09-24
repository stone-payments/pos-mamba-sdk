# `@mamba/pos`

## Simulator

For `mamba apps` to be able to run on a common browser, you must simulate the real `POS` environment.

- Just the `import` is enough to create the simulated environment.

```js
/** Boot the Mamba simulator */
import '@mamba/pos/simulator/index.js';
```

- However, you can also initialize the `digital POS` component, which will be the container for your `mamba app` when running on a browser. A `store` must be passed to the component.

```js
import * as Simulator '@mamba/pos/simulator/index.js';
import store from './store.js';

/** Initialize the Simulator POS */
Simulator.getVirtualPOS(store);
```

It's **obligatory** to include the entry file which starts the simulator **before** the app.
