namespace PupupuAi.DTOs;

public class PredictionResponse
{
    public List<ObjectDetectionResult> Predictions { get; set; } = new();
    public long InferenceTimeMs { get; set; }
}

public class ObjectDetectionResult
{
    public string Label { get; set; } = string.Empty;
    public float Confidence { get; set; }
    public BoundingBox Box { get; set; } = new();
}

public class BoundingBox
{
    public float X { get; set; }
    public float Y { get; set; }
    public float Width { get; set; }
    public float Height { get; set; }
}
