using Pupupu.Data.Repositories.Interfaces;
using Pupupu.Domains.Entities;
using Pupupu.DTOs.Requests;
using Pupupu.DTOs.Responses;
using Pupupu.Services.Interfaces;

namespace Pupupu.Services;

public class AchievementService : IAchievementsService
{
    private readonly IAchievementRepository _rep;

    public AchievementService(IAchievementRepository rep)
    {
        _rep = rep;
    }

    public async Task<List<AchievementResponse>> GetAllAchievementsAsync(CancellationToken ct)
    {
        var achievements = await _rep.GetAllAsync(ct);
        return achievements.Select(MapToResponse).ToList();
    }

    public async Task<AchievementResponse?> GetAchievementByIdAsync(Guid id, CancellationToken ct)
    {
        var achievement = await _rep.GetAchievementByIdAsync(id, ct);
        return achievement == null ? null : MapToResponse(achievement);
    }

    public async Task<AchievementResponse> CreateAchievementAsync(CreateAchievementRequest request, CancellationToken ct)
    {
        var achievement = new Achievement
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            PointsReward = request.PointsReward,
            IconPath = request.IconPath
        };

        var created = await _rep.CreateAchievementAsync(achievement, ct);
        return MapToResponse(created);
    }

    public async Task<AchievementResponse?> UpdateAchievementAsync(Guid id, UpdateAchievementRequest request, CancellationToken ct)
    {
        var existing = await _rep.GetAchievementByIdAsync(id, ct);
        if (existing == null) return null;

        existing.Name = request.Name;
        existing.Description = request.Description;
        existing.PointsReward = request.PointsReward;
        existing.IconPath = request.IconPath;

        var updated = await _rep.UpdateAchievementAsync(id, existing, ct);
        return updated == null ? null : MapToResponse(updated);
    }

    public async Task<bool> DeleteAchievementAsync(Guid id, CancellationToken ct)
    {
        return await _rep.DeleteAchievementAsync(id, ct);
    }

    private static AchievementResponse MapToResponse(Achievement achievement)
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