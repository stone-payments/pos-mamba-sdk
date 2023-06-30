/** Used to extend a driver with the base driver */
export default function (o, ...modifiers) {
  for (let i = modifiers.length; i--; ) {
    const modifier = modifiers[i];
    if (typeof modifier === 'function') {
      modifiers[i](o);
    } else {
      Object.assign(o, modifier);
    }
  }

  return o;
}
