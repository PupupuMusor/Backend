namespace Pupupu.DTOs.Responses;

public record AchievementResponse(Guid Id, string Name, string Description, int PointsReward, string? IconPath);
public record UserAchievementResponse(Guid UserId, Guid AchievementId, AchievementResponse? Achievement);
public record UserWeeklyStatsResponse(Guid UserId, int Points, DateTime WeekStartDate);