#!/bin/bash

AWS_PROFILE="" # --profile sit
BASE_PATH=s3://geoplatform-cdn-temp/tippecanoe/structures

sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker

cd /home/ec2-user
sudo mkdir -p tmp gdb 
sudo chown ec2-user:ec2-user ./tmp ./gdb

# Alabama
wget -O ./gdb/AL_OCC_Structures_12292021.gdb.zip https://disasters.geoplatform.gov/publicdata/Partners/ORNL/Occupancy_Type/Alabama/AL_OCC_Structures_12292021.gdb.zip
aws s3 cp ./gdb/AL_OCC_Structures_12292021.gdb.zip ${BASE_PATH}/gdb/AL_OCC_Structures_12292021.gdb.zip 
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'AL_OCC_Structures_12292021.gdb.zip' as GDB_SOURCE from AL_Structures_OCC" \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/al.geojsonseq "data/gdb/AL_OCC_Structures_12292021.gdb.zip"
sudo gzip -c "${PWD}"/tmp/al.geojsonseq > "${PWD}"/tmp/al.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/al.geojsonseq.gz ${BASE_PATH}/gzipped/al.geojsonseq.gz

# Florida 
# Internal server error: https://disasters.geoplatform.gov/publicdata/Partners/ORNL/Occupancy_Type/Florida/

# Georgia
wget -O ./gdb/GA_Structures_OCC_12292021.gdb.zip https://disasters.geoplatform.gov/publicdata/Partners/ORNL/Occupancy_Type/Georgia/GA_Structures_OCC_12292021.gdb.zip
aws s3 cp ./gdb/GA_Structures_OCC_12292021.gdb.zip ${BASE_PATH}/gdb/GA_Structures_OCC_12292021.gdb.zip
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'GA_Structures_OCC_12292021.gdb.zip' as GDB_SOURCE from GA_Structures_OCC" \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/ga.geojsonseq "data/gdb/GA_Structures_OCC_12292021.gdb.zip"
sudo gzip -c "${PWD}"/tmp/ga.geojsonseq > "${PWD}"/tmp/ga.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/ga.geojsonseq.gz ${BASE_PATH}/gzipped/ga.geojsonseq.gz

# Louisiana
wget -O ./gdb/LA_Structures_v2_OCC_12292021.gdb.zip https://disasters.geoplatform.gov/publicdata/Partners/ORNL/Occupancy_Type/Louisiana/LA_Structures_v2_OCC_12292021.gdb.zip
aws s3 cp ./gdb/LA_Structures_v2_OCC_12292021.gdb.zip ${BASE_PATH}/gdb/LA_Structures_v2_OCC_12292021.gdb.zip
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'LA_Structures_v2_OCC_12292021.gdb.zip' as GDB_SOURCE from LA_Structures_v2_OCC" \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/la.geojsonseq "data/gdb/LA_Structures_v2_OCC_12292021.gdb.zip"
sudo gzip -c "${PWD}"/tmp/la.geojsonseq > "${PWD}"/tmp/la.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/la.geojsonseq.gz ${BASE_PATH}/gzipped/la.geojsonseq.gz

# Mississippi
wget -O ./gdb/MS_Structures_OCC_12292021.gdb.zip https://disasters.geoplatform.gov/publicdata/Partners/ORNL/Occupancy_Type/Mississippi/MS_Structures_OCC_12292021.gdb.zip
aws s3 cp ./gdb/MS_Structures_OCC_12292021.gdb.zip ${BASE_PATH}/gdb/MS_Structures_OCC_12292021.gdb.zip
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'MS_Structures_OCC_12292021.gdb.zip' as GDB_SOURCE from MS_Structures_OCC" \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/ms.geojsonseq "data/gdb/MS_Structures_OCC_12292021.gdb.zip"
sudo gzip -c "${PWD}"/tmp/ms.geojsonseq > "${PWD}"/tmp/ms.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/ms.geojsonseq.gz ${BASE_PATH}/gzipped/ms.geojsonseq.gz

# North Carolina
wget -O ./gdb/NC_Structures_OCC_12292021.gdb.zip https://disasters.geoplatform.gov/publicdata/Partners/ORNL/Occupancy_Type/NorthCarolina/NC_Structures_OCC_12292021.gdb.zip
aws s3 cp ./gdb/NC_Structures_OCC_12292021.gdb.zip ${BASE_PATH}/gdb/NC_Structures_OCC_12292021.gdb.zip
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'NC_Structures_OCC_12292021.gdb.zip' as GDB_SOURCE from NC_Structures_OCC" \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/nc.geojsonseq "data/gdb/NC_Structures_OCC_12292021.gdb.zip"
sudo gzip -c "${PWD}"/tmp/nc.geojsonseq > "${PWD}"/tmp/nc.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/nc.geojsonseq.gz ${BASE_PATH}/gzipped/nc.geojsonseq.gz

# Oregon 
wget -O ./gdb/OR_OCC_V03.zip https://disasters.geoplatform.gov/publicdata/Partners/ORNL/Occupancy_Type/Oregon/OR_OCC_V03.zip
aws s3 cp ./gdb/OR_OCC_V03.zip ${BASE_PATH}/gdb/OR_OCC_V03.zip
unzip ./gdb/OR_OCC_V03.zip -d ./gdb
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'OR_OCC_V03.zip' as GDB_SOURCE from OR_Structures" \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/or.geojsonseq "data/gdb/OR_Structures.gdb"
sudo gzip -c "${PWD}"/tmp/or.geojsonseq > "${PWD}"/tmp/or.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/or.geojsonseq.gz ${BASE_PATH}/gzipped/or.geojsonseq.gz

# South Carolina
wget -O ./gdb/SC_Structures_OCC._12292021gdb.zip https://disasters.geoplatform.gov/publicdata/Partners/ORNL/Occupancy_Type/SouthCarolina/SC_Structures_OCC._12292021gdb.zip
aws s3 cp ./gdb/SC_Structures_OCC._12292021gdb.zip ${BASE_PATH}/gdb/SC_Structures_OCC._12292021gdb.zip
unzip ./gdb/SC_Structures_OCC._12292021gdb.zip -d ./gdb
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'SC_Structures_OCC._12292021gdb.zip' as GDB_SOURCE from SC_Structures_OCC" \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/sc.geojsonseq "data/gdb/SC_Structures_OCC.gdb"
sudo gzip -c "${PWD}"/tmp/sc.geojsonseq > "${PWD}"/tmp/sc.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/sc.geojsonseq.gz ${BASE_PATH}/gzipped/sc.geojsonseq.gz

# Texas 
wget -O ./gdb/TX_Structures_v2_OCC_12292021.gdb.zip https://disasters.geoplatform.gov/publicdata/Partners/ORNL/Occupancy_Type/Texas/TX_Structures_v2_OCC_12292021.gdb.zip
aws s3 cp ./gdb/TX_Structures_v2_OCC_12292021.gdb.zip ${BASE_PATH}/gdb/TX_Structures_v2_OCC_12292021.gdb.zip
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'TX_Structures_v2_OCC_12292021.gdb.zip' as GDB_SOURCE from TX_Structures_v2_OCC" \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/tx.geojsonseq "data/gdb/TX_Structures_v2_OCC_12292021.gdb.zip"
sudo gzip -c "${PWD}"/tmp/tx.geojsonseq > "${PWD}"/tmp/tx.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/tx.geojsonseq.gz ${BASE_PATH}/gzipped/tx.geojsonseq.gz

# Virginia
wget -O ./gdb/VA_Structures_OCC_12292021.gdb.zip https://disasters.geoplatform.gov/publicdata/Partners/ORNL/Occupancy_Type/Virginia/VA_Structures_OCC_12292021.gdb.zip
aws s3 cp ./gdb/VA_Structures_OCC_12292021.gdb.zip ${BASE_PATH}/gdb/VA_Structures_OCC_12292021.gdb.zip
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'VA_Structures_OCC_12292021.gdb.zip' as GDB_SOURCE from VA_Structures_OCC" \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/va.geojsonseq "data/gdb/VA_Structures_OCC_12292021.gdb.zip"
sudo gzip -c "${PWD}"/tmp/va.geojsonseq > "${PWD}"/tmp/va.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/va.geojsonseq.gz ${BASE_PATH}/gzipped/va.geojsonseq.gz

sudo shutdown now
