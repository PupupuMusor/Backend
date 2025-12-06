using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pupupu.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Statistics");

            migrationBuilder.CreateTable(
                name: "Achievements",
                schema: "Statistics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    PointsReward = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    IconPath = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Achievements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserWeeklyStats",
                schema: "Statistics",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Points = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    WeekStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserWeeklyStats", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "UserAchievements",
                schema: "Statistics",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    AchievementId = table.Column<Guid>(type: "uuid", nullable: false),
                    AchievementId1 = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAchievements", x => new { x.UserId, x.AchievementId });
                    table.ForeignKey(
                        name: "FK_UserAchievements_Achievements_AchievementId",
                        column: x => x.AchievementId,
                        principalSchema: "Statistics",
                        principalTable: "Achievements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserAchievements_Achievements_AchievementId1",
                        column: x => x.AchievementId1,
                        principalSchema: "Statistics",
                        principalTable: "Achievements",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Achievements_Name",
                schema: "Statistics",
                table: "Achievements",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_UserAchievements_AchievementId",
                schema: "Statistics",
                table: "UserAchievements",
                column: "AchievementId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAchievements_AchievementId1",
                schema: "Statistics",
                table: "UserAchievements",
                column: "AchievementId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserAchievements",
                schema: "Statistics");

            migrationBuilder.DropTable(
                name: "UserWeeklyStats",
                schema: "Statistics");

            migrationBuilder.DropTable(
                name: "Achievements",
                schema: "Statistics");
        }
    }
}
