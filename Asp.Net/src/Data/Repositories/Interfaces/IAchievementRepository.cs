using Pupupu.Domains.Entities;
using Pupupu.DTOs.Requests;

namespace Pupupu.Data.Repositories.Interfaces;

public interface IAchievementRepository
{
    Task<List<Achievement>> GetAllAsync(CancellationToken ct);
    Task<Achievement?> GetAchievementByIdAsync(Guid id, CancellationToken ct);
    Task<Achievement> CreateAchievementAsync(Achievement achievement, CancellationToken ct);
    Task<Achievement?> UpdateAchievementAsync(Guid id, Achievement achievement, CancellationToken ct);
    Task<bool> DeleteAchievementAsync(Guid id, CancellationToken ct);

}