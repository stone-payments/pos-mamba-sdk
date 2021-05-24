const ThisStore = {
  _storedModel: undefined,
};

/**
 * All models available
 * @returns {Object} All models.
 */
export const MODELS = Object.freeze({
  S920: 'S920',
  Q92: 'Q92',
  MP35P: 'Gertec MP35P',
  MP35: 'Gertec MP35',
  V240M: 'Verifone V240M',
  D195: 'D195',
  Q60: 'Q60',
});

/**
 * Default mamba model
 * @returns {string} Default mamba model.
 */
export const DEFAULT_MODEL = MODELS.S920;

/**
 * Checks if the method exists
 * @returns {String} return Pos Model.
 */
export const MODELS_SLUGS = Object.keys(MODELS);

/**
 * Checks if the method exists
 * @returns {String} return Pos Model available slugs.
 */
export const AVAILABLE_SLUGS = MODELS_SLUGS.reduce((result, model) => {
  result[MODELS[model]] = model;
  return result;
}, {});

/**
 * Checks if the method exists
 * @returns {String} return Pos Model.
 */
export const getPosModel = () => {
  /* Necessary because the circular dependency with simulator */
  if (window.$System && typeof window.$System.getPosModel !== 'function') {
    return DEFAULT_MODEL;
  }
  const { _storedModel } = ThisStore;
  if (typeof _storedModel === 'string') {
    return _storedModel;
  }

  ThisStore._storedModel = window.$System.getPosModel();
  return ThisStore._storedModel;
};

/**
 * Get POS model slug
 * @returns {String} return Pos Model Slug.
 */
export const getPosModelSlug = currentModel => {
  let activeModel = currentModel;
  if (!activeModel) {
    activeModel = getPosModel();
  }
  return AVAILABLE_SLUGS[activeModel] || DEFAULT_MODEL;
};
