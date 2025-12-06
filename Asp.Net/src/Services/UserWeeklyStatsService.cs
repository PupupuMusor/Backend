using Pupupu.DTOs.Requests;
using Pupupu.DTOs.Responses;
using Pupupu.Domains.Entities;
using Pupupu.Data.Repositories.Interfaces;

namespace Pupupu.Services.Interfaces;

public class UserWeeklyStatsService : IUserWeeklyStatsService
{
    private readonly IUserWeeklyStatsRepository _repository;

    public UserWeeklyStatsService(IUserWeeklyStatsRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<UserWeeklyStats>> GetAllAsync(int skip, int take, CancellationToken ct)
    {
        if (take <= 0 || skip < 0)
        {
            throw new ArgumentException("Invalid pagination parameters");
        }

        return await _repository.GetAllAsync(take, skip, ct);
    }

    public async Task<UserWeeklyStats> GetFirstAsync(CancellationToken ct)
    {
        return await _repository.GetFirstAsync(ct);
    }
}
