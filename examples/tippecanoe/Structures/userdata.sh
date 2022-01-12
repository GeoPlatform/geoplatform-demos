#!/bin/bash

AWS_PROFILE="" # --profile sit
BASE_PATH=s3://geoplatform-cdn-temp/tippecanoe
TILESERVER_URL=${BASE_PATH}/structures/tiles
MBTILE_URL=${BASE_PATH}/structures/structures.mbtiles
TIPPE_PARAMS="-f -P --drop-densest-as-needed --generate-ids -Z9 -z13 -l structures"

sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker

sudo yum update -y
sudo yum install -y git gcc sqlite-devel.x86_64
sudo yum groupinstall -y "Development Tools"

cd /tmp
git clone https://github.com/mapbox/tippecanoe.git
cd tippecanoe
make -j
sudo make install

cd /home/ec2-user
sudo mkdir -p tmp mbtiles tiles
sudo chown -R ec2-user:ec2-user ./tmp ./mbtiles ./tiles

aws s3 cp ${BASE_PATH}/Structures/OR_OCC_V03.zip OR_OCC_V03.zip
sudo unzip OR_OCC_V03.zip
sudo rm OR_OCC_V03.zip

aws s3 cp ${BASE_PATH}/Structures/LA_OCC_v02.zip LA_OCC_v02.zip
sudo unzip LA_OCC_v02.zip
sudo rm LA_OCC_v02.zip

aws s3 cp ${BASE_PATH}/Structures/FL_OCC_V03.zip FL_OCC_V03.zip
sudo unzip FL_OCC_V03.zip
sudo rm FL_OCC_V03.zip

# OCC_Prototype_v2/OR_structure
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'OCC_Prototype_v2.gdb' as GDB_SOURCE from OR_Structures" \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/OCC_Prototype_v2-OR_structure.geojsonseq "/data/LA_OCC_v02/OCC_Prototype_v2.gdb"
sudo gzip -c "${PWD}"/tmp/OCC_Prototype_v2-OR_structure.geojsonseq > "${PWD}"/tmp/OCC_Prototype_v2-OR_structure.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/OCC_Prototype_v2-OR_structure.geojsonseq.gz ${BASE_PATH}/Structures/gzipped/OCC_Prototype_v2-OR_structure.geojsonseq.gz ${AWS_PROFILE}
tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/OCC_Prototype_v2-OR_structure.mbtiles "${PWD}"/tmp/OCC_Prototype_v2-OR_structure.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/OCC_Prototype_v2-OR_structure.mbtiles ${BASE_PATH}/Structures/mbtiles/OCC_Prototype_v2-OR_structure.mbtiles ${AWS_PROFILE}

# OCC_Prototype_v2/LA_Structures_Update
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'OCC_Prototype_v2.gdb' as GDB_SOURCE from LA_Structures_Update"  \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/OCC_Prototype_v2-LA_Structures_Update.geojsonseq "/data/LA_OCC_v02/OCC_Prototype_v2.gdb"
sudo gzip -c "${PWD}"/tmp/OCC_Prototype_v2-LA_Structures_Update.geojsonseq > "${PWD}"/tmp/OCC_Prototype_v2-LA_Structures_Update.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/OCC_Prototype_v2-LA_Structures_Update.geojsonseq.gz ${BASE_PATH}/Structures/gzipped/OCC_Prototype_v2-LA_Structures_Update.geojsonseq.gz ${AWS_PROFILE}
tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/OCC_Prototype_v2-LA_Structures_Update.mbtiles "${PWD}"/tmp/OCC_Prototype_v2-LA_Structures_Update.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/OCC_Prototype_v2-LA_Structures_Update.mbtiles ${BASE_PATH}/Structures/mbtiles/OCC_Prototype_v2-LA_Structures_Update.mbtiles ${AWS_PROFILE}

# OCC_Prototype_v2/TN_Structures
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'OCC_Prototype_v2.gdb' as GDB_SOURCE from TN_Structures" \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/OCC_Prototype_v2-TN_Structures.geojsonseq "/data/LA_OCC_v02/OCC_Prototype_v2.gdb"
sudo gzip -c "${PWD}"/tmp/OCC_Prototype_v2-TN_Structures.geojsonseq > "${PWD}"/tmp/OCC_Prototype_v2-TN_Structures.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/OCC_Prototype_v2-TN_Structures.geojsonseq.gz ${BASE_PATH}/Structures/gzipped/OCC_Prototype_v2-TN_Structures.geojsonseq.gz ${AWS_PROFILE}
tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/OCC_Prototype_v2-TN_Structures.mbtiles "${PWD}"/tmp/OCC_Prototype_v2-TN_Structures.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/OCC_Prototype_v2-TN_Structures.mbtiles ${BASE_PATH}/Structures/mbtiles/OCC_Prototype_v2-TN_Structures.mbtiles ${AWS_PROFILE}

# FL_Structures_V2_20210728_NoAdrs/USAStructures_Occupancy_FL_20210728_NoAdrs
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'FL_Structures_V2_20210728_NoAdrs.gdb' as GDB_SOURCE from USAStructures_Occupancy_FL_20210728_NoAdrs" \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/USAStructures_Occupancy_FL_20210728_NoAdrs.geojsonseq "/data/FL_Structures_V2_20210728_NoAdrs.gdb"
sudo gzip -c "${PWD}"/tmp/USAStructures_Occupancy_FL_20210728_NoAdrs.geojsonseq > "${PWD}"/tmp/USAStructures_Occupancy_FL_20210728_NoAdrs.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/USAStructures_Occupancy_FL_20210728_NoAdrs.geojsonseq.gz ${BASE_PATH}/Structures/gzipped/USAStructures_Occupancy_FL_20210728_NoAdrs.geojsonseq.gz ${AWS_PROFILE}
tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/USAStructures_Occupancy_FL_20210728_NoAdrs.mbtiles "${PWD}"/tmp/USAStructures_Occupancy_FL_20210728_NoAdrs.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/USAStructures_Occupancy_FL_20210728_NoAdrs.mbtiles ${BASE_PATH}/Structures/mbtiles/USAStructures_Occupancy_FL_20210728_NoAdrs.mbtiles ${AWS_PROFILE}

# OR_Structures/OR_Structures
sudo docker run -v "${PWD}":/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr \
-sql "SELECT *, 'OR_Structures.gdb' as GDB_SOURCE from OR_Structures" \
-skipfailures -progress -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 \
-f GeoJSONseq /data/tmp/OR_Structures.geojsonseq "/data/OR_Structures.gdb"
sudo gzip -c "${PWD}"/tmp/OR_Structures.geojsonseq > "${PWD}"/tmp/OR_Structures.geojsonseq.gz
aws s3 cp "${PWD}"/tmp/OR_Structures.geojsonseq.gz ${BASE_PATH}/Structures/gzipped/OR_Structures.geojsonseq.gz ${AWS_PROFILE}
tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/OR_Structures.mbtiles "${PWD}"/tmp/OR_Structures.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/OR_Structures.mbtiles ${BASE_PATH}/Structures/mbtiles/OR_Structures.mbtiles ${AWS_PROFILE}

# join all to a single mbtiles file
tile-join -pk -f -n structures -o"${PWD}"/mbtiles/structures.mbtiles \
"${PWD}"/mbtiles/OR_Structures.mbtiles \
"${PWD}"/mbtiles/USAStructures_Occupancy_FL_20210728_NoAdrs.mbtiles \
"${PWD}"/mbtiles/OCC_Prototype_v2-TN_Structures.mbtiles \
"${PWD}"/mbtiles/OCC_Prototype_v2-LA_Structures_Update.mbtiles \
"${PWD}"/mbtiles/OCC_Prototype_v2-OR_structure.mbtiles

aws s3 cp "${PWD}"/mbtiles/structures.mbtiles ${MBTILE_URL} ${AWS_PROFILE}

# expand to tile directory
tile-join --force -pk -pC -n Structures -e ./tiles ./mbtiles/structures.mbtiles

# rename tile extensions to mvt
sudo find ./tiles -name '*.pbf' -exec rename .pbf .mvt {} +

# sync directory to s3
aws s3 sync ./tiles $TILESERVER_URL --no-progress --only-show-errors --delete ${AWS_PROFILE}

sudo shutdown now
