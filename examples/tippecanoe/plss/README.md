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

If you encounter `instance-terminated-no-capacity` errors running a spot instance, use [Instance Advisor](https://aws.amazon.com/ec2/spot/instance-advisor/). Select an Instance Type with a low Frequency of Interuption. 
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

BASE_URL=s3://geoplatform-cdn-temp/tippecanoe
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker


#download gdb/shp
wget -O AL_CadNSDI_V2.gdb.zip https://navigator.blm.gov/api/share/9218950c3c621bfe
wget -O AK_CadNSDI.gdb.zip https://sdms.ak.blm.gov/download/landstatus/AK_CadNSDI.gdb.zip
wget -O AR_CadNSDI_V2.gdb.zip https://navigator.blm.gov/api/share/555a5533fc16beaa
wget -O CadRef_v10.gdb.zip https://navigator.blm.gov/api/share/ae0092d194729cca
wget -O BLM_CO_PLSS_20210823.gdb.zip https://navigator.blm.gov/api/share/acd1dfb31b26d86a
wget -O IA_CadNSDI_V2.gdb.zip https://navigator.blm.gov/api/share/40d57361b3dbddad
wget -O IL_CadNSDI_V2.gdb.zip https://navigator.blm.gov/api/share/93674b9856410368
wget -O IN_CadNSDI_V2.gdb.zip https://navigator.blm.gov/api/share/ddb959307b5bc49a
wget -O KS_CadNSDI_V2.gdb.zip http://nationalcad.org/PLSSCadNSDI/KS_CadNSDI_V2.gdb.9-1-16.zip
wget -O LA_CadNSDI_V2.gdb.zip https://navigator.blm.gov/api/share/56bc9f41216d8bfa
wget -O MI_CadNSDI_V2.gdb.zip https://navigator.blm.gov/api/share/87bd418c180a1cca
wget -O MN_CadNSDI_V2.gdb.zip https://navigator.blm.gov/api/share/410a60844fb2b3f5
wget -O MO_CadNSDI_V2.gdb.zip https://navigator.blm.gov/api/share/94090627aaaa3029
wget -O MS_CadNSDI_V2.gdb.zip https://navigator.blm.gov/api/share/ada1dce5abcb8ed0
wget -O CadNSDI_MT_2021_05_25.gdb.zip http://ftpgeoinfo.msl.mt.gov/Data/Spatial/MSDI/Cadastral/PLSS/CadNSDI_MT_2021_05_25.zip
wget -O ND_CadNSDI_V2_06252018.gdb.zip http://nationalcad.org/PLSSCadNSDI/ND_CadNSDI_V2_06252018.zip
wget -O NM_CadNSDI2_07262019.gdb.zip http://nationalcad.org/PLSSCadNSDI/NM_CadNSDI2_07262019_gdb.zip
wget -O NE_CadNSDI_V2.gdb.zip http://nationalcad.org/PLSSCadNSDI/NE_CadNSDI_V2.gdb.1-12-18.zip
wget -O BLM_NV_PLSS.gdb.zip https://navigator.blm.gov/api/share/7df0490539ba6f3d
wget -O OH_CADNSDI_V2.gdb.zip https://navigator.blm.gov/api/share/beb703adca0e464a
wget -O CadNSDI_PLSS_web.gdb.zip https://navigator.blm.gov/api/share/pub_ef2eafc87f3ff8dv
wget -O SD_CadNSDI_V2.gdb.zip http://nationalcad.org/PLSSCadNSDI/SD_CadNSDI_V2.gdb.1-13-16.zip
wget -O WY_PLSS_CadNSDI_20190925.gdb.zip https://navigator.blm.gov/api/share/3976794700053a98


# copy gdb to s3
aws s3 cp AL_CadNSDI_V2.gdb.zip $BASE_URL/AL_CadNSDI_V2.gdb.zip
aws s3 cp AK_CadNSDI.gdb.zip $BASE_URL/AK_CadNSDI.gdb.zip
aws s3 cp AR_CadNSDI_V2.gdb.zip $BASE_URL/AR_CadNSDI_V2.gdb.zip
aws s3 cp CadRef_v10.gdb.zip $BASE_URL/CadRef_v10.gdb.zip
aws s3 cp BLM_CO_PLSS_20210823.gdb.zip $BASE_URL/BLM_CO_PLSS_20210823.gdb.zip
aws s3 cp IA_CadNSDI_V2.gdb.zip $BASE_URL/IA_CadNSDI_V2.gdb.zip
aws s3 cp IL_CadNSDI_V2.gdb.zip $BASE_URL/IL_CadNSDI_V2.gdb.zip
aws s3 cp IN_CadNSDI_V2.gdb.zip $BASE_URL/IN_CadNSDI_V2.gdb.zip
aws s3 cp KS_CadNSDI_V2.gdb.zip $BASE_URL/KS_CadNSDI_V2.gdb.zip
aws s3 cp LA_CadNSDI_V2.gdb.zip $BASE_URL/LA_CadNSDI_V2.gdb.zip
aws s3 cp MI_CadNSDI_V2.gdb.zip $BASE_URL/MI_CadNSDI_V2.gdb.zip
aws s3 cp MN_CadNSDI_V2.gdb.zip $BASE_URL/MN_CadNSDI_V2.gdb.zip
aws s3 cp MO_CadNSDI_V2.gdb.zip $BASE_URL/MO_CadNSDI_V2.gdb.zip
aws s3 cp MS_CadNSDI_V2.gdb.zip $BASE_URL/MS_CadNSDI_V2.gdb.zip
aws s3 cp CadNSDI_MT_2021_05_25.gdb.zip $BASE_URL/CadNSDI_MT_2021_05_25.gdb.zip
aws s3 cp ND_CadNSDI_V2_06252018.gdb.zip $BASE_URL/ND_CadNSDI_V2_06252018.gdb.zip
aws s3 cp NM_CadNSDI2_07262019.gdb.zip $BASE_URL/NM_CadNSDI2_07262019.gdb.zip
aws s3 cp NE_CadNSDI_V2.gdb.zip $BASE_URL/NE_CadNSDI_V2.gdb.zip
aws s3 cp BLM_NV_PLSS.gdb.zip $BASE_URL/BLM_NV_PLSS.gdb.zip
aws s3 cp OH_CADNSDI_V2.gdb.zip $BASE_URL/OH_CADNSDI_V2.gdb.zip
aws s3 cp CadNSDI_PLSS_web.gdb.zip $BASE_URL/CadNSDI_PLSS_web.gdb.zip
aws s3 cp SD_CadNSDI_V2.gdb.zip $BASE_URL/SD_CadNSDI_V2.gdb.zip
aws s3 cp WY_PLSS_CadNSDI_20190925.gdb.zip $BASE_URL/WY_PLSS_CadNSDI_20190925.gdb.zip


# Alaska field names are lowercase, the rest of the states are uppercase. Lets convert AK to uppercase to match. 
AK_SQL_CMD="SELECT stateabbr as STATEABBR, prinmercd as PRINMERCD, prinmer as PRINMER, twnshpno as TWNSHPNO, twnshpfrac as TWNSHPFRAC, twnshpdir as TWNSHPDIR, rangeno as RANGENO, rangefrac as RANGEFRAC, rangedir as RANGEDIR, twnshpdpcd as TWNSHPDPCD, plssid as PLSSID, twnshplab as TWNSHPLAB, shape_Length as SHAPE_Length, shape_Area as SHAPE_Area from CADNSDI_PLSSTOWNSHIP"

# convert to geojson
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/al.geojson /data/AL_CadNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -sql $AK_SQL_CMD -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ak.geojson /data/AK_CadNSDI.gdb.zip
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ar.geojson /data/AR_CadNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ca.geojson /data/CadRef_v10.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/co.geojson /data/BLM_CO_PLSS_20210823.gdb.zip BLM_CO_PLSS_Township
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ia.geojson /data/IA_CadNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/il.geojson /data/IL_CadNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/in.geojson /data/IN_CadNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ks.geojson /data/KS_CadNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/la.geojson /data/LA_CadNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/mi.geojson /data/MI_CadNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/mn.geojson /data/MN_CadNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/mo.geojson /data/MO_CadNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ms.geojson /data/MS_CadNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/mt.geojson /data/CadNSDI_MT_2021_05_25.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/nd.geojson /data/ND_CadNSDI_V2_06252018.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/nm.geojson /data/NM_CadNSDI2_07262019.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ne.geojson /data/NE_CadNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/nv.geojson /data/BLM_NV_PLSS.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/oh.geojson /data/OH_CADNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/or.geojson /data/CadNSDI_PLSS_web.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/sd.geojson /data/SD_CadNSDI_V2.gdb.zip PLSSTownship
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/wy.geojson /data/WY_PLSS_CadNSDI_20190925.gdb.zip PLSSTownship


#geojson to compressed
gzip -c al.geojson > al.geojson.gz
gzip -c ak.geojson > ak.geojson.gz
gzip -c ar.geojson > ar.geojson.gz
gzip -c ca.geojson > ca.geojson.gz
gzip -c co.geojson > co.geojson.gz
gzip -c ia.geojson > ia.geojson.gz
gzip -c il.geojson > il.geojson.gz
gzip -c in.geojson > in.geojson.gz
gzip -c ks.geojson > ks.geojson.gz
gzip -c la.geojson > la.geojson.gz
gzip -c mi.geojson > mi.geojson.gz
gzip -c mn.geojson > mn.geojson.gz
gzip -c mo.geojson > mo.geojson.gz
gzip -c ms.geojson > ms.geojson.gz
gzip -c mt.geojson > mt.geojson.gz
gzip -c nd.geojson > nd.geojson.gz
gzip -c nm.geojson > nm.geojson.gz
gzip -c ne.geojson > ne.geojson.gz
gzip -c nv.geojson > nv.geojson.gz
gzip -c oh.geojson > oh.geojson.gz
gzip -c or.geojson > or.geojson.gz
gzip -c sd.geojson > sd.geojson.gz
gzip -c wy.geojson > wy.geojson.gz


#compressed to s3
aws s3 cp al.geojson.gz $BASE_URL/al.geojson.gz
aws s3 cp ak.geojson.gz $BASE_URL/ak.geojson.gz
aws s3 cp ar.geojson.gz $BASE_URL/ar.geojson.gz
aws s3 cp ca.geojson.gz $BASE_URL/ca.geojson.gz
aws s3 cp co.geojson.gz $BASE_URL/co.geojson.gz
aws s3 cp ia.geojson.gz $BASE_URL/ia.geojson.gz
aws s3 cp il.geojson.gz $BASE_URL/il.geojson.gz
aws s3 cp in.geojson.gz $BASE_URL/in.geojson.gz
aws s3 cp ks.geojson.gz $BASE_URL/ks.geojson.gz
aws s3 cp la.geojson.gz $BASE_URL/la.geojson.gz
aws s3 cp mi.geojson.gz $BASE_URL/mi.geojson.gz
aws s3 cp mn.geojson.gz $BASE_URL/mn.geojson.gz
aws s3 cp mo.geojson.gz $BASE_URL/mo.geojson.gz
aws s3 cp ms.geojson.gz $BASE_URL/ms.geojson.gz
aws s3 cp mt.geojson.gz $BASE_URL/mt.geojson.gz
aws s3 cp nd.geojson.gz $BASE_URL/nd.geojson.gz
aws s3 cp nm.geojson.gz $BASE_URL/nm.geojson.gz
aws s3 cp ne.geojson.gz $BASE_URL/ne.geojson.gz
aws s3 cp nv.geojson.gz $BASE_URL/nv.geojson.gz
aws s3 cp oh.geojson.gz $BASE_URL/oh.geojson.gz
aws s3 cp or.geojson.gz $BASE_URL/or.geojson.gz
aws s3 cp sd.geojson.gz $BASE_URL/sd.geojson.gz
aws s3 cp wy.geojson.gz $BASE_URL/wy.geojson.gz

sudo shutdown now

```

> Note: that the size of the EBS storage will depend on the size of the source files. Good rule is to use a x25 multiplier from your source file. So if your source if 5GB create a drive that is 5 * 25 = 125 GB. Also note that `SIGNIFICANT_FIGURES=6` is included to round to 6 decimal places. This may not always be apporaite for polyline and polygon geometry.

To run the task it will utilize a EC2 Spot instance and execute based on the specificication document created. The `--spot-price` will need to be adjusted if the server is adjusted.

```bash
aws ec2 request-spot-instances --spot-price "0.1" --instance-count 1 --type "one-time" --launch-specification file://specification_geojson.json --profile sit
```


## Create the User Data

For each specification.json document created will have an associated userdata as well. These are the commands that the EC2 server will execute on bootup. It is important to have the final `sudo shutdown now` command followed by a new line to ensure that the server is terminated at the end of the process otherwise unwanted charges could occur if not properly shutdown.

The below is a sample of working commands that will install tippecanoe, download the file to process and when finished upload the generated output to S3 and then shut itself down. 

```bash
#!/bin/bash
set -e 

BASE_URL=s3://geoplatform-cdn-temp/tippecanoe
TILESERVER_URL=s3://gp-sit-tileservice-tile-cache/vector/9b59f427-c0ad-5f8b-ac22-2dbdac882dfa

sudo yum update -y
sudo yum install -y git gcc sqlite-devel.x86_64
sudo yum groupinstall -y "Development Tools"

cd /tmp
git clone https://github.com/mapbox/tippecanoe.git
cd tippecanoe
make -j
sudo make install

# s3 gz to local
aws s3 cp $BASE_URL/al.geojson.gz al.json.gz 
aws s3 cp $BASE_URL/ak.geojson.gz ak.json.gz 
aws s3 cp $BASE_URL/ar.geojson.gz ar.json.gz 
aws s3 cp $BASE_URL/ca.geojson.gz ca.json.gz 
aws s3 cp $BASE_URL/co.geojson.gz co.json.gz 
aws s3 cp $BASE_URL/ia.geojson.gz ia.json.gz 
aws s3 cp $BASE_URL/il.geojson.gz il.json.gz 
aws s3 cp $BASE_URL/in.geojson.gz in.json.gz 
aws s3 cp $BASE_URL/ks.geojson.gz ks.json.gz 
aws s3 cp $BASE_URL/la.geojson.gz la.json.gz 
aws s3 cp $BASE_URL/mi.geojson.gz mi.json.gz 
aws s3 cp $BASE_URL/mn.geojson.gz mn.json.gz 
aws s3 cp $BASE_URL/mo.geojson.gz mo.json.gz 
aws s3 cp $BASE_URL/ms.geojson.gz ms.json.gz 
aws s3 cp $BASE_URL/mt.geojson.gz mt.json.gz 
aws s3 cp $BASE_URL/nd.geojson.gz nd.json.gz 
aws s3 cp $BASE_URL/nm.geojson.gz nm.json.gz 
aws s3 cp $BASE_URL/ne.geojson.gz ne.json.gz 
aws s3 cp $BASE_URL/nv.geojson.gz nv.json.gz 
aws s3 cp $BASE_URL/oh.geojson.gz oh.json.gz 
aws s3 cp $BASE_URL/or.geojson.gz or.json.gz 
aws s3 cp $BASE_URL/sd.geojson.gz sd.json.gz 
aws s3 cp $BASE_URL/wy.geojson.gz wy.json.gz 

# create mbtiles for each state
tippecanoe -o ./al.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./al.json.gz
tippecanoe -o ./ak.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./ak.json.gz
tippecanoe -o ./ar.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./ar.json.gz
tippecanoe -o ./ca.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./ca.json.gz
tippecanoe -o ./co.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./co.json.gz
tippecanoe -o ./ia.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./ia.json.gz
tippecanoe -o ./il.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./il.json.gz
tippecanoe -o ./in.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./in.json.gz
tippecanoe -o ./ks.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./ks.json.gz
tippecanoe -o ./la.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./la.json.gz
tippecanoe -o ./mi.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./mi.json.gz
tippecanoe -o ./mn.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./mn.json.gz
tippecanoe -o ./mo.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./mo.json.gz
tippecanoe -o ./ms.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./ms.json.gz
tippecanoe -o ./mt.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./mt.json.gz
tippecanoe -o ./nd.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./nd.json.gz
tippecanoe -o ./nm.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./nm.json.gz
tippecanoe -o ./ne.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./ne.json.gz
tippecanoe -o ./nv.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./nv.json.gz
tippecanoe -o ./oh.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./oh.json.gz
tippecanoe -o ./or.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./or.json.gz
tippecanoe -o ./sd.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./sd.json.gz
tippecanoe -o ./wy.mbtiles --force --drop-densest-as-needed --coalesce-densest-as-needed -y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area -Z1 -z12 -l township ./wy.json.gz

#mbtiles to s3
aws s3 cp al.mbtiles $BASE_URL/plss_al.mbtiles 
aws s3 cp ak.mbtiles $BASE_URL/plss_ak.mbtiles 
aws s3 cp ar.mbtiles $BASE_URL/plss_ar.mbtiles 
aws s3 cp ca.mbtiles $BASE_URL/plss_ca.mbtiles 
aws s3 cp co.mbtiles $BASE_URL/plss_co.mbtiles 
aws s3 cp ia.mbtiles $BASE_URL/plss_ia.mbtiles 
aws s3 cp il.mbtiles $BASE_URL/plss_il.mbtiles 
aws s3 cp in.mbtiles $BASE_URL/plss_in.mbtiles 
aws s3 cp ks.mbtiles $BASE_URL/plss_ks.mbtiles 
aws s3 cp la.mbtiles $BASE_URL/plss_la.mbtiles 
aws s3 cp mi.mbtiles $BASE_URL/plss_mi.mbtiles 
aws s3 cp mn.mbtiles $BASE_URL/plss_mn.mbtiles 
aws s3 cp mo.mbtiles $BASE_URL/plss_mo.mbtiles 
aws s3 cp ms.mbtiles $BASE_URL/plss_ms.mbtiles 
aws s3 cp mt.mbtiles $BASE_URL/plss_mt.mbtiles 
aws s3 cp nd.mbtiles $BASE_URL/plss_nd.mbtiles 
aws s3 cp nm.mbtiles $BASE_URL/plss_nm.mbtiles 
aws s3 cp ne.mbtiles $BASE_URL/plss_ne.mbtiles 
aws s3 cp nv.mbtiles $BASE_URL/plss_nv.mbtiles 
aws s3 cp oh.mbtiles $BASE_URL/plss_oh.mbtiles 
aws s3 cp or.mbtiles $BASE_URL/plss_or.mbtiles 
aws s3 cp sd.mbtiles $BASE_URL/plss_sd.mbtiles 
aws s3 cp wy.mbtiles $BASE_URL/plss_wy.mbtiles 

# join all mbtiles into one
tile-join --force -pk -pC -n township -o ./plss_national.mbtiles ./al.mbtiles ./ak.mbtiles ./ar.mbtiles ./ca.mbtiles ./co.mbtiles ./ia.mbtiles ./il.mbtiles ./in.mbtiles ./ks.mbtiles ./la.mbtiles ./mi.mbtiles ./mn.mbtiles ./mo.mbtiles ./ms.mbtiles ./mt.mbtiles ./nd.mbtiles ./nm.mbtiles ./ne.mbtiles ./nv.mbtiles ./oh.mbtiles ./or.mbtiles ./sd.mbtiles ./wy.mbtiles

# copy it to s3
aws s3 cp plss_national.mbtiles $BASE_URL/plss_national.mbtiles 

# explode national tiles to a directory structure
sudo mkdir tiles
sudo chown ec2-user:ec2-user ./tiles
tile-join --force -pk -pC -n township -e ./tiles ./plss_national.mbtiles

# rename file extension from pbf to mvt
find ./tiles -name '*.pbf' -exec rename .pbf .mvt {} +


# sync to s3. 
echo "syncing to s3 $TILESERVER_URL"
aws s3 sync ./tiles $TILESERVER_URL --no-progress --only-show-errors

echo "Process complete, shutting down."
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
aws ec2 request-spot-instances --spot-price "0.4" --instance-count 1 --type "one-time" --launch-specification file://specification_geojson.json --profile sit
aws ec2 request-spot-instances --spot-price "0.4" --instance-count 1 --type "one-time" --launch-specification file://specification_mbtiles.json --profile sit
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

- [TippeCanoe User Guide](https://github.com/mapbox/tippecanoe)
- [Ogr2Ogr User Guide](https://gdal.org/programs/ogr2ogr.html)
- [Current Spot Pricing](https://aws.amazon.com/ec2/spot/pricing/)
- [How to view Spot history](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances-history.html)
- [TileServerGL User Guide](https://github.com/maptiler/tileserver-gl)
- [Data Sources - pdf](https://nationalcad.org/download/PLSS-CadNSDI-Data-Set-Availability.pdf)

