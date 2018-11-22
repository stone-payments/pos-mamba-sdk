import AppbarModifier from './Modifier.html';

const { newTestApp } = global;

it('should fire appbar:modify when rendered', () =>
  new Promise(res => {
    const test = newTestApp();
    test.on('appbar:modify', res);
    test.createComponent(AppbarModifier, {
      data: { title: 'New Title' },
    });
  }));
