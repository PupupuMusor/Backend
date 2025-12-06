using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using PupupuAi.DTOs;
using PupupuAi.Services.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using System.Diagnostics;

namespace PupupuAi.Services;

public class YoloService : IYoloService
{
    private readonly InferenceSession _session;
    private readonly string[] _labels;

    private const int ImageSize = 640;

    public YoloService(IConfiguration configuration, IWebHostEnvironment env)
    {
        var modelPath = Path.Combine(env.ContentRootPath, "best.onnx");
        if (!File.Exists(modelPath))
        {
            throw new FileNotFoundException($"Model file not found at {modelPath}. Please export yolo export model=best.pt format=onnx");
        }

        _session = new InferenceSession(modelPath);
        _labels = configuration.GetSection("Model:Labels").Get<string[]>() ?? new[] { "Glass", "Metal", "Organic", "Other", "Paper", "Plastic" };
    }

    public async Task<PredictionResponse> DetectObjectsAsync(Stream imageStream)
    {
        var stopwatch = Stopwatch.StartNew();

        using var image = await Image.LoadAsync<Rgb24>(imageStream);

        int originalWidth = image.Width;
        int originalHeight = image.Height;

        image.Mutate(x => x.Resize(new ResizeOptions
        {
            Size = new Size(ImageSize, ImageSize),
            Mode = ResizeMode.Pad,
            PadColor = Color.FromRgb(114, 114, 114)
        }));

        var input = new DenseTensor<float>(new[] { 1, 3, ImageSize, ImageSize });

        image.ProcessPixelRows(accessor =>
        {
            for (int y = 0; y < accessor.Height; y++)
            {
                var pixelRow = accessor.GetRowSpan(y);
                for (int x = 0; x < accessor.Width; x++)
                {
                    var pixel = pixelRow[x];
                    input[0, 0, y, x] = pixel.R / 255f;
                    input[0, 1, y, x] = pixel.G / 255f;
                    input[0, 2, y, x] = pixel.B / 255f;
                }
            }
        });

        var inputs = new List<NamedOnnxValue>
        {
            NamedOnnxValue.CreateFromTensor("images", input)
        };

        using var results = _session.Run(inputs);
        var output = results.First().AsTensor<float>();

        var predictions = ParseOutputV8(output, originalWidth, originalHeight);

        var finalPredictions = NonMaxSuppression(predictions, 0.45f);

        stopwatch.Stop();

        return new PredictionResponse
        {
            Predictions = finalPredictions,
            InferenceTimeMs = stopwatch.ElapsedMilliseconds
        };
    }

    private List<ObjectDetectionResult> ParseOutputV8(Tensor<float> output, int originalW, int originalH)
    {
        var result = new List<ObjectDetectionResult>();

        int dim1 = output.Dimensions[1];
        int dim2 = output.Dimensions[2];

        int channels, anchors;
        bool isTransposed = false;

        if (dim1 > dim2)
        {
            anchors = dim1;
            channels = dim2;
            isTransposed = true;
        }
        else
        {
            anchors = dim2;
            channels = dim1;
            isTransposed = false;
        }

        int classesCount = channels - 4;

        for (int i = 0; i < anchors; i++)
        {
            float maxScore = 0;
            int maxClassId = -1;

            for (int c = 0; c < classesCount; c++)
            {
                float score = isTransposed
                    ? output[0, i, 4 + c]
                    : output[0, 4 + c, i];

                if (score > maxScore)
                {
                    maxScore = score;
                    maxClassId = c;
                }
            }

            if (maxScore < 0.45f) continue;

            float x, y, w, h;
            if (isTransposed)
            {
                x = output[0, i, 0];
                y = output[0, i, 1];
                w = output[0, i, 2];
                h = output[0, i, 3];
            }
            else
            {
                x = output[0, 0, i];
                y = output[0, 1, i];
                w = output[0, 2, i];
                h = output[0, 3, i];
            }

            float xMin = x - (w / 2);
            float yMin = y - (h / 2);

            float scale = Math.Max((float)originalW / ImageSize, (float)originalH / ImageSize);

            float padX = (ImageSize - originalW / scale) / 2;
            float padY = (ImageSize - originalH / scale) / 2;

            float xOriginal = (xMin - padX) * scale;
            float yOriginal = (yMin - padY) * scale;
            float wOriginal = w * scale;
            float hOriginal = h * scale;

            xOriginal = Math.Max(0, xOriginal);
            yOriginal = Math.Max(0, yOriginal);

            result.Add(new ObjectDetectionResult
            {
                Label = _labels.Length > maxClassId ? _labels[maxClassId] : $"Class {maxClassId}",
                Confidence = maxScore,
                Box = new BoundingBox
                {
                    X = xOriginal,
                    Y = yOriginal,
                    Width = wOriginal,
                    Height = hOriginal
                }
            });
        }

        return result;
    }

    private List<ObjectDetectionResult> NonMaxSuppression(List<ObjectDetectionResult> boxes, float iouThreshold)
    {
        var result = new List<ObjectDetectionResult>();
        var sortedBoxes = boxes.OrderByDescending(b => b.Confidence).ToList();

        while (sortedBoxes.Count > 0)
        {
            var current = sortedBoxes[0];
            result.Add(current);
            sortedBoxes.RemoveAt(0);

            for (int i = sortedBoxes.Count - 1; i >= 0; i--)
            {
                if (CalculateIoU(current.Box, sortedBoxes[i].Box) > iouThreshold)
                {
                    sortedBoxes.RemoveAt(i);
                }
            }
        }
        return result;
    }

    private float CalculateIoU(BoundingBox b1, BoundingBox b2)
    {
        float x1 = Math.Max(b1.X, b2.X);
        float y1 = Math.Max(b1.Y, b2.Y);
        float x2 = Math.Min(b1.X + b1.Width, b2.X + b2.Width);
        float y2 = Math.Min(b1.Y + b1.Height, b2.Y + b2.Height);

        if (x2 < x1 || y2 < y1) return 0;

        float intersection = (x2 - x1) * (y2 - y1);
        float area1 = b1.Width * b1.Height;
        float area2 = b2.Width * b2.Height;

        return intersection / (area1 + area2 - intersection);
    }
}