<label
  class="input -{type}"
  style="background-color: {bgColor}; color: {textColor}"
  on:mousedown="handleMousedown(event)"
>
  {#if label}
    <span>{label}</span>
  {/if}

  <input
    ref:input
    type={visible ? 'text' : 'password'}
    style="color: {textColor}"
    on:focus="onFocus()"
    on:blur="onBlur()"
    on:input="set({ value: this.value })"
    {autofocus}
    />

  {#if type === 'password'}
    <div class="type-toggle">
      <Icon symbol="{visible ? 'eye' : 'eye-off'}" />
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
        label: undefined,
        type: 'text',
        bgColor: '#fff',
        textColor: '#4a4a4a',
        visible: true,
        value: '',
        alphanumeric: false,
      }
    },
    oncreate() {
      const { type } = this.get()

      if (type === 'password') {
        this.set({ visible: false })
      }
    },
    methods: {
      onFocus() {
        const { alphanumeric } = this.get()
        if(alphanumeric) {
          Keyboard.setKeyboardAsAlphanumeric()
        } else {
          Keyboard.setKeyboardAsNumeric()
        }
      },
      onBlur() {
        const { alphanumeric } = this.get()
        if(alphanumeric) {
          Keyboard.setKeyboardAsNumeric()
        }
      },
      /** We use mousedown instead of click because it fires before the input's .focus() */
      handleMousedown(e) {
        const { type, visible } = this.get()
        /** Change password visibility only if element is focused */
        if (type === 'password' && document.activeElement === this.refs.input) {
          this.set({ visible: !visible })
          setTimeout(() => this.refs.input.focus())
        }
      },
    },
  }
</script>

<style>
  .input {
    position: relative;
    display: block;
    width: 100%;
    padding: 10px 20px;
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
  }

  input[type='text'] {
    font-size: 20px;
  }

  .type-toggle {
    position: absolute;
    right: 20px;
    bottom: 10px;
  }
</style>
