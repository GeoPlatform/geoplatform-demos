;(function () {
  function r (e, n, t) {
    function o (i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = 'function' == typeof require && require
          if (!f && c) return c(i, !0)
          if (u) return u(i, !0)
          var a = new Error("Cannot find module '" + i + "'")
          throw ((a.code = 'MODULE_NOT_FOUND'), a)
        }
        var p = (n[i] = { exports: {} })
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r]
            return o(n || r)
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        )
      }
      return n[i].exports
    }
    for (
      var u = 'function' == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i])
    return o
  }
  return r
})()(
  {
    1: [
      function (require, module, exports) {
        'use strict'
        var currentlySelectedFeatures = {
          nld_leveed_areas: [],
          california: []
        }
        var highlightFeatures = {
          california: [],
          // laHighlights: []
        }
        var gBoundingPolygon = {}
        var gBBox = {}
        var gFeatureName = ''
        var map = new maplibregl.Map({
          container: 'map',
          style: 'assets/style.json',
          zoom: 3.5,
          center: [-95.9, 38.65],
          hash: true,
          attributionControl: false
        })

        document
          .getElementById('lmin-btn')
          .addEventListener('click', minimizeLegend)

        function minimizeLegend (event, firstRun = false) {
          var legend = document.getElementById('legend')
          legend.style.width = '12px'
          legend.style.height = '25px'
          document.getElementById('lmin-btn').style.display = 'none'
          document.getElementById('lmax-btn').style.display = 'inline-block'
          document.getElementById('legend').style.cursor = 'pointer'
          document.getElementById('legend').style.paddingBottom = '0px'
          document.getElementById('legend').style.paddingTop = '5px'
          document.getElementById('legend').style.overflowX = 'hidden'
          document
            .getElementById('legend')
            .addEventListener('click', maximizeLegend, false)
          if (firstRun == false) {
            event.stopPropagation()
          }
        }

        function maximizeLegend () {
          var legend = document.getElementById('legend')
          legend.style.width = '230px'
          legend.style.height = 'auto'
          // if (
          //   typeof window.orientation !== 'undefined' ||
          //   navigator.userAgent.indexOf('IEMobile') !== -1
          // ) {
          //   legend.style.height = '220px'
          // } else {
          //   legend.style.height = '195px'
          // }
          document.getElementById('legend').style.padding = '10px'
          document.getElementById('legend').removeAttribute('cursor')
          document
            .getElementById('legend')
            .removeEventListener('click', maximizeLegend)
          document.getElementById('lmax-btn').style.display = 'none'
          document.getElementById('lmin-btn').style.display = 'inline-block'
        }

        map.on('load', function () {
          var layers = map.getStyle().layers
          // Find the index of the first symbol layer in the map style
          var firstSymbolId
          for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol') {
              firstSymbolId = layers[i].id
              break
            }
          }
          var layers = [
            {
              id: 'counties',
              desc: 'TIGER/Line Counties',
              metaUrl:
                'https://www.geoplatform.gov/metadata/836230cf-d6e7-5794-b10a-a8bef4be936e',
              type: 'line',
              minzoom: 6,
              maxzoom: 14,
              source: {
                tiles: [
                  'https://tileservice.geoplatform.gov/vector/be0505bd_9d19_4c07_ac97_09ca5873ed26/{z}/{x}/{y}.mvt'
                ],
                type: 'vector',
                minzoom: 6,
                maxzoom: 14
              },
              'source-layer': 'tl_2019_us_county',
              layout: {
                visibility: 'visible',
                'line-cap': 'round',
                'line-join': 'round'
              },
              paint: {
                'line-opacity': 0.25,
                'line-color': 'yellow',
                'line-width': {
                  type: 'exponential',
                  base: 2,
                  stops: [
                    [6, 0.5],
                    [10, 7],
                    [14, 14]
                  ]
                }
              }
            },
            {
              id: 'zipCodes',
              desc: 'TIGER/Line ZCTA5',
              metaUrl:
                'https://www.geoplatform.gov/metadata/05f9ea87-9242-5710-8730-1c3431dc0c7f',
              type: 'line',
              minzoom: 9,
              maxzoom: 14,
              source: {
                tiles: [
                  'https://tileservice.geoplatform.gov/vector/edd18cd7_7adc_4428_a6d9_81072155427e/{z}/{x}/{y}.mvt'
                ],
                type: 'vector',
                minzoom: 9,
                maxzoom: 14
              },
              'source-layer': 'tl_2019_us_zcta510',
              layout: {
                visibility: 'visible',
                'line-cap': 'round',
                'line-join': 'round'
              },
              paint: {
                'line-opacity': 0.75,
                'line-color': 'orange',
                'line-width': {
                  type: 'exponential',
                  base: 2,
                  stops: [
                    [9, 0.5],
                    [14, 5.5]
                  ]
                }
              }
            },
            {
              id: 'nad_r8',
              desc: 'National Address Data',
              metaUrl: null,
              type: 'circle',
              source: {
                type: 'vector',
                tiles: [
                  'https://geoplatform-cdn-temp.s3.amazonaws.com/tippecanoe/NAD/tiles/{z}/{x}/{y}.mvt'
                ],
                minzoom: 7,
                maxzoom: 15
              },
              'source-layer': 'nad',
              layout: {
                visibility: 'visible'
              },
              paint: {
                'circle-color': '#FF6E40',
                'circle-radius': {
                  stops: [
                    [7, 1],
                    [15, 4]
                  ]
                },
                'circle-opacity': 0.75
              }
            },
            {
              id: 'nhd_waterbody',
              desc: 'NHD Waterbodies',
              metaUrl:
                'https://sit.geoplatform.info/metadata/9e1b0d82-6095-5b94-ae66-9afeb1eacdfc',
              type: 'fill',
              source: {
                type: 'vector',
                tiles: [
                  'https://sit-tileservice.geoplatform.info/vector/9e1b0d82_6095_5b94_ae66_9afeb1eacdfc/{z}/{x}/{y}.mvt'
                ],
                minzoom: 1,
                maxzoom: 15
              },
              'source-layer': 'NHDWaterbody',
              layout: {
                visibility: 'visible'
              },
              paint: {
                'fill-color': '#03A9F4'
              }
            },
            {
              id: 'nhd_flowlines',
              desc: 'NHD Flow Lines',
              metaUrl:
                'https://sit.geoplatform.info/metadata/9e1b0d82-6095-5b94-ae66-9afeb1eacdfc',
              type: 'line',
              source: {
                type: 'vector',
                tiles: [
                  'https://sit-tileservice.geoplatform.info/vector/9e1b0d82_6095_5b94_ae66_9afeb1eacdfc/{z}/{x}/{y}.mvt'
                ],
                minzoom: 1,
                maxzoom: 15
              },
              'source-layer': 'NHDFlowline',
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
                visibility: 'visible'
              },
              paint: {
                'line-color': '#0277BD',
                'line-width': 1
              }
            },
            {
              id: 'structures',
              desc: 'Building Footprints',
              type: 'fill',
              source: {
                type: 'vector',
                tiles: [
                  'https://geoplatform-cdn-temp.s3.amazonaws.com/tippecanoe/structures/tiles/{z}/{x}/{y}.mvt'
                ],
                minzoom: 1,
                maxzoom: 15
              },
              'source-layer': 'structures',
              layout: {
                visibility: 'visible'
              },
              paint: {
                'fill-color': 'rgb(53, 175, 109)',
                'fill-outline-color': 'rgb(53, 175, 109)'
              }
            },
            {
              id: 'plss',
              desc: 'PLSS Townships',
              type: 'line',
              source: {
                tiles: [
                  'https://tileservice.geoplatform.gov/vector/9b59f427_c0ad_5f8b_ac22_2dbdac882dfa/{z}/{x}/{y}.mvt'
                ],
                type: 'vector',
                minzoom: 6,
                maxzoom: 14
              },
              'source-layer': 'PLSSTownship',
              layout: {
                visibility: 'visible',
                'line-cap': 'round',
                'line-join': 'round'
              },
              paint: {
                'line-opacity': 0.8,
                'line-color': 'rgb(1, 81, 131)',
                'line-width': 0.5
              }
            },
            {
              id: 'zipCodes-label', // append 'label' to an already existing id for legend toggling to work
              type: 'symbol',
              minzoom: 10,
              maxzoom: 14,
              source: {
                tiles: [
                  'https://tileservice.geoplatform.gov/vector/edd18cd7_7adc_4428_a6d9_81072155427e/{z}/{x}/{y}.mvt'
                ],
                type: 'vector'
              },
              'source-layer': 'tl_2019_us_zcta510',
              layout: {
                visibility: 'visible',
                'text-field': ['get', 'zcta5ce10'],
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  9,
                  10,
                  14,
                  22
                ]
              },
              paint: {
                'text-color': 'white',
                'text-halo-color': 'black',
                'text-halo-width': 0.5
              }
            },
            {
              id: 'counties-label', // append 'label' to an already existing id for legend toggling to work
              type: 'symbol',
              minzoom: 7,
              maxzoom: 12,
              source: {
                tiles: [
                  'https://tileservice.geoplatform.gov/vector/be0505bd_9d19_4c07_ac97_09ca5873ed26/{z}/{x}/{y}.mvt'
                ],
                type: 'vector'
              },
              'source-layer': 'tl_2019_us_county',
              layout: {
                visibility: 'visible',
                'text-field': ['get', 'namelsad'],
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  7,
                  10,
                  14,
                  32
                ]
              },
              paint: {
                'text-color': 'white',
                'text-halo-color': 'black',
                'text-halo-width': 0.5
              }
            }
          ]
          layers.forEach(layer => {
            map.addLayer(layer)
            if (layer.type !== 'symbol') {
              createLegendItem(layer)
            }
          })

          //minimize legend if mobile device
          if (
            typeof window.orientation !== 'undefined' ||
            navigator.userAgent.indexOf('IEMobile') !== -1
          ) {
            minimizeLegend(null, null, true)
          }
          document.getElementById('legend').style.visibility = 'visible'

          //create a single legend line item
          function createLegendItem (layer) {
            var item = document.createElement('div')
            var key = document.createElement('span')
            var zoomLevelDisplay = document.createElement('span')
            var metaLink = document.createElement('a')
            zoomLevelDisplay.classList.add('zoom-range')
            getZoomLevelRestrictions(zoomLevelDisplay, layer.source)
            metaLink.className = 'meta-link'
            metaLink.id = 'meta-link-' + layer.id
            metaLink.innerHTML = '<i class="fas fa-solid fa-info-circle"></i>'
            if (layer.metaUrl) {
              metaLink.href = layer.metaUrl
              metaLink.target = '_blank'
              var metaLinkTooltip = document.createElement('span')
              metaLinkTooltip.innerHTML = `Click to view full metadata record on Geoplatform.gov`
              metaLinkTooltip.classList.add('tooltip')
              metaLink.appendChild(metaLinkTooltip)
            } else {
              metaLink.style.visibility = 'hidden'
            }
            key.className = 'legend-key'
            key.id = 'lk-' + layer.id
            if (layer.id === 'terrain') {
              key.append(createLegendImage('fas fa-mountain', '#4d4d4d'))
            } else {
              if (layer.type == 'line') {
                key.style.backgroundColor = layer.paint['line-color']
              } else if (layer.type == 'circle') {
                key.style.backgroundColor = layer.paint['circle-color']
              } else if (layer.type == 'fill') {
                key.style.backgroundColor = layer.paint['fill-color']
              }
            }
            var legendBtn = document.createElement('button')
            legendBtn.className = 'legend-btn'
            legendBtn.innerHTML = layer.desc
            legendBtn.layerId = layer.id
            legendBtn.onclick = toggleMapLayer
            if (layer.layout.visibility === 'none') {
              key.style.visibility = 'hidden'
              legendBtn.classList.toggle('inactive')
            }
            item.appendChild(metaLink)
            item.appendChild(key)
            item.appendChild(legendBtn)
            item.appendChild(zoomLevelDisplay)
            legend.appendChild(item)
          }

          // display min to max zoom levels in legend if available
          async function getZoomLevelRestrictions (node, sourceInfo) {
            const { minzoom, maxzoom } = sourceInfo
            if (minzoom && maxzoom) {
              node.innerHTML = `z${minzoom}-${maxzoom}`

              var zoomLevelTooltip = document.createElement('span')
              zoomLevelTooltip.innerHTML = `Tiles are available for zoom range ${minzoom}-${maxzoom}`
              zoomLevelTooltip.classList.add('tooltip')
              node.appendChild(zoomLevelTooltip)
            }
          }

          //add image to a single legend line item
          function createLegendImage (className, classColor) {
            var keyIcon = document.createElement('i')
            keyIcon.className = className
            keyIcon.style.color = classColor
            keyIcon.style.fontSize = '9px'
            keyIcon.style.verticalAlign = 'middle'
            return keyIcon
          }

          //turn map layer on or off
          function toggleMapLayer (e) {
            var target = e.target || e.srcElement
            var layerVisability = map.getLayoutProperty(
              target.layerId,
              'visibility'
            )
            target.classList.toggle('inactive')
            if (layerVisability === 'visible') {
              map.setLayoutProperty(target.layerId, 'visibility', 'none')
              document.getElementById('lk-' + target.layerId).style.visibility =
                'hidden'
            } else {
              map.setLayoutProperty(target.layerId, 'visibility', 'visible')
              document.getElementById('lk-' + target.layerId).style.visibility =
                'visible'
            }

            // toggle label layer if exists
            const labelLayerId = `${target.layerId}-label`
            const labelLayer = map.getLayer(labelLayerId)
            if (labelLayer !== undefined) {
              const labelLayerVisibility = map.getLayoutProperty(
                labelLayerId,
                'visibility'
              )
              if (labelLayerVisibility === 'visible') {
                map.setLayoutProperty(labelLayerId, 'visibility', 'none')
              } else {
                map.setLayoutProperty(labelLayerId, 'visibility', 'visible')
              }
            }
          }
        })

        //highlight buildings within a clicked leveed area
        map.on('click', 'nld_leveed_areas', function (e) {
          processHighlight(e, 'click')
        })

        map.on('zoomend', function (e) {
          //check if highlighted boundary polygons are on-screen
          // if (
          //   map.queryRenderedFeatures({ layers: ['laHighlights'] }).length > 0
          // ) {
          //   //update highlighted inner polygons
          //   if (
          //     map.getLayoutProperty('california', 'visibility') === 'visible'
          //   ) {
          //     awaitMapUpdate()
          //   }
          // }
        })

        function awaitMapUpdate () {
          if (!map.areTilesLoaded('california')) {
            window.setTimeout(awaitMapUpdate, 100)
          } else {
            processHighlight('', 'zoomend')
          }
        }

        function processHighlight (e, eventType) {
          if (eventType === 'click') {
            gFeatureName = e.features[0].properties['FEATURE_NA']
            gBoundingPolygon = calculateBoundingPolygon(
              'nld_leveed_areas',
              'FEATURE_NA',
              gFeatureName
            )
            // highlightPolygon('laHighlights', gBoundingPolygon)
            //get polygons within the bbox (quick filter)
            gBBox = turf.bbox(gBoundingPolygon)
            currentlySelectedFeatures['california'] = getPolygonsWithinBBox(
              gBBox,
              'california'
            )
            //use turf to see which buildings overlap the leveed area (slow, accurate filter)
            highlightFeatures['california'] = getPolygonsWithinBoundingPolygon(
              'california',
              gBoundingPolygon
            )
            //update the geojson data for the highlight layer
            map.getSource('californiaHighlights').setData({
              type: 'FeatureCollection',
              features: highlightFeatures['california']
            })
            map.resize()
          } else if (eventType === 'zoomend') {
            currentlySelectedFeatures['california'] = getPolygonsWithinBBox(
              gBBox,
              'california'
            )
            highlightFeatures['california'] = getPolygonsWithinBoundingPolygon(
              'california',
              gBoundingPolygon
            )
            //update the geojson data for the highlight layer
            map.getSource('californiaHighlights').setData({
              type: 'FeatureCollection',
              features: highlightFeatures['california']
            })
            map.resize()
          }
        }

        //get polygons that fall within the bounding polygon. uses geospatial calculations
        function getPolygonsWithinBoundingPolygon (layerName, boundingPolygon) {
          var overlapCount = 0
          var tempHighlightFeatures = []
          var boundingPolygonType =
            (boundingPolygon.type === 'MultiPolygon' ||
              (boundingPolygon.geometry &&
                boundingPolygon.geometry.type === 'MultiPolygon')) === true
              ? 'mp'
              : 'p'
          for (
            var i = 0;
            i < currentlySelectedFeatures[layerName].length;
            i++
          ) {
            //split multipolygons
            if (
              currentlySelectedFeatures[layerName][i].geometry.type ==
              'MultiPolygon'
            ) {
              var multiPolygonContained = false
              currentlySelectedFeatures[layerName][
                i
              ].geometry.coordinates.forEach(function (coords) {
                if (
                  containsPolygon(
                    { type: 'Polygon', coordinates: coords },
                    boundingPolygon,
                    boundingPolygonType
                  )
                ) {
                  multiPolygonContained = true
                  tempHighlightFeatures.push({
                    type: 'Feature',
                    geometry: { type: 'Polygon', coordinates: coords },
                    properties: {}
                  })
                }
              })
              if (multiPolygonContained == true) {
                overlapCount++
              }
            } else if (
              containsPolygon(
                currentlySelectedFeatures[layerName][i].geometry,
                boundingPolygon,
                boundingPolygonType
              )
            ) {
              overlapCount++
              tempHighlightFeatures.push({
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates:
                    currentlySelectedFeatures[layerName][i].geometry.coordinates
                },
                properties: {}
              })
            }
          }
          return tempHighlightFeatures
        }

        //return a slice all polygons of the given layer. uses bbox
        function getPolygonsWithinBBox (bbox, layerName) {
          return map.queryRenderedFeatures(
            [
              map.project(new maplibregl.LngLat(bbox[0], bbox[1])),
              map.project(new maplibregl.LngLat(bbox[2], bbox[3]))
            ],
            {
              layers: [layerName]
            }
          )
        }

        //highlight the bounding box polygon and update the map
        function highlightPolygon (name, polygon) {
          highlightFeatures[name] = []
          if (polygon.type === 'Feature') {
            highlightFeatures[name].push(polygon)
          } else {
            highlightFeatures[name].push({
              type: 'Feature',
              geometry: polygon,
              properties: {}
            })
          }
          // map.getSource(name).setData({
          //   type: 'FeatureCollection',
          //   features: highlightFeatures['laHighlights']
          // })
          map.resize()
        }

        //calculate and return the bounding polygon of the clicked on area
        function calculateBoundingPolygon (layerName, filterName, filterValue) {
          //get all visible tiles for the clicked leveed area
          currentlySelectedFeatures[layerName] = map.queryRenderedFeatures({
            layers: [layerName],
            filter: ['==', filterName, filterValue]
          })
          var polygons = []
          for (var index in currentlySelectedFeatures[layerName]) {
            polygons.push(currentlySelectedFeatures[layerName][index].geometry)
          }
          //union the polygons together
          var boundingPolygon = polygons[0]
          if (polygons.length > 1) {
            for (var i = 1; i < polygons.length; i++) {
              boundingPolygon = turf.union(boundingPolygon, polygons[i])
            }
          }
          return boundingPolygon
        }

        //checks to see if the innerPolygon overlaps with, or is contained within, the bounding Polygon
        function containsPolygon (
          innerPolygon,
          boundingPolygon,
          boundingPolygonType
        ) {
          var containsBoolean = false
          //if bounding polygon is a multipolygon (mp), split it up
          if (boundingPolygonType === 'mp') {
            //return true if the innerPolygon is within or overlapping any of the boundingPolygons
            if (boundingPolygon.geometry) {
              boundingPolygon.geometry.coordinates.some(function (coords) {
                containsBoolean = containsPolygonHelper(innerPolygon, {
                  type: 'Polygon',
                  coordinates: coords
                })
                return containsBoolean
              })
            } else {
              boundingPolygon.coordinates.some(function (coords) {
                containsBoolean = containsPolygonHelper(innerPolygon, {
                  type: 'Polygon',
                  coordinates: coords
                })
                return containsBoolean
              })
            }
          } else {
            containsBoolean = containsPolygonHelper(
              innerPolygon,
              boundingPolygon
            )
          }
          return containsBoolean
        }
        function containsPolygonHelper (innerPolygon, boundingPolygon) {
          if (
            turf.booleanWithin(innerPolygon, boundingPolygon) ||
            turf.booleanOverlap(innerPolygon, boundingPolygon)
          ) {
            return true
          } else {
            return false
          }
        }

        map.addControl(new maplibregl.NavigationControl())

        map.on('load', () => {
          updateMapInfo()
        })

        function updateMapInfo () {
          const center = map.getCenter()
          const zoom = map.getZoom()
          document.getElementById('zoom').innerHTML = `Zoom: ${parseFloat(
            zoom
          ).toFixed(2)}`
        }

        function toggleLoadingState (on) {
          let elem = document.getElementById('map-loading')
          if (on) {
            elem.style.display = 'block'
          } else {
            elem.style.display = 'none'
          }
        }

        map.on('idle', ev => {
          toggleLoadingState()
        })
        map.on('drag', function () {
          toggleLoadingState(true)
        })
        map.on('zoom', function () {
          toggleLoadingState(true)
        })
        map.on('moveend', function (e) {
          updateMapInfo()
        })
        map.on('zoomend', function (e) {
          updateMapInfo()
        })
      },
      {}
    ]
  },
  {},
  [1]
)
