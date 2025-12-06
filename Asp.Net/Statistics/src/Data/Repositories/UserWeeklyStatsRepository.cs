using Microsoft.EntityFrameworkCore;
using Pupupu.Domains.Entities;
using Pupupu.DTOs.Requests;

namespace Pupupu.Data.Repositories.Interfaces;

public class UserWeeklyStatsRepository : IUserWeeklyStatsRepository
{
    private readonly StatisticsDbContext _context;

    public UserWeeklyStatsRepository(StatisticsDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserWeeklyStats>> GetAllAsync(int take = 10, int skip = 0, CancellationToken ct = default)
    {
        return await _context.UserWeeklyStats.OrderByDescending(u => u.Points)
                                              .Skip(skip)
                                              .Take(take)
                                              .ToListAsync(ct);
    }

    public async Task<UserWeeklyStats> GetFirstAsync(CancellationToken ct)
    {
        return await _context.UserWeeklyStats.OrderByDescending(u => u.Points).FirstOrDefaultAsync(ct);
    }

    public async Task ResetAllPointsAsync(CancellationToken ct)
    {
        await _context.UserWeeklyStats.ExecuteUpdateAsync(s => s.SetProperty(u => u.Points, 0), ct);
    }
}