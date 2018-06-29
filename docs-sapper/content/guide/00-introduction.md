---
title: Introduction
---

### What is MAMBA?

Mamba is a system and framework developed within Stone specifically for POS (Point of Sale)!
With it you can use web programming to develop applications using web technologies, according to the client's needs.


```js
/* { filename: 'main.js' } */
import App from './App.html';

const app = new App({
	target: document.querySelector('main'),
	data: { name: 'world' }
});

// change the data associated with the template
app.set({ name: 'everybody' });

// detach the component and clean everything up
app.destroy();
```
