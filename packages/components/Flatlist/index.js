import Icon from '@mamba/icon';
import { neutral800 } from '@mamba/styles/colors.js';
import DefaultRow from './DefaultRow.html';
import FlatList from './FlatList.html';

const DefaultRowDecorator = {
  endFixture: {
    value: () => Icon,
    props: { symbol: 'chevron-right', color: neutral800 },
  },
};

export { DefaultRow, FlatList, DefaultRowDecorator };
