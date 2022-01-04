"""
Splits up a geodatabase feature class into several geojson files,
depending on the `file_feature_limit` size

example:
python process_gdb.py <GDB Path> <Feature Class> <File Feature Limit>

If no <File Feature Limit> is specified, it is calculated by feature_count/100
"""

import logging
import json
import os
import sys
import gzip
import time
import math
import boto3
from osgeo import ogr

arg_names = ['command', 'gdb', 'feature_class', 'feature_limit']
args = dict(zip(arg_names, sys.argv))

gdb_path = args.get('gdb')  # 'NHD_H_National_GDB.gdb'
fc_name = args.get('feature_class')  # 'NHDWaterbody'
# limit of features per output file
file_feature_limit = args.get('feature_limit')
log_file = f"{fc_name}.log"

driver = ogr.GetDriverByName('OpenFileGDB')
data_source = driver.Open(gdb_path, 0)

current_dir = os.getcwd()
temp_dir = os.path.join(current_dir, 'temp')

s3 = boto3.resource('s3')

logging.basicConfig(filename=log_file,
                    filemode='w',
                    format='%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
                    datefmt='%H:%M:%S',
                    level=logging.INFO)


def print_status(current, total):
    """
    prints the status of the script every `current` features
    """
    percent = math.floor((current / total) * 100)
    print(f"{percent}% complete ({current}/{total})")
    status = f"{percent}% complete ({current}/{total})"
    logging.info(status)


def process_chunk(collection, idx):
    """
    writes the output geojson and uploads to specified s3 path
    """
    file_name = f"{fc_name}-{idx}"

    output_geojson = f'{temp_dir}/{file_name}.geojson'
    output_gz = f'{temp_dir}/{file_name}.geojson.gz'

    with open(output_geojson, 'w') as f:
        json.dump(collection, f)

    with open(output_geojson, 'rb') as src, gzip.open(output_gz, 'wb') as dst:
        dst.writelines(src)

    # copy gzip to s3
    s3.meta.client.upload_file(output_gz, 'geoplatform-cdn-temp', f"tippecanoe/NHD/{fc_name}/{file_name}.geojson.gz")

    # cleanup
    os.remove(output_gz)
    os.remove(output_geojson)


if __name__ == "__main__":
    seg_start = time.time()
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    layer = data_source.GetLayerByName(fc_name)
    featureCount = layer.GetFeatureCount()

    if file_feature_limit is None:
        file_feature_limit = math.ceil(featureCount/100)
    else:
        file_feature_limit = int(file_feature_limit)
        
    arg_info = f'GDB: {gdb_path} | Feature Class: {fc_name} | File Feature Limit: {file_feature_limit}'
    print(arg_info)
    logging.info(arg_info)

    fc = {
        'type': 'FeatureCollection',
        'features': []
    }

    current_iteration = 0
    for feature in layer:
        try:
            json_obj = feature.ExportToJson(as_object=True)

            if json_obj['geometry']['coordinates']:
                fc['features'].append(json_obj)
                current_iteration += 1

            if current_iteration % file_feature_limit == 0:
                process_chunk(fc, current_iteration)
                print_status(current_iteration, featureCount)
                fc['features'] = []

        except Exception as e:
            logging.error(e)
            continue

    completed = f'completed in {time.time() - seg_start}'
    print(completed)
    logging.info(completed)
    s3.meta.client.upload_file(log_file, 'geoplatform-cdn-temp', f"tippecanoe/NHD/{log_file}")
