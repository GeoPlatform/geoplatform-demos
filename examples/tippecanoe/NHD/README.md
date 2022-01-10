# Introduction

In order to create MVT tiles via TippeCanoe https://github.com/mapbox/tippecanoe it requires a GeoJSON file, high compute and memory servers, and the ability to create multiple variations of the tiles to determine which zoom ranges are best for each dataset. These steps make use of EC2 Spot intances to process the data. For demonstration the NHD dataset will be used to walk through the process. 

In order for TippeCanoe to work it requires the source file to be in a GeoJSON or .gz compressed version. Here you will find an example of how you can use EC2 to perform those actions leveraging Docker, ogr2ogr, gzip, Python and S3 to store the output.  

## Specification Document

This process is CPU and RAM intensive, requiring a minimum of 48gb of RAM to convert the the NHDFlowline dataset. Choosing an EC2 instance that has a high CPU count will improve the execution speed of the script.  For best results, it's recommended to consult the [Instance Advisor](https://aws.amazon.com/ec2/spot/instance-advisor/) prior to requesting the EC2 spot instance. By selecting an Instance Type with a low Frequency of Interuption, there is a low chance of encountering any `instance-terminated-no-capacity` errors. The *spec.json* is a working example which contains the parameters for requesting the spot instance. 

> Note: that the size of the EBS storage should be at least 200gb. The size of the *NHD_H_National_GDB.gdb* is ~86gb decompressed and intermediate geojson files will be 40gb+. Decompression of the Geodatabase is important for performance reasons. Also note that `SIGNIFICANT_FIGURES=6` is included to round to 6 decimal places. This may not always be apporaite for polyline and polygon geometry.


**Copying Source GDB**

A one-time task of copying the source GDB to our S3 bucket was ran to reduce bandwidth cost to the provider and speed up re-occuring downloads of the geodabase to the Spot Instance where the user data scripts will be ran. Run this just once from an EC2 in the us-east-1 region:

```bash
aws s3 cp s3://prd-tnm/StagedProducts/Hydrography/NHD/National/HighResolution/GDB/NHD_H_National_GDB.zip s3://geoplatform-cdn-temp/tippecanoe/NHD/NHD_H_National_GDB.zip
```

## User Data

The `UserData` property within the *spec.json* contains base64 encoded data which gives the ec2 instance instructions on bootup. These instructions are scripted out in *userdata.sh*. The script contains working commands that install Tippecanoem, Docker, copy the source GDB and run each target feature class through a series of commands to convert them to a MBTiles format. Once all feature classes have been converted to a MBTiles format, they are joined together using the `tile-join` command, expanded to a tile directory and copied/synced to s3.  It is important to have the final `sudo shutdown now` command followed by a new line to ensure that the server is terminated at the end of the process otherwise unwanted charges could occur if not properly shutdown.


**Bootloading the Processing Script**

Because of the size of the NHD data, using a regular ogr2ogr command is not practical so a python script is used to iterate features providing a more optimized result. For specifics on how the the feature classes are read and converted to a GeoJSONSeq file, take a look at *tools/gdb_to_geojsonseq.py*.

The Geojson Sequence format was chosen for its ability to be read in parrellel using Tippecanoe. This format follows specification [rfc8142](https://datatracker.ietf.org/doc/html/rfc8142#section-2). 


> Note: Depending on if multiple tippe runs need to be done in parallel or on the same machine the User Data could run many tippecanoe commands on the same computer one after another. One benefit is that it does not need to download the file each time (which may be a cost to provider) so if the source is big and not within GeoPlatform S3 this could reduce some bandwidth charges in exchange for a longer runtime of a single instance. Just make sure to upload your mbtile then remove locally before starting the next variation otherwise the drive will quickly run out of space.

### Encoding the User Data

When wanting to change the User Data for different sources and steps it needs to be saved in base64. Generating base64 can be done from online websites or can be done locally using OpenSSL command. For Mac machines this should be available from the terminal. For Window users this does not come preloaded but is included with Git. Below is an example of how to reference a source file. 

```bash
# Mac Example
> openssl base64 -A -in ./userdata.sh -out ./userdata.txt

# Windows example
"C:\Program Files\Git\usr\bin\openssl.exe" base64 -A -in .\userdata.sh -out .\userdata01.txt
```

## Execute the Script

To run the task it will utilize a EC2 Spot instance and execute based on the specificication document created. The `--spot-price` will need to be adjusted if the server is adjusted.

```bash
aws ec2 request-spot-instances --spot-price "0.4" --instance-count 1 --type "one-time" --launch-specification file://UserData/mbtiles_spec.json --profile sit
```

Once the EC2 Spot Instance is executed successfully, you can optionally log into the console, connect to the instance and monitor the execution of the *UserData* startup script with:

```bash
sudo tail -f /var/log/cloud-init-output.log
```

## Previewing Output

Once the .mbtiles file(s) have been generated and stored on S3 those files are normally a few GB. To explore theme locally follow these steps.

**Step 1**

Download the S3 file using something similar to this.

```bash
cd /my_data_folder
aws s3 cp s3://geoplatform-cdn-temp/tippecanoe/NHD/mbtiles/NHD.mbtiles NHD.mbtiles
```

**Step 2**

Startup tileserver-gl which is a simple tileserver for MBTiles

```bash
cd /my_data_folder
docker run --rm -it -v ${PWD}:/data -p 8080:80 klokantech/tileserver-gl --mbtiles /data/NHD.mbtiles
```

> Note: if you are using windows \${PWD} works in Powershell terminals. If using Mac/Unix you can change `${PWD}` to `$(pwd)`

**Step 3**

Go to `http://localhost:8080` to explore the tiles.

# References

- [National Hydrography Dataset](https://prd-tnm.s3.amazonaws.com/index.html?prefix=StagedProducts/Hydrography/NHD/National/HighResolution/GDB/)
- [TippeCanoe User Guide](https://github.com/mapbox/tippecanoe)
- [Ogr2Ogr User Guide](https://gdal.org/programs/ogr2ogr.html)
- [Current Spot Pricing](https://aws.amazon.com/ec2/spot/pricing/)
- [How to view Spot history](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances-history.html)
- [TileServerGL User Guide](https://github.com/maptiler/tileserver-gl)

