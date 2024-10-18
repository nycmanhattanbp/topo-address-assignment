<script>
  import MapSearch from '../components/mapSearch.svelte'
  import AddressSearch from '../components/addressSearch.svelte'
  import BBLSearch from '../components/bblSearch.svelte'

  let view
  let plutoLayer
</script>

<main class="container-fluid mt-5">
  <h3>Introduction</h3>
  <div class="row mb-5">
    <div class="col-lg-9">
      <p>
        To provide open public government information about the status of house number verification and address assignment request the office has created the Address Status Locator.  The online resource allows you to search house number records on file within the 
        <a href="https://www.manhattanbp.nyc.gov/resources/land-use/" target="_blank">topographical bureau of The Manhattan Borough President’s Office</a>. The Manhattan Borough President’s Office has a two-step process for all new developments and all alteration that double the size of the original building square footage.
      </p>
    </div>
  </div>
  <div class="row mb-5">
    <div class="col">
      <h3>House number verification</h3>
      <div class="mr-1 pr-1 mh-vh-50">
        <h4>Existing building</h4>
        <p>If an alteration <b>does not</b> double the original size of the existing building a Verification letter will be issued verifying the appropriate house numbers for each entrance of the existing building.</p>

        <h4>New building or enlargement</h4>
        <p>For new developments the process is as follows:</p>
        <p>First is the initial filing address verification for the new development or alteration – 1 (enlargement of existing buildings that double the original size). You would e-mail <a href="mailto:hrivera@manhattanbp.nyc.gov">hrivera@manhattanbp.nyc.gov</a> the PW-1 and PD-1 form and a copy of the ground floor plan of the proposed new or alteration of existing building. If you are merging or apportioning lot(s) you would also need to submit the RP-602 form signed by the Department of Finance showing the new lot number(s).</p>
        <p>When all required documents and payment are received the PD-1 will be stamp and a reservation letter will be issued reserving the appropriate house numbers for each entrance of the planned new or altered building. All Documents will be uploaded to the Address Status Locator when processed.</p>
        <p>The address verification fee is $250. Payment must be made by Cashiers' Check or Money Order made payable to "The Manhattan Borough President's Office". All other forms of payment will be returned and delay the processing of your request.</p>
        <p>Once all the work is near completion applicants will need to request permanent house number(s).</p>
      </div>
    </div>
    <div class="col">
      <h3>Permanent house number assignment</h3>
      <div class="mr-1 pr-1 mh-vh-50">
        <p>To request permanent house number(s) assignment.  E-mail a request letter asking this office to permanently assign house number(s) to the newly constructed or newly altered building located on Manhattan Block (?), Lot (?). You would include copies of the original PW-1 and PD-1 that were stamped at the beginning of the project and a copy of the approved ground floor plan showing the building entrances. All Documents will be uploaded to the Address Status Locator when processed.</p>
        <p>The permanent house number assignment fee is $300 per address. Payment must be made by Cashiers' Check or Money Order made payable to <b>"The Manhattan Borough President's Office".</b>  All other forms of payment will be returned and delay the processing of your request.</p>
        <p>Each block and lot in Manhattan have a slated address range, this is what you see in DOB profile, but the Manhattan Borough President's Office only officially assign permanent house numbers (addresses) to built entrances of buildings.</p>
      </div>
    </div>
  </div>
  <div id="map">

    <div class="row">
      
    </div>
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