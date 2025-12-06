using Pupupu.Domains.Entities;
using Pupupu.DTOs.Requests;

namespace Pupupu.Data.Repositories.Interfaces;

public interface IUserAchievementRepository
{
    Task<List<UsersAchievements>> GetAllUserAchievementsAsync(CancellationToken ct);
    Task<List<Achievement>?> GetUserAchievementByIdAsync(Guid id, CancellationToken ct);
    Task<UsersAchievements> AddAchivementToUserAsync(Guid userId, Guid achievementId, CancellationToken ct);
    Task<bool> RemoveAchievementFromUserAsync(Guid userId, Guid achievementId, CancellationToken ct);

}