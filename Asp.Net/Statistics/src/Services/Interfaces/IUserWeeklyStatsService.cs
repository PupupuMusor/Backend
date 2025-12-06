using Pupupu.DTOs.Requests;
using Pupupu.DTOs.Responses;
using Pupupu.Domains.Entities;

namespace Pupupu.Services.Interfaces;

public interface IUserWeeklyStatsService
{
    Task<List<UserWeeklyStats>> GetAllAsync(int skip, int take, CancellationToken ct);
    Task<UserWeeklyStats> GetFirstAsync(CancellationToken ct);
}
