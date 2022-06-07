module.exports = (fn) => {
  try {
    return fn();
  } catch (e) {
    return null;
  }
};
