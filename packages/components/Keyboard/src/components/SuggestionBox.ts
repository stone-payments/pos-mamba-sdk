/* import { SuggestionBoxParams } from '../types'; */
import type Keyboard from '../Keyboard';
import { createKeyboardElement, ClassNames } from '../helpers';
import { KeyboardOptions, SuggestionBoxParams } from '../types';
import { DEFAULT_SUGGESTIONS } from '../mappings';

/**
 * Responsible to handle suggestions and suggestions layout
 */
class SuggestionBox {
  private keyboardInstance!: Keyboard;

  getOptions: () => KeyboardOptions;

  suggestionDOMElement!: HTMLDivElement;

  constructor({ getOptions, keyboardInstance }: SuggestionBoxParams) {
    this.keyboardInstance = keyboardInstance;
    this.getOptions = getOptions;
  }

  /**
   * Destruct its elements and remove it from keyboard
   */
  destroy() {
    this.clearBox();
  }

  shouldUpdateOrCease() {
    const input = this.keyboardInstance.getInput();
    const last = input.slice(-1);
    const suggestionFound: string = DEFAULT_SUGGESTIONS[last];
    if (suggestionFound) {
      this.render(suggestionFound.split(' '));
    } else {
      this.clearBox();
    }
  }

  /**
   * Remove keyboard suggestion box
   */
  private clearBox(): void {
    if (this.suggestionDOMElement) {
      const { parentNode } = this.suggestionDOMElement;
      if (parentNode) parentNode.removeChild(this.suggestionDOMElement);
    }
  }

  /**
   * Renders or update the keyboard suggestions box
   */
  private render(suggestionList: string[]) {
    // Remove last suggestion box, if any
    this.clearBox();

    this.suggestionDOMElement = createKeyboardElement(ClassNames.suggestionBox) as HTMLDivElement;

    const suggestionTable = createKeyboardElement(undefined, 'table') as HTMLTableElement;
    const suggestionRow = createKeyboardElement(undefined, 'tr') as HTMLTableRowElement;

    suggestionList.forEach((suggestionValue) => {
      const suggestionCell = createKeyboardElement(undefined, 'td') as HTMLTableCellElement;

      const suggestionButton = createKeyboardElement([
        ClassNames.buttonPrefix,
        ClassNames.suggestionBoxButton,
      ]) as HTMLDivElement;
      suggestionButton.textContent = suggestionValue;

      // Add button to the table cell
      suggestionCell.appendChild(suggestionButton);

      // Add cell to table row
      suggestionRow.appendChild(suggestionCell);
    });

    // Add table row
    suggestionTable.appendChild(suggestionRow);

    // Add table to container
    this.suggestionDOMElement.appendChild(suggestionTable);

    /** Add suggestion box to the DOM */
    this.keyboardInstance.keyboardDOM.insertBefore(
      this.suggestionDOMElement,
      this.keyboardInstance.keyboardDOM.firstChild,
    );
  }
}

export default SuggestionBox;
