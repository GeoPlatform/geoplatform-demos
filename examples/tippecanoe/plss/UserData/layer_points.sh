#!/bin/bash
set -e 

BASE_URL=s3://geoplatform-cdn-temp/tippecanoe/PLSS
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker


# copy gdb from s3
aws s3 cp $BASE_URL/AL_CadNSDI_V2.gdb.zip AL_CadNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/AK_CadNSDI.gdb.zip AK_CadNSDI.gdb.zip 
aws s3 cp $BASE_URL/AR_CadNSDI_V2.gdb.zip AR_CadNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/CadRef_v10.gdb.zip CadRef_v10.gdb.zip 
aws s3 cp $BASE_URL/BLM_CO_PLSS_20210823.gdb.zip BLM_CO_PLSS_20210823.gdb.zip 
aws s3 cp $BASE_URL/IA_CadNSDI_V2.gdb.zip IA_CadNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/IL_CadNSDI_V2.gdb.zip IL_CadNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/IN_CadNSDI_V2.gdb.zip IN_CadNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/KS_CadNSDI_V2.gdb.zip KS_CadNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/LA_CadNSDI_V2.gdb.zip LA_CadNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/MI_CadNSDI_V2.gdb.zip MI_CadNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/MN_CadNSDI_V2.gdb.zip MN_CadNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/MO_CadNSDI_V2.gdb.zip MO_CadNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/MS_CadNSDI_V2.gdb.zip MS_CadNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/CadNSDI_MT_2021_05_25.gdb.zip CadNSDI_MT_2021_05_25.gdb.zip 
aws s3 cp $BASE_URL/ND_CadNSDI_V2_06252018.gdb.zip ND_CadNSDI_V2_06252018.gdb.zip 
aws s3 cp $BASE_URL/NM_CadNSDI2_07262019.gdb.zip NM_CadNSDI2_07262019.gdb.zip 
aws s3 cp $BASE_URL/NE_CadNSDI_V2.gdb.zip NE_CadNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/BLM_NV_PLSS.gdb.zip BLM_NV_PLSS.gdb.zip 
aws s3 cp $BASE_URL/BLM_NM_REGION_OK_CadNSDI_gdb.zip BLM_NM_REGION_OK_CadNSDI_gdb.zip # oklahoma
aws s3 cp $BASE_URL/OH_CADNSDI_V2.gdb.zip OH_CADNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/CadNSDI_PLSS_web.gdb.zip CadNSDI_PLSS_web.gdb.zip 
aws s3 cp $BASE_URL/SD_CadNSDI_V2.gdb.zip SD_CadNSDI_V2.gdb.zip 
aws s3 cp $BASE_URL/WI_CadNSDI_V2.gdb.zip WI_CadNSDI_V2.gdb.zip
aws s3 cp $BASE_URL/WY_PLSS_CadNSDI_20190925.gdb.zip WY_PLSS_CadNSDI_20190925.gdb.zip 

# Alaska field names are lowercase, the rest of the states are uppercase. Lets convert AK to uppercase to match. 
# AK_SQL_CMD="SELECT stateabbr as STATEABBR, prinmercd as PRINMERCD, prinmer as PRINMER, twnshpno as TWNSHPNO, twnshpfrac as TWNSHPFRAC, twnshpdir as TWNSHPDIR, rangeno as RANGENO, rangefrac as RANGEFRAC, rangedir as RANGEDIR, twnshpdpcd as TWNSHPDPCD, plssid as PLSSID, twnshplab as TWNSHPLAB, shape_Length as SHAPE_Length, shape_Area as SHAPE_Area from CADNSDI_PLSSTOWNSHIP"
LAYER=PLSSPoint
# convert $LAYER to geojson
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/al_$LAYER.geojson /data/AL_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ak_$LAYER.geojson /data/AK_CadNSDI.gdb.zip cadnsdi_plsspoint
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ar_$LAYER.geojson /data/AR_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ca_$LAYER.geojson /data/CadRef_v10.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/co_$LAYER.geojson /data/BLM_CO_PLSS_20210823.gdb.zip BLM_CO_PLSS_Point
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ia_$LAYER.geojson /data/IA_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/il_$LAYER.geojson /data/IL_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/in_$LAYER.geojson /data/IN_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ks_$LAYER.geojson /data/KS_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/la_$LAYER.geojson /data/LA_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/mi_$LAYER.geojson /data/MI_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/mn_$LAYER.geojson /data/MN_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/mo_$LAYER.geojson /data/MO_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ms_$LAYER.geojson /data/MS_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/mt_$LAYER.geojson /data/CadNSDI_MT_2021_05_25.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/nd_$LAYER.geojson /data/ND_CadNSDI_V2_06252018.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/nm_$LAYER.geojson /data/NM_CadNSDI2_07262019.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ne_$LAYER.geojson /data/NE_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/nv_$LAYER.geojson /data/BLM_NV_PLSS.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/ok_$LAYER.geojson /data/BLM_NM_REGION_OK_CadNSDI_gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/oh_$LAYER.geojson /data/OH_CADNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/or_wa_$LAYER.geojson /data/CadNSDI_PLSS_web.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/sd_$LAYER.geojson /data/SD_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/wi_$LAYER.geojson /data/WI_CadNSDI_V2.gdb.zip $LAYER
sudo docker run -v $(pwd):/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -overwrite -skipfailures -progress --config OGR_ORGANIZE_POLYGONS SKIP -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 -f GeoJSON /data/wy_$LAYER.geojson /data/WY_PLSS_CadNSDI_20190925.gdb.zip $LAYER

#geojson to compressed
gzip -c al_$LAYER.geojson > al_$LAYER.geojson.gz
gzip -c ak_$LAYER.geojson > ak_$LAYER.geojson.gz
gzip -c ar_$LAYER.geojson > ar_$LAYER.geojson.gz
gzip -c ca_$LAYER.geojson > ca_$LAYER.geojson.gz
gzip -c co_$LAYER.geojson > co_$LAYER.geojson.gz
gzip -c ia_$LAYER.geojson > ia_$LAYER.geojson.gz
gzip -c il_$LAYER.geojson > il_$LAYER.geojson.gz
gzip -c in_$LAYER.geojson > in_$LAYER.geojson.gz
gzip -c ks_$LAYER.geojson > ks_$LAYER.geojson.gz
gzip -c la_$LAYER.geojson > la_$LAYER.geojson.gz
gzip -c mi_$LAYER.geojson > mi_$LAYER.geojson.gz
gzip -c mn_$LAYER.geojson > mn_$LAYER.geojson.gz
gzip -c mo_$LAYER.geojson > mo_$LAYER.geojson.gz
gzip -c ms_$LAYER.geojson > ms_$LAYER.geojson.gz
gzip -c mt_$LAYER.geojson > mt_$LAYER.geojson.gz
gzip -c nd_$LAYER.geojson > nd_$LAYER.geojson.gz
gzip -c nm_$LAYER.geojson > nm_$LAYER.geojson.gz
gzip -c ne_$LAYER.geojson > ne_$LAYER.geojson.gz
gzip -c nv_$LAYER.geojson > nv_$LAYER.geojson.gz
gzip -c oh_$LAYER.geojson > oh_$LAYER.geojson.gz
gzip -c ok_$LAYER.geojson > ok_$LAYER.geojson.gz
gzip -c or_wa_$LAYER.geojson > or_wa_$LAYER.geojson.gz
gzip -c sd_$LAYER.geojson > sd_$LAYER.geojson.gz
gzip -c wi_$LAYER.geojson > wi_$LAYER.geojson.gz
gzip -c wy_$LAYER.geojson > wy_$LAYER.geojson.gz

#compressed to s3
aws s3 cp al_$LAYER.geojson.gz $BASE_URL/al_$LAYER.geojson.gz
aws s3 cp ak_$LAYER.geojson.gz $BASE_URL/ak_$LAYER.geojson.gz
aws s3 cp ar_$LAYER.geojson.gz $BASE_URL/ar_$LAYER.geojson.gz
aws s3 cp ca_$LAYER.geojson.gz $BASE_URL/ca_$LAYER.geojson.gz
aws s3 cp co_$LAYER.geojson.gz $BASE_URL/co_$LAYER.geojson.gz
aws s3 cp ia_$LAYER.geojson.gz $BASE_URL/ia_$LAYER.geojson.gz
aws s3 cp il_$LAYER.geojson.gz $BASE_URL/il_$LAYER.geojson.gz
aws s3 cp in_$LAYER.geojson.gz $BASE_URL/in_$LAYER.geojson.gz
aws s3 cp ks_$LAYER.geojson.gz $BASE_URL/ks_$LAYER.geojson.gz
aws s3 cp la_$LAYER.geojson.gz $BASE_URL/la_$LAYER.geojson.gz
aws s3 cp mi_$LAYER.geojson.gz $BASE_URL/mi_$LAYER.geojson.gz
aws s3 cp mn_$LAYER.geojson.gz $BASE_URL/mn_$LAYER.geojson.gz
aws s3 cp mo_$LAYER.geojson.gz $BASE_URL/mo_$LAYER.geojson.gz
aws s3 cp ms_$LAYER.geojson.gz $BASE_URL/ms_$LAYER.geojson.gz
aws s3 cp mt_$LAYER.geojson.gz $BASE_URL/mt_$LAYER.geojson.gz
aws s3 cp nd_$LAYER.geojson.gz $BASE_URL/nd_$LAYER.geojson.gz
aws s3 cp nm_$LAYER.geojson.gz $BASE_URL/nm_$LAYER.geojson.gz
aws s3 cp ne_$LAYER.geojson.gz $BASE_URL/ne_$LAYER.geojson.gz
aws s3 cp nv_$LAYER.geojson.gz $BASE_URL/nv_$LAYER.geojson.gz
aws s3 cp oh_$LAYER.geojson.gz $BASE_URL/oh_$LAYER.geojson.gz
aws s3 cp ok_$LAYER.geojson.gz $BASE_URL/ok_$LAYER.geojson.gz
aws s3 cp or_wa_$LAYER.geojson.gz $BASE_URL/or_wa_$LAYER.geojson.gz
aws s3 cp sd_$LAYER.geojson.gz $BASE_URL/sd_$LAYER.geojson.gz
aws s3 cp wi_$LAYER.geojson.gz $BASE_URL/wi_$LAYER.geojson.gz
aws s3 cp wy_$LAYER.geojson.gz $BASE_URL/wy_$LAYER.geojson.gz


sudo shutdown now
