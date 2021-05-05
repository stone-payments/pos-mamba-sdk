import Icon from '@mamba/icon';
import { MODELS, getPosModel } from '@mamba/utils/index.js';
import { neutral800 } from '@mamba/styles/colors.js';

const _getModelSlug = currentModel => {
  let val = 'S920';
  Object.keys(MODELS).forEach(key => {
    if (currentModel === MODELS[key]) {
      val = key;
    }
  });
  return val;
};

let ACTIVE_MODEL = getPosModel();
let ACTIVE_MODEL_SLUG;
let DefaultRowDecorator = {};

const SetDefaultRowDecorator = ({ label }, overrides = {}) => {
  const defaultOptions = {
    prefix: position => `${position}. `,
    ...overrides,
  };

  DefaultRowDecorator = {
    endFixture: {
      value: () => Icon,
      props: { symbol: 'chevron-right', color: neutral800 },
    },
    label: {
      ...label,
      ...defaultOptions,
    },
  };
  return DefaultRowDecorator;
};

const GetDefaultDecorator = (rowProps, overrides) => {
  ACTIVE_MODEL = getPosModel();

  const defaultProps = rowProps || { label: {} };
  const labelData = (defaultProps && defaultProps.label) || {};

  return (
    {
      [MODELS.MP35P]: {
        small: true,
        highlight: true,
        label: {
          ...labelData,
          style: {
            ...labelData.style,
            fontWeight: '700',
          },
          prefix: position => `${position}. `,
          prefixStyle: {
            color: '$green500',
          },
        },
        ...overrides,
      },
    }[ACTIVE_MODEL] || SetDefaultRowDecorator(defaultProps, overrides)
  );
};

const getModelSlug = () => _getModelSlug(ACTIVE_MODEL);

export {
  GetDefaultDecorator,
  DefaultRowDecorator,
  ACTIVE_MODEL,
  ACTIVE_MODEL_SLUG,
  getModelSlug,
};
