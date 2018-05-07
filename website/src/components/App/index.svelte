<h1>Hello {name}!</h1>

<nav>
  <NavLink exact to="/">Home</NavLink>
  <NavLink to="/about">About</NavLink>
</nav>

<Route exact path="/">
  <Home/>
</Route>

<Route path="/about">
  <About/>
</Route>

<script>
  export default {
    components: {
      NavLink: 'svelte-routing/NavLink',
      Route: 'svelte-routing/Route',
      About: '../../routes/About',
      Home: '../../routes/Home',
    },
  }

</script>
