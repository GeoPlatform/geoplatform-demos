#!/bin/bash
sudo yum update -y
sudo yum install -y git gcc sqlite-devel.x86_64
sudo yum groupinstall -y "Development Tools"

# Install tippecanoe
cd /tmp
git clone https://github.com/mapbox/tippecanoe.git
cd tippecanoe
make -j
sudo make install

# Download Data to process
sudo mkdir /var/data
sudo chown ec2-user:ec2-user /var/data
cd /var/data
# NOTE this file will need to change based on the source that needs to be generated
aws s3 cp s3://geoplatform-cdn-temp/tippecanoe/NAD/nad_r8.geojson.gz nad_r8.json.gz

# Process data
tippecanoe -o ./tiles.mbtiles --drop-densest-as-needed --extend-zooms-if-still-dropping -zg -P -l nad ./nad_r8.json.gz

# Store the created mbtiles file back to S3. This S3 file will need to change as needed for the variations generated
aws s3 cp tiles.mbtiles s3://geoplatform-cdn-temp/tippecanoe/NAD/nad_r8.mbtiles

# expand to tile directory
tile-join --force -pk -pC -n NAD -e ./tiles tiles.mbtiles 

# rename tile extensions to mvt
sudo find ./tiles -name '*.pbf' -exec rename .pbf .mvt {} +

# sync directory to s3
aws s3 sync ./tiles s3://geoplatform-cdn-temp/tippecanoe/NAD/tiles --no-progress --only-show-errors

sudo shutdown now
