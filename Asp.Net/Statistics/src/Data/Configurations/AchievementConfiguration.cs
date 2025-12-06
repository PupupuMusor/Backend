using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Pupupu.Domains.Entities;

public class UserWeeklyStatsConfiguration : IEntityTypeConfiguration<UserWeeklyStats>
{
    public void Configure(EntityTypeBuilder<UserWeeklyStats> builder)
    {
        builder.ToTable("UserWeeklyStats");

        builder.HasKey(a => a.UserId);
        builder.Property(a => a.UserId)
            .ValueGeneratedNever();

        builder.Property(a => a.Points)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(a => a.WeekStartDate)
            .IsRequired()
            .HasDefaultValueSql("now()");
    }
}