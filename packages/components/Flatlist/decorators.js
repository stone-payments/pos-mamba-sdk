import Icon from '@mamba/icon';
import { MODELS, getPosModelSlug, getPosModel } from '@mamba/utils/index.js';
import { neutral800 } from '@mamba/styles/colors.js';

let ACTIVE_MODEL = getPosModel();
let ACTIVE_MODEL_SLUG;
let DefaultRowDecorator = {};

const SEPARATORS = {
  MP35P: '. ',
  DEFAULT: ' - ',
};

const withPosPrefixSeparator = separator => position => {
  return (position && `${position}${separator}`) || null;
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

export const SetDefaultRowDecorator = (incomingProps = {}, overrides = {}) => {
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

  const top = ALIGN_TOP[incomingProps.align || overrides.align || 'start'];
  const transform = `translateY(${
    TRANSLATE_TOP[incomingProps.align || overrides.align || 'start']
  });`;

  DefaultRowDecorator = {
    endFixture: {
      value: () => Icon,
      props: { symbol: 'chevron-right', color: neutral800 },
      contentStyle: {
        position: 'absolute',
        right: '5px',
        top,
        transform,
      },
    },
    label: {
      ...incomingProps.label,
      ...getPrefixOverride(overrides),
    },
    ...incomingProps,
    ...overrides,
    highlightSelect: false,
  };

  if (__DEBUG_LVL__ >= 2) {
    console.log(JSON.stringify({ DefaultRowDecorator }, null, 2));
  }

  return DefaultRowDecorator;
};

const GetDefaultDecorator = (rowProps, overrides = {}) => {
  ACTIVE_MODEL = getPosModel();

  const incomingProps = rowProps || { label: {} };
  const labelData = (incomingProps && incomingProps.label) || {};

  const currentOverride = overrides[getPosModelSlug()] || overrides;

  const ARROW_CAPABILITIES_DECORATOR = {
    small: true,
    label: {
      ...labelData,
      style: {
        ...labelData.style,
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
    ...currentOverride,
    highlightSelect: true,
  };

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
