FROM osgeo/gdal:ubuntu-small-3.3.3

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.9 \
    python3-pip \
    && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* 

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install GDAL==3.3.3 boto3==1.20.26 tqdm==4.62.3

WORKDIR /code