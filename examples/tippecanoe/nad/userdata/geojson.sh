#!/bin/bash
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker

# Download source and convert to GeoJSON
cd /tmp
aws s3 cp s3://nationaladdressdata/NAD_r8.zip nad_r8.zip
mv nad_r8.zip nad_r8.gdb.zip
sudo docker run -v /tmp:/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -f GeoJSON -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 /data/nad_r8.geojson /vsizip/data/nad_r8.gdb.zip NAD

# Compress and upload file to S3
gzip -c nad_r8.geojson > nad_r8.geojson.gz
aws s3 cp nad_r8.geojson.gz s3://geoplatform-cdn-temp/tippecanoe/NAD/nad_r8.geojson.gz

sudo shutdown now