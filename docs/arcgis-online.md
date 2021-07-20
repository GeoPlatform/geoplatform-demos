# ArcGIS Online

## ArcGIS Online example using a tile service and WMS to add zip code layers to a map
This example goes through the steps to create a new map in ArcGIS Online and then add a basemap, a tile layer, and a WMS layer.

This example will be using services listed on the Geoplatform [Census 5-Digit ZIP Code Tabulation Area](https://www.geoplatform.gov/metadata/895888d3-4f32-5143-88e2-e7b3612891f0) metadata page.

* Geoplatform Tile Service: https://tileservice.geoplatform.gov/tile/edd18cd7_7adc_4428_a6d9_81072155427e/{z}/{x}/{y}.png

* Web Map Service: https://tigerweb.geo.census.gov/arcgis/services/TIGERweb/tigerWMS_Current/MapServer/WMSServer

If you are new to ArcGIS Online see: [Get started with ArcGIS Online](https://learn.arcgis.com/en/projects/get-started-with-arcgis-online/).

If you don't have a Geoplatform ArcGIS Online account, see [GeoPlatform.gov Account Registration for GeoPlatform ArcGIS Online](https://geoplatform.atlassian.net/wiki/spaces/GC/pages/833552385/GeoPlatform.gov+Account+Registration+and+Sign-In+Instructions+for+GeoPlatform+ArcGIS+Online).

### Example Steps
1. Open https://geoplatform.maps.arcgis.com/home/index.html and sign in with your account.![Signin](https://user-images.githubusercontent.com/64213093/124012833-d239de00-d99e-11eb-867b-a358d7d1eec6.png)
2. To find links to resources and the the tile service layer go to [Census 5-Digit ZIP Code Tabulation Area](https://www.geoplatform.gov/metadata/895888d3-4f32-5143-88e2-e7b3612891f0) metadata page.![get-raster-url](https://user-images.githubusercontent.com/64213093/124013793-f9dd7600-d99f-11eb-8894-b94a17bc3b3b.png)
3. In ArcGIS Online click on the map tab and click on Add and select Add Layer from Web.![map-screen](https://user-images.githubusercontent.com/64213093/122100865-e55e8280-cdd0-11eb-9ad4-fae8f3b204a0.png)
4. In the Add Layer from Web dialog, change the type of data your are referencing to "A Tile Layer" and add the copied URL.![add-tile-url](https://user-images.githubusercontent.com/64213093/122101444-88170100-cdd1-11eb-8265-5b8078678000.png)
5. From the Census 5-Digit ZIP Code Tabulation Area metadta page get the link to the WMS.![get-wms-url](https://user-images.githubusercontent.com/64213093/124016161-9274f580-d9a2-11eb-9835-cd19e93caf07.png)
6. On the ArcGIS Online web page click on the map tab and click on Add and select Add Layer from Web.
7. In the Add Layer from Web dialog, change the type of data your are referencing to "A WMS Web Service" and add the copied URL.![add-wms-url](https://user-images.githubusercontent.com/64213093/122102281-813cbe00-cdd2-11eb-9961-da770ee5f4c7.png)
8. In the Contents pane under the tigerWMS Current add the 2010 Censsus Zip Code Tabulation Areas Label.![add-wms-layer](https://user-images.githubusercontent.com/64213093/122102762-045e1400-cdd3-11eb-9f38-10cc3bc91148.png)
9. Final result.![result](https://user-images.githubusercontent.com/64213093/122103358-c3b2ca80-cdd3-11eb-96a3-de96896644d1.png)
10. To share the map first save it with at leaste one tag.![save-map](https://user-images.githubusercontent.com/64213093/122103446-dc22e500-cdd3-11eb-8992-20ec12d10087.png)
11. Then click the link button to get a shortened URL to the map.![share-map](https://user-images.githubusercontent.com/64213093/122103563-007ec180-cdd4-11eb-949c-39def0254b3d.png)
12. Link to the [final map](https://arcg.is/18eejj)





