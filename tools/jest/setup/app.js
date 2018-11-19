import DummyApp from './DummyApp.html';

if (!global.App) {
  const target = document.body;

  const App = new DummyApp({
    target,
  });

  const newComponent = (component, props) => {
    if (props) {
      App.setComponentProps(props);
    }
    App.set({
      component,
    });
  };

  global.App = App;

  global.newComponent = newComponent;
}
