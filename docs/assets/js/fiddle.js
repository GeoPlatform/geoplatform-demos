/*jshint esversion: 6 */

// Set up the OSM layer
let background = new ol.layer.Tile({
    source: new ol.source.OSM({
      source: new ol.source.OSM()
    })
  });
  
  let style = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgb(0, 0, 0)',
      width: 2,
      opacity: 1,
    })
  });
  
  // add mapbox vector tile
  let mvt = new ol.layer.VectorTile({
    declutter: true,
    source: new ol.source.VectorTile({
      format: new ol.format.MVT(),
      url: 'https://tileservice.geoplatform.gov/vector/edd18cd7_7adc_4428_a6d9_81072155427e/{z}/{x}/{y}.mvt',
    }),
    style: style
  });
  
  let layers = [background, mvt];
  
  // Create the map
  let map = new ol.Map({
    layers: layers,
    target: 'map',
    view: new ol.View({
      center: ol.proj.transform([-105, 39.753056], 'EPSG:4326', 'EPSG:3857'),
      zoom: 12
    })
  });  