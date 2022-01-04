#!/bin/bash

AWS_PROFILE=""
BASE_URL=s3://geoplatform-cdn-temp/tippecanoe/NHD
TILESERVER_URL=s3://gp-sit-tileservice-tile-cache/vector/9e1b0d82-6095-5b94-ae66-9afeb1eacdfc
EXPLODED_MBTILE_URL=s3://gp-sit-us-east-1-geoplatform-archive/9e1b0d82-6095-5b94-ae66-9afeb1eacdfc.mbtiles

sudo yum update -y
sudo yum install -y git gcc sqlite-devel.x86_64
sudo yum groupinstall -y "Development Tools"

cd /tmp
git clone https://github.com/mapbox/tippecanoe.git
cd tippecanoe
make -j
sudo make install

# ========================
# NHDLineEventFC
# ========================
aws s3 cp ${BASE_URL}/NHDLineEventFC.geojson.gz ./gzipped/NHDLineEventFC.geojson.gz  $AWS_PROFILE
tippecanoe -o ./mbtiles/NHDAreaEventFC.mbtiles --generate-ids -zg -l NHDLineEventFC ./gzipped/NHDLineEventFC.geojson.gz
aws s3 cp ./mbtiles/NHDLineEventFC.mbtiles $BASE_URL $AWS_PROFILE

# ========================
# NHDAreaEventFC
# ========================
aws s3 cp ${BASE_URL}/NHDAreaEventFC.geojson.gz ./gzipped/NHDAreaEventFC.geojson.gz  $AWS_PROFILE
tippecanoe -o ./mbtiles/NHDAreaEventFC.mbtiles --generate-ids -zg -l NHDAreaEventFC ./gzipped/NHDAreaEventFC.geojson.gz
aws s3 cp ./mbtiles/NHDAreaEventFC.mbtiles $BASE_URL $AWS_PROFILE

# ========================
# NHDLine
# ========================
aws s3 cp ${BASE_URL}/NHDLine.geojson.gz ./gzipped/NHDLine.geojson.gz  $AWS_PROFILE
tippecanoe -o ./mbtiles/NHDLine.mbtiles --generate-ids -zg -l NHDLine ./gzipped/NHDLine.geojson.gz
aws s3 cp ./mbtiles/NHDLine.mbtiles $BASE_URL $AWS_PROFILE

# ========================
# NHDPoint
# ========================
aws s3 cp ${BASE_URL}/NHDPoint.geojson.gz ./gzipped/NHDPoint.geojson.gz  $AWS_PROFILE
tippecanoe -o ./mbtiles/NHDPoint.mbtiles --generate-ids -zg -l NHDPoint ./gzipped/NHDPoint.geojson.gz
aws s3 cp ./mbtiles/NHDPoint.mbtiles $BASE_URL $AWS_PROFILE

# ========================
# NHDWaterbody
# ========================
WATERBODY_LAYER=NHDWaterbody
s3_files=($(aws s3 ls ${BASE_URL}/NHDWaterbody/ $AWS_PROFILE | awk '{print $4}'))
mbtile_join_str=""
for i in "${s3_files[@]}"
do
{
  echo "$i"
  aws s3 cp ${BASE_URL}/NHDWaterbody/${i} ./gzipped/${i} $AWS_PROFILE
  tippecanoe -o ./mbtiles/${i%.*}.mbtiles --generate-ids -Z4 -z10 -l ${WATERBODY_LAYER} ./gzipped/"${i}"
  mbtile_join_str+="./mbtiles/${i%.*}.mbtiles "
}
done
# create a unified NHDWaterbody mbtiles and copy to s3
tile-join --force -pk -pC -n $WATERBODY_LAYER -o ./mbtiles/${WATERBODY_LAYER}.mbtiles ${mbtile_join_str}
aws s3 cp ./mbtiles/${WATERBODY_LAYER}.mbtiles $BASE_URL $AWS_PROFILE

# ========================
# NHDArea
# ========================
NHDArea_LAYER=NHDArea
s3_files=($(aws s3 ls ${BASE_URL}/${NHDArea_LAYER}/ $AWS_PROFILE | awk '{print $4}'))
mbtile_join_str=""
for i in "${s3_files[@]}"
do
{
  echo "$i"
  aws s3 cp ${BASE_URL}/${NHDArea_LAYER}/${i} ./gzipped/${i} $AWS_PROFILE
  tippecanoe -o ./mbtiles/${i%.*}.mbtiles --generate-ids -Z4 -z10 -l ${NHDArea_LAYER} ./gzipped/"${i}"
  mbtile_join_str+="./mbtiles/${i%.*}.mbtiles "
}
done
# create a unified NHDArea mbtiles and copy to s3
tile-join --force -pk -pC -n $NHDArea_LAYER -o ./mbtiles/${NHDArea_LAYER}.mbtiles ${mbtile_join_str}
aws s3 cp ./mbtiles/${NHDArea_LAYER}.mbtiles $BASE_URL $AWS_PROFILE

# ========================
# NHDFlowline
# ========================
NHDFlowline_LAYER=NHDFlowline
s3_files=($(aws s3 ls ${BASE_URL}/${NHDFlowline_LAYER}/ $AWS_PROFILE | awk '{print $4}'))
mbtile_join_str=""
for i in "${s3_files[@]}"
do
{
  echo "$i"
  aws s3 cp ${BASE_URL}/${NHDFlowline_LAYER}/${i} ./gzipped/${i} $AWS_PROFILE
  tippecanoe -o ./mbtiles/${i%.*}.mbtiles --generate-ids -Z11 -z12 -l ${NHDFlowline_LAYER} ./gzipped/"${i}"
  mbtile_join_str+="./mbtiles/${i%.*}.mbtiles "
}
done
# create a unified NHDArea mbtiles and copy to s3
tile-join --force -pk -pC -n $NHDFlowline_LAYER -o ./mbtiles/${NHDFlowline_LAYER}.mbtiles ${mbtile_join_str}
aws s3 cp ./mbtiles/${NHDFlowline_LAYER}.mbtiles $BASE_URL $AWS_PROFILE

# compile all layers into one mbtile file and copy to s3
tile-join --force -pk -pC -n NHD -o ./mbtiles/NHD.mbtiles ./mbtiles/NHDPoint.mbtiles ./mbtiles/NHDLine.mbtiles ./mbtiles/${WATERBODY_LAYER}.mbtiles
aws s3 cp ./mbtiles/NHD.mbtiles $BASE_URL $AWS_PROFILE

# explode national tiles to a directory structure
sudo mkdir tiles
sudo chown ec2-user:ec2-user ./tiles
tile-join --force -pk -pC -n PLSS -e ./tiles ./mbtiles/NHD.mbtiles

# rename file extension from pbf to mvt
find ./tiles -name '*.pbf' -exec rename .pbf .mvt {} +

# sync to s3
echo "syncing to s3 $TILESERVER_URL"
aws s3 sync ./tiles $TILESERVER_URL --no-progress --only-show-errors

echo "Process complete, shutting down."
sudo shutdown now
