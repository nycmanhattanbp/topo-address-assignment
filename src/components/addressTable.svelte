<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  export let addresses

  //sort by street then house number
  $: sortedAddresses = addresses.sort((a, b) =>
    a.street.toLowerCase() !== b.street.toLowerCase()
      ? a.street.toLowerCase().localeCompare(b.street.toLowerCase())
      : sortByNumber(a.houseNum, b.houseNum)
  )

  function sortByNumber(a, b) {
    const a_num = a.match(/\d+/)[0]
    const b_num = b.match(/\d+/)[0]
    return a_num !== b_num
      ? a_num - b_num
      : a.toLowerCase().localeCompare(b.toLowerCase())
  }

  function unixToUTC(seconds) {
    const date = new Date(seconds)
    const localeDate = date.toLocaleDateString('en-US')
    const localeTime = date.toLocaleTimeString('en-US')
    return `<abbr title="${localeDate} ${localeTime}">${localeDate}</abbr>`
  }

  function getFiles(files) {
    if (files.length > 0) {
      //35?w=400
      return `${files.length}`
    }
    return ''
  }

  function highlightAddress(feature) {
    dispatch('message', {
      feature
    })
  }
</script>

<div class="table-overflow">
  <table class="table is-hoverable is-fullwidth is-bordered">
    <thead>
      <th><abbr title="House number">House #</abbr></th>
      <th>Street</th>
      <th>Type</th>
      <th>Last Edit Date</th>
      <th>Files</th>
    </thead>
    <tbody>
      {#each sortedAddresses as address (address.id)}
      <tr on:click="{highlightAddress(address.feature)}">
        <td>{address.houseNum}</td>
        <td>{address.street}</td>
        <td>{address.type}</td>
        <td>{@html unixToUTC(address.lastEdit)}</td>
        <td>{@html getFiles(address.files)}</td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-overflow {
    overflow-x: auto;
    max-width: 90vw;
  }
</style>
