mapboxgl.accessToken = '{your_api_here}';
var map = new mapboxgl.Map({
    center: [-104.99, 39.75],
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 14
});

var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    maxWidth: 600
});

map.on('load', function() {

    var layers = [{
        "id": "nad_r5",
        "type": "circle",
        "source": {
            "type": "vector",
            "tiles": [
              "https://sit-tileservice.geoplatform.info/vector/nad_r5_tz/{z}/{x}/{y}.mvt"
            ],
            "minZoom": 0,
            "maxZoom": 14,
            "minzoom": 14,
            "maxzoom": 18
        },
        "source-layer": "nad_r5",
        "minzoom": 14,
        // "filter": ["all", ["!=", "addr_type", "Unknown"]],
        "layout": {"visibility": "visible"},
        "paint": {
          "circle-color": "rgba(18,172,235, 1)",
          "circle-radius": {
              stops: [
                  [0, 2],
                  [14, 2],
                  [16, 4],
                  [18, 8]
              ]
          }
        }
    }];

    layers.forEach((layer) => {
        map.addLayer(layer);
    });

    map.on('mouseenter', 'nad_r5', function (e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        console.log(e.features[0].properties)
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.add_number + ' ' + e.features[0].properties.streetname + ' ' + e.features[0].properties.stn_postyp;
        description += '<br>' + e.features[0].properties.county + ', ' + e.features[0].properties.state + ' ' + e.features[0].properties.zip_code;
        description += '<br><br>Source: ' + e.features[0].properties.source;
        description += '<br>Nat Grid Coordinate: ' + e.features[0].properties.natgrid_coord;
        description += '<br>Coordinates: ' + e.features[0].properties.latitude + ', ' + e.features[0].properties.longitude;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
         
        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });
         
    map.on('mouseleave', 'nad_r5', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
});
