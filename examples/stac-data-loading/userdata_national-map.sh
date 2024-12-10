#!/bin/bash
set -e

# install jq
sudo yum update -y 
sudo yum install jq -y
sudo yum install -y amazon-linux-extras
sudo amazon-linux-extras enable python3.8
sudo yum install -y python3.8
sudo alternatives --install /usr/bin/python3 python3 /usr/bin/python3.8 1
python3.8 -m ensurepip --upgrade
python3.8 -m pip install --upgrade pip


POSTGRES_SECRET=sit/rds/postgres-magic
POSTGRES_USER=$(aws secretsmanager get-secret-value --secret-id ${POSTGRES_SECRET} --region us-east-1 --query 'SecretString' --output text | jq -r '.username')
POSTGRES_PASSWORD=$(aws secretsmanager get-secret-value --secret-id ${POSTGRES_SECRET} --region us-east-1 --query 'SecretString' --output text | jq -r '.password')
DSN_CONNECTION="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@sit-postgres-stac.cymsqtsduz19.us-east-1.rds.amazonaws.com:5432/postgres"
BASE_URL=s3://gp-sit-us-east-1-public-configs/stac/national_map/collections
echo "DSN_CONNECTION: $DSN_CONNECTION"
echo "BASE_URL: $BASE_URL"

# install dependency - version needs to match the database's pgstac version. 
python3.8 -m pip install "pypgstac==0.8.*"
python3.8 -m pip install "pypgstac[psycopg]==0.8.*"

# copy from s3
cd /tmp
mkdir data
aws s3 cp $BASE_URL/collections.ndjson ./data/collections.ndjson
aws s3 cp $BASE_URL/high_resolution_nhd_features.ndjson ./data/high_resolution_nhd_features.ndjson
aws s3 cp $BASE_URL/landcover_by_state_features.ndjson ./data/landcover_by_state_features.ndjson
aws s3 cp $BASE_URL/map_indicees_by_state_features.ndjson ./data/map_indicees_by_state_features.ndjson
aws s3 cp $BASE_URL/small_scale_arce_features.ndjson ./data/small_scale_arce_features.ndjson
aws s3 cp $BASE_URL/small_scale_bil_features.ndjson ./data/small_scale_bil_features.ndjson
aws s3 cp $BASE_URL/small_scale_filegdb101_features.ndjson ./data/small_scale_filegdb101_features.ndjson
aws s3 cp $BASE_URL/small_scale_geotiff_features.ndjson ./data/small_scale_geotiff_features.ndjson
aws s3 cp $BASE_URL/small_scale_shapefile_features.ndjson ./data/small_scale_shapefile_features.ndjson
aws s3 cp $BASE_URL/small_scale_tiff_features.ndjson ./data/small_scale_tiff_features.ndjson
aws s3 cp $BASE_URL/struct_features.ndjson ./data/struct_features.ndjson
aws s3 cp $BASE_URL/topo_map_vector_features.ndjson ./data/topo_map_vector_features.ndjson
aws s3 cp $BASE_URL/tran_features.ndjson ./data/tran_features.ndjson
aws s3 cp $BASE_URL/wbd_by_huc2_features.ndjson ./data/wbd_by_huc2_features.ndjson

echo "running pypgstac commands"

# load collection
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load collections ./data/collections.ndjson

# load items
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/high_resolution_nhd_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/landcover_by_state_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/map_indicees_by_state_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/small_scale_arce_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/small_scale_bil_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/small_scale_filegdb101_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/small_scale_geotiff_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/small_scale_shapefile_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/small_scale_tiff_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/struct_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/topo_map_vector_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/tran_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/wbd_by_huc2_features.ndjson

echo "finished"

sudo shutdown now
