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

const DefaultRowDecorator = {
  endFixture: {
    value: () => Icon,
    props: { symbol: 'chevron-right', color: neutral800 },
  },
  labelPrefix: {
    value: position => `${position}. `,
  },
};

const GetDefaultDecorator = itemData => {
  ACTIVE_MODEL = getPosModel();
  ACTIVE_MODEL_SLUG = getSlugModel(ACTIVE_MODEL);

  const labelData = itemData.label || {};
  const style = labelData.style || {};
  style.fontWeight = 'bold';

  return (
    {
      [MODELS.MP35P]: {
        label: {
          ...labelData,
          style,
          prefix: position => `${position}. `,
          prefixStyle: {
            color: '$green500',
          },
        },
      },
    }[ACTIVE_MODEL] || DefaultRowDecorator
  );
};

export {
  GetDefaultDecorator,
  DefaultRowDecorator,
  ACTIVE_MODEL,
  ACTIVE_MODEL_SLUG,
};
