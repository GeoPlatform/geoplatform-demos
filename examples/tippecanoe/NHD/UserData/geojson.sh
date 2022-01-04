#!/bin/bash
S3_BASE_PATH=s3://geoplatform-cdn-temp/tippecanoe

sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker

# no permission issues here
cd /home/ec2-user

# copy and decompress Geodatabase
aws s3 cp ${S3_BASE_PATH}/NHD/NHD_H_National_GDB.zip NHD_H_National_GDB.zip
sudo unzip NHD_H_National_GDB.zip
sudo rm NHD_H_National_GDB.zip

# copy dependencies to convert NHDWaterbody
aws s3 cp ${S3_BASE_PATH}/tools/process_gdb.py process_gdb.py
aws s3 cp ${S3_BASE_PATH}/tools/requirements.txt requirements.txt
aws s3 cp ${S3_BASE_PATH}/tools/Dockerfile Dockerfile

sudo DOCKER_BUILDKIT=1 docker build . -t ishiland/gdal-python

# convert NHDLine using ogr2ogr, copy to s3
sudo docker run --rm -v ${PWD}:/code/ ishiland/gdal-python ogr2ogr -overwrite -skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON NHDLine.geojson NHD_H_National_GDB.gdb NHDLine
gzip -c NHDLine.geojson > NHDLine.geojson.gz
aws s3 cp NHDLine.geojson.gz ${S3_BASE_PATH}/NHD/NHDLine.geojson.gz 

# convert NHDPoint using ogr2ogr, copy to s3
sudo docker run --rm -v ${PWD}:/code/ ishiland/gdal-python ogr2ogr -overwrite -skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON NHDPoint.geojson NHD_H_National_GDB.gdb NHDPoint
gzip -c NHDPoint.geojson > NHDPoint.geojson.gz
aws s3 cp NHDPoint.geojson.gz ${S3_BASE_PATH}/NHD/NHDPoint.geojson.gz

# convert NHDLineEventFC using ogr2ogr, copy to s3
sudo docker run --rm -v ${PWD}:/code/ ishiland/gdal-python ogr2ogr -overwrite -skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON NHDLineEventFC.geojson NHD_H_National_GDB.gdb NHDLineEventFC
gzip -c NHDLineEventFC.geojson > NHDLineEventFC.geojson.gz
aws s3 cp NHDLineEventFC.geojson.gz ${S3_BASE_PATH}/NHD/NHDLineEventFC.geojson.gz

# convert NHDAreaEventFC using ogr2ogr, copy to s3
sudo docker run --rm -v ${PWD}:/code/ ishiland/gdal-python ogr2ogr -overwrite -skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON NHDAreaEventFC.geojson NHD_H_National_GDB.gdb NHDAreaEventFC
gzip -c NHDAreaEventFC.geojson > NHDAreaEventFC.geojson.gz
aws s3 cp NHDAreaEventFC.geojson.gz ${S3_BASE_PATH}/NHD/NHDAreaEventFC.geojson.gz

# convert NHDArea using ogr2ogr, copy to s3
sudo docker run --rm -v ${PWD}:/code/ ishiland/gdal-python python process_gdb.py NHD_H_National_GDB.gdb NHDArea

# convert NHDFlowline by iterating features using python, copy to s3
sudo docker run --rm -v ${PWD}:/code/ ishiland/gdal-python python process_gdb.py NHD_H_National_GDB.gdb NHDFlowline 100000

# convert NHDWaterbody by iterating features using python, copy to s3
sudo docker run --rm -v ${PWD}:/code/ ishiland/gdal-python python process_gdb.py NHD_H_National_GDB.gdb NHDWaterbody

sudo shutdown now
