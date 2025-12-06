using Pupupu.Data.Repositories.Interfaces;
using Pupupu.Domains.Entities;
using Pupupu.DTOs.Requests;
using Pupupu.DTOs.Responses;
using Pupupu.Services.Interfaces;

namespace Pupupu.Services;

public class UserAchievementService : IUserAchievementService
{
    private readonly IUserAchievementRepository _rep;
    private readonly IAchievementRepository _achievementRep;

    public UserAchievementService(IUserAchievementRepository rep, IAchievementRepository achievementRep)
    {
        _rep = rep;
        _achievementRep = achievementRep;
    }

    public async Task<UserAchievementResponse> AssignAchievementToUserAsync(AssignAchievementRequest request, CancellationToken ct)
    {
        var userAchievement = await _rep.AddAchivementToUserAsync(request.UserId, request.AchievementId, ct);

        AchievementResponse? achievementResponse = null;
        if (userAchievement.Achievement != null)
        {
            achievementResponse = MapToAchievementResponse(userAchievement.Achievement);
        }
        else
        {
            // Try to fetch it if not loaded
            var achievement = await _achievementRep.GetAchievementByIdAsync(request.AchievementId, ct);
            if (achievement != null)
                achievementResponse = MapToAchievementResponse(achievement);
        }

        return new UserAchievementResponse(userAchievement.UserId, userAchievement.AchievementId, achievementResponse);
    }

    public async Task<List<AchievementResponse>> GetUserAchievementsAsync(Guid userId, CancellationToken ct)
    {
        var achievements = await _rep.GetUserAchievementByIdAsync(userId, ct);

        if (achievements == null)
            return new List<AchievementResponse>();

        return achievements.Select(MapToAchievementResponse).ToList();
    }

    public async Task<bool> RemoveAchievementFromUserAsync(Guid userId, Guid achievementId, CancellationToken ct)
    {
        return await _rep.RemoveAchievementFromUserAsync(userId, achievementId, ct);
    }

    private static AchievementResponse MapToAchievementResponse(Achievement achievement)
    {
        return new AchievementResponse(
            achievement.Id,
            achievement.Name,
            achievement.Description,
            achievement.PointsReward,
            achievement.IconPath
        );
    }
}
