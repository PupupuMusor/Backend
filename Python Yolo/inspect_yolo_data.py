import cv2
import os
import glob
import yaml
import random

def main():
    with open('yolo_dataset/data.yaml', 'r') as f:
        data_config = yaml.safe_load(f)
    
    class_names = data_config['names']
    
    img_dir = os.path.join('yolo_dataset', 'images', 'train')
    label_dir = os.path.join('yolo_dataset', 'labels', 'train')
    
    img_files = glob.glob(os.path.join(img_dir, '*.jpg'))
    random.shuffle(img_files)
    
    print(f"Found {len(img_files)} images. Showing 10 random samples...")
    print("Press any key to next image, 'q' to quit.")

    for img_path in img_files[:10]:
        img = cv2.imread(img_path)
        h, w, _ = img.shape
        
        basename = os.path.basename(img_path)
        label_name = os.path.splitext(basename)[0] + '.txt'
        label_path = os.path.join(label_dir, label_name)
        
        if os.path.exists(label_path):
            with open(label_path, 'r') as f:
                lines = f.readlines()
                
            for line in lines:
                parts = line.strip().split()
                cls_id = int(parts[0])
                cx, cy, bw, bh = map(float, parts[1:])
                
                x_center = cx * w
                y_center = cy * h
                box_w = bw * w
                box_h = bh * h
                
                x1 = int(x_center - box_w / 2)
                y1 = int(y_center - box_h / 2)
                x2 = int(x_center + box_w / 2)
                y2 = int(y_center + box_h / 2)
                
                color = (0, 255, 0)
                cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
                
                label = class_names[cls_id]
                cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)
        
        display_h = 800
        if h > display_h:
            scale = display_h / h
            img = cv2.resize(img, (int(w * scale), int(display_h)))
            
        cv2.imshow('YOLO Data Inspection', img)
        key = cv2.waitKey(0)
        if key == ord('q'):
            break
            
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
