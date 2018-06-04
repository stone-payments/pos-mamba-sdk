<h1>Default AppBar</h1>
<br><br>
<AppBar></AppBar>

<h1>Colored AppBar</h1>
<br><br>
<AppBar bgColor="red" textColor="green" title="Colored"></AppBar>

<h1>AppBar with title</h1>
<br><br>
<AppBar title="Title"></AppBar>

<h1>AppBar with left icon</h1>
<br><br>
<AppBar leftIcon="X"></AppBar>

<h1>AppBar with right icon</h1>
<br><br>
<AppBar rightIcon="X"></AppBar>

<h1>AppBar with left icon and title</h1>
<br><br>
<AppBar leftIcon="X" title="Title"></AppBar>

<h1>AppBar with left icon and title</h1>
<br><br>
<AppBar rightIcon="X" title="Title"></AppBar>

<h1>AppBar with left/right icon and title</h1>
<br><br>
<AppBar leftIcon="X" rightIcon="X" title="Title"></AppBar>

<script>
  export default {
    components: {
      AppBar: '../src',
    },
  }
</script>
