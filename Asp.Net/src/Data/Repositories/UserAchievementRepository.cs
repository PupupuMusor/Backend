using Microsoft.EntityFrameworkCore;
using Pupupu.Data.Repositories.Interfaces;
using Pupupu.Domains.Entities;
using Pupupu.DTOs.Requests;

namespace Pupupu.Data.Repositories;

public class UserAchievementRepository : IUserAchievementRepository
{
    private StatisticsDbContext _context;

    public UserAchievementRepository(StatisticsDbContext context)
    {
        _context = context;
    }
    public async Task<List<UsersAchievements>> GetAllUserAchievementsAsync(CancellationToken ct)
    {
        return await _context.UsersAchievements.ToListAsync();
    }
    public async Task<List<Achievement>?> GetUserAchievementByIdAsync(Guid id, CancellationToken ct)
    {
        return await _context.UsersAchievements
            .Where(ua => ua.UserId == id)
            .Include(ua => ua.Achievement)
            .Select(ua => ua.Achievement)
            .ToListAsync();
    }
    public async Task<UsersAchievements> AddAchivementToUserAsync(Guid userId, Guid achievementId, CancellationToken ct)
    {
        var achivement = await _context.UsersAchievements.AddAsync(new UsersAchievements
        {
            UserId = userId,
            AchievementId = achievementId,
        });
        await _context.SaveChangesAsync();

        return achivement.Entity;
    }

    public async Task<bool> RemoveAchievementFromUserAsync(Guid userId, Guid achievementId, CancellationToken ct)
    {
        var deletedRows = await _context.UsersAchievements
            .Where(x => x.UserId == userId && x.AchievementId == achievementId)
            .ExecuteDeleteAsync(ct);

        return deletedRows > 0;
    }
}