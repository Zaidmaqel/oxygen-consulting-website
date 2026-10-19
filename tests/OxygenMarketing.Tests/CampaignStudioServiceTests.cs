using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OxygenMarketing.Data;
using OxygenMarketing.Models;
using OxygenMarketing.Services;
using OxygenMarketing.ViewModels;
using Xunit;

namespace OxygenMarketing.Tests
{
    public class CampaignStudioServiceTests
    {
        private ApplicationDbContext CreateInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            var context = new ApplicationDbContext(options);

            // Seed sample benchmarks
            context.CaseStudies.AddRange(
                new CaseStudy
                {
                    TitleAr = "ملابس",
                    TitleEn = "Fashion",
                    IndustryAr = "ملابس",
                    IndustryEn = "Fashion",
                    DescriptionAr = "test",
                    DescriptionEn = "test",
                    Budget = 700m,
                    Reach = 100000,
                    Conversations = 3500,
                    Cpc = 0.20m,
                    IsActive = true
                },
                new CaseStudy
                {
                    TitleAr = "إسكانات",
                    TitleEn = "Real Estate",
                    IndustryAr = "إسكانات",
                    IndustryEn = "Real Estate",
                    DescriptionAr = "test",
                    DescriptionEn = "test",
                    Budget = 1500m,
                    Reach = 170000,
                    Conversations = 3000,
                    Cpc = 0.50m,
                    IsActive = true
                }
            );
            context.SaveChanges();

            return context;
        }

        [Fact]
        public async Task CalculateEstimate_WithNullRequest_ReturnsSafeDefaults()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var service = new CampaignStudioService(context);

            // Act
            var result = await service.CalculateEstimateAsync(null);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.BudgetMin > 0);
            Assert.True(result.BudgetMax >= result.BudgetMin);
            Assert.True(result.ReachMin > 0);
            Assert.True(result.ReachMax >= result.ReachMin);
            Assert.True(result.ConversationsMin > 0);
            Assert.True(result.ConversationsMax >= result.ConversationsMin);
            Assert.False(string.IsNullOrWhiteSpace(result.DisclaimerAr));
            Assert.False(string.IsNullOrWhiteSpace(result.DisclaimerEn));
        }

        [Fact]
        public async Task CalculateEstimate_MultiPlatform_IncreasesBudgetProportionally()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var service = new CampaignStudioService(context);

            var singlePlatformReq = new CampaignStudioEstimateRequest
            {
                Platforms = new List<string> { "Instagram" },
                Services = new List<string> { "paid_ads" },
                Goal = "messages"
            };

            var multiPlatformReq = new CampaignStudioEstimateRequest
            {
                Platforms = new List<string> { "Instagram", "Facebook", "TikTok" },
                Services = new List<string> { "paid_ads" },
                Goal = "messages"
            };

            // Act
            var singleResult = await service.CalculateEstimateAsync(singlePlatformReq);
            var multiResult = await service.CalculateEstimateAsync(multiPlatformReq);

            // Assert
            Assert.True(multiResult.BudgetMin > singleResult.BudgetMin, "3 platforms should require higher minimum spend than 1 platform");
            Assert.True(multiResult.ReachMin > singleResult.ReachMin, "Higher budget should yield higher minimum reach");
        }

        [Fact]
        public async Task CalculateEstimate_AwarenessGoal_ProducesHigherReachThanMessages()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var service = new CampaignStudioService(context);

            var awarenessReq = new CampaignStudioEstimateRequest
            {
                Platforms = new List<string> { "Instagram", "Facebook" },
                Services = new List<string> { "paid_ads" },
                Goal = "awareness"
            };

            var messagesReq = new CampaignStudioEstimateRequest
            {
                Platforms = new List<string> { "Instagram", "Facebook" },
                Services = new List<string> { "paid_ads" },
                Goal = "messages"
            };

            // Act
            var awarenessResult = await service.CalculateEstimateAsync(awarenessReq);
            var messagesResult = await service.CalculateEstimateAsync(messagesReq);

            // Assert
            Assert.True(awarenessResult.ReachMax > messagesResult.ReachMax, "Awareness campaign should optimize for impressions and maximum reach");
            Assert.True(messagesResult.ConversationsMax > awarenessResult.ConversationsMax, "Messages campaign should produce significantly higher direct conversations");
        }
    }
}
