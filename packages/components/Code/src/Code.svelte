{#if inline}
  <code class="language-{language} {inline && 'inline' || ''}">
    {@html text}
  </code>
{:else}
  <pre class="code-block line-numbers language-{language}">
    <code class="language-{language}">
      {@html text}
    </code>
  </pre>
{/if}

<script>
  export default {
    data() {
      return {
        text: '',
        language: 'javascript',
        inline: false
      }
    }
  }
</script>

<style type="text/scss">
  @import '@mamba/styles-utils/index.scss';
  
  .code-block, code {
    background-color: rgb(244, 245, 247);
  }

  :global(.code-block), :global(code) {
    border-radius: 3px;
    display: block;
    margin: 0 0 2px;
  }

  :global(.code-block) {
    padding: 2px;
    overflow-x: auto;
  }

  code.inline {
    padding: 2px;
  }

  .code-block :global(code),
  .code-block :global(pre) {
    font-family: $mamba-code-font-family;
  }
</style>