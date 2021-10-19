# Introduction

In order to create MVT tiles via TippeCanoe https://github.com/mapbox/tippecanoe it requires a GeoJSON file, high compute and memory servers, and the ability to create multiple variations of the tiles to determine which is best for the zoom ranges of 0-7. These steps make use of EC2 Spot intances to process the data. For demonstration the PLSS dataset will be used to walk through the process.

## Encoding User Data

When wanting to change the User Data for different sources and steps it needs to be saved in base64. Generating base64 can be done from online websites or can be done locally using OpenSSL command. For Mac machines this should be available from the terminal. For Window users this does not come preloaded but is included with Git. Below is an example of how to reference a source file. The output will be printed in the terminal and can be copy pasted into the specificaion.json document. Make sure to remove any spaces and line feeds.

```bash
# Mac Example
> openssl base64 -in /data/fgdc/userdata01.txt

# Windows example
"C:\Program Files\Git\usr\bin\openssl.exe" base64 -in D:\Data\fgdc\nad_r6\userdata01.txt
```

## Creating GeoJSON from the source

In order for TippeCanoe to work it requires the source file to be in a GeoJSON or .gz compressed version. Here you will find an example of how you can use EC2 to perform those actions leveraging Docker, ogr2ogr, gzip and S3 to store the output. When ogr2ogr runs it only uses one CPU and very little memory so the ideal machine at this time is the `c5.large` which is 2 vCPU and 4GB of memory which should be sufficient for most conversions.

**Specification Document**
```json
{
    "ImageId": "ami-087c17d1fe0178315",
    "KeyName": "geoplatform",
    "SecurityGroupIds": [ "sg-098a0214e40b42e6a" ],
    "InstanceType": "c5.large",
    "Placement": {
        "AvailabilityZone": "us-east-1a"
    },
    "IamInstanceProfile": {
        "Arn": "arn:aws:iam::998343784597:instance-profile/TippeCanoe"
    },
    "BlockDeviceMappings": [{
        "DeviceName": "/dev/xvda",
        "Ebs": {
            "DeleteOnTermination": true,
            "SnapshotId": "snap-0699a041095ac5492",
            "VolumeSize": 100,
            "VolumeType": "gp3",
            "Encrypted": false
        }
    }],
   "UserData":  "IyEvYmluL2Jhc2gNCnN1ZG8geXVtIHVwZGF0ZSAteQ0Kc3VkbyB5dW0gaW5zdGFsbCAteSBkb2NrZXINCnN1ZG8gc3lzdGVtY3RsIHN0YXJ0IGRvY2tlcg0KDQojIERvd25sb2FkIHNvdXJjZSBhbmQgY29udmVydCB0byBHZW9KU09ODQpjZCAvdG1wDQphd3MgczMgY3AgczM6Ly9uYXRpb25hbGFkZHJlc3NkYXRhL05BRF9yNy56aXAgbmFkX3I3LnppcA0KbXYgbmFkX3I3LnppcCBuYWRfcjcuZ2RiLnppcA0Kc3VkbyBkb2NrZXIgcnVuIC12IC90bXA6L2RhdGEgLS1uYW1lIEdEQUwgLS1ybSBvc2dlby9nZGFsOmFscGluZS1zbWFsbC1sYXRlc3Qgb2dyMm9nciAtZiBHZW9KU09OIC1sY28gU0lHTklGSUNBTlRfRklHVVJFUz02IC10X3NycyBjcnM6ODQgL2RhdGEvbmFkX3I3Lmdlb2pzb24gL3ZzaXppcC9kYXRhL25hZF9yNy5nZGIuemlwIE5BRA0KDQojIENvbXByZXNzIGFuZCB1cGxvYWQgZmlsZSB0byBTMw0KZ3ppcCAtYyBuYWRfcjcuZ2VvanNvbiA+IG5hZF9yNy5nZW9qc29uLmd6DQphd3MgczMgY3AgbmFkX3I3Lmdlb2pzb24uZ3ogczM6Ly9nZW9wbGF0Zm9ybS1jZG4tdGVtcC90aXBwZWNhbm9lL25hZF9yNy5nZW9qc29uLmd6DQoNCnN1ZG8gc2h1dGRvd24gbm93DQo="
}
```

**User Data**

```bash
#!/bin/bash

sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker

# Download source
cd /tmp
wget -O AL_CadNSDI_V2.gdb.zip https://navigator.blm.gov/api/share/9218950c3c621bfe

# Copy source to s3 
aws s3 cp AL_CadNSDI_V2.gdb.zip s3://geoplatform-cdn-temp/tippecanoe/AL_CadNSDI_V2.gdb.zip

# Convert source to GeoJSON
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/al.geojson /data/AL_CadNSDI_V2.gdb.zip PLSSTownship

# Compress the GeoJSON
gzip -c al.geojson > al.geojson.gz

# copy compressed GeoJSON to s3
aws s3 cp al.geojson.gz s3://geoplatform-cdn-temp/tippecanoe/al.geojson.gz

sudo shutdown now

```

> Note: that the size of the EBS storage will depend on the size of the source files. Good rule is to use a x25 multiplier from your source file. So if your source if 5GB create a drive that is 5 * 25 = 125 GB. Also note that `SIGNIFICANT_FIGURES=6` is included to round to 6 decimal places. This may not always be apporaite for polyline and polygon geometry.

To run the task it will utilize a EC2 Spot instance and execute based on the specificication document created. The `--spot-price` will need to be adjusted if the server is adjusted.

```bash
aws ec2 request-spot-instances --spot-price "0.1" --instance-count 1 --type "one-time" --launch-specification file://specification_geojson.json --profile sit
```


## Create the User Data

For each specification.json document created will have an associated userdata as well. These are the commands that the EC2 server will execute on bootup. It is important to have the final `sudo shutdown now` command followed by a new line to ensure that the server is terminated at the end of the process otherwise unwanted charges could occur if not properly shutdown.

The below is a sample of working commands that will install tippecanoe, download the file to process and when finished upload the generated output to S3 and then shut itself down. For NAD this whole execution takes around 2 to 4 hours to complete depending on the flags provided. When working with this file or any other source you will need to edit Line 18 (the source file and local name), Line 21 (the tippecanoe command to be executed), and Line 24 (where the file needs to be saved). It is recommend to create a userdata0x.txt file for each scenario to be executed before moving to the next step.

```bash
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
aws s3 cp s3://geoplatform-cdn-temp/tippecanoe/al.geojson.gz al.json.gz 

# Process data
tippecanoe -o ./al.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./al.json.gz


# Store the created mbtiles file back to S3. This S3 file will need to change as needed for the variations generated
aws s3 cp al.mbtiles s3://geoplatform-cdn-temp/tippecanoe/plss_al.mbtiles 

# repeat the above steps for all PLSS states, then do a tile join on all of them to create a national mbtiles:
tile-join --force -pk -pC -n township -o ./plss_national.mbtiles ./al.mbtiles ./ak.mbtiles ./ar.mbtiles ./ca.mbtiles ./co.mbtiles ./ia.mbtiles ./il.mbtiles ./in.mbtiles ./ks.mbtiles ./la.mbtiles ./mi.mbtiles ./mn.mbtiles ./mo.mbtiles ./ms.mbtiles ./mt.mbtiles ./nd.mbtiles ./nm.mbtiles ./ne.mbtiles ./nv.mbtiles ./oh.mbtiles ./or.mbtiles ./sd.mbtiles ./wy.mbtiles

# copy it to s3
aws s3 cp plss_national.mbtiles s3://geoplatform-cdn-temp/tippecano/plss_national.mbtiles 

# explode national tiles to a directory structure
sudo mkdir tiles
sudo chown ec2-user:ec2-user ./tiles
tile-join --force -pk -pC -n township -e ./tiles ./plss_national.mbtiles

# rename file extension from pbf to mvt
find ./tiles -name '*.pbf' -exec rename .pbf .mvt {} +

# sync .mvt tiles to s3 
aws s3 sync ./tiles s3://gp-sit-tileservice-tile-cache/vector/9b59f427-c0ad-5f8b-ac22-2dbdac882dfa --no-progress --only-show-errors

sudo shutdown now

```

> Note: Depending on if multiple tippe runs need to be done in parallel or on the same machine the User Data could run many tippecanoe commands on the same computer one after another. One benefit is that it does not need to download the file each time (which may be a cost to provider) so if the source if big and not within GeoPlatform S3 this could reduce some bandwidth charges in exchange for a longer runtime of a single instance. Just make sure to upload your mbtile then remove locally before starting the next variation otherwise the drive will quickly run out of space.

## Create the Specification Document

For each job you will want to create a 

```json
{
    "ImageId": "ami-087c17d1fe0178315",
    "KeyName": "geoplatform",
    "SecurityGroupIds": [ "sg-098a0214e40b42e6a" ],
    "InstanceType": "m5.4xlarge",
    "Placement": {
        "AvailabilityZone": "us-east-1a"
    },
    "IamInstanceProfile": {
        "Arn": "arn:aws:iam::998343784597:instance-profile/TippeCanoe"
    },
    "BlockDeviceMappings": [{
        "DeviceName": "/dev/xvda",
        "Ebs": {
            "DeleteOnTermination": true,
            "SnapshotId": "snap-0699a041095ac5492",
            "VolumeSize": 60,
            "VolumeType": "gp3",
            "Encrypted": false
        }
    }],
   "UserData": "{{base64_data_here}}"
}
```

## Generate MBTiles

To run the task it will utilize a EC2 Spot instance and execute based on the specificication document created. The `--spot-price` will need to be adjusted if the server is adjusted.

```bash
aws ec2 request-spot-instances --spot-price "0.4" --instance-count 1 --type "one-time" --launch-specification file://specification01.json --profile sit
aws ec2 request-spot-instances --spot-price "0.4" --instance-count 1 --type "one-time" --launch-specification file://specification02.json --profile sit
aws ec2 request-spot-instances --spot-price "0.4" --instance-count 1 --type "one-time" --launch-specification file://specification03.json --profile sit
```

## Previewing Output

Once the .mbtiles file(s) have been generated and stored on S3 those files are normally a few GB. To explore theme locally follow these steps.

**Step 1**

Download the S3 file using something similar to this.

```bash
cd /my_data_folder
aws s3 cp s3://geoplatform-cdn-temp/tippecanoe/plss_national.mbtiles tiles.mbtiles
```

**Step 2**

Startup tileserver-gl which is a simple tileserver for MBTiles

```bash
cd /my_data_folder
docker run --rm -it -v ${PWD}:/data -p 8080:80 klokantech/tileserver-gl --mbtiles /data/tiles.mbtiles
```

> Note: if you are using windows \${PWD} works in Powershell terminals. If using Mac/Unix you can change `${PWD}` to `$(pwd)`

**Step 3**

Go to `http://localhost:8080` to explore the tiles.

# References
TODO: add resources

- [TippeCanoe User Guide](https://github.com/mapbox/tippecanoe)
- [Ogr2Ogr User Guide](https://gdal.org/programs/ogr2ogr.html)
- [Current Spot Pricing](https://aws.amazon.com/ec2/spot/pricing/)
- [How to view Spot history](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances-history.html)
- [TileServerGL User Guide](https://github.com/maptiler/tileserver-gl)
- [Data Sources - pdf](https://nationalcad.org/download/PLSS-CadNSDI-Data-Set-Availability.pdf)

