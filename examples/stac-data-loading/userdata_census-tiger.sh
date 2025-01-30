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
STAC_URL=s3://gp-sit-us-east-1-public-configs/stac
BASE_URL=$STAC_URL/census/collections
echo "DSN_CONNECTION: $DSN_CONNECTION"
echo "BASE_URL: $BASE_URL"

# install dependency - version needs to match the database's pgstac version. 
python3.8 -m pip install "pypgstac==0.8.*"
python3.8 -m pip install "pypgstac[psycopg]==0.8.*"

# copy from s3
cd /tmp
mkdir data
aws s3 cp $STAC_URL/collection_geoplatform.ndjson ./data/collection_geoplatform.ndjson
aws s3 cp $BASE_URL/collections.ndjson ./data/collections.ndjson
aws s3 cp $BASE_URL/addr_features.ndjson ./data/addr_features.ndjson
aws s3 cp $BASE_URL/addrfeat_features.ndjson ./data/addrfeat_features.ndjson
aws s3 cp $BASE_URL/addrfn_features.ndjson ./data/addrfn_features.ndjson
aws s3 cp $BASE_URL/aiannh_features.ndjson ./data/aiannh_features.ndjson
aws s3 cp $BASE_URL/aitsn_features.ndjson ./data/aitsn_features.ndjson
aws s3 cp $BASE_URL/anrc_features.ndjson ./data/anrc_features.ndjson
aws s3 cp $BASE_URL/arealm_features.ndjson ./data/arealm_features.ndjson
aws s3 cp $BASE_URL/areawater_features.ndjson ./data/areawater_features.ndjson
aws s3 cp $BASE_URL/bg_features.ndjson ./data/bg_features.ndjson
aws s3 cp $BASE_URL/cbsa_features.ndjson ./data/cbsa_features.ndjson
aws s3 cp $BASE_URL/cd118_features.ndjson ./data/cd118_features.ndjson
aws s3 cp $BASE_URL/cnecta_features.ndjson ./data/cnecta_features.ndjson
aws s3 cp $BASE_URL/coastline_features.ndjson ./data/coastline_features.ndjson
aws s3 cp $BASE_URL/concity_features.ndjson ./data/concity_features.ndjson
aws s3 cp $BASE_URL/county_features.ndjson ./data/county_features.ndjson
aws s3 cp $BASE_URL/cousub_features.ndjson ./data/cousub_features.ndjson
aws s3 cp $BASE_URL/csa_features.ndjson ./data/csa_features.ndjson
aws s3 cp $BASE_URL/edges_features.ndjson ./data/edges_features.ndjson
aws s3 cp $BASE_URL/elsd_features.ndjson ./data/elsd_features.ndjson
aws s3 cp $BASE_URL/estate_features.ndjson ./data/estate_features.ndjson
aws s3 cp $BASE_URL/faces_features.ndjson ./data/faces_features.ndjson
aws s3 cp $BASE_URL/facesah_features.ndjson ./data/facesah_features.ndjson
aws s3 cp $BASE_URL/facesal_features.ndjson ./data/facesal_features.ndjson
aws s3 cp $BASE_URL/facesmil_features.ndjson ./data/facesmil_features.ndjson
aws s3 cp $BASE_URL/featnames_features.ndjson ./data/featnames_features.ndjson
aws s3 cp $BASE_URL/linearwater_features.ndjson ./data/linearwater_features.ndjson
aws s3 cp $BASE_URL/metdiv_features.ndjson ./data/metdiv_features.ndjson
aws s3 cp $BASE_URL/mil_features.ndjson ./data/mil_features.ndjson
aws s3 cp $BASE_URL/necta_features.ndjson ./data/necta_features.ndjson
aws s3 cp $BASE_URL/nectadiv_features.ndjson ./data/nectadiv_features.ndjson
aws s3 cp $BASE_URL/place_features.ndjson ./data/place_features.ndjson
aws s3 cp $BASE_URL/pointlm_features.ndjson ./data/pointlm_features.ndjson
aws s3 cp $BASE_URL/primaryroads_features.ndjson ./data/primaryroads_features.ndjson
aws s3 cp $BASE_URL/prisecroads_features.ndjson ./data/prisecroads_features.ndjson
aws s3 cp $BASE_URL/puma20_features.ndjson ./data/puma20_features.ndjson
aws s3 cp $BASE_URL/rails_features.ndjson ./data/rails_features.ndjson
aws s3 cp $BASE_URL/roads_features.ndjson ./data/roads_features.ndjson
aws s3 cp $BASE_URL/scsd_features.ndjson ./data/scsd_features.ndjson
aws s3 cp $BASE_URL/sdadm_features.ndjson ./data/sdadm_features.ndjson
aws s3 cp $BASE_URL/sldl_features.ndjson ./data/sldl_features.ndjson
aws s3 cp $BASE_URL/sldu_features.ndjson ./data/sldu_features.ndjson
aws s3 cp $BASE_URL/state_features.ndjson ./data/state_features.ndjson
aws s3 cp $BASE_URL/subbarrio_features.ndjson ./data/subbarrio_features.ndjson
aws s3 cp $BASE_URL/tabblock20_features.ndjson ./data/tabblock20_features.ndjson
aws s3 cp $BASE_URL/tbg_features.ndjson ./data/tbg_features.ndjson
aws s3 cp $BASE_URL/tract_features.ndjson ./data/tract_features.ndjson
aws s3 cp $BASE_URL/ttract_features.ndjson ./data/ttract_features.ndjson
aws s3 cp $BASE_URL/uac20_features.ndjson ./data/uac20_features.ndjson
aws s3 cp $BASE_URL/uga20_features.ndjson ./data/uga20_features.ndjson
aws s3 cp $BASE_URL/unsd_features.ndjson ./data/unsd_features.ndjson
aws s3 cp $BASE_URL/vtd20_features.ndjson ./data/vtd20_features.ndjson
aws s3 cp $BASE_URL/zcta520_features.ndjson ./data/zcta520_features.ndjson

# comment out this line if migrating or populating pgstac schema for first time
# echo "running migration command"
# python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION migrate

echo "running geoplatform commands"

python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load collections --method upsert ./data/collection_geoplatform.ndjson

echo "running collections commands"

# load collection
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load collections --method upsert ./data/collections.ndjson
echo "running items commands"
# load items
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/addr_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/addrfeat_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/addrfn_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/aiannh_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/aitsn_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/anrc_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/arealm_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/areawater_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/bg_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/cbsa_features.ndjson
# python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/cd118_features.ndjson
# python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/cnecta_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/coastline_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/concity_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/county_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/cousub_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/csa_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/edges_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/elsd_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/estate_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/faces_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/facesah_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/facesal_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/facesmil_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/featnames_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/linearwater_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/metdiv_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/mil_features.ndjson
# python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/necta_features.ndjson
# python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/nectadiv_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/place_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/pointlm_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/primaryroads_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/prisecroads_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/puma20_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/rails_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/roads_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/scsd_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/sdadm_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/sldl_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/sldu_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/state_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/subbarrio_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/tabblock20_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/tbg_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/tract_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/ttract_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/uac20_features.ndjson
# python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/uga20_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/unsd_features.ndjson
# python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/vtd20_features.ndjson
python3 -m pypgstac.pypgstac --dsn $DSN_CONNECTION load items --method upsert ./data/zcta520_features.ndjson


echo "finished"

sudo shutdown now
