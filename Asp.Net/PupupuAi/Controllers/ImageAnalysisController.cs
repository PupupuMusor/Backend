using Microsoft.AspNetCore.Mvc;
using PupupuAi.DTOs;
using PupupuAi.Services.Interfaces;

namespace PupupuAi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImageAnalysisController : ControllerBase
{
    private readonly IYoloService _yoloService;

    public ImageAnalysisController(IYoloService yoloService, ILogger<ImageAnalysisController> logger)
    {
        _yoloService = yoloService;
    }

    [HttpPost("analyze")]
    public async Task<ActionResult<PredictionResponse>> AnalyzeImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No image file uploaded.");
        }

        try
        {
            using var stream = file.OpenReadStream();
            var result = await _yoloService.DetectObjectsAsync(stream);
            return Ok(result);
        }
        catch (FileNotFoundException ex)
        {
            return StatusCode(500, new { error = "Model configuration error", message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error during image analysis.{ex.Message}");
        }
    }
}
