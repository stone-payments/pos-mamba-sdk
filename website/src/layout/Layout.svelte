<main class="docs Grid" use:links>
  <Sidebar />
  <Main>
    <slot></slot>
  </Main>
  <div class="Grid-rightSpacer Flex--grow "></div>
</main>

<script>
  import links from 'svelte-routing/links'
  import Sidebar from './components/Sidebar'
  import Main from './components/Main'

  export default {
    components: { Sidebar, Main },
    actions: { 
      links 
    }
  }
</script>
