using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Pupupu.Domains.Entities;

public class UsersAchievementsConfiguration : IEntityTypeConfiguration<UsersAchievements>
{
    public void Configure(EntityTypeBuilder<UsersAchievements> builder)
    {
        builder.ToTable("UserAchievements");

        builder.HasKey(ua => new { ua.UserId, ua.AchievementId });

        builder.HasOne(ua => ua.Achievement)
            .WithMany()
            .HasForeignKey(ua => ua.AchievementId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}