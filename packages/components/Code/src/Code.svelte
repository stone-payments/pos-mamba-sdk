{#if inline}
  <code class="language-{language} {inline && 'inline' || ''}">{@html text}</code>
{:else}
  <pre class="code-block line-numbers language-{language}">
    <code class="language-{language}">{@html text}</code>
  </pre>
{/if}

<script>
  export default {
    data() {
      return {
        text: '',
        language: 'javascript',
        inline: false,
      }
    },
  }
</script>