using Microsoft.AspNetCore.Mvc;
using Pupupu.DTOs.Requests;
using Pupupu.DTOs.Responses;
using Pupupu.Services.Interfaces;

namespace Pupupu.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AchievementsController : ControllerBase
{
    private readonly IAchievementsService _achievementsService;
    private readonly IUserAchievementService _userAchievementsService;

    public AchievementsController(IAchievementsService achievementsService, IUserAchievementService userAchievementsService)
    {
        _achievementsService = achievementsService;
        _userAchievementsService = userAchievementsService;
    }

    [HttpGet]
    public async Task<ActionResult<List<AchievementResponse>>> GetAll(CancellationToken ct)
    {
        var result = await _achievementsService.GetAllAchievementsAsync(ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AchievementResponse>> GetById(Guid id, CancellationToken ct)
    {
        var result = await _achievementsService.GetAchievementByIdAsync(id, ct);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<AchievementResponse>> Create([FromBody] CreateAchievementRequest request, CancellationToken ct)
    {
        var result = await _achievementsService.CreateAchievementAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<AchievementResponse>> Update(Guid id, [FromBody] UpdateAchievementRequest request, CancellationToken ct)
    {
        var result = await _achievementsService.UpdateAchievementAsync(id, request, ct);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken ct)
    {
        var success = await _achievementsService.DeleteAchievementAsync(id, ct);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpPost("assign")]
    public async Task<ActionResult<UserAchievementResponse>> AssignToUser([FromBody] AssignAchievementRequest request, CancellationToken ct)
    {
        var result = await _userAchievementsService.AssignAchievementToUserAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<List<AchievementResponse>>> GetUserAchievements(Guid userId, CancellationToken ct)
    {
        var result = await _userAchievementsService.GetUserAchievementsAsync(userId, ct);
        return Ok(result);
    }

    [HttpDelete("user/{userId:guid}/{achievementId:guid}")]
    public async Task<ActionResult> RemoveFromUser(Guid userId, Guid achievementId, CancellationToken ct)
    {
        var success = await _userAchievementsService.RemoveAchievementFromUserAsync(userId, achievementId, ct);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
}
