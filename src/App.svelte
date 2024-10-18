<script>
  import Router, { link } from 'svelte-spa-router'
  import { routes } from './routes'
  import 'bulma/css/bulma.css'

  // git subtree push --prefix public/ origin gh-pages
</script>

<div class="container mb-5 h-100">
  <header class="container-fluid">
    <div class="row mt-3">
      <div class="col-10 col-md-11">
        <h1 class="title">Manhattan Address Status Locator</h1>
        <h2 class="subtitle">Land Use & Planning, Manhattan Topographical Bureau</h2>
      </div>
      <nav class="col-2 col-md-1">
        <ul>
          <li class="m-2">
            <a href="/" use:link>Home</a>    
          </li>
        </ul>
      </nav>
    </div>
  </header>
  <div class="content">
    <Router {routes}></Router>
  </div>
</div>