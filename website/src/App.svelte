<div id="main">
  <Route exact path="/" component={{ProjectNav}}/>
</div>

<script>
  // import Link from 'svelte-routing/Link.html';
  import Route from 'svelte-routing/Route.html';
  import routes from './routes'
  
  const Home = { ...routes };

  console.log('Home: ', Home);

  export default {
    components: { Route },
  }
</script>
