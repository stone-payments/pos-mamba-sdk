import dispatch from './dispatcher.js';

export const makeRequestEventName = (e) => `Request-${e}`;

export default function requester(event, data = {}) {
  if (typeof event !== 'string') return;
  dispatch(makeRequestEventName(event), data);
}
