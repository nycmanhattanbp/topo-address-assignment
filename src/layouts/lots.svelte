<script>
  import { onMount } from 'svelte'
  import { link } from 'svelte-spa-router'
  import AddressTable from '../components/addressTable.svelte'
  export let params = {}
  let container
  let addresses
  let view
  let addressLayer
  let highlightSelect
  let lotDetails = {
    files: [],
    comments: '',
    type: ''
  }
  //remove all commas
  $: bbl = parseInt(params.bbl.split(',').join(''))

  //generate bbl

  $: bbl_break = {
    boro: bbl.toString()[0],
    block: bbl
      .toString()
      .slice(1, 6)
      .replace(/^0+/g, ''),
    lot: bbl
      .toString()
      .slice(6)
      .replace(/^0+/g, '')
  }

  onMount(() => {
    require([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer',
      'esri/widgets/Legend'
    ], (Map, MapView, FeatureLayer, Legend) => {
      const map = new Map({
        basemap: 'gray-vector'
      })

      view = new MapView({
        container,
        map,
        center: [-74.0034, 40.7128],
        zoom: 16
      })

      function createFillSymbol(value, color) {
        return {
          value: value,
          symbol: {
            color: color,
            type: 'simple-fill',
            style: 'solid',
            outline: {
              style: 'none'
            }
          },
          label: value
        }
      }

      const typeRenderer = {
        type: 'unique-value',
        field: 'BBL',
        defaultSymbol: {
          type: 'simple-fill',
          color: '#aaaaaa',
          style: 'solid',
          outline: {
            style: 'none'
          }
        },
        uniqueValueInfos: [createFillSymbol(bbl, '#ed5151')]
      }

      const plutoLayer = new FeatureLayer({
        url:
          'https://services9.arcgis.com/E91gVsRO3nuXX9et/ArcGIS/rest/services/mn_topo_pluto_public/FeatureServer/0',
        renderer: typeRenderer,
        opacity: 0.4,
        outFields: ['BBL', 'Type'],
        definitionExpression: `BBL = ${bbl}`
      })

      //add to map
      map.add(plutoLayer, 0)

      //zoom to plutoLayer extent
      plutoLayer
        .when(() => plutoLayer.queryExtent())
        .then(response => view.goTo(response.extent))

      //query for attachements on lot
      plutoLayer
        .when(() => plutoLayer.queryObjectIds())
        .then(objectIds => plutoLayer.queryAttachments({ objectIds }))
        .then(attachements => {
          lotDetails.files = Object.keys(attachements).reduce(
            (all, key) => [...all, ...attachements[key]],
            []
          )
        })

      //query for addresses
      plutoLayer.queryFeatures().then(results => {
        const geometry = results.features[0].geometry
        const { attributes } = results.features[0].toJSON()
        lotDetails.comments = attributes['Comments']
        lotDetails.type = attributes['Type']
        //add address layer
        addressLayer = new FeatureLayer({
          url:
            'https://services9.arcgis.com/E91gVsRO3nuXX9et/ArcGIS/rest/services/mn_topo_addresses_public/FeatureServer/0',
          popupTemplate: {
            title: '{House_Num} {Street}',
            content: [
              {
                type: 'fields',
                fieldInfos: [
                  {
                    fieldName: 'House_Num',
                    label: 'House Number'
                  },
                  {
                    fieldName: 'Street',
                    label: 'Street'
                  },
                  {
                    fieldName: 'SAF_Type',
                    label: 'SAF Type'
                  },
                  {
                    fieldName: 'Primary_',
                    label: 'Is Primary'
                  },
                  {
                    fieldName: 'Posted',
                    label: 'Is Posted'
                  },
                  {
                    fieldName: 'Comments',
                    label: 'Comments'
                  }
                ]
              },
              { type: 'attachments' }
            ]
          }
        })

        //add legend
        const legend = new Legend({
          view,
          layerInfos: [
            {
              layer: addressLayer,
              title: 'Addresses'
            },
            {
              layer: plutoLayer,
              title: 'Parcels/ Lots'
            }
          ]
        })

        view.ui.add(legend, 'bottom-right')

        map.add(addressLayer, 1)

        //filter for address that is within 10 feet of buffer of bbl
        view
          .whenLayerView(addressLayer)
          .then(layerView => {
            layerView.filter = {
              geometry,
              spatialRelationship: 'contains',
              distance: 5,
              units: 'feet'
            }
          })
          .then(() => {
            const query = addressLayer.createQuery()
            query.geometry = geometry
            query.spatialRelationship = 'contains'
            query.distance = 5
            query.units = 'feet'
            return queryFeaturesItem(addressLayer, query)
          })
          .then(features => {
            addresses = features
            //reset view
            view
              .whenLayerView(addressLayer)
              .then(layerView => (layerView.filter = { where: '1=1' }))
          })
      })
    })
  })

  function queryFeaturesItem(layer, query) {
    return layer
      .queryFeatures(query)
      .then(results => {
        //convert to json, extract k/v, then
        return results.features.map(feature => {
          const { attributes } = feature.toJSON()
          const {
            House_Num: houseNum,
            Street: street,
            FID: id,
            SAF_Type: type,
            EditDate: lastEdit
          } = attributes
          return {
            houseNum: houseNum ? houseNum : '_', //default if null
            street: street ? street : '_', //default if null
            id,
            type,
            lastEdit,
            feature,
            files: []
          }
        })
      })
      .then(async features => {
        if (features.length === 0) {
          return features
        }
        //query for attachements
        const objectIds = features.map(feature => feature.id)
        const attachements = await layer.queryAttachments({
          objectIds: objectIds
        })
        //bind to features
        Object.keys(attachements).forEach(id => {
          const feature = features.find(feature => feature.id.toString() === id)
          feature.files = attachements[id].map(item => item.url)
        })
        return features
      })
      .catch(error => console.log(error.message))
  }

  function highlightAddress(event) {
    if (addressLayer) {
      view.whenLayerView(addressLayer).then(layerView => {
        if (highlightSelect) {
          highlightSelect.remove()
        }
        highlightSelect = layerView.highlight(event.detail.feature)
      })
    }
  }
</script>

<div class="container">
  <h3 class="is-3">Lot Information</h3>
  <p class="is-6 subtitle">Boro-Block-Lot: {bbl}</p>
  <ul>
    <li>
      <a
        href="{`https://zola.planning.nyc.gov/l/lot/${bbl_break.boro}/${bbl_break.block}/${bbl_break.lot}`}"
        target="_blank"
        rel="noopener noreferrer"
        >View ZOLA</a
      >
    </li>
    <li>
      <a
        href="{`http://a836-acris.nyc.gov/bblsearch/bblsearch.asp?borough=${bbl_break.boro}&block=${bbl_break.block}&lot=${bbl_break.lot}`}"
        target="_blank"
        rel="noopener noreferrer"
        >View ACRIS</a
      >
    </li>
    <li>
      <a
        href="{`http://a810-bisweb.nyc.gov/bisweb/PropertyBrowseByBBLServlet?allborough=${bbl_break.boro}&allblock=${bbl_break.block}&alllot=${bbl_break.lot}&go5=+GO+&requestid=0`}"
        target="_blank"
        rel="noopener noreferrer"
        >View DOB</a
      >
    </li>
  </ul>

  {#if lotDetails.type}
  <p><strong>Type: </strong>{lotDetails.type}</p>
  {/if} {#if lotDetails.comments}
  <p><strong>Comments: </strong>{lotDetails.comments}</p>
  {/if}

  <p><strong>Files</strong></p>
  {#if lotDetails.files.length}
  <ul>
    {#each lotDetails.files as lot}
    <li>
      <a href="{lot.url}" target="_blank" rel="noopener noreferrer"
        >{lot.name}</a
      >
    </li>
    {/each}
  </ul>

  {:else}
  <p>No files attached to this lot</p>
  {/if}

  <hr />

  {#if addresses} {#if addresses.length}
  <p><strong>There are {addresses.length} addresses for this lot.</strong></p>

  <AddressTable {addresses} on:message="{highlightAddress}"></AddressTable>
  {:else}
  <p>
    <strong
      >No addresses mapped in the database, please view the files above.</strong
    >
  </p>
  {/if} {:else}
  <p>Loading...</p>
  {/if}

  <br />

  <div id="map" bind:this="{container}"></div>
  <hr />
  <a href="/" use:link>Go back to main page</a>
</div>

<style>
  :global(.esri-legend) {
    max-height: 150px !important;
  }

  #map {
    max-width: 1000px;
    height: 500px;
  }
</style>
