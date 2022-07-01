/* import { SuggestionBoxParams } from '../types'; */
import type Keyboard from '../Keyboard';
/**
 * Responsible to handle suggestions and suggestions layout
 */
class SuggestionBox {
  private keyboardInstance!: Keyboard;

  suggestionDOMElement!: HTMLDivElement;

  /* constructor({ getOptions, keyboardInstance }: SuggestionBoxParams) {

  } */

  /**
   * Destruct its elements and remove it from keyboard
   */
  destruct() {
    if (this.suggestionDOMElement) {
      this.suggestionDOMElement.parentNode?.removeChild(this.suggestionDOMElement);
    }
  }
}

export default SuggestionBox;
