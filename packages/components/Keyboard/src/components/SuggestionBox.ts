/* import { SuggestionBoxParams } from '../types'; */
import type Keyboard from '../Keyboard';
import { createKeyboardElement, ClassNames } from '../helpers';
import {
  KeyboardOptions,
  SuggestionBoxParams,
  onSuggestionSelect,
  KeyboardHandlerEvent,
} from '../types';
import { DEFAULT_SUGGESTIONS } from '../mappings';

/**
 * Responsible to handle suggestions and suggestions layout
 */
class SuggestionBox {
  private keyboardInstance!: Keyboard;

  getOptions: () => KeyboardOptions;

  suggestionDOMElement: HTMLDivElement | null;

  onSelect!: onSuggestionSelect;

  candidate?: string;

  constructor({ getOptions, keyboardInstance, onSelect }: SuggestionBoxParams) {
    this.keyboardInstance = keyboardInstance;
    this.getOptions = getOptions;
    this.onSelect = onSelect;
    this.suggestionDOMElement = null;
  }

  /**
   * Destruct its elements and remove it from keyboard
   */
  destroy() {
    this.clearBox();
  }

  reset() {
    this.clearBox();
    this.candidate = undefined;
  }

  resetIfExist() {
    if (this.suggestionDOMElement) {
      // Postpone the reset after all event of cursor worker dispatch.
      setTimeout(() => this.reset());
    }
  }

  /**
   * Shows or hides suggestion box on button click.
   * @param keyCandidate The last key pressed
   * @return Return `true` if button has some suggestions to show
   */
  shouldUpdateOrCease(keyCandidate?: string): boolean {
    if (!keyCandidate) {
      this.reset();
      return false;
    }

    const suggestionFound: string | undefined = DEFAULT_SUGGESTIONS[keyCandidate];
    if (suggestionFound) {
      this.candidate = keyCandidate;
      this.render(suggestionFound.split(' '));
    } else {
      this.reset();
    }

    return !!suggestionFound;
  }

  /**
   * Remove keyboard suggestion box
   */
  private clearBox(): void {
    if (this.suggestionDOMElement) {
      const { parentNode } = this.suggestionDOMElement;
      if (parentNode) parentNode.removeChild(this.suggestionDOMElement);
      this.suggestionDOMElement = null;
    }
  }

  /**
   * Renders or update the keyboard suggestions box
   */
  private render(suggestionList: string[]) {
    if (this.keyboardInstance.options.debug) {
      console.log(`Start suggestion render with ${suggestionList}`);
    }

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
      suggestionButton.onclick = (e: KeyboardHandlerEvent) => {
        if (typeof this.candidate === 'string') {
          this.onSelect(suggestionValue, this.candidate, e);
          this.reset();
        }
      };

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
