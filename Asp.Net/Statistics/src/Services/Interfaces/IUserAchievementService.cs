using Pupupu.DTOs.Requests;
using Pupupu.DTOs.Responses;

namespace Pupupu.Services.Interfaces;

public interface IUserAchievementService
{
    Task<UserAchievementResponse> AssignAchievementToUserAsync(AssignAchievementRequest request, CancellationToken ct);
    Task<List<AchievementResponse>> GetUserAchievementsAsync(Guid userId, CancellationToken ct);
    Task<bool> RemoveAchievementFromUserAsync(Guid userId, Guid achievementId, CancellationToken ct);
}
