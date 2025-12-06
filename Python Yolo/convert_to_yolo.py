import json
import os
import shutil
import csv
import random
import yaml
from tqdm import tqdm

ANNOTATIONS_FILE = 'data/annotations.json'
IMAGES_DIR = 'data'
OUTPUT_DIR = 'yolo_dataset'
MAP_FILE = 'map_basic.csv'

def load_class_map(map_file):
    mapping = {}
    new_classes = set()
    with open(map_file, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) >= 2:
                mapping[row[0]] = row[1]
                new_classes.add(row[1])
    
    sorted_classes = sorted(list(new_classes))
    class_to_id = {name: i for i, name in enumerate(sorted_classes)}
    
    return mapping, class_to_id, sorted_classes

def convert_bbox(size, box):
    dw = 1. / size[0]
    dh = 1. / size[1]
    x = box[0] + box[2] / 2.0
    y = box[1] + box[3] / 2.0
    w = box[2]
    h = box[3]
    x = x * dw
    w = w * dw
    y = y * dh
    h = h * dh
    return (x, y, w, h)

def main():
    print("Loading class mapping...")
    cat_name_map, new_class_to_id, class_names = load_class_map(MAP_FILE)
    print(f"Found {len(class_names)} target classes: {class_names}")

    print("Loading annotations...")
    with open(ANNOTATIONS_FILE, 'r') as f:
        data = json.load(f)

    original_cat_id_to_name = {cat['id']: cat['name'] for cat in data['categories']}

    for split in ['train', 'val']:
        os.makedirs(os.path.join(OUTPUT_DIR, 'images', split), exist_ok=True)
        os.makedirs(os.path.join(OUTPUT_DIR, 'labels', split), exist_ok=True)

    images = data['images']
    annotations = data['annotations']
    
    img_anns = {}
    for ann in annotations:
        img_id = ann['image_id']
        if img_id not in img_anns:
            img_anns[img_id] = []
        img_anns[img_id].append(ann)

    random.seed(42)
    random.shuffle(images)
    split_idx = int(len(images) * 0.9)
    train_images = images[:split_idx]
    val_images = images[split_idx:]

    print("Converting data...")
    
    for split, split_images in [('train', train_images), ('val', val_images)]:
        for img in tqdm(split_images, desc=f"Processing {split}"):
            img_id = img['id']
            file_name = img['file_name']
            
            src_path = os.path.join(IMAGES_DIR, file_name)
            if not os.path.exists(src_path):
                continue

            flat_name = file_name.replace('/', '_').replace('\\', '_')
            dst_img_path = os.path.join(OUTPUT_DIR, 'images', split, flat_name)
            dst_label_path = os.path.join(OUTPUT_DIR, 'labels', split, flat_name.replace('.jpg', '.txt'))

            shutil.copy(src_path, dst_img_path)

            with open(dst_label_path, 'w') as out_f:
                if img_id in img_anns:
                    for ann in img_anns[img_id]:
                        original_cat_id = ann['category_id']
                        original_name = original_cat_id_to_name.get(original_cat_id)
                        
                        if original_name in cat_name_map:
                            new_class_name = cat_name_map[original_name]
                            new_class_id = new_class_to_id[new_class_name]
                            
                            bbox = convert_bbox((img['width'], img['height']), ann['bbox'])
                            
                            out_f.write(f"{new_class_id} {bbox[0]:.6f} {bbox[1]:.6f} {bbox[2]:.6f} {bbox[3]:.6f}\n")

    yaml_content = {
        'path': os.path.abspath(OUTPUT_DIR),
        'train': 'images/train',
        'val': 'images/val',
        'names': {i: name for i, name in enumerate(class_names)}
    }
    
    with open(os.path.join(OUTPUT_DIR, 'data.yaml'), 'w') as f:
        yaml.dump(yaml_content, f, sort_keys=False)

    print(f"Conversion complete! Dataset saved to {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
