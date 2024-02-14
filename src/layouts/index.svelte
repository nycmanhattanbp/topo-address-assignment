<script>
  import MapSearch from '../components/mapSearch.svelte'
  import AddressSearch from '../components/addressSearch.svelte'
  import BBLSearch from '../components/bblSearch.svelte'

  let view
  let plutoLayer
</script>

<main>
  <h3 class="title is-3">Manhattan Topographical Bureau</h3>
  <h6 class="subtitle is-6">Address assignment statuses (beta)</h6>

  <div id="map">
    <div class="has-background-light info">
      <p class="is-6">
        Search by BBL, then click on a lot to view more details in
        the popup.
      </p>
    </div>
    <AddressSearch {view} {plutoLayer}></AddressSearch>
    <hr />
    <BBLSearch {view} {plutoLayer}></BBLSearch>
    <p>
      Note: We are current in the process of initializing the database, some
      addresses and documents might be missing.
    </p>
    <MapSearch bind:view="{view}" bind:plutoLayer="{plutoLayer}"></MapSearch>
  </div>
</main>

<style>
  #map {
    max-width: 1000px;
    height: 600px;
  }
  .info {
    padding: 1rem 0.5rem;
    margin-bottom: 1rem;
  }
</style>
