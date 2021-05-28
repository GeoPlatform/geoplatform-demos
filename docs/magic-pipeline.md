# GeoPlarform Harvest Pipeline
The harvest pipeline is used to ensure that all metadata records and source data in GeoPlatform are up to date with published resources in Data.gov. GeoPlatform metadata record cache and services (raster and vector tiles, web map services and web features services) are monitored to ensure that they remain current with what is publised at Data.gov. Emails and reports are generated at crucial steps in the pipeline detailing the state of GeoPlatform's services.

The pipeline is broken up into two major tasks - caching metadata records displayed in GeoPlatform and managing the spatial data and services of the metadata's sources. Caching the metadata records and source data ensures that the metadata and services in GeoPlatform are kept in sync with the resources published at Data.gov

Each pipline task is broken up into seperate lambdas that perform specific tasks. The lambdas are initialized by timers and connected via SQS messages to orchestrate the operations of the pipeline task.

## Caching Metadata Records
Metadata records in GeoPlatform displayed using GeoNetwork. The state of each of the metadata records and sources are recorded in the Logic Map Table (LMT) database. When a record or its source are updated on Data.gov, the records in LMT are used to identify which record is outdated. Outdated records are managed by the pipeline to retrieve the current metadata records from Data.gov and cache it in an S3 bucket. Once the updated Data.gov record is cached in the S3 bucket, the GeoNetwork API is used to push the updated metadata record into GeoNetwork for discovery and display. Each of the seperate lambdas used for managing the metadata records are described below. 

### ExtractMetadataFromDataDotGov
ExtractMetadataFromDataDotGov is initialized daily via cron task. It first recieves a list of Data.gov records that have been updated since the last time ExtractMetadataFromDataDotGov executed. Each outdated record is loaded into an SQS queue that is listened for by CacheMetadataFromDataDotGov. 

* get last run date from LMT 
    * SELECT * FROM extract_data_gov_log ORDER BY last_run_dt DESC LIMIT 1;
* Determine start and end dates based on the last run date and the current execution date
    * startDate = last run date from the extract_data_gov_log logic map table
    * endDate = current execution date plus one day
* Get number of modified records since the startDate and endDate
    * use data.gov api package_search to find data.gov records that have been modified 
* Get the list of modified records since startDate and endDate for SQS messages
    * use data.gov api package_search to retrieve all modified records from data.gov
    * create an sqs message for each data.gov modified record and send to data-gov-cache-records
    * data-gov-cache-records is listend for by CacheMetadataFromDataDotGov 


    

### UpdateLMTNGDA
UpdateLMTNGDA filters a maintained list of NGDAs on s3 by ‘Approved’ status and retrieve counterpart records from Data.gov. Bulk load any missing registry and source records to LMT and update any registries and sources that have changed  in LMT.  Send email and report detailing the adds and updates. An SQS message will be sent to CacheMetadataFromDataGov to cache the new registry record’s metadata in the data-gov-cache S3 bucket.

* retrieve list of NGDAs (portfolioJSON)
* set option.sidecar to information on sub-file data layers from s3 bucket
* retrieve lists of approved entries (approvedPortfolio) from portfolioJSON
* fetch list of data.gov (dataDotGovResults) records matching approvedPortfolio
* a list of valid NGDAS (ngdaSources) are created from dataDotGovResults of known distribution or service formats.
* A list of registry record objects (registries) are created from ngdaSources
* fetch a list of registries from the database (existingRegistryRecs)
* create list existing data_dot_gov_dataset_id records (dbRegistryRecordLUT) from existingRegistryRecs  
* create lists of records for bulk insert (bulkRegistryRecs), and non bulk records (skipBulkRegistryRecs)
* Add bulkRegistryRecs to the database
* Retrieve list of of changes registries (changedRegistries) from existingRegistryRecs and skipBulkRegistryRecs (from CKAN)
* add changed registries to database
* create bulk sources records (bulkSourcesRecs)  
* get list of changed sources and update the changed sources
* send email and report with details on bulk and updated registry and sources records
* Create and send an sqs message to sit-update-geonetwork-from-s3 queue
* sit-update-geonetwork-from-s3 is listened for by UpdateGeoNetworkMetadata


### CacheMetadataFromDataDotGov
CacheMetadataFromDataDotGov is initialized via SQS message from ExtractMetadataFromDataDotGov or UpdateLMTNGDA. CacheMetadataFromDataDotGov retreives the metadata source record from Data.gov and saves it to the data-dot-gov S3 bucket. A registry record is created in LMT registry table if it does not yet exist.  A downstream SQS message is sent to UpdateGeoNetworkMetadata. An SQS message will be sent to CacheMetadataFromDataGov to cache the new registry record’s metadata in the data-gov-cache S3 bucket.

* Retrieve source metadata (harvestResponse) record from data.gov harvest endpoint
  * E.G. https://catalog.data.gov/harvest/object/bdbe64d9-3b44-47f0-9421-d37adbe9a702
* get the content type of the harvest object harvestResponseContentType
* Build a cache file (json or xml) from the harvestResponse 
* Find or create a registry record saving the file extension (harvestResponseContentType) 
* if file size is greater than 4 mb
  * emitRegistryStateEvent and return message details that the metadata file iwht the data.gov id is greater than  mb
* Save metadata record to data-gov-cache S3 bucket. 
* Create and send an sqs message to sit-update-geonetwork-from-s3 queue
* sit-update-geonetwork-from-s3 is listened for by UpdateGeoNetworkMetadata


### UpdateGeonetworkMetadata
UpdateGeonetworkMetadata receives registry id in payload. Retrieve registry item and associated geoplatformServices based in payload registry_id. Retrieve registry record’s metadata file from data-gov-cache S3 bucket. Update metadata record content with any updated metadata values or services. Saves to geonetwork via GeoNetwork API.

* retrieve registry item along with its associated geoplatform_service record
* get the registry item’s metadata file name and extension  type (metadataFileName)
* if the fileExtension is not xml then fire a registryEvent and return message ‘Not an XML file; skipping’
* authenticate with GeoNetwork and set xrst-token headers
* retrieve the registry record’s metadata file from s3 bucket data-gov-cache
* create uuid for the file with the title and DNS namespace and overwrite if different than what is in the metadata file
* set geonetwork_id = to uuid
* write NGDA Theme to metadata document
* write NGDA Community to metadata document
* create DigitalTransferOptions node in document
* if there are GeoPlatformServices write each of the GeoPlatformServices to the metadata services
* save the metadata record to geonetwork via the geonetwork api. 

## Managing Spatial Data
GeoPlatform spatial data is is extracted from metadata source references to create raster, vector, WMF and WFS services. These services are added to the GeoPlatform metadata records displayed in GeoNetwork. Each of the seperate lambdas used for managing spatial data are described below.

### AuditSourceDataset
AuditSourceDataset retrieves list of uninitiated, new and stale sources from LMT. Uninitiated metadata records are created in LMT. Source data referenc links are checked for changes in last_modified or content length headers to see if any of the source data has changed. If changes to last_modified date or content length are detected a downstream SQS message is sent to ProcessNGDAData. Update the LMT source record with the new last_modified and content_length values for future executions of AuditSourceDataset. An audit report is uploaded to a public S3 bucket.

* get all uninitialized sources from LMT (unintSources)
  * where metadata source ids are enabled and metadata.source_id is null
  * include metadata records
* get all new sources from LMT (newSources);
  * where source.enabled = true
  * include metadata records
* get all stale sources from LMT (staleSources);
  * where the last run in the metadata table is less than its time to live value
  * include metadata records
* loop each of the sources in uninitSources, newSources, staleSources source
  * get the the source with its metadata record
  * is source ready (enabled, not being processed and not obsolete)?
  * Get summary of the source metadata (etag, last_modified, content_length)
    * has source  changed?
      * If so send downstream message 
        * sit-magic-data-identify-sources
          * listened for by ExtractNGDAData
    * update the source metadata from the fetched metadata
      * (etag, last_modified, content_length)	

### ProcessNGDAData
Receives message notifying that a change in the source data has been detected. Upload source data with updated data and save in the tilegarden database. Update source metadata crud_status to ‘current’. Send SQS messages to downstream lambdas which create data artifacts, register geoserver WMS and WFS files and cache tilegarden raster and vector tiles. 

* if the event body has a source_id
  * get source with metadata based on source_id
  * check if metadata status is ‘IN_PROGRESS’
    * exit 
  * if metadata status is not ‘NEW’, ‘ERROR’ or ‘STALE’
    * set metadata crud status to ‘IN_PROGRESS’;
      
  * Initialize source metadata with crud_status of ‘IN_PROGRESS’ if missing and allowed
  * create a record with the body, source.href, source_tablename and source. 
* If the event body has sourceUri property
  * create a record of the event body
* Import source data
  * if the record is a feature services	
    * download json data from feature server
    * import file using GDAL
      * update source layer_type, layer_srs, layer_name & layer_extent with ogr information
        * import features into postgres database using OGR
  * if the record is a file url
    * download file 
    * import file using GDAL
      * update source layer_type, layer_srs, layer_name & layer_extent with ogr information
    * mport features into postgres database using OGR
  * return { success, result: history, message }
* Update source metadata record crud_status to ‘current’ or ‘error’;
* if import success 
  * send downstream messages
    * ‘populatetilegarden’
    * ‘geoserver’
    * ‘artifact:geojson’
    * ‘artifact:shp’
    * ‘artifact:gpkg’

### CreateArtifact
Creates file artifact from from tilegarden database and saves it to an s bucket. 

* invoked by ProcessNGDAData via sqs message
* get source by event source_id
* get registry by source.registry_id
* establish artifact type SHP, GEOJSON, GPKG (eventType & gdalFormat)
* get output file path and continuation 
* save postgresql table as artifact type using ogr2ogr
* after extract and postprocessing are complete
* send sqs message to populate-services
  * listened to by ProcessServiceBroker

### ProcessServiceBroker
Determines which downstream lambda gets called based on event payload properties. 

* invoked by ProcessNGDAData via sqs message
* Determine which lambda is invoked in the pipeline lambda_id of event body
  * RegisterNGDAGeoserver
  * PopulateTilegardenConfig
  * PopulateServicesAndDistributionsGeonetwork
* Invoke lambda with payload from input event. 

### PopulateServicesAndDistributionsGeonetwork
Creates a geoplatform_services record in LMT if needed and send a message to UpdateGeonetworkMetadata to update the metadata record data-gov-cache S3 bucket.; 

* invoked by ProcessServiceBroker via sqs message
* find or create a geoplatform service based on
* geonetworkId, protocol and serviceUrl
* send message to sqs queue update-geonetwork-from-s3
* listened to by UpdateGeonetworkMetadata

### PopulateTilegardenConfig
Save mapnik.xml template for source and precache tilegarden vector and raster tiles. Then sends an sqs message downstream to PopulateServicesAndDistributionsGeonetwork to update the metadata record in GeoNetwork and on the data-gov-cache S3 bucket to include tilegarden services.

* invoked by ProcessServiceBroker via sqs message
* get source from sourceId included in event payload
* get mapnick.xml handlebars template
* render the mapnick.xml template with the following source properties
  * layerName
  * layerSRS
  * layerType
  * layerExtent
  * mapSRS
  * tableName
* save rendered mapnik template to s3 bucket with the name of the source’s table_name or event table name. 
* Kick off precaching if enabled
  * tile-precacher-precache-tile queue
* kick off populategeonetwork 
  * populate-services queue

### RegisterNGDAGeoserver
Registers source data WFS and WMS resources on geoserver and send a message to PopulateServicesAndDistributionsGeonetwork to update the metadata record in GeoNetwork and on the data-gov-cache S3 bucket to include geoserver WMF and WFS services. 

* invoked by ProcessServiceBroker via sqs message
* retrieve sourceId from event payload
* get list of workspaces via geoserver API
* if there is no workspace via geoserver API
  * create ‘ngda’ workspace
  * create ‘ngda_datastore’ datastore
* get a list of datastores
* if there is no workspace
  * create ‘ngda_datastore’ datastore
* retrieve registry and source records from LMT 
* retrieve ngda_name from registry record
* retrieve a list of layers via geoserver API
* if layer list not listed on geoserver
  * register layer with geoserver
* add read role to layer based on the event.read_role property
* send sqs message to populate-services
  * received by popgeonetwork
  * payload
    * geonetwork_id
    * protocol (WMS, WFS)
    * url path of WMS or WFS
    * name (Web Map Service, Web Feature Service)
    * desc - ‘Provided by GeoPlatform’      
