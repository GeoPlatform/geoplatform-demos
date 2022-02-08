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
          laHighlights: []
        }
        var gBoundingPolygon = {}
        var gBBox = {}
        var gFeatureName = ''
        mapboxgl.accessToken =
          'pk.eyJ1IjoidXNhY2UiLCJhIjoiY2o1MDZscms4MDI4MjMycG1wa3puc212MCJ9.CW7edZMtlx5vFLNF5P-zTA'
        var map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/dark-v9',
          zoom: 5,
          center: [-122.447303, 37.753574],
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
              id: 'nad_r8',
              desc: 'National Address Data',
              type: 'circle',
              source: {
                type: 'vector',
                tiles: [
                  'https://geoplatform-cdn-temp.s3.amazonaws.com/tippecanoe/NAD/tiles/{z}/{x}/{y}.mvt'
                ],
                minzoom: 0,
                maxzoom: 12
              },
              'source-layer': 'nad',
              layout: {
                visibility: 'visible'
              },
              paint: {
                'circle-color': '#FF6E40',
                'circle-radius': {
                  type: 'exponential',
                  property: 'point_count',
                  stops: [
                    [96, 1],
                    [18333, 15]
                  ]
                },
                'circle-opacity': 0.2
              }
            },
            {
              id: 'nhd_waterbody',
              desc: 'NHD Waterbodies',
              type: 'fill',
              source: {
                type: 'vector',
                tiles: [
                  'https://sit-tileservice.geoplatform.info/vector/9e1b0d82_6095_5b94_ae66_9afeb1eacdfc/{z}/{x}/{y}.mvt'
                ],
                minzoom: 1,
                maxzoom: 13
              },
              'source-layer': 'NHDWaterbody',
              layout: {
                visibility: 'visible'
              },
              paint: {
                'fill-color': '#03A9F4'
              }
            },
            // {
            //   id: 'nld_leveed_areas',
            //   desc: 'NLD Leveed Areas',
            //   type: 'fill',
            //   source: {
            //     type: 'vector',
            //     tiles: [
            //       'https://s3.amazonaws.com/usace-maptiles-tests/nld-leveed-areas-fgz/{z}/{x}/{y}.pbf'
            //     ],
            //     minzoom: 1,
            //     maxzoom: 14
            //   },
            //   'source-layer': 'nld_national_april_2018_leveed_areas',
            //   layout: {
            //     visibility: 'visible'
            //   },
            //   paint: {
            //     'fill-color': '#B39DDB',
            //     'fill-opacity': 0.3
            //   }
            // },
            {
              id: 'laHighlights',
              desc: 'Leveed Area Highlights',
              type: 'fill',
              source: {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: highlightFeatures['laHighlights']
                }
              },
              layout: {
                visibility: 'visible'
              },
              paint: {
                'fill-color': '#FF3D00',
                'fill-opacity': 0.4
              }
            },
            {
              id: 'nhd_flowlines',
              desc: 'NHD Flow Lines',
              type: 'line',
              source: {
                type: 'vector',
                tiles: [
                  'https://sit-tileservice.geoplatform.info/vector/9e1b0d82_6095_5b94_ae66_9afeb1eacdfc/{z}/{x}/{y}.mvt'
                ],
                minzoom: 1,
                maxzoom: 14
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
            // {
            //   id: 'nld_centerlines',
            //   desc: 'NLD Center Lines',
            //   type: 'line',
            //   source: {
            //     type: 'vector',
            //     tiles: [
            //       'https://s3.amazonaws.com/usace-maptiles-tests/nld-centerlines-gz/{z}/{x}/{y}.pbf'
            //     ],
            //     minzoom: 1,
            //     maxzoom: 14
            //   },
            //   'source-layer': 'nld_national_april_2018_levee_centerlines',
            //   layout: {
            //     'line-join': 'round',
            //     'line-cap': 'round',
            //     visibility: 'visible'
            //   },
            //   paint: {
            //     'line-color': '#673AB7',
            //     'line-width': 1
            //   }
            // },
            // {
            //   id: 'terrain',
            //   desc: 'Terrain',
            //   type: 'hillshade',
            //   source: {
            //     type: 'raster-dem',
            //     tiles: [
            //       'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
            //     ],
            //     tileSize: 256,
            //     minzoom: 0,
            //     maxzoom: 15
            //   },
            //   layout: {
            //     visibility: 'visible'
            //   },
            //   paint: {
            //     'hillshade-exaggeration': 0.8,
            //     'hillshade-shadow-color': '#0a0a0a',
            //     'hillshade-highlight-color': '#404040',
            //     'hillshade-accent-color': '#080808'
            //   }
            // },
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
              id: 'californiaHighlights',
              desc: 'California Building Highlights',
              type: 'fill',
              source: {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: highlightFeatures['california']
                }
              },
              layout: {
                visibility: 'visible'
              },
              paint: {
                'fill-color': '#FFFF00',
                'fill-outline-color': '#FFFF00'
              }
            },
            // {
            //   id: 'nhwy',
            //   desc: 'National Highway',
            //   type: 'line',
            //   source: {
            //     tiles: [
            //       'https://sit-tileservice.geoplatform.info/vector/ngda_nhpn/{z}/{x}/{y}.mvt'
            //     ],
            //     type: 'vector',
            //     minzoom: 6,
            //     maxzoom: 14
            //   },
            //   'source-layer': 'national_highway',
            //   layout: {
            //     visibility: 'visible',
            //     'line-cap': 'round',
            //     'line-join': 'round'
            //   },
            //   paint: {
            //     'line-opacity': 1,
            //     'line-color': 'rgb(255, 175, 109)',
            //     'line-width': 2
            //   }
            // },
            {
              id: 'plss',
              desc: 'Public Land Survey System (PLSS) - Townships',
              type: 'line',
              source: {
                tiles: [
                  'https://sit-tileservice.geoplatform.info/vector/9b59f427_c0ad_5f8b_ac22_2dbdac882dfa/{z}/{x}/{y}.mvt'
                ],
                type: 'vector',
                minzoom: 6,
                maxzoom: 12
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
            }
          ]
          var i = 0
          layers.forEach(layer => {
            if (layer.id === 'terrain') {
              //place terrain below waterway-river-canal layer
              map.addLayer(layer, 'waterway-river-canal')
            } else {
              map.addLayer(layer, firstSymbolId)
            }
            if (
              layer.id !== 'californiaHighlights' &&
              layer.id !== 'laHighlights'
            ) {
              createLegendItem(layer)
            }
            i++
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
            key.className = 'legend-key'
            key.id = 'lk-' + layer.id
            if (layer.id === 'terrain') {
              key.append(createLegendImage('fas fa-mountain', '#4d4d4d'))
            } else {
              if (layer.type == 'line') {
                key.style.backgroundColor = layer.paint['line-color']
              } else if (layer.type == 'circle') {
                key.style.backgroundColor = layer.paint['circle-color']
              } else {
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
            if (layer.id == 'plss') {
              legendBtn.style.width = '210px'
              legendBtn.style.textAlign = 'left'
            }
            item.appendChild(key)
            item.appendChild(legendBtn)
            legend.appendChild(item)
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
          }
        })

        //highlight buildings within a clicked leveed area
        map.on('click', 'nld_leveed_areas', function (e) {
          processHighlight(e, 'click')
        })

        map.on('zoomend', function (e) {
          //check if highlighted boundary polygons are on-screen
          if (
            map.queryRenderedFeatures({ layers: ['laHighlights'] }).length > 0
          ) {
            //update highlighted inner polygons
            if (
              map.getLayoutProperty('california', 'visibility') === 'visible'
            ) {
              awaitMapUpdate()
            }
          }
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
            highlightPolygon('laHighlights', gBoundingPolygon)
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
              map.project(new mapboxgl.LngLat(bbox[0], bbox[1])),
              map.project(new mapboxgl.LngLat(bbox[2], bbox[3]))
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
          map.getSource(name).setData({
            type: 'FeatureCollection',
            features: highlightFeatures['laHighlights']
          })
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

        map.addControl(new mapboxgl.NavigationControl())
      },
      {}
    ]
  },
  {},
  [1]
)
