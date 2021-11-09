#!/bin/bash
# set -e 

AWS_PROFILE=""
BASE_URL=s3://geoplatform-cdn-temp/tippecanoe
TILESERVER_URL=s3://gp-sit-tileservice-tile-cache/vector/9b59f427_c0ad_5f8b_ac22_2dbdac882dfa
NATIONAL_MBTILE_URL=s3://gp-sit-us-east-1-geoplatform-archive/9b59f427_c0ad_5f8b_ac22_2dbdac882dfa.mbtiles
TIPPE_PARAMS="--force --drop-densest-as-needed --drop-fraction-as-needed --drop-smallest-as-needed --coalesce-densest-as-needed --coalesce-smallest-as-needed -z10"
declare -a STATES_AR=("al" "ak" "ar" "ca" "co" "ia" "il" "in" "ks" "la" "mi" "mn" "mo" "ms" "mt" "nd" "nm" "ne" "nv" "oh" "or_wa" "sd" "wy")

sudo yum update -y
sudo yum install -y git gcc sqlite-devel.x86_64
sudo yum groupinstall -y "Development Tools"

cd /tmp
git clone https://github.com/mapbox/tippecanoe.git
cd tippecanoe
make -j
sudo make install


layer=PLSSFirstDivision
fields_to_keep="-y PLSSID -y FIRSTDIVID -y FIRSTDIVTXT -y GISACRE -y SHAPE_Length -y SHAPE_Area"
mbtile_join_str=""
for i in "${STATES_AR[@]}"
do
    state_layer_name="${i}"_"${layer}"
    echo "processing ${state_layer_name}"
    # copy geojson gzip to local 
    aws s3 cp $BASE_URL/$state_layer_name.geojson.gz $state_layer_name.geojson.gz $AWS_PROFILE
    #make mbtiles
    tippecanoe -o ./${state_layer_name}.mbtiles ${fields_to_keep} ${TIPPE_PARAMS} -Z9 -l ${layer} ./${state_layer_name}.geojson.gz
    #copy mbtiles to s3
    aws s3 cp ${state_layer_name}.mbtiles $BASE_URL/$state_layer_name.mbtiles ${AWS_PROFILE}
    mbtile_join_str+="./${state_layer_name}.mbtiles "
    mbtile_join_str+="./${state_layer_name}.mbtiles "
done
# create a national $layer
tile-join --force -pk -pC -n $layer -o ./${layer}.mbtiles ${mbtile_join_str}
# copy it to s3
aws s3 cp ${layer}.mbtiles $BASE_URL/${layer}.mbtiles $AWS_PROFILE


layer=PLSSSecondDivision
fields_to_keep="-y PLSSID -y FIRSTDIVID -y SECDIVID -y SECDIVTXT -y GISACRE -y SHAPE_Length -y SHAPE_Area"
mbtile_join_str=""
for i in "${STATES_AR[@]}"
do
    state_layer_name="${i}"_"${layer}"
    echo "processing ${state_layer_name}"
    # copy geojson gzip to local 
    aws s3 cp $BASE_URL/$state_layer_name.geojson.gz $state_layer_name.geojson.gz $AWS_PROFILE
    #make mbtiles
    tippecanoe -o ./${state_layer_name}.mbtiles ${fields_to_keep} ${TIPPE_PARAMS} -Z10 -l ${layer} ./${state_layer_name}.geojson.gz
    #copy mbtiles to s3
    aws s3 cp ${state_layer_name}.mbtiles $BASE_URL/$state_layer_name.mbtiles ${AWS_PROFILE}
    mbtile_join_str+="./${state_layer_name}.mbtiles "
done
# create a national $layer 
tile-join --force -pk -pC -n $layer -o ./${layer}.mbtiles ${mbtile_join_str}
# copy it to s3
aws s3 cp ${layer}.mbtiles $BASE_URL/${layer}.mbtiles $AWS_PROFILE


layer=PLSSTownship
fields_to_keep="-y STATEABBR -y PRINMERCD -y PRINMER -y TWNSHPNO -y TWNSHPFRAC -y TWNSHPDIR -y RANGENO -y RANGEDIR -y TWNSHPDPCD -y PLSSID -y STEWARD -y TWNSHPLAB -y SHAPE_Length -y SHAPE_Area"
mbtile_join_str=""
for i in "${STATES_AR[@]}"
do
    state_layer_name="${i}"_"${layer}"
    echo "processing ${state_layer_name}"
    # copy geojson gzip to local 
    aws s3 cp $BASE_URL/$state_layer_name.geojson.gz $state_layer_name.geojson.gz $AWS_PROFILE
    #make mbtiles
    tippecanoe -o ./${state_layer_name}.mbtiles ${fields_to_keep} ${TIPPE_PARAMS} -Z6 -l ${layer} ./${state_layer_name}.geojson.gz
    #copy mbtiles to s3
    aws s3 cp ${state_layer_name}.mbtiles $BASE_URL/$state_layer_name.mbtiles ${AWS_PROFILE}
    mbtile_join_str+="./${state_layer_name}.mbtiles "
done
# create a national $layer
tile-join --force -pk -pC -n $layer -o ./${layer}.mbtiles ${mbtile_join_str}
# copy it to s3
aws s3 cp ${layer}.mbtiles $BASE_URL/${layer}.mbtiles $AWS_PROFILE


layer=PLSSSpecialSurvey
fields_to_keep="-y SURVID -y SURVNO -y SURVTYP -y GISACRE -y SHAPE_Length -y SHAPE_Area"
mbtile_join_str=""
for i in "${STATES_AR[@]}"
do
    state_layer_name="${i}"_"${layer}"
    echo "processing ${state_layer_name}"
    # copy geojson gzip to local 
    aws s3 cp $BASE_URL/$state_layer_name.geojson.gz $state_layer_name.geojson.gz $AWS_PROFILE
    #make mbtiles
    tippecanoe -o ./${state_layer_name}.mbtiles ${fields_to_keep} ${TIPPE_PARAMS} -Z8 -l ${layer} ./${state_layer_name}.geojson.gz
    #copy mbtiles to s3
    aws s3 cp ${state_layer_name}.mbtiles $BASE_URL/$state_layer_name.mbtiles ${AWS_PROFILE}
    mbtile_join_str+="./${state_layer_name}.mbtiles "
done
# create a national $layer
tile-join --force -pk -pC -n $layer -o ./${layer}.mbtiles ${mbtile_join_str}
# copy it to s3
aws s3 cp ${layer}.mbtiles $BASE_URL/${layer}.mbtiles $AWS_PROFILE


layer=PLSSPoint
fields_to_keep="-y PLSSID -y POINTID -y ELEV -y YCOORD -y YCOORD -y POINTLAB"
mbtile_join_str=""
for i in "${STATES_AR[@]}"
do
    state_layer_name="${i}"_"${layer}"
    echo "processing ${state_layer_name}"
    # copy geojson gzip to local 
    aws s3 cp $BASE_URL/$state_layer_name.geojson.gz $state_layer_name.geojson.gz $AWS_PROFILE
    #make mbtiles 
    tippecanoe -o ./${state_layer_name}.mbtiles ${fields_to_keep} ${TIPPE_PARAMS} -Z6 -l ${layer} ./${state_layer_name}.geojson.gz
    #copy mbtiles to s3
    aws s3 cp ${state_layer_name}.mbtiles $BASE_URL/$state_layer_name.mbtiles ${AWS_PROFILE}
    mbtile_join_str+="./${state_layer_name}.mbtiles "
done
# create a national $layer
tile-join --force -pk -pC -n $layer -o ./${layer}.mbtiles ${mbtile_join_str}
# copy it to s3
aws s3 cp ${layer}.mbtiles $BASE_URL/${layer}.mbtiles $AWS_PROFILE


# compile all national $layer's into one mbtile
tile-join --force -pk -pC -n PLSS_National -o ./plss_national.mbtiles ./PLSSFirstDivision.mbtiles ./PLSSSecondDivision.mbtiles ./PLSSTownship.mbtiles ./PLSSSpecialSurvey.mbtiles ./PLSSTownship.mbtiles ./PLSSPoint.mbtiles
# copy it to s3
aws s3 cp plss_national.mbtiles $NATIONAL_MBTILE_URL $AWS_PROFILE


# explode national tiles to a directory structure
sudo mkdir tiles
sudo chown ec2-user:ec2-user ./tiles
tile-join --force -pk -pC -n PLSS -e ./tiles ./plss_national.mbtiles

# rename file extension from pbf to mvt
find ./tiles -name '*.pbf' -exec rename .pbf .mvt {} +

# sync to s3
echo "syncing to s3 $TILESERVER_URL"
aws s3 sync ./tiles $TILESERVER_URL --no-progress --only-show-errors

echo "Process complete, shutting down."
sudo shutdown now
