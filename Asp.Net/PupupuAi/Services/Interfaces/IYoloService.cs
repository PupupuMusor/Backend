using PupupuAi.DTOs;

namespace PupupuAi.Services.Interfaces;

public interface IYoloService
{
    Task<PredictionResponse> DetectObjectsAsync(Stream imageStream);
}
