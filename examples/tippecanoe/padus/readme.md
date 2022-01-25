# Introduction

In order to create MVT tiles via TippeCanoe https://github.com/mapbox/tippecanoe it requires a GeoJSON file, high compute and memory servers, and the ability to create multiple variations of the tiles to determine which zoom ranges are best for each dataset. These steps make use of EC2 Spot instances to process the data. For demonstration the PADUS dataset will be used to walk through the process. 

In order for TippeCanoe to work it requires the source file to be in a GeoJSON or .gz compressed version. Here you will find an example of how you can use EC2 to perform those actions leveraging Docker, ogr2ogr, gzip and S3 to store the output.  

## Specification Document

For the purposes of this example, a 2 vCPU and 8GB machine should suffice for minimum requirements. For best results, it's recommended to consult the [Instance Advisor](https://aws.amazon.com/ec2/spot/instance-advisor/) prior to requesting the EC2 spot instance. By selecting an Instance Type with a low Frequency of Interruption, there is a low chance of encountering any `instance-terminated-no-capacity` errors. The *geojson_spec.json* and *mbtiles_spec.json* are working examples which contains the parameters for requesting the spot instances. 

> Note: that the size of the EBS storage should be at least 100gb. There are 9 geodatabases that will be copied.  Also note that `SIGNIFICANT_FIGURES=6` is included to round to 6 decimal places. This may not always be appropriate for polyline and polygon geometry.

## User Data

The `UserData` property within the *geojson_spec.json* and *mbtiles_spec.json* contains base64 encoded data which gives the ec2 instance instructions on bootup. These instructions are scripted out in *mbtiles.sh* and *geojson.sh* which are described below. 


**Creating the Geojson**

A one-time task of copying the source GDB's from the source location and converting the underlying feature classes to geojson was performed. These Geojson files were compressed and copied to our s3 bucket.  The original GDB can be found [here](https://www.sciencebase.gov/catalog/item/requestDownload/5f186a2082cef313ed843257?filePath=__disk__42%2F38%2Fd9%2F4238d97c123918fe95d0dfa13b99ff7c374a93f8). 

The commands for this step are located in the *geojson.sh* file. 


**Creating the Vector Tiles**

A second task of copying the compressed geojson files from the s3 location and running each of them through a `tippecanoe` command was performed next. Once all Geojsons have been converted to a MBtile file, they are joined together using the `tile-join` command. This merged MBtile file is then expanded into a tile directory and then synced to an s3 location. All other individual MBtile files are also copied to s3. 

The commands for this step are located in the *mbtiles.sh* file. 


> It is important to have the final `sudo shutdown now` command followed by a new line to ensure that the server is terminated at the end of the process otherwise unwanted charges could occur if not properly shutdown.

### Encoding the User Data

When wanting to change the User Data for different sources and steps it needs to be saved in base64. Generating base64 can be done from online websites or can be done locally using OpenSSL command. For Mac machines this should be available from the terminal. For Window users this does not come preloaded but is included with Git. Below is an example of how to reference a source file. 

```bash
# Mac Example
> openssl base64 -A -in ./geojson.sh -out ./geojson.txt

# Windows example
"C:\Program Files\Git\usr\bin\openssl.exe" base64 -A -in .\geojson.sh -out .\geojson.txt
```

## Execute the Script

To run the task it will utilize a EC2 Spot instance and execute based on the specification document created. The `--spot-price` will need to be adjusted if the server is adjusted.

```bash
aws ec2 request-spot-instances --spot-price "0.4" --instance-count 1 --type "one-time" --launch-specification file://geojson_spec.json --profile sit
```

Once the EC2 Spot Instance is executed successfully, you can optionally log into the console, connect to the instance and monitor the execution of the *UserData* startup script with:

```bash
sudo tail -f /var/log/cloud-init-output.log
```

## Previewing Output

Once the *PADUS.mbtiles* file(s) have been generated and stored on S3 those files are normally a few GB. To explore theme locally follow these steps.

**Step 1**

Download the S3 file using something similar to this.

```bash
cd /my_data_folder
aws s3 cp s3://geoplatform-cdn-temp/tippecanoe/padus/PADUS.mbtiles PADUS.mbtiles --profile sit
```

**Step 2**

Startup tileserver-gl which is a simple tileserver for MBTiles

```bash
cd /my_data_folder
docker run --rm -it -v ${PWD}:/data -p 8080:80 klokantech/tileserver-gl --mbtiles /data/PADUS.mbtiles
```

> Note: if you are using windows \${PWD} works in Powershell terminals. If using Mac/Unix you can change `${PWD}` to `$(pwd)`

**Step 3**

Go to `http://localhost:8080` to explore the tiles.

# References

- [PADUS Download](https://www.usgs.gov/programs/gap-analysis-project/science/pad-us-data-download?qt-science_center_objects=0#qt-science_center_objects)
- [TippeCanoe User Guide](https://github.com/mapbox/tippecanoe)
- [Ogr2Ogr User Guide](https://gdal.org/programs/ogr2ogr.html)
- [Current Spot Pricing](https://aws.amazon.com/ec2/spot/pricing/)
- [How to view Spot history](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances-history.html)
- [TileServerGL User Guide](https://github.com/maptiler/tileserver-gl)