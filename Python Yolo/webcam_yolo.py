from ultralytics import YOLO
import cv2
import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', type=str, default='best.pt', help='Path to trained model')
    parser.add_argument('--conf', type=float, default=0.5, help='Confidence threshold')
    args = parser.parse_args()

    try:
        model = YOLO(args.model)
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    print("Starting webcam... Press 'q' to quit.")
    
    model.predict(source=0, show=True, conf=args.conf)

if __name__ == '__main__':
    main()
