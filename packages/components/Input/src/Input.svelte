<label
  class="input -{type}"
  style="background-color: {bgColor}; color: {textColor}"
  on:mousedown="onMousedown(event)"
>
  {#if label}
    <span>{label}</span>
  {/if}

  <input
    ref:input
    type={visible ? 'text' : 'password'}
    style="color: {textColor}"
    {disabled}
    on:focus="onFocus()"
    on:blur="onBlur()"
    on:keyup="onKeyUp(event)"
    on:input="set({ value: this.value })"
    />

  {#if type === 'password' && readable}
    <div class="type-toggle">
      <Icon symbol="{visible ? 'eye' : 'eye-off'}" />
    </div>
  {/if}

  {#if typeof validate === 'function' && !!errorMsg}
    <div class="validation-msg" style="color: {errorColor}; border-color: {errorColor}">
      {errorMsg}
    </div>
  {/if}
</label>


<script>
  import Keyboard from '@mamba/native/keyboard'

  export default {
    components: {
      Icon: '@mamba/icon',
    },
    data() {
      return {
        visible: true,
        value: '',
        validate: undefined,
        errorMsg: undefined,
        label: undefined,
        type: 'text',
        alphanumeric: false,
        readable: false,
        autofocus: false,
        disabled: false,
        bgColor: '#fff',
        textColor: '#4a4a4a',
        errorColor: '#d50000',
      }
    },
    oncreate() {
      if (this.options.data) {
        const { type, maxlength, autofocus, value } = this.options.data

        if (typeof maxlength !== 'undefined') {
          this.refs.input.setAttribute('maxlength', parseInt(maxlength))
        }

        if (type === 'password') {
          this.set({ visible: false })
        }

        if (value) {
          this.value(value)
        }

        if (autofocus) {
          this.focus()
          this.refs.input.scrollIntoView()
        }
      }
    },
    onupdate({ changed, current }) {
      if (changed.errorMsg && current.errorMsg) {
        this.refs.input.scrollIntoView()
      }
    },
    methods: {
      /** Prepend text to the input */
      prepend(value) {
        this.refs.input.value = value + this.refs.input.value
      },
      /** Append text to the input */
      append(value) {
        this.refs.input.value += value
      },
      /** Set or get the input value */
      value(inputValue) {
        const inputEl = this.refs.input
        if (inputValue != null) {
          inputEl.value = inputValue
        }
        return inputEl.value
      },
      focus() {
        this.refs.input.focus()
      },
      blur() {
        this.refs.input.blur()
      },
      // TODO: when 'visible' changes, it triggers a focus
      onFocus() {
        const { alphanumeric } = this.get()
        if (alphanumeric) {
          Keyboard.setKeyboardAsAlphanumeric()
        } else {
          Keyboard.setKeyboardAsNumeric()
        }
      },
      onBlur() {
        const { alphanumeric } = this.get()
        if (alphanumeric) {
          Keyboard.setKeyboardAsNumeric()
        }
      },
      onKeyUp(e) {
        const key = Keyboard.getKeyName(e.keyCode)
        this.fire('keyup')
        if (key === 'enter') {
          if (this.validate()) {
            this.fire('valid')
            this.blur()
          } else {
            this.fire('invalid')
          }
          this.fire('submit')
        }
      },
      /** We use mousedown instead of click because it fires before the input's .focus() */
      onMousedown(e) {
        const { type, visible, readable } = this.get()
        /** Change password visibility only if element is focused */
        if (
          type === 'password' &&
          readable &&
          document.activeElement === this.refs.input
        ) {
          this.set({ visible: !visible })
          setTimeout(() => this.refs.input.focus())
        }
      },
      validate() {
        const { validate, value } = this.get()
        /** If we have a validation function, execute it */
        if (typeof validate === 'function') {
          const { valid, msg } = validate(value)
          if (!valid) {
            this.set({ errorMsg: msg })
          } else {
            this.set({ errorMsg: undefined })
          }
          return valid
        }

        /** If not, just return 'valid' */
        return true
      },
    },
  }
</script>

<style>
  .input {
    position: relative;
    display: block;
    width: 100%;
    padding: 10px 15px;
    background-color: #fff;
  }

  .input.-password input {
    padding-right: 35px;
  }

  span {
    display: block;
    width: block;
    font-size: 14px;
    font-weight: bold;
    pointer-events: none;
  }

  input {
    width: 100%;
    background-color: transparent;
    -webkit-appearance: none;
    border: none;
    font-size: 30px;
    height: 36px;
    border-bottom: 1px dotted #dedede;
  }

  input[type='text'] {
    font-size: 20px;
  }

  .type-toggle {
    position: absolute;
    right: 20px;
    bottom: 10px;
  }

  .validation-msg {
    color: #d50000;
    border-top: 2px solid;
    padding-top: 5px;
    font-size: 12px;
  }
</style>
