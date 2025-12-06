using Microsoft.AspNetCore.Identity;

namespace Pupupu.Domains.Entities;

public class UsersAchievements
{
    public Guid UserId { get; set; }
    public Guid AchievementId { get; set; }
    public Achievement Achievement { get; set; } = null!;
}
