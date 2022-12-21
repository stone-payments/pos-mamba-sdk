import {
  KeyboardInput,
  KeyboardOptions,
  KeyboardHandlerEvent,
  CursorPosition,
  CursorWorkerParams,
  KeyboardVisibility,
} from '../types';
import { greddyBraces } from './regExps';
import type Keyboard from '../Keyboard';
import { bindMethods } from '../helpers';

/**
 * CursorWorker.
 * Controls input value insertion
 */
class CursorWorker {
  getOptions: () => KeyboardOptions;

  getCursorPosition = (): CursorPosition => this.cursorPosition;

  getCursorPositionEnd = (): CursorPosition => this.cursorPositionEnd;

  keyboardInstance: Keyboard;

  maxLengthReached!: boolean;

  /**
   * Cursor position
   */
  cursorPosition!: CursorPosition;

  /**
   * Cursor position end
   */
  cursorPositionEnd!: CursorPosition;

  /**
   * Captured cursor input target
   */
  cursorInputTarget?: HTMLInputElement;

  /**
   * Control flag for events setup
   */
  setuped = false;

  /**
   * Creates an instance of the CursorWorker
   */
  constructor({ getOptions, keyboardInstance }: CursorWorkerParams) {
    this.getOptions = getOptions;
    this.keyboardInstance = keyboardInstance;
    bindMethods(CursorWorker, this);

    this.cursorPosition = null;
    this.cursorPositionEnd = null;
  }

  /**
   * Moves the cursor position by a given amount
   *
   * @param length Represents by how many characters the input should be moved
   * @param minus Whether the cursor should be moved to the left or not.
   */
  private updateCursorPos(length: number, minus = false) {
    const newCursorPos = this.updateCursorPosAction(length, minus);
    this.setCursorPosition(newCursorPos);
  }

  /**
   * Action method of updateCursorPos
   *
   * @param length Represents by how many characters the input should be moved
   * @param minus Whether the cursor should be moved to the left or not.
   */
  private updateCursorPosAction(length: number, minus = false) {
    const options = this.getOptions();
    let cursorPosition = this.getCursorPosition();

    if (cursorPosition != null) {
      if (minus) {
        if (cursorPosition > 0) cursorPosition -= length;
      } else {
        cursorPosition += length;
      }
    }

    if (options.debug) {
      console.log('Cursor at:', cursorPosition);
    }

    return cursorPosition;
  }

  /**
   * Adds a string to the input at a given position
   *
   * @param source The source input
   * @param str The string to add
   * @param position The (cursor) position where the string should be added
   * @param moveCursor Whether to update mamba-keyboard's cursor
   */
  private addStringAt(
    source: string,
    str: string,
    position: number = source.length,
    positionEnd: number = source.length,
    moveCursor = false,
  ) {
    let output;

    if (!position && position !== 0) {
      output = source + str;
    } else {
      output = [source.slice(0, position), str, source.slice(positionEnd)].join('');

      /**
       * Avoid cursor position change when maxLength is set
       */
      if (!this.isMaxLengthReached()) {
        if (moveCursor) this.updateCursorPos(str.length);
      }
    }

    return output;
  }

  /**
   * Removes an amount of characters before a given position
   *
   * @param source The source input
   * @param position The (cursor) position from where the characters should be removed
   * @param moveCursor Whether to update mamba-keyboard's cursor
   */
  private removeAt(
    source: string,
    position: number = source.length,
    positionEnd: number = source.length,
    moveCursor = false,
  ) {
    if (position === 0 && positionEnd === 0) {
      return source;
    }

    let output;

    if (position === positionEnd) {
      if (position && position >= 0) {
        output = source.substr(0, position - 1) + source.substr(position);
        if (moveCursor) this.updateCursorPos(1, true);
      } else {
        output = source.slice(0, -1);
        if (moveCursor) this.updateCursorPos(1, true);
      }
    } else {
      output = source.slice(0, position) + source.slice(positionEnd);
      if (moveCursor) {
        this.setCursorPosition(position);
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
    moveCursor = false,
  ) {
    if (!source?.length || position === null) {
      return source;
    }

    let output;

    if (position === positionEnd) {
      output = source.substr(0, position) + source.substr(position + 1);
    } else {
      output = source.slice(0, position) + source.slice(positionEnd);
      if (moveCursor) {
        this.setCursorPosition(position);
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
  private cursorEventHandler(event: KeyboardHandlerEvent): void {
    if (!this) return;
    const options = this.getOptions();
    if (this.keyboardInstance.isRenderAllowed !== true) return;
    if (options.disabled === true) return;
    if (this.keyboardInstance.visibility === KeyboardVisibility.Hidden) return;

    const isDOMInputType = event.target instanceof HTMLInputElement;

    const isKeyboard =
      event.target === this.keyboardInstance.keyboardDOM ||
      (event.target && this.keyboardInstance.keyboardDOM.contains(event.target as Node));

    if (
      isDOMInputType &&
      ['text', 'tel'].includes(event.target.type) &&
      !options.disableCursorPositioning
    ) {
      /**
       * Tracks current cursor position
       * As keys are pressed, text will be added/removed at that position within the input.
       */
      this.setCursorPosition(
        event.target.selectionStart,
        event.target.selectionEnd,
        false,
        event.target,
      );

      if (options.debug) {
        console.log(
          'Cursor at: ',
          this.getCursorPosition(),
          this.getCursorPositionEnd(),
          event && event.target.tagName.toLowerCase(),
          `(${this.keyboardInstance.keyboardDOMClass})`,
        );
      }

      this.cursorInputTarget = event.target;
    } else if (
      (options.disableCursorPositioning || !isKeyboard) &&
      event?.type !== 'selectionchange'
    ) {
      /**
       * If we toggled off disableCursorPositioning, we must ensure cursorPosition doesn't persist once reactivated.
       */
      this.setCursorPosition(null);

      if (options.debug) {
        console.log(`Cursor position reset due to "${event?.type}" event`, event);
      }
      this.cursorInputTarget = undefined;
    }
  }

  // Accessible methods

  /**
   * Handles mamba-keyboard event listeners
   */
  public setupCursorEventsControl(): void {
    const options = this.getOptions();

    if (!document || options.readonly === true || this.setuped) return;

    if (options.debug) {
      console.log(`Cursor handling started (${this.keyboardInstance.keyboardDOMClass})`);
    }

    /**
     * Events for cursor control
     */
    document.addEventListener('keyup', this.cursorEventHandler);
    document.addEventListener('mouseup', this.cursorEventHandler);
    document.addEventListener('select', this.cursorEventHandler);
    document.addEventListener('selectionchange', this.cursorEventHandler);
    this.setuped = true;
  }

  /**
   * Remove cursor worker controls events
   */
  public ceaseCursorEventsControl() {
    if (!this.setuped) return;
    document.removeEventListener('keyup', this.cursorEventHandler);
    document.removeEventListener('mouseup', this.cursorEventHandler);
    document.removeEventListener('select', this.cursorEventHandler);
    document.removeEventListener('selectionchange', this.cursorEventHandler);
    this.setuped = false;
  }

  /**
   * Changes the internal cursor position
   *
   * @param position The cursor's start position
   * @param positionEnd The cursor's end position
   * @param moveCursor Move cursor of target input or not
   * @param customTarget Pass early input event from focusin
   */
  public setCursorPosition(
    position: CursorPosition,
    endPosition = position,
    moveCursor = false,
    customTarget: any = undefined,
  ): void {
    const options = this.getOptions();

    this.cursorPosition = position;
    this.cursorPositionEnd = endPosition;

    const input = customTarget || this.cursorInputTarget || options.input;

    /**
     * Try move cursor
     */
    if (moveCursor && input instanceof HTMLInputElement) {
      input.setSelectionRange(position, endPosition);
    }
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
   * Filters numeric output to handle formatted inputs
   * @experimental
   *
   * @param value
   * @returns
   */
  shouldFilterNumericValue(value: string): string {
    const options = this.getOptions();
    if (
      options.filtersNumbersOnly === true ||
      !this.keyboardInstance.generalKeyboard.alphanumericEnabled === true
    ) {
      value = value.replace(/\D/g, '');
    }
    return value;
  }

  /**
   * Returns the updated input resulting from clicking a given button
   *
   * @param button The button's layout name
   * @param input The input string
   * @param cursorPos The cursor's current position
   * @param cursorPosEnd The cursor's current end position
   * @param moveCursor Whether to update mamba-keyboard's cursor
   * @return Updated input value
   */
  getUpdatedInput(button: string, input: string, moveCursor = false): string {
    const cursorPos = this.cursorPosition as number;
    const cursorPosEnd = this.cursorPositionEnd || cursorPos;
    const commonParams: [number, number, boolean] = [cursorPos, cursorPosEnd, moveCursor];

    let output = input;

    switch (button) {
      case '{space}':
        output = this.addStringAt(output, ' ', ...commonParams);
        break;
      case '{backspace}':
        if (output.length > 0 && this.keyboardInstance.generalKeyboard.backspaceEnabled === true) {
          output = this.removeAt(output, ...commonParams);
        }
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

        output = this.shouldFilterNumericValue(output);
    }

    return output;
  }
}

/**
 * Export only type
 */
export type { CursorWorker };

export default CursorWorker;
