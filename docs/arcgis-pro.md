# ArcGIS Pro

## ArcGIS example using a tile service laye and WMS to add a zip code layers
This example goes through the steps to create a new project in ArcGIS and then add a basemap, a tile layer, and a WMS layer.

This example will be using services listed on the Geoplatform [Census 5-Digit ZIP Code Tabulation Area](https://www.geoplatform.gov/metadata/895888d3-4f32-5143-88e2-e7b3612891f0) metadata page.

* Geoplatform Tile Service: https://tileservice.geoplatform.gov/tile/edd18cd7_7adc_4428_a6d9_81072155427e/{z}/{x}/{y}.png

* Web Map Service: https://tigerweb.geo.census.gov/arcgis/services/TIGERweb/tigerWMS_Current/MapServer/WMSServer

If you are new to ArcGIS Pro see: [ArcGIS Getting Started](https://www.esri.com/training/catalog/57630435851d31e02a43f007/getting-started-with-arcgis-pro/).

If you don't have ArcGIS Pro, they have a [Free Trial](https://www.esri.com/en-us/arcgis/trial?rsource=%2Fsoftware%2Farcgis%2Farcgis-for-desktop%2Ffree-trial).

### Example Steps
1. Open ArcGIS and start with a Map template![map-template](https://user-images.githubusercontent.com/64213093/122089770-55b2d700-cdc4-11eb-829a-cb3c31733b5d.png)
2. This will have the World Topographic Map and World Hillshade maps as basemaps.
3. To find links to resources and the the tile service layer go to [Census 5-Digit ZIP Code Tabulation Area](https://www.geoplatform.gov/metadata/895888d3-4f32-5143-88e2-e7b3612891f0) metadata page.![get-raster-url](https://user-images.githubusercontent.com/64213093/122091515-1c7b6680-cdc6-11eb-9910-dfc117c913d7.png)
4. Click on the View on Map button for the layer and copy the URL.![copy-raster-url](https://user-images.githubusercontent.com/64213093/122091753-5ea4a800-cdc6-11eb-970b-2de1daf6ad8a.png)
5. In ArcGIS click Add Data from Path.![add-data-to-path](https://user-images.githubusercontent.com/64213093/122091898-898efc00-cdc6-11eb-9afc-d77a99745617.png)
6. Add the copied URL for the tile service. ![enter-tile-path](https://user-images.githubusercontent.com/64213093/122092045-ba6f3100-cdc6-11eb-9cbd-1d26339ace7d.png)
7. From the Census 5-Digit ZIP Code Tabulation Area metadta page get the link to the WMS.
8. In ArcGIS add the WMS under Connections on the Insert tab.![add-wms connection](https://user-images.githubusercontent.com/64213093/122092652-687adb00-cdc7-11eb-881e-42b28d525502.png)
9. Enter the copied URL from the metadata page.

    ![add-wms-url](https://user-images.githubusercontent.com/64213093/122092730-7f213200-cdc7-11eb-8be1-b418df1ef98b.png)

11. In the Catalog pane add the Zip Code Tabulation Areas to the map.![add-to-current-map](https://user-images.githubusercontent.com/64213093/122093002-d32c1680-cdc7-11eb-8784-1562a6b29d6e.png)
12. The map now shows the zip code tabulation areas with labels.![result](https://user-images.githubusercontent.com/64213093/122093158-0078c480-cdc8-11eb-8612-5e623c7a3902.png)
