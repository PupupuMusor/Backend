using Pupupu.Domains.Entities;
using Pupupu.DTOs.Requests;

namespace Pupupu.Data.Repositories.Interfaces;

public interface IUserWeeklyStatsRepository
{
    Task<List<UserWeeklyStats>> GetAllAsync(int take, int skip, CancellationToken ct);
    Task<UserWeeklyStats> GetFirstAsync(CancellationToken ct);
    Task ResetAllPointsAsync(CancellationToken ct);
}