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
aws s3 cp s3://geoplatform-cdn-temp/tippecanoe/nad/nad_r8.geojson.gz nad_r8.json.gz

# Process data
tippecanoe -o ./tiles.mbtiles --drop-densest-as-needed --coalesce-densest-as-needed -Z1 -z7 -P -l nad ./nad_r8.json.gz

# Store the created mbtiles file back to S3. This S3 file will need to change as needed for the variations generated
aws s3 cp tiles.mbtiles s3://geoplatform-cdn-temp/tippecanoe/nad/nad_r8_01.mbtiles
sudo shutdown now
