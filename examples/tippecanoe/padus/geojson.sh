!/bin/bash

BASE_URL=s3://geoplatform-cdn-temp/tippecanoe/padus

sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker

sudo mkdir -p tmp
sudo chown ec2-user:ec2-user /tmp
cd /tmp

aws s3 cp ${BASE_URL}/PAD_US2_1_GDB.zip PAD_US2_1_GDB.zip

# `ogrinfo -so PAD_US2_1_GDB.zip` yields: 
# 1: Public_Access (None)
# 2: Category (None)
# 3: Designation_Type (None)
# 4: GAP_Status (None)
# 5: IUCN_Category (None)
# 6: Agency_Name (None)
# 7: Agency_Type (None)
# 8: State_Name (None)
# 9: PADUS2_1Combined_Fee_Designation (Multi Polygon)
# 10: PADUS2_1Combined_Fee_Designation_Easement (Multi Polygon)
# 11: PADUS2_1Combined_Fee_Easement (Multi Polygon)
# 12: PADUS2_1Combined_Marine_Fee_Designation_Easement (Multi Polygon)
# 13: PADUS2_1Combined_Proclamation_Marine_Fee_Designation_Easement (Multi Polygon)
# 14: PADUS2_1Designation (Multi Polygon)
# 15: PADUS2_1Easement (Multi Polygon)
# 16: PADUS2_1Fee (Multi Polygon)
# 17: PADUS2_1Marine (Multi Polygon)
# 18: PADUS2_1Proclamation (Multi Polygon)

# PADUS2_1Combined_Fee_Designation (Multi Polygon)
OUT_LAYER=combined_fee_designation
sudo docker run -v /tmp:/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -f GeoJSONSeq -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 /data/${OUT_LAYER}.geojsonseq PAD_US2_1_GDB.zip PADUS2_1Combined_Fee_Designation
gzip -c ${OUT_LAYER}.geojsonseq > ${OUT_LAYER}.geojsonseq.gz
aws s3 cp ${OUT_LAYER}.geojsonseq.gz ${BASE_URL}/geojson/${OUT_LAYER}.geojsonseq.gz

# PADUS2_1Combined_Fee_Designation_Easement (Multi Polygon)
OUT_LAYER=combined_fee_designation_easement
sudo docker run -v /tmp:/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -f GeoJSONSeq -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 /data/${OUT_LAYER}.geojsonseq PAD_US2_1_GDB.zip PADUS2_1Combined_Fee_Designation_Easement
gzip -c ${OUT_LAYER}.geojsonseq > ${OUT_LAYER}.geojsonseq.gz
aws s3 cp ${OUT_LAYER}.geojsonseq.gz ${BASE_URL}/geojson/${OUT_LAYER}.geojsonseq.gz

# PADUS2_1Combined_Fee_Easement (Multi Polygon)
OUT_LAYER=combined_fee_easement
sudo docker run -v /tmp:/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -f GeoJSONSeq -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 /data/${OUT_LAYER}.geojsonseq PAD_US2_1_GDB.zip PADUS2_1Combined_Fee_Easement
gzip -c ${OUT_LAYER}.geojsonseq > ${OUT_LAYER}.geojsonseq.gz
aws s3 cp ${OUT_LAYER}.geojsonseq.gz ${BASE_URL}/geojson/${OUT_LAYER}.geojsonseq.gz

# PADUS2_1Combined_Marine_Fee_Designation_Easement (Multi Polygon)
OUT_LAYER=combined_marine_fee_designation_easement
sudo docker run -v /tmp:/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -f GeoJSONSeq -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 /data/${OUT_LAYER}.geojsonseq PAD_US2_1_GDB.zip PADUS2_1Combined_Marine_Fee_Designation_Easement
gzip -c ${OUT_LAYER}.geojsonseq > ${OUT_LAYER}.geojsonseq.gz
aws s3 cp ${OUT_LAYER}.geojsonseq.gz ${BASE_URL}/geojson/${OUT_LAYER}.geojsonseq.gz

# PADUS2_1Combined_Proclamation_Marine_Fee_Designation_Easement (Multi Polygon)
OUT_LAYER=combined_proclamation_marine_fee_designation_easement
sudo docker run -v /tmp:/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -f GeoJSONSeq -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 /data/${OUT_LAYER}.geojsonseq PAD_US2_1_GDB.zip PADUS2_1Combined_Proclamation_Marine_Fee_Designation_Easement
gzip -c ${OUT_LAYER}.geojsonseq > ${OUT_LAYER}.geojsonseq.gz
aws s3 cp ${OUT_LAYER}.geojsonseq.gz ${BASE_URL}/geojson/${OUT_LAYER}.geojsonseq.gz

# PADUS2_1Designation (Multi Polygon)
OUT_LAYER=designation
sudo docker run -v /tmp:/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -f GeoJSONSeq -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 /data/${OUT_LAYER}.geojsonseq PAD_US2_1_GDB.zip PADUS2_1Designation
gzip -c ${OUT_LAYER}.geojsonseq > ${OUT_LAYER}.geojsonseq.gz
aws s3 cp ${OUT_LAYER}.geojsonseq.gz ${BASE_URL}/geojson/${OUT_LAYER}.geojsonseq.gz

# PADUS2_1Easement (Multi Polygon)
OUT_LAYER=easement
sudo docker run -v /tmp:/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -f GeoJSONSeq -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 /data/${OUT_LAYER}.geojsonseq PAD_US2_1_GDB.zip PADUS2_1Easement
gzip -c ${OUT_LAYER}.geojsonseq > ${OUT_LAYER}.geojsonseq.gz
aws s3 cp ${OUT_LAYER}.geojsonseq.gz ${BASE_URL}/padus/geojson/${OUT_LAYER}.geojsonseq.gz

# PADUS2_1Fee (Multi Polygon)
OUT_LAYER=fee
sudo docker run -v /tmp:/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -f GeoJSONSeq -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 /data/${OUT_LAYER}.geojsonseq PAD_US2_1_GDB.zip PADUS2_1Fee
gzip -c ${OUT_LAYER}.geojsonseq > ${OUT_LAYER}.geojsonseq.gz
aws s3 cp ${OUT_LAYER}.geojsonseq.gz ${BASE_URL}/padus/geojson/${OUT_LAYER}.geojsonseq.gz

# PADUS2_1Marine (Multi Polygon)
OUT_LAYER=marine
sudo docker run -v /tmp:/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -f GeoJSONSeq -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 /data/${OUT_LAYER}.geojsonseq PAD_US2_1_GDB.zip PADUS2_1Marine
gzip -c ${OUT_LAYER}.geojsonseq > ${OUT_LAYER}.geojsonseq.gz
aws s3 cp ${OUT_LAYER}.geojsonseq.gz ${BASE_URL}/padus/geojson/${OUT_LAYER}.geojsonseq.gz

# PADUS2_1Proclamation (Multi Polygon)
OUT_LAYER=proclamation
sudo docker run -v /tmp:/data --name GDAL --rm osgeo/gdal:alpine-small-latest ogr2ogr -f GeoJSONSeq -lco SIGNIFICANT_FIGURES=6 -t_srs crs:84 /data/${OUT_LAYER}.geojsonseq PAD_US2_1_GDB.zip PADUS2_1Proclamation
gzip -c ${OUT_LAYER}.geojsonseq > ${OUT_LAYER}.geojsonseq.gz
aws s3 cp ${OUT_LAYER}.geojsonseq.gz ${BASE_URL}/padus/geojson/${OUT_LAYER}.geojsonseq.gz

sudo shutdown now