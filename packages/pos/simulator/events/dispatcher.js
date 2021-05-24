export default function dispatch(event = '', data = {}) {
  if (typeof event !== 'string') return;
  const evt = new CustomEvent(event, {
    detail: { ...data, origin: window.location.host },
  });
  window.dispatchEvent(evt);
}
