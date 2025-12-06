using Microsoft.AspNetCore.Identity;

namespace Pupupu.Domains.Entities;

public class UserWeeklyStats
{
    public Guid UserId { get; set; }
    public int Points { get; set; }
    public DateTime WeekStartDate { get; set; }
}
