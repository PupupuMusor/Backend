import os.path
import argparse
import json
from PIL import Image
import requests
from io import BytesIO
import sys
import concurrent.futures
import threading

parser = argparse.ArgumentParser()
parser.add_argument('--dataset_path', required=False, default= './data/annotations.json')
parser.add_argument('--threads', required=False, type=int, default=20)
args = parser.parse_args()

dataset_dir = os.path.dirname(args.dataset_path)

counter = 0
counter_lock = threading.Lock()
nr_images = 0

def download_one_image(image):
    global counter
    
    file_name = image['file_name']
    url_original = image['flickr_url']
    url_resized = image['flickr_640_url']

    file_path = os.path.join(dataset_dir, file_name)

    subdir = os.path.dirname(file_path)
    if not os.path.isdir(subdir):
        try:
            os.makedirs(subdir, exist_ok=True)
        except OSError:
            pass

    if not os.path.isfile(file_path):
        try:
            response = requests.get(url_original, timeout=15)
            if response.status_code == 200:
                img = Image.open(BytesIO(response.content))
                if hasattr(img, '_getexif') and img._getexif():
                    img.save(file_path, exif=img.info["exif"])
                else:
                    img.save(file_path)
            else:
                response = requests.get(url_resized, timeout=15)
                if response.status_code == 200:
                    img = Image.open(BytesIO(response.content))
                    if hasattr(img, '_getexif') and img._getexif():
                        img.save(file_path, exif=img.info["exif"])
                    else:
                        img.save(file_path)
        except Exception:
            pass

    with counter_lock:
        counter += 1
        if counter % 50 == 0 or counter == nr_images:
            sys.stdout.write(f"\rDownloaded {counter}/{nr_images}")
            sys.stdout.flush()

with open(args.dataset_path, 'r') as f:
    annotations = json.loads(f.read())
    images = annotations['images']
    nr_images = len(images)

    print(f"Downloading {nr_images} images using {args.threads} threads...")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.threads) as executor:
        executor.map(download_one_image, images)

    print('\nFinished')
