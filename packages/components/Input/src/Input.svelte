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
    type={visible ? 'text' : type}
    style="color: {textColor}"
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
  export default {
    components: {
      Icon: '@mamba/icon',
    },
    data() {
      return {
        type: 'text',
        bgColor: '#fff',
        textColor: '#000',
        visible: true,
        value: '',
        autofocus: false,
      }
    },
    oncreate() {
      if(this.get().type === 'password') {
        this.set({ visible: false })
      }
    },
    methods: {
      /** We use mousedown instead of click because it fires before the input's .focus() */
      handleMousedown(e) {
        const { type, visible } = this.get()
        /** Change password visibility only if element is focused */
        if(type === 'password' && document.activeElement === this.refs.input) {
          this.set({ visible: !visible })
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
  }

  .type-toggle {
    position: absolute;
    right: 20px;
    bottom: 10px;
  }
</style>
