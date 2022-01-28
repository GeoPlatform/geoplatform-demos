# Introduction

In order to create MVT tiles via TippeCanoe https://github.com/mapbox/tippecanoe it requires a GeoJSON file, high compute and memory servers, and the ability to create multiple variations of the tiles to determine which zoom ranges are best for each dataset. These steps make use of EC2 Spot instances to process the data. This directory contains several examples of using Tippecanoe to create MVT tiles, while each directory has more specific details regarding its respective source data. 


## Specification Document

For the purposes of this example, a 2 vCPU and 8GB machine should suffice for minimum requirements. For best results, it's recommended to consult the [Instance Advisor](https://aws.amazon.com/ec2/spot/instance-advisor/) prior to requesting the EC2 spot instance. By selecting an Instance Type with a low Frequency of Interruption, there is a low chance of encountering any `instance-terminated-no-capacity` errors. The *geojson_spec.json* and *mbtiles_spec.json* are working examples which contains the parameters for requesting the spot instances. 

> Note: `SIGNIFICANT_FIGURES=6` is included to round to 6 decimal places. This may not always be appropriate for polyline and polygon geometry.

## User Data

The `UserData` property within the *geojson_spec.json* and *mbtiles_spec.json* contains base64 encoded data which gives the ec2 instance instructions on bootup. These instructions are scripted out in *mbtiles.sh* and *geojson.sh* which are described below. 


**Creating the Geojson**
In order for TippeCanoe to work it requires the source file to be in a GeoJSON or .gz compressed version. Here you will find an example of how you can use EC2 to perform those actions leveraging Docker, ogr2ogr, gzip and S3 to store the output.  

For each directory, the commands for this step are generally located in the *geojson.sh* file. Here is an example:

```sh
#!/bin/bash
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker

# Download source and convert to GeoJSON
cd /tmp
aws s3 cp s3://nationaladdressdata/NAD_r8.zip nad_r8.zip
mv nad_r8.zip nad_r8.gdb.zip
sudo docker run -v /tmp:/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -f GeoJSON -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 /data/nad_r8.geojson /data/nad_r8.gdb.zip NAD

# Compress and upload file to S3
gzip -c nad_r8.geojson > nad_r8.geojson.gz
aws s3 cp nad_r8.geojson.gz s3://geoplatform-cdn-temp/tippecanoe/NAD/nad_r8.geojson.gz

sudo shutdown now
```

**Creating the Vector Tiles**

A second task of copying the compressed geojson files from the s3 location and running each of them through a `tippecanoe` command was performed next. Once all Geojson's have been converted to a MBtile file, they are joined together using the `tile-join` command. This merged MBtile file is then expanded into a tile directory and then synced to an s3 location. All other individual MBtile files are also copied to s3. 

For each directory, the commands for this step are generally located in the *mbtiles.sh* file. Here is an example:

```sh
#!/bin/bash
sudo yum update -y
sudo yum install -y git gcc sqlite-devel.x86_64
sudo yum groupinstall -y "Development Tools"

# Install tippecanoe
cd /tmp
git clone https://github.com/mapbox/tippecanoe.git
cd tippecanoe
make -j
sudo make install

# Download Data to process
sudo mkdir /var/data
sudo chown ec2-user:ec2-user /var/data
cd /var/data
# NOTE this file will need to change based on the source that needs to be generated
aws s3 cp s3://geoplatform-cdn-temp/tippecanoe/NAD/nad_r8.geojson.gz nad_r8.json.gz

# Process data
tippecanoe -o ./tiles.mbtiles --drop-densest-as-needed --extend-zooms-if-still-dropping -zg -P -l nad ./nad_r8.json.gz

# Store the created mbtiles file back to S3. This S3 file will need to change as needed for the variations generated
aws s3 cp tiles.mbtiles s3://geoplatform-cdn-temp/tippecanoe/NAD/nad_r8.mbtiles

# expand to tile directory
tile-join --force -pk -pC -n NAD -e ./tiles tiles.mbtiles 

# rename tile extensions to mvt
sudo find ./tiles -name '*.pbf' -exec rename .pbf .mvt {} +

# sync directory to s3
aws s3 sync ./tiles s3://geoplatform-cdn-temp/tippecanoe/NAD/tiles --no-progress --only-show-errors

sudo shutdown now

```
> It is important to have the final `sudo shutdown now` command followed by a new line to ensure that the server is terminated at the end of the process otherwise unwanted charges could occur if not properly shutdown.

### Encoding the User Data

To use the `mbtiles.sh` or `geojson.sh` in a specification document, it needs to be saved in base64. Generating base64 can be done from online websites or can be done locally using OpenSSL command. For Mac machines this should be available from the terminal. For Window users this does not come preloaded but is included with Git. Below is an example of how to reference a source file. 

```bash
# Mac Example
> openssl base64 -A -in ./geojson.sh -out ./geojson.txt

# Windows example
"C:\Program Files\Git\usr\bin\openssl.exe" base64 -A -in .\geojson.sh -out .\geojson.txt
```

Copy the contents of the output txt file to the `UserData` property of the target specification file. For example, the `geojson.txt` contents would be copied to the `UserData` property of `geojson_spec.json`. 

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

Once the *mbtiles* file(s) have been generated and stored on S3, explore theme locally follow these steps. These files are normally a few GB.

**Step 1**

Download the S3 file using something similar to this.

```bash
cd /my_data_folder
aws s3 cp s3://geoplatform-cdn-temp/tippecanoe/NAD/nad_r8.mbtiles NAD.mbtiles --profile sit
```

**Step 2**

Startup tileserver-gl which is a simple tileserver for MBTiles

```bash
cd /my_data_folder
docker run --rm -it -v ${PWD}:/data -p 8080:80 klokantech/tileserver-gl --mbtiles /data/NAD.mbtiles
```

> Note: if you are using windows \${PWD} works in Powershell terminals. If using Mac/Unix you can change `${PWD}` to `$(pwd)`

**Step 3**

Go to `http://localhost:8080` to explore the tiles.

# References

- [TippeCanoe User Guide](https://github.com/mapbox/tippecanoe)
- [Ogr2Ogr User Guide](https://gdal.org/programs/ogr2ogr.html)
- [Current Spot Pricing](https://aws.amazon.com/ec2/spot/pricing/)
- [How to view Spot history](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances-history.html)
- [TileServerGL User Guide](https://github.com/maptiler/tileserver-gl)