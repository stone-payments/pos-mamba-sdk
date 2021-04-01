import System from '@mamba/pos/api/system.js';

/**
 * Checks if the method exists
 * @returns {String} return Pos Model.
 */
 export const _getPosModel = (feature) => {
  const { getPosModel } = System;
  if (typeof getPosModel === 'function') {
    return getPosModel();
  }
  return 'S920';
};

/**
 * All models available
 * @returns {Object} All models.
 */
export const MODELS = {
  S920: 'S920',
  Q92: 'Q92',
  MP35P: 'MP35P',
  V240M: 'V240M'
};
