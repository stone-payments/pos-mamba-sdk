import {
  KeyboardInput,
  KeyboardOptions,
  KeyboardHandlerEvent,
  CaretPosition,
  CaretWorkerParams,
} from '../types';
import { greddyBraces } from './regExps';
import type Keyboard from '../components/Keyboard';

/**
 * CaretWorker
 */
class CaretWorker {
  getOptions: () => KeyboardOptions;

  getCaretPosition = (): CaretPosition => this.caretPosition;

  getCaretPositionEnd = (): CaretPosition => this.caretPositionEnd;

  keyboardInstance: Keyboard;

  maxLengthReached!: boolean;

  /**
   * Caret position
   */
  caretPosition!: CaretPosition;

  /**
   * Caret position end
   */
  caretPositionEnd!: CaretPosition;

  /**
   * Creates an instance of the CaretWorker
   */
  constructor({ getOptions, keyboardInstance }: CaretWorkerParams) {
    this.getOptions = getOptions;
    this.keyboardInstance = keyboardInstance;

    this.caretPosition = null;
    this.caretPositionEnd = null;
  }

  /**
   * Moves the cursor position by a given amount
   *
   * @param length Represents by how many characters the input should be moved
   * @param minus Whether the cursor should be moved to the left or not.
   */
  private updateCaretPos(length: number, minus = false) {
    const newCaretPos = this.updateCaretPosAction(length, minus);
    this.setCaretPosition(newCaretPos);
  }

  /**
   * Action method of updateCaretPos
   *
   * @param length Represents by how many characters the input should be moved
   * @param minus Whether the cursor should be moved to the left or not.
   */
  private updateCaretPosAction(length: number, minus = false) {
    const options = this.getOptions();
    let caretPosition = this.getCaretPosition();

    if (caretPosition != null) {
      if (minus) {
        if (caretPosition > 0) caretPosition -= length;
      } else {
        caretPosition += length;
      }
    }

    if (options.debug) {
      console.log('Caret at:', caretPosition);
    }

    return caretPosition;
  }

  /**
   * Adds a string to the input at a given position
   *
   * @param source The source input
   * @param str The string to add
   * @param position The (cursor) position where the string should be added
   * @param moveCaret Whether to update mamba-keyboard's cursor
   */
  private addStringAt(
    source: string,
    str: string,
    position: number = source.length,
    positionEnd: number = source.length,
    moveCaret = false,
  ) {
    console.log(source, str, position, positionEnd, moveCaret);

    let output;

    if (!position && position !== 0) {
      output = source + str;
    } else {
      output = [source.slice(0, position), str, source.slice(positionEnd)].join('');

      /**
       * Avoid caret position change when maxLength is set
       */
      if (!this.isMaxLengthReached()) {
        if (moveCaret) this.updateCaretPos(str.length);
      }
    }

    return output;
  }

  /**
   * Removes an amount of characters before a given position
   *
   * @param source The source input
   * @param position The (cursor) position from where the characters should be removed
   * @param moveCaret Whether to update mamba-keyboard's cursor
   */
  private removeAt(
    source: string,
    position: number = source.length,
    positionEnd: number = source.length,
    moveCaret = false,
  ) {
    if (position === 0 && positionEnd === 0) {
      return source;
    }

    let output;

    if (position === positionEnd) {
      if (position && position >= 0) {
        output = source.substr(0, position - 1) + source.substr(position);
        if (moveCaret) this.updateCaretPos(1, true);
      } else {
        output = source.slice(0, -1);
        if (moveCaret) this.updateCaretPos(1, true);
      }
    } else {
      output = source.slice(0, position) + source.slice(positionEnd);
      if (moveCaret) {
        this.setCaretPosition(position);
      }
    }

    return output;
  }

  /**
   * Removes an amount of characters after a given position
   *
   * @param source The source input
   * @param position The (cursor) position from where the characters should be removed
   */
  private removeForwardsAt(
    source: string,
    position: number = source.length,
    positionEnd: number = source.length,
    moveCaret = false,
  ) {
    if (!source?.length || position === null) {
      return source;
    }

    let output;

    if (position === positionEnd) {
      output = source.substr(0, position) + source.substr(position + 1);
    } else {
      output = source.slice(0, position) + source.slice(positionEnd);
      if (moveCaret) {
        this.setCaretPosition(position);
      }
    }

    return output;
  }

  /**
   * Gets the current value of maxLengthReached
   *
   * @returns If max length reached
   */
  private isMaxLengthReached(): boolean {
    return this.maxLengthReached;
  }

  /**
   * Called by {@link setEventListeners} when an event that warrants a cursor position update is triggered
   */
  private caretEventHandler(event: KeyboardHandlerEvent): void {
    console.log(event);

    if (!this) return;
    const options = this.getOptions();
    const isDOMInputType = event.target instanceof HTMLInputElement;

    /* if (isDOMInputType) {
      debugger;
    } */

    const isKeyboard =
      event.target === this.keyboardInstance.keyboardDOM ||
      (event.target && this.keyboardInstance.keyboardDOM.contains(event.target));

    if (
      isDOMInputType &&
      ['text', 'tel'].includes(event.target.type) &&
      !options.disableCaretPositioning
    ) {
      /**
       * Tracks current cursor position
       * As keys are pressed, text will be added/removed at that position within the input.
       */
      this.setCaretPosition(event.target.selectionStart, event.target.selectionEnd);

      /**
       * Tracking current input in order to handle caret positioning edge cases
       */
      this.keyboardInstance.activeInputElement = event.target;

      if (options.debug) {
        console.log(
          'Caret at: ',
          this.getCaretPosition(),
          this.getCaretPositionEnd(),
          event && event.target.tagName.toLowerCase(),
          `(${this.keyboardInstance.keyboardDOMClass})`,
        );
      }
    } else if (
      (options.disableCaretPositioning || !isKeyboard) &&
      event?.type !== 'selectionchange'
    ) {
      /**
       * If we toggled off disableCaretPositioning, we must ensure caretPosition doesn't persist once reactivated.
       */
      this.setCaretPosition(null);

      /**
       * Resetting activeInputElement
       */
      this.keyboardInstance.activeInputElement = null;

      if (options.debug) {
        console.log(`Caret position reset due to "${event?.type}" event`, event);
      }
    }
  }

  // Accessible methods

  /**
   * Handles mamba-keyboard event listeners
   */
  setupCaretEventsControl(): void {
    if (!document) return;

    const options = this.getOptions();

    if (options.debug) {
      console.log(`Caret handling started (${this.keyboardInstance.keyboardDOMClass})`);
    }

    /**
     * Events for caret control
     */
    document.addEventListener('keyup', (e) => this.caretEventHandler(e));
    document.addEventListener('mouseup', (e) => this.caretEventHandler(e));
    document.addEventListener('select', (e) => this.caretEventHandler(e));
    document.addEventListener('selectionchange', (e) => this.caretEventHandler(e));
  }

  /**
   * Changes the internal caret position
   * @param position The caret's start position
   * @param positionEnd The caret's end position
   */
  public setCaretPosition(position: CaretPosition, endPosition = position): void {
    this.caretPosition = position;
    this.caretPositionEnd = endPosition;
  }

  /**
   * Determines whether the max length has been reached when maxLength option are set.
   *
   * @param keyboardInput
   * @param updatedInput
   */
  handleMaxLength(keyboardInput: KeyboardInput, updatedInput: string) {
    const options = this.getOptions();
    const { maxLength } = options;
    const condition = updatedInput.length - 1 >= maxLength;

    /**
     * If pressing this button won't add more characters
     * We exit out of this limiter function
     */
    if (updatedInput.length <= keyboardInput.default.length) return false;
    if (!Number.isInteger(maxLength)) return false;

    if (options.debug) {
      console.log('"maxLength" reached:', condition);
    }

    this.maxLengthReached = condition;
    return condition;
  }

  /**
   * Returns the updated input resulting from clicking a given button
   *
   * @param button The button's layout name
   * @param input The input string
   * @param caretPos The cursor's current position
   * @param caretPosEnd The cursor's current end position
   * @param  moveCaret Whether to update mamba-keyboard's cursor
   */
  getUpdatedInput(button: string, input: string, moveCaret = false) {
    const caretPos = this.caretPosition as number;
    const caretPosEnd = this.caretPositionEnd || caretPos;
    const commonParams: [number, number, boolean] = [caretPos, caretPosEnd, moveCaret];

    let output = input;

    switch (button) {
      case '{space}':
        output = this.addStringAt(output, ' ', ...commonParams);
        break;
      case '{backspace}':
        if (output.length > 0) output = this.removeAt(output, ...commonParams);
        break;
      case '{delete}':
        if (output.length > 0) output = this.removeForwardsAt(output, ...commonParams);
        break;
      case '{':
      case '}':
        output = this.addStringAt(output, button, ...commonParams);
        break;
      default:
        /**
         * Filters function button value from output of input
         */
        if (!greddyBraces.test(button)) {
          output = this.addStringAt(output, button, ...commonParams);
        }
    }

    return output;
  }
}

export default CaretWorker;
