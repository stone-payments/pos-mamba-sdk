/* eslint-disable no-restricted-syntax */

/**
 * Bind all methods in a given class
 */
export function bindMethods(myClass: any, instance: any) {
  // eslint-disable-next-line no-unused-vars
  for (const myMethod of Object.getOwnPropertyNames(myClass.prototype)) {
    const excludeMethod = myMethod === 'constructor' || myMethod === 'bindMethods';
    if (!excludeMethod) {
      instance[myMethod] = instance[myMethod].bind(instance);
    }
  }
}
