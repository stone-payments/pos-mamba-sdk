<div class="container">
  <h1>Progress bar <span>{'<ProgressBar/>'}</span></h1>

  <div class="row">
    <ProgressBar />
  </div>

  <h1>Progress bar with custom color <span>{'<ProgressBar color="#ddd"/>'}</span></h1>

  <div class="row">
    <ProgressBar color="#ddd" />
  </div>

  <h1>Progress bar with custom height <span>{'<ProgressBar height="4px"/>'}</span></h1>

  <div class="row">
    <ProgressBar height="4px" />
  </div>

  <h1>Progress bar with defined progress <span>{'<ProgressBar progress="'}{fakeProgress}{'%"/>'}</span></h1>

  <div class="row">
    <ProgressBar progress="{fakeProgress}%" height="8px" />
  </div>

</div>

<style>
  h1 span {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    font-family: monospace;
  }

  .container {
    max-width: 80%;
    width: 700px;
    margin: 0 auto;
  }

  .row {
    margin-bottom: 50px
  }
</style>

<script>
  import { ProgressBar } from '../src'

  export default {
    components: {
      ProgressBar,
    },
    data() {
      return {
        fakeProgress: 0,
      }
    },
    oncreate() {
      setInterval(() => {
        let { fakeProgress } = this.get()
        if(fakeProgress > 100) fakeProgress = -1
        this.set({ fakeProgress: fakeProgress + 1 })
      }, 100)
    },
  }
</script>
