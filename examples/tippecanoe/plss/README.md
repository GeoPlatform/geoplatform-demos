# Introduction

In order to create MVT tiles via TippeCanoe https://github.com/mapbox/tippecanoe it requires a GeoJSON file, high compute and memory servers, and the ability to create multiple variations of the tiles to determine which is best for the zoom ranges of 1-10. These steps make use of EC2 Spot intances to process the data. For demonstration the PLSS dataset will be used to walk through the process.

## Encoding User Data

When wanting to change the User Data for different sources and steps it needs to be saved in base64. Generating base64 can be done from online websites or can be done locally using OpenSSL command. For Mac machines this should be available from the terminal. For Window users this does not come preloaded but is included with Git. Below is an example of how to reference a source file. The output will be printed in the terminal and can be copy pasted into the specificaion.json document. Make sure to remove any spaces and line feeds.

```bash
# Mac Example
> openssl base64 -in /data/fgdc/userdata01.txt

# Windows example
"C:\Program Files\Git\usr\bin\openssl.exe" base64 -in D:\Data\fgdc\nad_r6\userdata01.txt
```

## Creating GeoJSON from the source

In order for TippeCanoe to work it requires the source file to be in a GeoJSON or .gz compressed version. Here you will find an example of how you can use EC2 to perform those actions leveraging Docker, ogr2ogr, gzip and S3 to store the output. When ogr2ogr runs it only uses one CPU and very little memory so the ideal machine at this time is the `c5.large` which is 2 vCPU and 4GB of memory which should be sufficient for most conversions. If you encounter `instance-terminated-no-capacity` errors running a spot instance, use [Instance Advisor](https://aws.amazon.com/ec2/spot/instance-advisor/) to select an Instance Type with a low Frequency of Interuption. 

**Specification Document**

Specification Documents were broken up to target individual layers due to the 16kb limit of the `UserData` string. 

The specification documents for this step are located in the `User Data` directory with the naming convention *layer_{layer name}_spec.json*. For Example, *layer_first_division_spec.json*. There are 5 layers total to process here. 


**User Data**

As stated above, to avoid the 16kb limit in the `UserData` string these scripts were broken apart to target individual layers and are located in the `User Data` directory with the naming convention *layer_{layer name}_spec.sh*. For Example, *layer_first_division.sh* 


> Note: that the size of the EBS storage will depend on the size of the source files. Good rule is to use a x25 multiplier from your source file. So if your source if 5GB create a drive that is 5 * 25 = 125 GB. Also note that `SIGNIFICANT_FIGURES=6` is included to round to 6 decimal places. This may not always be apporaite for polyline and polygon geometry.

To run the task it will utilize a EC2 Spot instance and execute based on the specificication document created. The `--spot-price` will need to be adjusted if the server is adjusted.

```bash
aws ec2 request-spot-instances --spot-price "0.1" --instance-count 1 --type "one-time" --launch-specification file://layer_<layer name>_spec.json --profile sit
```


## Create the MBTiles and XYZ directory

For each specification.json document created will have an associated userdata as well. These are the commands that the EC2 server will execute on bootup. It is important to have the final `sudo shutdown now` command followed by a new line to ensure that the server is terminated at the end of the process otherwise unwanted charges could occur if not properly shutdown.

*UserData/mbtiles.sh* is a sample of working commands that will install tippecanoe, copy the geojson files to process and when finished upload the generated output to S3 for each layer. It also compiles all layers into one mbtile file and an xyz directory structure then finally shut itself down. 


> Note: Depending on if multiple tippe runs need to be done in parallel or on the same machine the User Data could run many tippecanoe commands on the same computer one after another. One benefit is that it does not need to download the file each time (which may be a cost to provider) so if the source if big and not within GeoPlatform S3 this could reduce some bandwidth charges in exchange for a longer runtime of a single instance. Just make sure to upload your mbtile then remove locally before starting the next variation otherwise the drive will quickly run out of space.

## Create the Specification Document

A working example of this document is in *UserData/mbtiles_spec.json*

## Generate MBTiles

To run the task it will utilize a EC2 Spot instance and execute based on the specificication document created. The `--spot-price` will need to be adjusted if the server is adjusted.

```bash
aws ec2 request-spot-instances --spot-price "0.4" --instance-count 1 --type "one-time" --launch-specification file://mbtiles_spec.json --profile sit
```

## Previewing Output

Once the .mbtiles file(s) have been generated and stored on S3 those files are normally a few GB. To explore theme locally follow these steps.

**Step 1**

Download the S3 file using something similar to this.

```bash
cd /my_data_folder
aws s3 cp s3://geoplatform-cdn-temp/tippecanoe/plss_national.mbtiles tiles.mbtiles
```

**Step 2**

Startup tileserver-gl which is a simple tileserver for MBTiles

```bash
cd /my_data_folder
docker run --rm -it -v ${PWD}:/data -p 8080:80 klokantech/tileserver-gl --mbtiles /data/tiles.mbtiles
```

> Note: if you are using windows \${PWD} works in Powershell terminals. If using Mac/Unix you can change `${PWD}` to `$(pwd)`

**Step 3**

Go to `http://localhost:8080` to explore the tiles.

# References

- [Navigator Public Lands](https://navigator.blm.gov/home)
- [FGDC Cadastral Subcommittee Outreach Web Site Faciliating standardized](https://nationalcad.org/)
- [Data Sources - pdf](https://nationalcad.org/download/PLSS-CadNSDI-Data-Set-Availability.pdf)
- [TippeCanoe User Guide](https://github.com/mapbox/tippecanoe)
- [Ogr2Ogr User Guide](https://gdal.org/programs/ogr2ogr.html)
- [Current Spot Pricing](https://aws.amazon.com/ec2/spot/pricing/)
- [How to view Spot history](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances-history.html)
- [TileServerGL User Guide](https://github.com/maptiler/tileserver-gl)

