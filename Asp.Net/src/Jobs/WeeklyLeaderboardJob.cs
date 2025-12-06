using Hangfire;
using Pupupu.Data.Repositories.Interfaces;
using System.Net.Http;
using System.Text.Json;

namespace Pupupu.Jobs;

public class WeeklyLeaderboardJob
{
    private readonly IUserWeeklyStatsRepository _repository;
    private readonly IHttpClientFactory _httpClientFactory;

    public WeeklyLeaderboardJob(
        IUserWeeklyStatsRepository repository,
        IHttpClientFactory httpClientFactory)
    {
        _repository = repository;
        _httpClientFactory = httpClientFactory;
    }

    [AutomaticRetry(Attempts = 3)]
    public async Task ProcessWeeklyLeaderboardAsync(CancellationToken ct)
    {
        var winner = await _repository.GetFirstAsync(ct);

        SendCongratulatoryEmailAsync(winner.UserId, winner.Points, ct);

        await _repository.ResetAllPointsAsync(ct);
    }

    private async Task SendCongratulatoryEmailAsync(Guid userId, int points, CancellationToken ct)
    {
        var client = _httpClientFactory.CreateClient();

        // запрос
    }
}
