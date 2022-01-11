#!/bin/bash

AWS_PROFILE="" # --profile sit
TILESERVER_URL=s3://gp-sit-tileservice-tile-cache/vector/9e1b0d82_6095_5b94_ae66_9afeb1eacdfc
MBTILE_URL=s3://gp-sit-us-east-1-geoplatform-archive/9e1b0d82_6095_5b94_ae66_9afeb1eacdfc.mbtiles
BASE_PATH=s3://geoplatform-cdn-temp/tippecanoe

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
sudo mkdir -p tmp
sudo mkdir -p mbtiles
sudo mkdir -p tiles
sudo chown ec2-user:ec2-user ./tmp
sudo chown ec2-user:ec2-user ./mbtiles
sudo chown ec2-user:ec2-user ./tiles

# copy and decompress Geodatabase
aws s3 cp ${BASE_PATH}/NHD/NHD_H_National_GDB.zip NHD_H_National_GDB.zip
sudo unzip NHD_H_National_GDB.zip # ~87gb
sudo rm NHD_H_National_GDB.zip

# copy dependencies to convert Geodatabase Feature Classes to GeojsonSeq
aws s3 cp ${BASE_PATH}/tools/gdb_to_geojsonseq.py gdb_to_geojsonseq.py
aws s3 cp ${BASE_PATH}/tools/Dockerfile Dockerfile

sudo DOCKER_BUILDKIT=1 docker build . -t ishiland/gdal-python

LAYER=NHDPointEventFC
sudo docker run --rm -v ${PWD}:/code/ ishiland/gdal-python python gdb_to_geojsonseq.py NHD_H_National_GDB.gdb ${LAYER} tmp
sudo gzip -c ${PWD}/tmp/${LAYER}.geojsonseq > ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/tmp/${LAYER}.geojsonseq.gz ${BASE_PATH}/NHD/gzipped/${LAYER}.geojson.gz ${AWS_PROFILE}
tippecanoe -f -P --generate-ids -Z10 -zg -l ${LAYER} --drop-densest-as-needed --extend-zooms-if-still-dropping -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/NHD/mbtiles/${LAYER}.mbtile ${AWS_PROFILE}
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

LAYER=NHDPoint
sudo docker run --rm -v ${PWD}:/code/ ishiland/gdal-python python gdb_to_geojsonseq.py NHD_H_National_GDB.gdb ${LAYER} tmp
gzip -c ${PWD}/tmp/${LAYER}.geojsonseq > ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/tmp/${LAYER}.geojsonseq.gz ${BASE_PATH}/NHD/gzipped/${LAYER}.geojson.gz ${AWS_PROFILE}
tippecanoe -f -P --generate-ids -Z10 -zg -l ${LAYER} --drop-densest-as-needed --extend-zooms-if-still-dropping -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/NHD/mbtiles/${LAYER}.mbtile ${AWS_PROFILE}
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

LAYER=NHDLine
sudo docker run --rm -v ${PWD}:/code/ ishiland/gdal-python python gdb_to_geojsonseq.py NHD_H_National_GDB.gdb ${LAYER} tmp
gzip -c ${PWD}/tmp/${LAYER}.geojsonseq > ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/tmp/${LAYER}.geojsonseq.gz ${BASE_PATH}/NHD/gzipped/${LAYER}.geojson.gz ${AWS_PROFILE}
tippecanoe -f -P --generate-ids -Z8 -zg -l ${LAYER} --drop-densest-as-needed --extend-zooms-if-still-dropping -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/NHD/mbtiles/${LAYER}.mbtile ${AWS_PROFILE}
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

LAYER=NHDArea
sudo docker run --rm -v ${PWD}:/code/ ishiland/gdal-python python gdb_to_geojsonseq.py NHD_H_National_GDB.gdb ${LAYER} tmp
gzip -c ${PWD}/tmp/${LAYER}.geojsonseq > ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/tmp/${LAYER}.geojsonseq.gz ${BASE_PATH}/NHD/gzipped/${LAYER}.geojson.gz ${AWS_PROFILE}
tippecanoe -f -P --generate-ids -Z8 -zg -l ${LAYER} --drop-densest-as-needed --extend-zooms-if-still-dropping -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/NHD/mbtiles/${LAYER}.mbtile ${AWS_PROFILE}
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

LAYER=NHDWaterbody
sudo docker run --rm -v ${PWD}:/code/ ishiland/gdal-python python gdb_to_geojsonseq.py NHD_H_National_GDB.gdb ${LAYER} tmp
gzip -c ${PWD}/tmp/${LAYER}.geojsonseq > ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/tmp/${LAYER}.geojsonseq.gz ${BASE_PATH}/NHD/gzipped/${LAYER}.geojson.gz ${AWS_PROFILE}
tippecanoe -f -P --generate-ids -zg -l ${LAYER} --drop-densest-as-needed --extend-zooms-if-still-dropping -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/NHD/mbtiles/${LAYER}.mbtile ${AWS_PROFILE}
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

LAYER=NHDFlowline
sudo docker run --rm -v ${PWD}:/code/ ishiland/gdal-python python gdb_to_geojsonseq.py NHD_H_National_GDB.gdb ${LAYER} tmp
gzip -c ${PWD}/tmp/${LAYER}.geojsonseq > ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/tmp/${LAYER}.geojsonseq.gz ${BASE_PATH}/NHD/gzipped/${LAYER}.geojson.gz ${AWS_PROFILE}
tippecanoe -f -P --generate-ids -Z12 -zg -l ${LAYER} --drop-densest-as-needed --extend-zooms-if-still-dropping -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/NHD/mbtiles/${LAYER}.mbtile ${AWS_PROFILE}
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

# join all to a single mbtiles file
tile-join -pk -f -n NHD -o mbtiles/NHD.mbtiles ${PWD}/mbtiles/NHDArea.mbtiles ${PWD}/mbtiles/NHDFlowline.mbtiles ${PWD}/mbtiles/NHDLine.mbtiles ${PWD}/mbtiles/NHDPoint.mbtiles ${PWD}/mbtiles/NHDWaterbody.mbtiles ${PWD}/mbtiles/NHDPointEventFC.mbtiles
aws s3 cp ${PWD}/mbtiles/NHD.mbtiles ${MBTILE_URL} ${AWS_PROFILE}

# expand to tile directory
tile-join --force -pk -pC -n NHD -e ./tiles ./mbtiles/NHD.mbtiles

# rename tile extensions to mvt
sudo find ./tiles -name '*.pbf' -exec rename .pbf .mvt {} +

# sync directory to s3
aws s3 sync ./tiles $TILESERVER_URL --no-progress --only-show-errors --delete ${AWS_PROFILE}

sudo shutdown now
