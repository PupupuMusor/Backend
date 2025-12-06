using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.EntityFrameworkCore;
using Pupupu.Data;
using Pupupu.Data.Repositories;
using Pupupu.Data.Repositories.Interfaces;
using Pupupu.Jobs;
using Pupupu.Services;
using Pupupu.Services.Interfaces;

namespace Pupupu;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddHttpClient();

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;

        builder.Services.AddDbContext<StatisticsDbContext>(options =>
            options.UseNpgsql(connectionString));

        builder.Services.AddHangfire(configuration => configuration
            .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
            .UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings()
            .UsePostgreSqlStorage(options => options.UseNpgsqlConnection(connectionString)));

        builder.Services.AddHangfireServer();

        builder.Services.AddScoped<IAchievementRepository, AchievementRepository>();
        builder.Services.AddScoped<IUserAchievementRepository, UserAchievementRepository>();
        builder.Services.AddScoped<IUserWeeklyStatsRepository, UserWeeklyStatsRepository>();

        builder.Services.AddScoped<IAchievementsService, AchievementService>();
        builder.Services.AddScoped<IUserAchievementService, UserAchievementService>();
        builder.Services.AddScoped<IUserWeeklyStatsService, UserWeeklyStatsService>();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.UseHangfireDashboard();

        RecurringJob.AddOrUpdate<WeeklyLeaderboardJob>(
            "weekly-leaderboard-reset",
            job => job.ProcessWeeklyLeaderboardAsync(CancellationToken.None),
            Cron.Weekly(DayOfWeek.Sunday, 23, 59));

        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<StatisticsDbContext>();
            await dbContext.Database.MigrateAsync();
        }

        await app.RunAsync();
    }
}