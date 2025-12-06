using Pupupu.DTOs.Requests;
using Pupupu.DTOs.Responses;

namespace Pupupu.Services.Interfaces;

public interface IAchievementsService
{
    Task<List<AchievementResponse>> GetAllAchievementsAsync(CancellationToken ct);
    Task<AchievementResponse?> GetAchievementByIdAsync(Guid id, CancellationToken ct);
    Task<AchievementResponse> CreateAchievementAsync(CreateAchievementRequest request, CancellationToken ct);
    Task<AchievementResponse?> UpdateAchievementAsync(Guid id, UpdateAchievementRequest request, CancellationToken ct);
    Task<bool> DeleteAchievementAsync(Guid id, CancellationToken ct);
}
