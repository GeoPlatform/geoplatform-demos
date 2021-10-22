# Terriamap Demo

## Background
[Terriamap](https://github.com/TerriaJS/TerriaMap/) is a map application used to display geographic services of GeoPlatform NGDAs. Utilizing [terria.js](https://github.com/TerriaJS/terriajs), Terriamap enables users to search, view and explore catalogs of geographic tiles and services. URL encoded parameters can be used by GeoPlatform Terriamap to extend and augment the behavior of the map and resources on load. Used in conjunction with GeoPlatform API, specific datasets, types of dataset or service types can be configured as Terriamap loads. This document will give a general overview of the Terriamap UI and offer examples of using URL parameters in GeoPlatform Terriamap to dynamically load resources.  

## Opening Terriamap
This section covers opening Terriamap from GeoPlatform's main page. 
1. Open [GeoPlatform](https://beta.geoplatform.gov) in a browser.
2. Click __NGDA Themes__ option in the menu items at the top of the page to open the NGDA Themes page. <br />
![NGDA_THEMES_LINK](https://user-images.githubusercontent.com/61807178/120216939-a7286700-c205-11eb-899e-38468488d86d.png)
3. Click on the __Explore Now__ button in the __Discover Federal Geospatial Data__ panel at the right of the page to open Terriamap
![Explore_now](https://user-images.githubusercontent.com/61807178/120218114-469a2980-c207-11eb-97e2-0fac319639bc.png)
4. Terriamap will load.   

## Loading an NGDA
This section covers adding data from the Terriamap catalog. 
1. Click the __Add Data__ button in the left hand panel of Terriamap.  <br />
![AddData](https://user-images.githubusercontent.com/61807178/120309831-ae9e4d80-c2a3-11eb-83e3-3d51d54b2bc3.png)
2. In the resulting menu, click the __Utilities__ to expand it. With the __Utilities__ folder expanded click __Raster Tiles for Outer Continental Shelf Oil and Natural Gas Platforms - Gulf of Mexio Region NAD 27__  <br />
![SelectCatalogItem](https://user-images.githubusercontent.com/61807178/120310344-4c921800-c2a4-11eb-8a0c-59787e01fc31.png)

3. With the Natural Gas Platforms option selected, click the __Add to the map__ button in the preview map.  <br />
![AddToTHeMap](https://user-images.githubusercontent.com/61807178/120310937-ea85e280-c2a4-11eb-9198-0a4510bf22ee.png)

4. The Natural Gas Platforms option will be loaded into Terriamap's table of contents and map. 
![DataInMap](https://user-images.githubusercontent.com/61807178/120311630-b8c14b80-c2a5-11eb-9745-ec4ddda481b1.png)  

## Searching for a Specific Layer
This section covers searching for specific layer in Terriamap. 
1. Click the __Add Data__ button in the left hand panel of Terriamap. 
2. In the top left hand side of the resulting __Add Data__ menu, type 'Oil and Natural Gas' into the __Search the catalog__ text field. 
![SearchCatalog](https://user-images.githubusercontent.com/61807178/120320300-017e0200-c2b0-11eb-99fb-7aec3192f131.png)

## Adjusting Map Settings
This section describes the map setting options available in Terriamaps.
1. Click  the __Map__ button in the upper right row of map controls to open the map settings control. <br />
![MapSettings](https://user-images.githubusercontent.com/61807178/120322283-3c813500-c2b2-11eb-8905-5a717c8bab7b.png) 
2. Set the map view surface types - 3D Terrian, 3D Smooth or 2D. <br />
![MapViewSurface](https://user-images.githubusercontent.com/61807178/120326838-245fe480-c2b7-11eb-8324-665bd07e2720.png)
3. Choose a basemap from a list of options. <br />
![SelectBasemap](https://user-images.githubusercontent.com/61807178/120327556-e1524100-c2b7-11eb-9cb1-d3f168fac09f.png)\
4. Optimize performance settings. <br />
![PerformanceOptions](https://user-images.githubusercontent.com/61807178/120327894-44dc6e80-c2b8-11eb-8d87-618744035f90.png)

## Sharing and Printing the Map
This section covers sharing and printing maps in Terriamaps
1. Click the __Share / Print__ button in the upper right row of map controls to open the Share/Print control. <br />
![SharePrintControl](https://user-images.githubusercontent.com/61807178/120331466-cb467f80-c2bb-11eb-8ae7-7eec48dc3f5c.png)
2. To share a link of the current map and settings a share link is provided. With the sharing/printing control open, click the __Copy__ button to copy the share link to the system clipboard. Paste the share link into any document that you would like to share your map in. <br />
![CopyShareLink](https://user-images.githubusercontent.com/61807178/120333573-d4385080-c2bd-11eb-8ae2-d7fd7bd8f3b0.png)
3. To show a print preview of your map, click the __Show Print View__ button. A view of your current map will be loaded into a fresh browser tab. <br />
![ShowPrintPreview](https://user-images.githubusercontent.com/61807178/120335162-4198b100-c2bf-11eb-9c6b-29288c3676f3.png)
4. To print your current map click the print button. A print preview window will open to show the preview of the map and the layer details. Select a printer and click __Save__. <br />
![PrintButton](https://user-images.githubusercontent.com/61807178/120336279-31350600-c2c0-11eb-824e-f2651679268d.png)
5. A code snippet to embed an iframe of the map into a web page is offered under the __Advanced options__ dropdown panel. Copy the code snippet into the HTML of a web page to display your current map. <br />
![AdvancedOptions](https://user-images.githubusercontent.com/61807178/120338174-fa5fef80-c2c1-11eb-82d8-a9333926def8.png)

## TerriaJS URL Parameters
Encoded URL parameters may be used to change the configuration of Terriamap as it loads. The documentation for using URL parameters to configure Terriamap can be found in the TerriaJS guide [Controlling with URL Parameters](https://docs.terria.io/guide/deploying/controlling-with-url-parameters/).

### TerriaJS Parameters
- clean	Don't load the default catalog files for this site.
- map=2d	Use the 2D (Leaflet) map, instead of the default.
- map=3d	Use the 3D (Cesium) map, instead of the default.
- map=3dSmooth	Use the 3D (Cesium) map without terrain, instead of the default.
- playStory=1	Automatically start playing the map's Story, if there is one.
- hideWorkbench=1	Collapse the workbench (left side) panel, useful for embedding. Also automatically plays a story, if there is one.
- mode=preview	Operate in "preview mode", which mostly means not showing a warning if the screen is small
- share=...	Load a map view previously saved using the "Share" function with URL shortening.
- start=...	Load a map view previously saved without URL shortening. The argument is a URL-encoded JSON structure defined using an internal format described below.

