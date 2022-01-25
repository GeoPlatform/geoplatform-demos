#!/bin/bash

AWS_PROFILE="" 
# TILESERVER_URL=s3://gp-sit-tileservice-tile-cache/vector/9e1b0d82_6095_5b94_ae66_9afeb1eacdfc
TILESERVER_URL=s3://geoplatform-cdn-temp/tippecanoe/padus/tiles
# MBTILE_URL=s3://gp-sit-us-east-1-geoplatform-archive/9e1b0d82_6095_5b94_ae66_9afeb1eacdfc.mbtiles
MBTILE_URL=s3://geoplatform-cdn-temp/tippecanoe/padus/PADUS.mbtiles
BASE_PATH=s3://geoplatform-cdn-temp/tippecanoe/padus
TIPPE_PARAMS="-f -P --coalesce-densest-as-needed --extend-zooms-if-still-dropping --generate-ids -zg --maximum-tile-bytes=250000"

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
sudo chown ec2-user:ec2-user ./tmp ./mbtiles ./tiles


LAYER=combined_fee_designation
aws s3 cp ${BASE_PATH}/geojson/${LAYER}.geojsonseq.gz ${PWD}/tmp/${LAYER}.geojsonseq.gz
tippecanoe ${TIPPE_PARAMS} -l ${LAYER} -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/mbtiles/${LAYER}.mbtile 
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

LAYER=combined_fee_designation_easement
aws s3 cp ${BASE_PATH}/geojson/${LAYER}.geojsonseq.gz ${PWD}/tmp/${LAYER}.geojsonseq.gz
tippecanoe ${TIPPE_PARAMS} -l ${LAYER} -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/mbtiles/${LAYER}.mbtile 
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

LAYER=combined_fee_easement
aws s3 cp ${BASE_PATH}/geojson/${LAYER}.geojsonseq.gz ${PWD}/tmp/${LAYER}.geojsonseq.gz
tippecanoe ${TIPPE_PARAMS} -l ${LAYER} -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/mbtiles/${LAYER}.mbtile 
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

LAYER=combined_marine_fee_designation_easement
aws s3 cp ${BASE_PATH}/geojson/${LAYER}.geojsonseq.gz ${PWD}/tmp/${LAYER}.geojsonseq.gz
tippecanoe ${TIPPE_PARAMS} -l ${LAYER} -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/mbtiles/${LAYER}.mbtile 
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

LAYER=designation
aws s3 cp ${BASE_PATH}/geojson/${LAYER}.geojsonseq.gz ${PWD}/tmp/${LAYER}.geojsonseq.gz
tippecanoe ${TIPPE_PARAMS} -l ${LAYER} -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/mbtiles/${LAYER}.mbtile 
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

LAYER=easement
aws s3 cp ${BASE_PATH}/geojson/${LAYER}.geojsonseq.gz ${PWD}/tmp/${LAYER}.geojsonseq.gz
tippecanoe ${TIPPE_PARAMS} -l ${LAYER} -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/mbtiles/${LAYER}.mbtile 
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

LAYER=fee
aws s3 cp ${BASE_PATH}/geojson/${LAYER}.geojsonseq.gz ${PWD}/tmp/${LAYER}.geojsonseq.gz
tippecanoe ${TIPPE_PARAMS} -l ${LAYER} -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/mbtiles/${LAYER}.mbtile 
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

LAYER=marine
aws s3 cp ${BASE_PATH}/geojson/${LAYER}.geojsonseq.gz ${PWD}/tmp/${LAYER}.geojsonseq.gz
tippecanoe ${TIPPE_PARAMS} -l ${LAYER} -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/mbtiles/${LAYER}.mbtile 
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

LAYER=proclamation
aws s3 cp ${BASE_PATH}/geojson/${LAYER}.geojsonseq.gz ${PWD}/tmp/${LAYER}.geojsonseq.gz
tippecanoe ${TIPPE_PARAMS} -l ${LAYER} -o ${PWD}/mbtiles/${LAYER}.mbtiles ${PWD}/tmp/${LAYER}.geojsonseq.gz
aws s3 cp ${PWD}/mbtiles/${LAYER}.mbtiles ${BASE_PATH}/mbtiles/${LAYER}.mbtile 
sudo rm ${PWD}/tmp/${LAYER}.geojsonseq.gz

# join all to a single mbtiles file
tile-join -pk -f -n PADUS -o mbtiles/PADUS.mbtiles \
    ${PWD}/mbtiles/combined_fee_designation.mbtiles \
    ${PWD}/mbtiles/combined_fee_designation_easement.mbtiles \
    ${PWD}/mbtiles/combined_fee_easement.mbtiles \
    ${PWD}/mbtiles/combined_marine_fee_designation_easement.mbtiles \
    ${PWD}/mbtiles/designation.mbtiles \
    ${PWD}/mbtiles/easement.mbtiles \
    ${PWD}/mbtiles/fee.mbtiles \
    ${PWD}/mbtiles/marine.mbtiles \
    ${PWD}/mbtiles/proclamation.mbtiles 

aws s3 cp ${PWD}/mbtiles/PADUS.mbtiles ${MBTILE_URL}

# expand to tile directory
tile-join --force -pk -pC -n PADUS -e ./tiles ./mbtiles/PADUS.mbtiles

# rename tile extensions to mvt
sudo find ./tiles -name '*.pbf' -exec rename .pbf .mvt {} +

# sync directory to s3
aws s3 sync ./tiles $TILESERVER_URL --no-progress --only-show-errors

sudo shutdown now