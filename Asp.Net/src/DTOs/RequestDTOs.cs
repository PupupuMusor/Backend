namespace Pupupu.DTOs.Requests;

public record CreateAchievementRequest(string Name, string Description, int PointsReward, string? IconPath);
public record UpdateAchievementRequest(string Name, string Description, int PointsReward, string? IconPath);
public record AssignAchievementRequest(Guid UserId, Guid AchievementId);