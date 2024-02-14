<script>
  let block = "";
  let lot = "";
  let error = "";

  export let view;
  export let plutoLayer;

  const headers = new Headers();
  headers.append('Ocp-Apim-Subscription-Key','8ef9b00a1d6c4a97b17a6c4828cfc2eb')

  function _set(addr) {
    fetch(
      `https://api.nyc.gov/geo/geoclient/v1/bbl.json?borough=manhattan&block=${block}&lot=${lot}`
    , {headers})
      .then((response) => response.json())
      .then((response) => {
        if ("latitudeInternalLabel" in response.bbl) {
          const { latitudeInternalLabel, longitudeInternalLabel } =
            response.bbl;
          const coords = [longitudeInternalLabel, latitudeInternalLabel];
          view.goTo({
            target: coords,
            zoom: 17,
          });

          //search plutoLayer
          const point = {
            x: coords[0],
            y: coords[1],
            spatialReference: {
              wkid: 4326,
            },
            type: "point",
          };
          console.log(point);
          plutoLayer
            .queryFeatures({
              //query object
              geometry: point,
              spatialRelationship: "intersects",
              returnGeometry: false,
              outFields: ["BBL"],
              distance: 10,
              units: "feet",
            })
            .then((featureSet) => {
              console.log(featureSet.features);
              // open popup of query result
              view.popup.open({
                location: point,
                features: featureSet.features
              });
            });
        } else {
          //throw error
          error = 'bbl-error';
        }
      }).catch(e => error = 'api-down')
  }
</script>

<form on:submit|preventDefault={_set}>
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label">Search by BBL</label>
    </div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <input
            id="block"
            placeholder="Block"
            type="text"
            pattern="\d*"
            name="block"
            bind:value={block}
            on:keyup={() => (error = false)}
            autocomplete="off"
            class={!error
              ? "input is-fullwidth"
              : "input is-fullwidth is-danger"}
            maxlength="5"
          />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <input
            id="lot"
            placeholder="Lot"
            type="text"
            pattern="\d*"
            name="lot"
            bind:value={lot}
            on:keyup={() => (error = "")}
            autocomplete="off"
            class={!error
              ? "input is-fullwidth"
              : "input is-fullwidth is-danger"}
            maxlength="4"
          />
        </div>
      </div>
      <button type="submit" class="button">Search</button>
    </div>
  </div>
  {#if error === 'bbl-error'}
    <p class="help is-danger">Block and/or Lot is invalid</p>
  {/if}
  {#if error === 'api-down'}
  <p class="help is-danger">BBL search database is down</p>
  {/if}
</form>

<style>
  form {
    margin-bottom: 1rem;
  }
  input[type="submit"] {
    background-color: #6a6a6a;
    border: none;
    color: white;
    padding: 5px 10px;
    text-decoration: none;
    cursor: pointer;
  }
</style>
