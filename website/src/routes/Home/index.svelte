<svelte:head>
  <title>Learn Mamba</title>
</svelte:head>

<header>
  <h1>Documentation</h1>
  <p>O Mamba Websdk vem com vários componentes de uso global. Eles aceleram a construção de aplicativos, além de manter o padrão visual entre eles.
  <br><br>
  Para conferir componentes e suas funcionalidades basta rodar npm link mamba-websdk e depois npm run dev na pasta do pos-mamba-websdk. O projeto rodará na porta 8079: localhost:8079.
  <br><br>
  Além dos componentes em si, é possível ver na página também as funções nativas (tal como a Printer).</p>
  <span>
    <Code text={code} inline={false} />
  </span>
  
</header>


<script>
  import Code from '@mamba/code'

  let code = "";

  export default {
    components: { Code },

    onstate({ changed, current, previous }) {
      fetch('/docs/guides/00-getting-started.md').then(res => {
        console.log('res.status: ', res.status);
      })
    },

    data () {
      return {
        code
      }
    },
  }
</script>
