using Microsoft.EntityFrameworkCore;
using Pupupu.Data.Repositories.Interfaces;
using Pupupu.Domains.Entities;

namespace Pupupu.Data.Repositories;

public class AchievementRepository : IAchievementRepository
{
    private StatisticsDbContext _context;

    public AchievementRepository(StatisticsDbContext context)
    {
        _context = context;
    }
    public async Task<List<Achievement>> GetAllAsync(CancellationToken ct)
    {
        return await _context.Achievements.AsNoTracking().ToListAsync();
    }
    public async Task<Achievement?> GetAchievementByIdAsync(Guid id, CancellationToken ct)
    {
        return await _context.Achievements.FindAsync(id);
    }
    public async Task<Achievement> CreateAchievementAsync(Achievement achievement, CancellationToken ct)
    {
        _context.Achievements.Add(achievement);
        await _context.SaveChangesAsync();
        return achievement; 
    }

    public async Task<Achievement?> UpdateAchievementAsync(Guid id, Achievement achievement, CancellationToken ct)
    {
        var updatedRows = await _context.Achievements.Where(x => x.Id == id).ExecuteUpdateAsync(p =>
                                                        p.SetProperty(p => p.Name, achievement.Name)
                                                        .SetProperty(p => p.Description, achievement.Description)
                                                        .SetProperty(p => p.PointsReward, achievement.PointsReward));

        return achievement;
    }
    public async Task<bool> DeleteAchievementAsync(Guid id, CancellationToken ct)
    {
        var deletedRows = _context.Achievements.Where(x => x.Id == id).ExecuteDeleteAsync();

        return await deletedRows.ContinueWith(t => t.Result > 0);
    }
}