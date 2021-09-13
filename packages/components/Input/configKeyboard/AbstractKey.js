export default class AbstractKey {
  code = '';
  label = '';

  /**
   * @param {string} code
   * @param {any} label
   */
  constructor({ code, label, pageScope }) {
    this.pageScope = pageScope;
    this.code = code;
    this.label = label;
  }

  onClick() {
    console.log('Aqui é a abstrata');
  }
}
