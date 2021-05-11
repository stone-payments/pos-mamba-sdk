import System from '@mamba/pos/api/system.js';

/**
 * Checks if the method exists
 * @returns {String} return Pos Model.
 */
export const getPosModel = () => {
  const { getPosModel: SysGetModel } = System;
  if (typeof SysGetModel === 'function') {
    return SysGetModel();
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
  MP35P: 'GERTEC - MP35P',
  V240M: 'Verifone V240M',
};
