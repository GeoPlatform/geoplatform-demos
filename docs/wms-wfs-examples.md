# GeoPlatform WMS and WFS examples

## Background
GeoPlatform uses [GeoServer](http://geoserver.org/) to serve up [WMS](https://docs.geoserver.org/maintain/en/user/services/wms/reference.html) and [WFS](https://docs.geoserver.org/maintain/en/user/services/wfs/reference.html) services. 

## Viewing and Previewing GeoPlatform WMS and WFS layers
This section covers exploring and previewing GeoPlatform WMS and WFS layers. 
1. Open [GeoServer's Layer Preview](https://geoserver.geoplatform.gov/geoserver/web/wicket/bookmarkable/org.geoserver.web.demo.MapPreviewPage?1&filter=false) page in a browser. The layer preview page contains a list of GeoPlatform WMS and WFS layers that may be previewed or consumed as services. 
2. To view a WMS layer click the OpenLayers link
![OpenLayers](https://user-images.githubusercontent.com/61807178/156367976-901dbb9f-6897-4ba5-b401-8559aa8832cf.png)
3. Clicking on the OpenLayers link will display the [WMS layer in a OpenLayers application](https://geoserver.geoplatform.gov/geoserver/ngda/wms?service=WMS&version=1.1.0&request=GetMap&layers=ngda%3A0711e7ef_fc6a_48d9_ad0a_9943706cafda&bbox=-82.9821201583609%2C24.3953900419913%2C-66.9107659383028%2C44.768991173469&width=605&height=768&srs=EPSG%3A4326&styles=&format=application/openlayers).
4. To view WFS features select the WFS --> GeoJSON option from under the __All Formats__ dropdown menu. 
![AllFormatsMenu](https://user-images.githubusercontent.com/61807178/156369925-54fb2deb-283d-401a-8578-f7b8dfc60113.png)
5. Clicking on the WFS --> GeoJSON option under the __All Formats__ menu will show the features of the [WFS layer in JSON format](https://geoserver.geoplatform.gov/geoserver/ngda/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ngda%3A0711e7ef_fc6a_48d9_ad0a_9943706cafda&maxFeatures=50&outputFormat=application%2Fjson). 

## Consuming WMS and WFS Services with Mapping APIs 
This section covers how to consume services in ArcGIS javascript API and Leaflet API and provides JSFiddle examples. 

### Leaflet Examples
[Leaflet](https://leafletjs.com/) is a lightweight mapping API that can be used to display WMS and WFS services in a map. 

#### WMS 
WMS layers are loaded into a Leaflet application as a tile layer. The snippet below is an example of how to load a WFS in Leaflet. 
```
 var oilWells = L.tileLayer.wms('https://geoserver.geoplatform.gov/geoserver/wms', {
  //NOTE: the layers property is taken from the name column of the GeoPlatform GeoServer Layer Preview page (https://geoserver.geoplatform.gov/geoserver/web/wicket/bookmarkable/org.geoserver.web.demo.MapPreviewPage)
  layers: 'ngda:34aba574_67dc_4e9b_9dc4_38522dd30a8e,ngda:447c0ccf_9fcc_4faa_b4c9_d628e0ccadac',
  format: 'image/png',
  transparent: true
});
```
In the code example above, note the __layers__ property. The layers listed here correlate with the name field as listed on the [Layer Preview page](https://geoserver.geoplatform.gov/geoserver/web/wicket/bookmarkable/org.geoserver.web.demo.MapPreviewPage?1&filter=false)

[WMS Leaflet Example](https://jsfiddle.net/fgdc_gp_demos/cubs4p5t/5/)

#### WFS
WFS layers are loaded into a Leaflet application as a GeoServer WFS layer. The snippet below is an example of how to load a WFS in Leaflet. 
```
const wfsLayer = L.Geoserver.wfs(
  "https://geoserver.geoplatform.gov/geoserver/wfs",
  {
    layers: "ngda:0e3763a7_2f60_4c70_a937_858c821a4ea0"
  }
);
```
In the code example above, note the __layers__ property. The layers listed here correlate with the name field as listed on the [Layer Preview page](https://geoserver.geoplatform.gov/geoserver/web/wicket/bookmarkable/org.geoserver.web.demo.MapPreviewPage?1&filter=false)

[WMS Leaflet Example](https://jsfiddle.net/fgdc_gp_demos/ksah3w6e/5/)

### ArcGIS API Examples
[ArcGIS API](https://developers.arcgis.com/javascript/latest/) is mapping API that can be used to display WMS and WFS services in a map. 

#### WMS 
WMS layers are loaded into an ArcGIS API application as a WMS layer. The snippet below is an example of how to load a WFS into an ArcGIS application. 
```
  const wmsLayer = new WMSLayer({
    url: "https://geoserver.geoplatform.gov/geoserver/wms", // url to your WMS endpoint
    sublayers: [
      { name: "ngda:447c0ccf_9fcc_4faa_b4c9_d628e0ccadac" },
      { name: "ngda:34aba574_67dc_4e9b_9dc4_38522dd30a8e" }
    ]
  });
```
In the code example above, note the __sublayers__ property. The names listed here correlate with the name fields as listed on the [Layer Preview page](https://geoserver.geoplatform.gov/geoserver/web/wicket/bookmarkable/org.geoserver.web.demo.MapPreviewPage?1&filter=false)

[WMS ArcGIS API Example](https://jsfiddle.net/fgdc_gp_demos/4wj1vrkp/3/)

#### WFS
WFS layers are loaded into an ArcGIS API application as a WFS layer. The snippet below is an example of how to load a WFS in Leaflet. 
```
const wfsLayer = new WFSLayer({
  url: "https://geoserver.geoplatform.gov/geoserver/wfs", // url to your WFS endpoint
  name: "ngda:447c0ccf_9fcc_4faa_b4c9_d628e0ccadac", // name of the FeatureType
  popupEnabled: true //enable the popup
});
```
In the code example above, note the __name__ property. The name listed here correlate with the name field as listed on the [Layer Preview page](https://geoserver.geoplatform.gov/geoserver/web/wicket/bookmarkable/org.geoserver.web.demo.MapPreviewPage?1&filter=false)

[WFS ArcGIS API Example](https://jsfiddle.net/fgdc_gp_demos/h0qxdy2o/4/)