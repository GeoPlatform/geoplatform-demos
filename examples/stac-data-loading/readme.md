
# Bulk Loading STAC Collections and Items
The below steps show how to load collections and items into a pgstac enabled database using a EC2 spot instance. 

### 1. encode the user data script
`openssl base64 -A -in userdata.sh -out userdata.txt`

### 2. request the spot instance
`aws ec2 request-spot-instances --spot-price "0.8" --instance-count 1 --type "one-time" --launch-specification file://spec.json --profile sit`

### 3. log into the instance and tail the logs
`sudo tail -f /var/log/cloud-init-output.log`

### 4.confirm the collection and items are loaded 
https://sit-stacapi.geoplatform.info/collections