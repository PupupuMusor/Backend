from ultralytics import YOLO
import os

def main():
    model = YOLO('yolov8s.pt')

    data_yaml = os.path.abspath('yolo_dataset/data.yaml')

    results = model.train(
        data=data_yaml,
        epochs=50,
        imgsz=640,
        batch=16,
        name='taco_yolov8',
        patience=10,
        device='cpu',
        workers=4
    )

    print("Training complete!")
    print(f"Best model saved at: {results.save_dir}/weights/best.pt")

if __name__ == '__main__':
    main()
