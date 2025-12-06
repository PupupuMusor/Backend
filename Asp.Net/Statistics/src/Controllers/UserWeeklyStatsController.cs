using Microsoft.AspNetCore.Mvc;
using Pupupu.DTOs.Requests;
using Pupupu.DTOs.Responses;
using Pupupu.Services.Interfaces;

namespace Pupupu.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserWeeklyStatsController : ControllerBase
{
    private readonly IUserWeeklyStatsService _userWeeklyStatsService;

    public UserWeeklyStatsController(IUserWeeklyStatsService userWeeklyStatsService)
    {
        _userWeeklyStatsService = userWeeklyStatsService;
    }

    [HttpGet]
    public async Task<ActionResult<List<UserWeeklyStatsResponse>>> GetAllAsync(int skip, int take, CancellationToken ct)
    {
        var result = await _userWeeklyStatsService.GetAllAsync(skip, take, ct);
        var response = result.Select(x => new UserWeeklyStatsResponse(x.UserId, x.Points, x.WeekStartDate)).ToList();
        return Ok(response);
    }

    [HttpGet("first")]
    public async Task<ActionResult<UserWeeklyStatsResponse>> GetFirstAsync(CancellationToken ct)
    {
        var result = await _userWeeklyStatsService.GetFirstAsync(ct);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(new UserWeeklyStatsResponse(result.UserId, result.Points, result.WeekStartDate));
    }
}
