<main class="Docs Grid">
  <Sidebar path={path} />
  <Main>
    <slot></slot>
  </Main>
  <div class="Grid-rightSpacer Flex--grow "></div>
</main>

<script>
  import Sidebar from './components/Sidebar'
  import Main from './components/Main'

  export default {
    components: { Sidebar, Main },
  }
</script>
