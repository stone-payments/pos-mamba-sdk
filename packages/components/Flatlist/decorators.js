import Icon from '@mamba/icon';
import { MODELS, getPosModelSlug, getPosModel } from '@mamba/utils/index.js';
import { neutral800 } from '@mamba/styles/colors.js';
import deepMerge from './utils/deepMerge.js';

let ACTIVE_MODEL = getPosModel();
let ACTIVE_MODEL_SLUG;
let DefaultRowDecorator = {};

const SEPARATORS = {
  MP35P: '. ',
  DEFAULT: ' - ',
};

const withPosPrefixSeparator = separator => position => {
  return (position && `${position}${separator}`) || '';
};

const getPrefixOverride = (
  overrides = {},
  _default = {},
  separator = SEPARATORS.DEFAULT,
) => {
  const keys = Object.getOwnPropertyNames(overrides);
  const hasPrefix = keys.indexOf('prefix') !== -1;
  const hasPrefixStyle = keys.indexOf('prefixStyle') !== -1;
  const _defaultStyle = _default.prefixStyle || undefined;
  return {
    prefix: hasPrefix ? overrides.prefix : withPosPrefixSeparator(separator),
    prefixStyle: hasPrefixStyle ? overrides.prefixStyle : _defaultStyle,
  };
};

const ALIGN_TOP = {
  start: '-5px',
  center: '50%',
  end: '100%',
};

const TRANSLATE_TOP = {
  start: '0',
  center: '-50%',
  end: '-100%',
};

const chevronFixture = (incomingProps = {}, overrides = {}) => {
  const top = ALIGN_TOP[incomingProps.align || overrides.align || 'start'];
  const transform = `translateY(${
    TRANSLATE_TOP[incomingProps.align || overrides.align || 'start']
  });`;

  return {
    value: () => Icon,
    props: { symbol: 'chevron-right', color: neutral800 },
    contentStyle: {
      position: 'absolute',
      right: '5px',
      top,
      transform,
    },
  };
};

export const SetDefaultRowDecorator = (incomingProps = {}, overrides = {}) => {
  DefaultRowDecorator = deepMerge(incomingProps, {
    endFixture: chevronFixture(incomingProps, overrides),
    label: {
      ...getPrefixOverride(overrides),
    },
    ...overrides,
    highlightSelect: false,
  });

  if (__DEBUG_LVL__ >= 2) {
    console.log(JSON.stringify({ DefaultRowDecorator }, null, 2));
  }

  return DefaultRowDecorator;
};

const GetDefaultDecorator = (rowProps, overrides = {}) => {
  ACTIVE_MODEL = getPosModel();

  const incomingProps = rowProps || { label: {} };

  const currentOverride = overrides[getPosModelSlug()] || overrides;

  const ARROW_CAPABILITIES_DECORATOR = deepMerge(incomingProps, {
    small: true,
    label: {
      style: {
        fontWeight: '700',
      },
      ...getPrefixOverride(
        currentOverride,
        {
          prefixStyle: {
            color: '$green500',
          },
        },
        SEPARATORS.MP35P,
      ),
    },
    contentStyle: {
      alignItems: 'center',
      paddingRight: '15px',
    },
    highlightSelect: true,
  });

  if (currentOverride.showChevron) {
    ARROW_CAPABILITIES_DECORATOR.endFixture = chevronFixture(
      incomingProps,
      currentOverride,
    );
    ARROW_CAPABILITIES_DECORATOR.contentStyle.paddingRight = '30px';
  }

  return (
    {
      [MODELS.MP35P]: ARROW_CAPABILITIES_DECORATOR,
      [MODELS.MP35]: ARROW_CAPABILITIES_DECORATOR,
      [MODELS.Q60]: ARROW_CAPABILITIES_DECORATOR,
      [MODELS.D195]: ARROW_CAPABILITIES_DECORATOR,
      [MODELS.D230]: ARROW_CAPABILITIES_DECORATOR,
    }[ACTIVE_MODEL] || SetDefaultRowDecorator(incomingProps, currentOverride)
  );
};

export {
  GetDefaultDecorator,
  DefaultRowDecorator,
  ACTIVE_MODEL,
  ACTIVE_MODEL_SLUG,
};
