using Microsoft.AspNetCore.Mvc;
using Pupupu.DTOs.Requests;
using Pupupu.DTOs.Responses;
using Pupupu.Services.Interfaces;

namespace Pupupu.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserAchievementController : ControllerBase
{
    private readonly IUserAchievementService _service;

    public UserAchievementController(IUserAchievementService service)
    {
        _service = service;
    }

    [HttpPost("assign")]
    public async Task<ActionResult<UserAchievementResponse>> AssignAchievement([FromBody] AssignAchievementRequest request, CancellationToken ct)
    {
        var result = await _service.AssignAchievementToUserAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<List<AchievementResponse>>> GetUserAchievements(Guid userId, CancellationToken ct)
    {
        var result = await _service.GetUserAchievementsAsync(userId, ct);
        return Ok(result);
    }

    [HttpDelete("{userId}/{achievementId}")]
    public async Task<ActionResult> RemoveAchievement(Guid userId, Guid achievementId, CancellationToken ct)
    {
        var result = await _service.RemoveAchievementFromUserAsync(userId, achievementId, ct);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}
