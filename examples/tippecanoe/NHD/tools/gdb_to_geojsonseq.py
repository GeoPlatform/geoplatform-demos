"""
Use multiprocessing to convert a geodatabase featureclass to a Geojson Sequence file.
More about GeojsonSeq format: https://stevage.github.io/ndgeojson/

usage:
gdb_to_geojsonseq.py <gdb path> <feature class> <out directory>

example:
python gdb_to_geojsonseq.py data/NHD.gdb NHDFlowline data/output_dir
"""

import os
import sys
import json
from multiprocessing import Pool
import time
from tqdm import tqdm
from osgeo import ogr, gdal

gdal.UseExceptions()
gdal.PushErrorHandler('CPLQuietErrorHandler')

arg_names = ['cmd', 'gdb', 'feature_class', 'out_dir']
args = dict(zip(arg_names, sys.argv))

gdb_path = os.path.normpath(args.get('gdb'))
fc_name = args.get('feature_class')
out_dir = os.path.normpath(args.get('out_dir'))
out_path = os.path.join(out_dir, f"{fc_name}.geojsonseq")

driver = ogr.GetDriverByName('OpenFileGDB')
data_source = driver.Open(gdb_path, 0)

layer = data_source.GetLayerByName(fc_name)


def get_feature_json(index):
    """
    get json by feature ID
    """
    ref_feature = layer.GetFeature(index)
    if ref_feature:
        try:
            obj = ref_feature.ExportToJson(as_object=True)
            if obj:
                # https://datatracker.ietf.org/doc/html/rfc8142#section-2
                return f"\x1e{json.dumps(obj)}\n"
        except Exception as e:
            pass
    return None

def get_fids(lyr):
    """
    return list of all feature IDs
    """
    print("Getting Features IDs..")
    feature = lyr.GetNextFeature()
    f_ids = []
    while feature:
        f_ids.append(feature.GetFID())
        feature = lyr.GetNextFeature()
    return f_ids


def multiprocess_ogr2ogr():
    # empty target file contents
    open(out_path, "w", encoding='utf-8').close()

    # initiate multiprocessing
    pool = Pool()
    ids = get_fids(layer)
    with pool as p:
        results = list(tqdm(p.imap_unordered(get_feature_json, ids, chunksize=1000), total=len(ids)))

    print('writing results to file...')
    with open(out_path, 'a', encoding='utf-8') as file:
        for obj in results:
            if obj:
                file.write(obj)


if __name__ == '__main__':
    seg_start = time.time()
    print(out_dir)
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)
    multiprocess_ogr2ogr()
    print(f'completed in {time.time() - seg_start} seconds')
