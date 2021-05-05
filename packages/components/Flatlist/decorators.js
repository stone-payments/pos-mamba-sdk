import Icon from '@mamba/icon';
import { MODELS, getPosModel } from '@mamba/utils/index.js';
import { neutral800 } from '@mamba/styles/colors.js';

const getSlugModel = currentModel => {
  let val = 'S920';
  Object.keys(MODELS).forEach(key => {
    if (currentModel === MODELS[key]) {
      val = key;
    }
  });
  return val;
};

let ACTIVE_MODEL = getPosModel();
let ACTIVE_MODEL_SLUG = getSlugModel(ACTIVE_MODEL);
let DefaultRowDecorator = {};

const SetDefaultRowDecorator = ({ label }) => {
  DefaultRowDecorator = {
    endFixture: {
      value: () => Icon,
      props: { symbol: 'chevron-right', color: neutral800 },
    },
    label: {
      ...label,
      prefix: position => `${position}. `,
    },
  };
  return DefaultRowDecorator;
};

const GetDefaultDecorator = rowProps => {
  ACTIVE_MODEL = getPosModel();
  ACTIVE_MODEL_SLUG = getSlugModel(ACTIVE_MODEL);

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
      },
    }[ACTIVE_MODEL] || SetDefaultRowDecorator(defaultProps)
  );
};

export {
  GetDefaultDecorator,
  DefaultRowDecorator,
  ACTIVE_MODEL,
  ACTIVE_MODEL_SLUG,
};
