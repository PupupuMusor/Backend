using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Pupupu.Domains.Entities;

public class Achievement
{
    public Guid Id { get; set; }
    public string Name { get; set; } = String.Empty;
    public string Description { get; set; } = String.Empty;
    public int PointsReward { get; set; }
    public string? IconPath { get; set; }
    public ICollection<UsersAchievements> UserAchievements { get; set; } = new List<UsersAchievements>();
}
