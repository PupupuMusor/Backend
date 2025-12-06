using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Pupupu.Domains.Entities;

public class AchievementConfiguration : IEntityTypeConfiguration<Achievement>
{
    public void Configure(EntityTypeBuilder<Achievement> builder)
    {
        builder.ToTable("Achievements");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id)
            .ValueGeneratedNever();

        builder.Property(a => a.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.Description)
            .HasMaxLength(2000)
            .IsRequired(false);

        builder.Property(a => a.PointsReward)
            .HasDefaultValue(0);

        builder.Property(a => a.IconPath)
            .IsRequired(false)
            .HasMaxLength(1000);

        builder.HasIndex(a => a.Name)
            .IsUnique(false);
    }
}