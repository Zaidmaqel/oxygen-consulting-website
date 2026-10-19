using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using OxygenMarketing.Data;
using OxygenMarketing.Models;
using OxygenMarketing.Services;
using OxygenMarketing.ViewModels;
using Xunit;

namespace OxygenMarketing.Tests
{
    public class ContactServiceTests
    {
        private ApplicationDbContext CreateInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task SubmitContact_ValidModel_SavesToDatabaseAndReturnsSuccess()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var emailServiceMock = new Mock<IEmailService>();
            var configMock = new Mock<IConfiguration>();
            var loggerMock = new Mock<ILogger<ContactService>>();

            var service = new ContactService(context, emailServiceMock.Object, configMock.Object, loggerMock.Object);

            var model = new ContactFormViewModel
            {
                Name = "Zaid Test",
                Phone = "+962796690421",
                Email = "zaid@example.com",
                Company = "Test Co",
                Message = "Inquiring about social media campaign packages."
            };

            // Act
            var result = await service.SubmitContactAsync(model, "192.168.1.10", "ar");

            // Assert
            Assert.True(result.Success);
            Assert.Contains("بنجاح", result.Message);

            var saved = await context.ContactMessages.FirstOrDefaultAsync(m => m.Email == "zaid@example.com");
            Assert.NotNull(saved);
            Assert.Equal("Zaid Test", saved.Name);
            Assert.False(saved.IsRead);
        }

        [Fact]
        public async Task SubmitContact_WithFilledHoneypot_DoesNotPersistSpam()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var emailServiceMock = new Mock<IEmailService>();
            var configMock = new Mock<IConfiguration>();
            var loggerMock = new Mock<ILogger<ContactService>>();

            var service = new ContactService(context, emailServiceMock.Object, configMock.Object, loggerMock.Object);

            var model = new ContactFormViewModel
            {
                Name = "Spam Bot",
                Phone = "+123456789",
                Email = "bot@spammer.org",
                Message = "Buy crypto now!",
                Website = "http://spam-link.com" // Honeypot filled by bot
            };

            // Act
            var result = await service.SubmitContactAsync(model, "203.0.113.5", "en");

            // Assert
            Assert.True(result.Success); // Silently returns success to not alert the bot
            var count = await context.ContactMessages.CountAsync();
            Assert.Equal(0, count); // Not saved to DB
        }

        [Fact]
        public async Task SubmitContact_ExceedingRateLimit_RejectsWithLimitMessage()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var emailServiceMock = new Mock<IEmailService>();
            var configMock = new Mock<IConfiguration>();
            var loggerMock = new Mock<ILogger<ContactService>>();

            var service = new ContactService(context, emailServiceMock.Object, configMock.Object, loggerMock.Object);
            const string clientIp = "198.51.100.42";

            // Seed 5 recent submissions from same IP in the last hour
            for (int i = 0; i < 5; i++)
            {
                context.ContactMessages.Add(new ContactMessage
                {
                    Name = $"User {i}",
                    Phone = "+962790000000",
                    Email = $"user{i}@test.com",
                    Message = "Test message",
                    CreatedAt = DateTime.UtcNow.AddMinutes(-10),
                    IpAddress = clientIp
                });
            }
            await context.SaveChangesAsync();

            var newSubmission = new ContactFormViewModel
            {
                Name = "6th Submission",
                Phone = "+962791111111",
                Email = "user6@test.com",
                Message = "Attempting to exceed rate limit"
            };

            // Act (6th attempt within the hour)
            var result = await service.SubmitContactAsync(newSubmission, clientIp, "en");

            // Assert
            Assert.False(result.Success);
            Assert.Contains("Rate limit reached", result.Message);
        }
    }
}
