using Microsoft.EntityFrameworkCore;
using Pupupu.Domains.Entities;

namespace Pupupu.Data;

public class StatisticsDbContext : DbContext
{
    public StatisticsDbContext(DbContextOptions<StatisticsDbContext> options) : base(options) { }

    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<UsersAchievements> UsersAchievements { get; set; }
    public DbSet<UserWeeklyStats> UserWeeklyStats { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasDefaultSchema("Statistics");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(StatisticsDbContext).Assembly);
    }
}