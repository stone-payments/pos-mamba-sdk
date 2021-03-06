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

const SetDefaultRowDecorator = (defaultProps, overrides = {}) => {
  DefaultRowDecorator = {
    endFixture: {
      value: () => Icon,
      props: { symbol: 'chevron-right', color: neutral800 },
      contentStyle: {
        paddingRight: '5px',
        overflow: 'hidden',
        height: '15px',
        display: 'flex',
        flexDirection: 'column',
      },
    },
    ...defaultProps,
    label: {
      ...defaultProps.label,
      ...getPrefixOverride(overrides),
    },
    ...overrides,
    highlightSelect: false,
  };
  return DefaultRowDecorator;
};

const GetDefaultDecorator = (rowProps, overrides = {}) => {
  ACTIVE_MODEL = getPosModel();

  const defaultProps = rowProps || { label: {} };
  const labelData = (defaultProps && defaultProps.label) || {};

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
    }[ACTIVE_MODEL] || SetDefaultRowDecorator(defaultProps, currentOverride)
  );
};

export {
  GetDefaultDecorator,
  DefaultRowDecorator,
  ACTIVE_MODEL,
  ACTIVE_MODEL_SLUG,
};
