import AppbarModifier from './Modifier.html';

const { newTestRoot } = global;

const root = newTestRoot();

it('should fire appbar:modify when rendered', () =>
  new Promise((res) => {
    root.on('appbar:modify', (props) => {
      if (props.title === 'New Title') {
        res();
      }
    });

    root.createComponent(AppbarModifier, {
      data: { title: 'New Title' },
    });
  }));
