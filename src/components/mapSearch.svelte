<script>
  import { onMount } from 'svelte'
  export let view
  export let plutoLayer
  let container
  let map

  onMount(() => {
    require([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer',
      'esri/widgets/Legend'
    ], (Map, MapView, FeatureLayer, Legend) => {
      map = new Map({
        basemap: 'gray-vector'
      })

      view = new MapView({
        container,
        map,
        center: [-74.0034, 40.7128],
        zoom: 16
      })

      function createFillSymbol(value, color, outline) {
        return {
          value: value,
          symbol: {
            color: color,
            type: 'simple-fill',
            style: 'solid',
            outline: outline ? {color: outline, width: '0.5px'} : {
              style: 'none'
            }
          },
          label: value
        }
      }

      const typeRenderer = {
        type: 'unique-value',
        field: 'TYPE',
        defaultSymbol: {
          type: 'simple-fill',
          color: '#aaaaaa',
          style: 'solid',
          outline: {
            style: 'none'
          }
        },
        uniqueValueInfos: [
          createFillSymbol('New/Permanent', '#ed5151', false),
          createFillSymbol('Tentative', '#149ece', false),
          createFillSymbol('No Topo', '#ffde3e', [230, 0, 0, 0.75])
        ]
      }

      plutoLayer = new FeatureLayer({
        url:
          'https://services9.arcgis.com/E91gVsRO3nuXX9et/ArcGIS/rest/services/mn_topo_pluto_public/FeatureServer/0',
        renderer: typeRenderer,
        opacity: 0.4,
        outFields: ['BBL', 'Type'],
        popupTemplate: {
          title: 'Lot Information',
          content: [
            {
              type: 'text',
              text:
                '<strong><a href="#/lots/{BBL}">Click here to view more details</a></strong>'
            },
            {
              type: 'fields',
              fieldInfos: [
                {
                  fieldName: 'BBL',
                  label: 'Boro-Block-Lot',
                  stringFieldOption: 'text-box'
                },
                {
                  fieldName: 'Type',
                  label: 'Type/Status'
                },
                { fieldName: 'Comments', label: 'Comments' }
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
            layer: plutoLayer,
            title: 'Parcels/ Lots'
          }
        ]
      })

      view.ui.add(legend, 'bottom-right')

      map.add(plutoLayer, 0)
    })
  })
</script>

<div id="map" bind:this="{container}"></div>

<style>
  :global(.esri-legend) {
    max-height: 150px !important;
  }

  :global(.esri-feature__text a) {
    background-color: #ffcece;
  }

  #map {
    width: 100%;
    height: 100%;
  }
</style>
