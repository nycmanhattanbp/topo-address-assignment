<script>
  import Router, { link } from 'svelte-spa-router'
  import { routes } from './routes'
  import 'bulma/css/bulma.css'
</script>

<div class="app">
  <nav>
    <ul>
      <li>
        <a href="/" use:link>Home</a>
        <a href="/" use:link>test</a>
      </li>
    </ul>
  </nav>
  <div class="content">
    <Router {routes}></Router>
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-wrap: wrap;
    font-family: 'Source Sans Pro', sans-serif;
  }
  :global(.is-1, .is-2, .is-3, .is-4, .is-5, .is-6) {
    font-family: 'Merriweather', serif;
  }
  nav {
    margin: 20px;
    display: flex;
    flex-direction: column;
    flex: 1 0;
    position: relative;
  }
  .content {
    margin: 20px;
    flex: 999 1 675px;
    min-height: 675px;
  }

  @media all and (max-width: 675px) {
    .content,
    nav {
      margin: 10px;
    }
  }
</style>
