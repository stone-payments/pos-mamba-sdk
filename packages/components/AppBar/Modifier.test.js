import AppbarModifier from './Modifier.html';

const { newComponent } = global;

it('should fire appbar:modify when props change', () =>
  new Promise(res => {
    const component = newComponent(AppbarModifier, {
      data: {
        title: 'teste',
      },
    });
    component.root.on('appbar:modify', res);
  }));
