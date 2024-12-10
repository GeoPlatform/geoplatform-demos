
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

### NOTE on spec.json properties
- `"ImageId": "ami-01e3c4a339a264cc9"`
    - ami-01e3c4a339a264cc9 is associated with Amazon Web Services and represents a preconfigured virtual machine template for EC2 instances.
- `"SecurityGroupIds": [ "sg-020afe4425192b9f3" ],`
    - this is TileserviceLambdaSecurityGroup
    - https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#SecurityGroup:groupId=sg-020afe4425192b9f3
- `"SubnetId": "subnet-07e68cb57322f7b1f",`
    - use gp-sit-vpc-private-subnet-one
    - https://us-east-1.console.aws.amazon.com/vpcconsole/home?region=us-east-1#SubnetDetails:subnetId=subnet-00dfe6e813f82bc33



