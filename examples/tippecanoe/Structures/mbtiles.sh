#!/bin/bash

AWS_PROFILE="" # --profile sit
BASE_PATH=s3://geoplatform-cdn-temp/tippecanoe/structures
TILESERVER_URL=${BASE_PATH}/tiles
MBTILE_URL=${BASE_PATH}/structures.mbtiles
TIPPE_PARAMS="-f -P --drop-densest-as-needed --generate-ids -Z9 -z13 -l structures"

sudo yum update -y
sudo yum install -y git gcc sqlite-devel.x86_64
sudo yum groupinstall -y "Development Tools"

cd /tmp
git clone https://github.com/mapbox/tippecanoe.git
cd tippecanoe
make -j
sudo make install

cd /home/ec2-user
sudo mkdir -p geojson mbtiles tiles
sudo chown ec2-user:ec2-user ./geojson ./mbtiles ./tiles

# copy the gzip
aws s3 cp ${BASE_PATH}/gzipped/al.geojsonseq.gz ./geojson/al.geojsonseq.gz
aws s3 cp ${BASE_PATH}/gzipped/ga.geojsonseq.gz ./geojson/ga.geojsonseq.gz
aws s3 cp ${BASE_PATH}/gzipped/la.geojsonseq.gz ./geojson/la.geojsonseq.gz
aws s3 cp ${BASE_PATH}/gzipped/ms.geojsonseq.gz ./geojson/ms.geojsonseq.gz
aws s3 cp ${BASE_PATH}/gzipped/nc.geojsonseq.gz ./geojson/nc.geojsonseq.gz
aws s3 cp ${BASE_PATH}/gzipped/or.geojsonseq.gz ./geojson/or.geojsonseq.gz
aws s3 cp ${BASE_PATH}/gzipped/sc.geojsonseq.gz ./geojson/sc.geojsonseq.gz
aws s3 cp ${BASE_PATH}/gzipped/tx.geojsonseq.gz ./geojson/tx.geojsonseq.gz
aws s3 cp ${BASE_PATH}/gzipped/va.geojsonseq.gz ./geojson/va.geojsonseq.gz

# make mbtiles 
tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/al.mbtiles "${PWD}"/geojson/al.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/al.mbtiles ${BASE_PATH}/mbtiles/al.mbtiles ${AWS_PROFILE}

tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/ga.mbtiles "${PWD}"/geojson/ga.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/ga.mbtiles ${BASE_PATH}/mbtiles/ga.mbtiles ${AWS_PROFILE}

tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/la.mbtiles "${PWD}"/geojson/la.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/la.mbtiles ${BASE_PATH}/mbtiles/la.mbtiles ${AWS_PROFILE}

tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/ms.mbtiles "${PWD}"/geojson/ms.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/ms.mbtiles ${BASE_PATH}/mbtiles/ms.mbtiles ${AWS_PROFILE}

tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/nc.mbtiles "${PWD}"/geojson/nc.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/nc.mbtiles ${BASE_PATH}/mbtiles/nc.mbtiles ${AWS_PROFILE}

tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/or.mbtiles "${PWD}"/geojson/or.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/or.mbtiles ${BASE_PATH}/mbtiles/or.mbtiles ${AWS_PROFILE}

tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/sc.mbtiles "${PWD}"/geojson/sc.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/sc.mbtiles ${BASE_PATH}/mbtiles/sc.mbtiles ${AWS_PROFILE}

tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/tx.mbtiles "${PWD}"/geojson/tx.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/tx.mbtiles ${BASE_PATH}/mbtiles/tx.mbtiles ${AWS_PROFILE}

tippecanoe ${TIPPE_PARAMS} -o "${PWD}"/mbtiles/va.mbtiles "${PWD}"/geojson/va.geojsonseq.gz
aws s3 cp "${PWD}"/mbtiles/va.mbtiles ${BASE_PATH}/mbtiles/va.mbtiles ${AWS_PROFILE}

# join the tiles
tile-join -pk -f -n structures -o"${PWD}"/mbtiles/structures.mbtiles \
"${PWD}"/mbtiles/al.mbtiles \
"${PWD}"/mbtiles/ga.mbtiles \
"${PWD}"/mbtiles/ms.mbtiles \
"${PWD}"/mbtiles/nc.mbtiles \
"${PWD}"/mbtiles/or.mbtiles \
"${PWD}"/mbtiles/sc.mbtiles \
"${PWD}"/mbtiles/tx.mbtiles \
"${PWD}"/mbtiles/va.mbtiles \
"${PWD}"/mbtiles/al.mbtiles 

aws s3 cp "${PWD}"/mbtiles/structures.mbtiles ${MBTILE_URL} ${AWS_PROFILE}

sudo chown -R ec2-user:ec2-user ./geojson ./mbtiles ./tiles

# expand to tile directory
tile-join --force -pk -pC -n structures -e ./tiles ./mbtiles/structures.mbtiles

# rename tile extensions to mvt
sudo find ./tiles -name '*.pbf' -exec rename .pbf .mvt {} +

# sync directory to s3
aws s3 sync ./tiles $TILESERVER_URL --no-progress --only-show-errors ${AWS_PROFILE}

sudo shutdown now
