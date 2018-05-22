<section class="router-layout wrapper" use:links>
  <Header />
  <section class="scrollWrapper">
    <Navigation />
    <Main>
      <slot></slot>
    </Main>
  </section>
</section>

<script>
  import links from 'svelte-routing/links'
  import Header from './components/header'
  import Navigation from './components/navigation'
  import Main from './components/main'

  export default {
    components: { Header, Navigation, Main },
    actions: { 
      links 
    }
  }
</script>
