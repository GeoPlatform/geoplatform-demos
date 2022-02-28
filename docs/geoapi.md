# GeoAPI Demo

## Background
[pygeoapi](https://github.com/geopython/pygeoapi), an is used to publish OGC Open API services on the web. In addition to publishing services, pygeoapi also provides easy to use ApenAPI Swagger documents and supports JSON, GeoJSON, HTML and CSV output. GeoPlatform uses pygeoapi to provide and API with Sweagger documentation for NGDAs. 

## Opening GeoAPI
This section covers opening GeoPlatform OGC GeoAPI Services. 
1. Open [GeoPlatform OGC GeoAPI Services](https://geoapi.geoplatform.gov/) in a browser.

## Viewing Collections
This section covers how to view GeoPlatform collections. 
1. Once [GeoPlatform OGC GeoAPI Services](https://geoapi.geoplatform.gov/) loads in your browser, click the __View the collections in this service__ link under the __Collections__ header. Clicking this link will open the __Collections in this service__ page. <br />
![geoapiCollections](https://user-images.githubusercontent.com/61807178/154780505-71a632bb-5c23-41f7-b6e1-ba0771c1a2ae.png)
2. The name, type and description of the collections are listed in the __Collections in this service__ page. <br />
![GeoPlatformCollections](https://user-images.githubusercontent.com/61807178/154976496-bbfe0fac-1113-4477-a155-d999ea840e61.png) 
3. To view on a collection click one of the linked names (e.g. Bailey's Ecoregions and Subregions Dataset). </br>
![BaileysEcoregion](https://user-images.githubusercontent.com/61807178/154977759-4b6d255a-d9d6-49fb-a020-24ff40eaca34.png)

## Browse a Collection's Features
This section covers exploring the individual items in a collection. The items are grouped in 10 item groups that can be paged through using the __Prev__ and __Next__ buttons below the map. The default limit of items to load per page may be set using the __Limit__ menu below the map.
1. With a collection open (e.g. [__Bailey's Ecoregions and Subregions Dataset__](https://geoapi.geoplatform.gov/collections/f5bfb616_0e64_4b2c_a2d7_268c01d8d28f)) Click on the __Browse through the items of "Bailey's Ecoregions and Subregions Dataset"__ </br>
![BrowsBaileys](https://user-images.githubusercontent.com/61807178/154979948-1f4a3ab7-a269-468a-b2f3-4844d27554a3.png)
2. Clicking the browse link opens a page with a map showing a subset of items' features with a table of items' attributes. </br>
![BrowseCollection](https://user-images.githubusercontent.com/61807178/154982859-2397a082-213b-45cb-95af-ec51a3d3ae83.png) 
### View an Individual Feature in a Collection
Individual collection items can be inspected and viewed on a map. Individual items may be loaded from the via map or via table. 
1. Click one of the items in the map to open the map information popup.  A numerical link to the item's id is shown. Click the link to open the item detail page. 
![itemLink_map](https://user-images.githubusercontent.com/61807178/154993771-46dd8c1e-23b8-4042-9acd-540a6230ec72.png)
2. Click one of the items' id length in the items table. </br>
![itemLink_table](https://user-images.githubusercontent.com/61807178/155006216-103da5a3-7d9f-4774-b10a-49d2e93ddada.png) 


#### Item Detail Page:
The item detail page shows the item and the attributes for the selected item.  
![ItemDetailPage](https://user-images.githubusercontent.com/61807178/154995428-4dabdc70-db3f-4b35-89ab-0e2cc2479ae3.png)

- Note the links to __JSON__ and __JSON-LD__ links on the right hand side of the menu bar if you would prefer the raw data of the item. </br>
![links_JSON](https://user-images.githubusercontent.com/61807178/155010218-80298fae-76a0-445a-850f-222988629235.png)


## View a Collection's Queryables 
Each collection has a list of fields described under the __Queryables__ page. 
1. With a collection open (e.g. [__Bailey's Ecoregions and Subregions Dataset__](https://geoapi.geoplatform.gov/collections/f5bfb616_0e64_4b2c_a2d7_268c01d8d28f)) Click on the __Display Queryables of "Bailey's Ecoregions and Subregions Dataset"__ </br>
2. Clicking the queryables link opens a page with a list of the collection's queryable fields. </br>
![Queryables](https://user-images.githubusercontent.com/61807178/155011558-72f38f1b-bd2c-4f15-b567-6360824ed072.png)

- Note the links to __JSON__ and __JSON-LD__ links on the right hand side of the menu bar if you would prefer the raw data of this collection's queryables. </br>
![links_JSON_general](https://user-images.githubusercontent.com/61807178/155012284-edb5b397-9abc-4610-a9b7-ad95e02d3247.png)

## Collection Links
Each collection have links to the GeoPlatform metadata record (e.g.[__Bailey's Ecoregions and Subregions Dataset__](https://geoplatform.gov/metadata/c871b1c5-6474-560b-89c6-5f9bc610b9f8)). In addition to the GeoPlatform metadata links to the collection, it's queryables and items list in __JSON__, __JSON-LS__ and __HTML__ format. </br>
![CollectionLinks](https://user-images.githubusercontent.com/61807178/155015626-bf094d44-d1d5-4b1e-9c3c-e04a4cec7946.png)

## JSON/JSON-LD Links
Note that any page in GeoAPI can be consumed in __JSON__ or __JSON-LD__ format by either clicking on the __json__ or __jsonld__ links on the right hand side of the menu bar or by adding ```f=json``` or ```f=jsonld``` parameters to any page.   </br>
![links_JSON_general](https://user-images.githubusercontent.com/61807178/155012284-edb5b397-9abc-4610-a9b7-ad95e02d3247.png)

