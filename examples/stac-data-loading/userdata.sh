#!/bin/bash
set -e

# install jq
sudo yum update -y 
sudo yum install jq -y

POSTGRES_SECRET=sit/rds/postgres-magic
POSTGRES_USER=$(aws secretsmanager get-secret-value --secret-id ${POSTGRES_SECRET} --region us-east-1 --query 'SecretString' --output text | jq -r '.username')
POSTGRES_PASSWORD=$(aws secretsmanager get-secret-value --secret-id ${POSTGRES_SECRET} --region us-east-1 --query 'SecretString' --output text | jq -r '.password')
DSN_CONNECTION="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@sit-postgres-stac.cymsqtsduz19.us-east-1.rds.amazonaws.com:5432/postgres"
BASE_URL=s3://gp-sit-us-east-1-public-configs/stac/census_tiger/collections

# install dependency - version needs to match the database's pgstac version. 
pip3 install pypgstac[psycopg]==0.6.10

# copy from s3
cd /tmp
mkdir data
aws s3 cp $BASE_URL/collections.ndjson ./data/collections.ndjson
aws s3 cp $BASE_URL/genz2010_features.ndjson ./data/genz2010_features.ndjson
aws s3 cp $BASE_URL/genz2012_features.ndjson ./data/genz2012_features.ndjson
aws s3 cp $BASE_URL/genz2013_features.ndjson ./data/genz2013_features.ndjson
aws s3 cp $BASE_URL/tiger2007fe_features.ndjson ./data/tiger2007fe_features.ndjson
aws s3 cp $BASE_URL/tiger2008_features.ndjson ./data/tiger2008_features.ndjson
aws s3 cp $BASE_URL/tiger2009_features.ndjson ./data/tiger2009_features.ndjson
aws s3 cp $BASE_URL/tiger2010blkpophu_features.ndjson ./data/tiger2010blkpophu_features.ndjson
aws s3 cp $BASE_URL/tigerrd13_st_features.ndjson ./data/tigerrd13_st_features.ndjson

echo "running pypgstac commands"

# load collection
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load collections ./data/collections.ndjson

# load items
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/genz2010_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/genz2012_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/genz2013_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/tiger2007fe_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/tiger2008_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/tiger2009_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/tiger2010blkpophu_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items ./data/tigerrd13_st_features.ndjson

echo "finished"

sudo shutdown now
